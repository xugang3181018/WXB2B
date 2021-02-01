// pages/dateRange/dateRange.js
const app = getApp()
Page({
  data: {

  },

  onLoad (options) {
    this.initDate()
  },

  initDate(){
    const taday = new Date().Format('yyyy-MM-dd')
    this.setData({
      taday
    })
  },

  changeDate({currentTarget,detail}){
    this.setData({
      [currentTarget.id]:detail.value
    })
  },

  allowTouch(e){
    app.tip('请先选择开始时间！')
  },

  goBack(){
    const {startDate,endDate} = this.data
    if(startDate && endDate){
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      prevPage.setData({
        searchDate:{
          startDate,
          endDate
        }, 
      })
      wx.navigateBack()
    }
  }

})