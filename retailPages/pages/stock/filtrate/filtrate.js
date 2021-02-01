// pages/retail/stock/filtrate/filtrate.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: {
      startDate: app.base.startDate(0, 'yyyy-MM-dd'),
      endDate: app.base.startDate(0, 'yyyy-MM-dd'),
    },
    items: [
      {value:0, name: '报损'},
      {value:1, name: '报溢'},
      {value:2, name: '领用'},
      {value:3, name: '其他'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   * type为1时显示订单类型
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      type:options.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 日期选择组件
  changeCalendar(e) {
    if(!e.detail.startDate){
      this.setData({
        showCal: false,
        hidden: false
      })  
    }else{
      this.setData({
        showCal: false,
        hidden: false,
        date: e.detail
      }) 
    }
  },

  // 日期组件的展示
  otherDate(event) {
    console.log(event)
    this.setData({
      showCal: true
    })
  },

  // 选择状态
  statusScreen(e) {
    let data = e.target.dataset
    this.setData({
      value: data.value,
      index: data.index
    })
  },

  //出库的类型
  radioChange(e){
    console.log(e)
    this.setData({
      adjustmentType:Number(e.detail.value)
    },()=>{
      console.log(this.data.adjustmentType)
    })
  },

  //重置
  reset() {
    this.setData({
      date: {
        startDate: app.base.startDate(0, 'yyyy-MM-dd'),
        endDate: app.base.startDate(0, 'yyyy-MM-dd'),
      },
      index: -1
    })
  },

  // 确定筛选
  onConfirm() {
    let {
      index,
      recordNo,
      date,
      merchantCode,
      type,
      adjustmentType
    } = this.data
    console.log(index, recordNo, date, merchantCode)
    let data = {
      recordStatus: index == 0 ? 0 : index || "",
      startTime: date.startDate || "",
      endTime: date.endDate || "",
    }
    if(type == 1){
      data.adjustmentType = adjustmentType
    }
    wx.setStorageSync('screen', data)
    wx.navigateBack()
  },
})