// pages/orderRecord/refundDetail/refundDetail.js
const base = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: {
      NOTPAY: "未支付",
      SUCCESS: "支付成功",
      REFUND: "已退款",
      CLOSED: "已关闭",
      REVOKED: "已撤销"
    },
    payType: {
      WXPAY: "微信支付",
      ALIPAY: "支付宝支付",
      MPAY: "会员支付",
      CASH: "现金支付",
      BANK: "pos支付"
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let detail = JSON.parse(options.detail)
    let refund = JSON.parse(options.refund)
    refund.time = base.strDateFormat(refund.time)
    console.log(refund.time)
    this.setData({
      detail,
      refund
    }) 
    console.log(base.strDateFormat(refund.time))
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})