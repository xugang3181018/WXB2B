// pages/retail/cancel/cancel.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderType:['商城','外卖','堂食','自提','拼团','秒杀'],
    payType:{WXPAY:'微信支付',ALIPAY:'支付宝支付',MPAY:'会员支付',CASH:'现金支付'}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.data,options)
    let data = JSON.parse(options.data)
    data.createTime = app.base.strDateFormat(data.createTime)
    // let data = wx.getStorageSync('cancelDetail')
    this.setData({
      cancelDetail:data
    })
  },

  //完成
  complete(){
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})