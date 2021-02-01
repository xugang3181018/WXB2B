//获取应用实例
const app = getApp()

Component({
  properties: { // 传输进来的属性
    nowDate: {
      type: String,
      value: null
    },
    isCloseOutside: {
      type: Boolean,
      value: false
    },
    showTip: {
      type: Boolean,
      value: false
    }
  },

  // 组件的内部数据
  data: {
    nowTime: null, // 当前显示时间转换成的毫秒数
    lastDate: app.formatDate((new Date(new Date().getTime() - 86400000)), "yyyy-MM-dd"),
    lastSecond: new Date(app.formatDate(new Date(), "yyyy-MM-dd")).getTime(), // 当天的日期的毫秒数
    isClose: true,
    closeImg: app.getImage('close.png'),
    sound: app.getImage('sound.png')
  },

  ready() {
    const nowDate = this.data.nowDate
    const nowTime = new Date(nowDate).getTime()
    this.setData({nowDate, nowTime, isClose: this.data.isCloseOutside})
  },

  observers: {
    isCloseOutside(res) {
      this.setData({isClose: res})
    },
  },

  // 自定义方法
  methods: {
    // 上一天
    lastDay() {
      const nowTime = this.data.nowTime - 24 * 60 * 60 * 1000
      this.setData({nowTime})
      const nowDate = app.formatDate(nowTime, "yyyy-MM-dd")
      this.triggerEvent('onChange', nowDate)
    },

    // 下一天
    nextDay() {
      const nowTime = this.data.nowTime + 24 * 60 * 60 * 1000
      if (nowTime < this.data.lastSecond) {
        const nowDate = app.formatDate(nowTime, "yyyy-MM-dd")
        this.setData({nowTime})
        this.triggerEvent('onChange', nowDate)
      } else {
        app.showToast('请选择今天之前的日期')
      }
    },

    // 时间变化
    changeDay(e) {
      const date = e.detail.value
      const nowTime = new Date(date).getTime()
      this.setData({nowTime})
      this.triggerEvent('onChange', e.detail.value)
    },

    // 关闭提示框
    closeTip() {
      this.setData({isClose: true})
    }
  },
})