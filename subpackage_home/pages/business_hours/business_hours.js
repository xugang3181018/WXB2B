const app = getApp()
import ppevent from '../../../utils/ppevent'

const startHours = []
const endHours = []
for (let i = 0; i <= 24; i++) {
  if(i < 10) {
    i = `0${i}`
  } else {
    i = `${i}`
  }
  if (i < 24) {
    startHours.push(i)
  }
  endHours.push(i)
}


Page({
  data: {
    addBusinessHours: app.getImage('add-business-hours.png'),
    currentIndex: null, // 编辑条目的索引
    customAry: null, // 自定义日期
    customList: [
      {name: '1', value: '周一'},
      {name: '2', value: '周二'},
      {name: '3', value: '周三'},
      {name: '4', value: '周四'},
      {name: '5', value: '周五'},
      {name: '6', value: '周六'},
      {name: '7', value: '周日'},
    ],
    deleteBusinessHours: app.getImage('delete-business-hours.png'),
    editBusinessHours: app.getImage('edit-business-hours.png'),
    carefulRed: app.getImage('careful-red.png'),
    end: [24, 0], // 默认结束时间
    startHours,
    endHours,
    startMinute: ['00', '15', '30', '45'],
    endMinute: ['00'],
    popShow: false, // 控制弹窗显示
    showList: [], // 页面显示的列表
    start: [0, 0], // 默认开始时间
    operation: 'add', // 弹窗的类型 add 添加 edit 编辑
    weekFlag: null, // 当天周期选项索引
    weekOptions: ['周一至周五', '每天', '自定义'],
  },

  onLoad(options) {
    this.initList(options)
  },

  // 初始化数据格式
  initList(options) {
    const businessHours = wx.getStorageSync('businessHours')
    const {endHours, startMinute, customList} = this.data
    const showList = []
    if (businessHours.length > 0) {
      businessHours.forEach(item => {
        let date = ''
        const startTime = item.times[0].startTime
        const endTime = item.times[0].endTime
        let start = startTime.split(':')
        let end = endTime.split(':')
        // 初始化周期
        switch (item.weekFlag) {
          case 0:
            date = '周一至周五'
            break
          case 1:
            date = '每天'
            break
          case 2:
            date = '自定义 '
            item.weeks.forEach(item2 => {
              customList.forEach((item3) => {
                if (item2 === Number(item3.name)) {
                  date += `${item3.value}，`
                }
              })
            })
            date = date.slice(0, date.length - 1)
            break
          default:
            date = '周一至周五'
        }
        // 初始化时间
        endHours.forEach((item, index) => {
          if (start[0] === item) start[0] = index
          if (end[0] === item) end[0] = index
        })
        startMinute.forEach((item, index) => {
          if (start[1] === item) start[1] = index
          if (end[1] === item) end[1] = index
        })
        const obj = {date, start, end, endTime, startTime, weeks: item.weeks, weekFlag: item.weekFlag}
        showList.push(obj)
      })
      this.setData({showList, ...options})
    }
  },

  // // 开关营业时间选项
  // changeSwitch(e) {
  //   const index = e.currentTarget.dataset.index
  //   const value = e.detail.value
  //   this.data.showList[index].isChecked = value
  // },

  // 删除当前营业时间表
  delete(e) {
    const _that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该营业时间吗？',
      success () {
        const index = e.currentTarget.dataset.index
        _that.data.showList.splice(index, 1)
        _that.setData({showList: _that.data.showList})
      }
    })
  },

  // 打开添加或编辑框
  open(e) {
    const {showList, weekOptions, customList} = this.data
    const operation = e.currentTarget.dataset.operation
    const currentIndex = operation === 'edit' ? e.currentTarget.dataset.index : null
    let start = [0, 0]
    let end = [24, 0]
    let weekFlag = null
    let customAry = null
    let endMinute = ['00']
    customList.forEach(item => {item.checked = false})
    if (operation === 'edit') {
      const current = showList[currentIndex]
      // 初始化时间
      start = current.start
      end = current.end
      endMinute = current.end[0] !== 24 ? ['00', '15', '30', '45'] : ['00']
      // 获取营业周期
      weekOptions.forEach((item, index) => {
        if (item === current.date) weekFlag = index
      })
      weekFlag = weekFlag === null ? 2 : weekFlag
      // 初始化自定义营业日期列表
      if (weekFlag === 2) {
        customAry = current.weeks
        current.weeks.forEach(item => {customList.forEach(item2 => {if (item === Number(item2.name)) item2.checked = true})})
      }
    }
    this.setData({popShow: true, operation, customList, weekFlag, endMinute, start, end, currentIndex, customAry})
  },

  // 改变时间
  changeTime(e) {
    const type = e.currentTarget.dataset.type
    let time = e.detail.value
    if (type === 'start') {
      this.setData({start: time})
    } else {
      let endMinute = ['00']
      if (time[0] === 24) {
        time = [24, 0]
      } else {
        endMinute = ['00', '15', '30', '45']
      }
      this.setData({end: time, endMinute})
    }
  },

  // 改变营业周期
  changeWeekOptions(e) {
    this.setData({weekFlag: Number(e.currentTarget.dataset.index)})
  },

  // 获取自定义
  getCustomAry(e) {
    this.setData({customAry: e.detail.value})
  },

  // 关闭弹窗
  close() {
    this.setData({popShow: false})
  },

  // 添加或编辑
  operations() {
    let {currentIndex, end, start, showList, operation, weekFlag} = this.data
    if (start[0] > end[0] || start[0] === end[0] && start[1] >= end[1]) {
      app.showToast('营业结束时间不得小于营业开始时间')
      return
    }
    if (weekFlag === null) {
      app.showToast('请选择营业周期')
      return
    }
    const newItem = this.getWeeks(start, end, weekFlag)
    if (!newItem) return
    const isRepeat = this.checkTime(showList, newItem, currentIndex, operation)
    if (!isRepeat) {
      if (operation === 'add') {
        showList.push(newItem)
      } else {
        showList[currentIndex] = newItem
      }
      this.setData({showList, popShow: false})
    }
  },

  // 获取自定义时间日期
  getWeeks (start, end, weekFlag) {
    let {weekOptions, customAry, customList, endHours, startMinute} = this.data
    let date = weekOptions[weekFlag]
    let weeks = []
    // 初始化周期
    if (date === '每天') {
      weeks = [1, 2, 3, 4, 5, 6, 7]
    } else if (date === '周一至周五') {
      weeks = [1, 2, 3, 4, 5]
    } else {
      if (customAry === null || customAry.length === 0) {
        app.showToast('请选择自定义日期')
        return false
      } else {
        if (customAry.length === 7) {
          date = '每天'
        } else if (customAry.length === 5 && customAry.filter((item) => item > 5).length === 0) {
          date = '周一至周五'
        } else {
          date = '自定义 '
          customList.forEach(item => {
            customAry.forEach((item2) => {
              if (item.name === item2) {
                weeks.push(Number(item.name))
                date += `${item.value}，`
              }
            })
          })
          weeks.sort()
          date = date.substring(0, date.length - 1)
        }
      }
    }
    const startTime = `${endHours[start[0]]}:${startMinute[start[1]]}`
    const endTime = `${endHours[end[0]]}:${startMinute[end[1]]}`
    // const newItem = {date, start, end, startTime, endTime, weeks, weekFlag, isChecked: operation === 'add' ? true : showList[currentIndex].isChecked}
    return {date, startTime, endTime, weeks, start, end, weekFlag}
  },

  // 校验时间端是否冲突
  checkTime (showList, newItem, currentIndex, operation) {
    let isRepeat = false
    if (showList.length > 0) {
      for (let i = 0; i < showList.length; i++) {
        const listItem = showList[i]
        if (currentIndex !== i && operation === 'edit' || operation === 'add') {
          const h1 = listItem.start[0] // 对比条目的开始时间的小时索引
          const m1 = listItem.start[1] // 对比条目的开始时间的分钟索引
          const h2 = listItem.end[0]
          const m2 = listItem.end[1]
          const h3 = newItem.start[0] // 当前条目
          const m3 = newItem.start[1]
          const h4 = newItem.end[0]
          const m4 = newItem.end[1]
          listItem.weeks.forEach(item => {
            newItem.weeks.forEach(item2 => {
              if (item === item2) {
                if (!(h4 < h1 || h4 === h1 && m4 <= m1 || h3 > h2 || h3 === h2 && m3 >= m2)) {
                  app.showToast('该时段与其他营业时段冲突，请重新选择')
                  isRepeat = true
                  return
                }
              }
            })
          })
        }
      }
    }
    return isRepeat
  },

  // 保存当前设置
  save() {
    const showList = this.data.showList
    let businessHours = []
    showList.forEach(item => {
      businessHours.push({
        weeks: item.weeks,
        times: [{
          startTime: item.startTime,
          endTime: item.endTime,
        }],
        weekFlag: item.weekFlag
      })
    })
    ppevent.emit('businessHours', businessHours)
    wx.navigateBack({delta: 1})
  }
})
