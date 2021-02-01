// pages/orderRecord/takeOutDetail/takeOutDetail.js
const base = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    max: 200,
    payStatus:['未支付','已支付','支付失败'],
    refundStatus:["","","部分退款"],
    deliveryStatus1:["待接单","骑手待接单","骑手待取货","配送中","已完成","已取消","配送失败","商品返还商家中","商品返还商户成功","未配送"],
    deliveryStatus2:["待接单","待自提","待自提","配送中","顾客已取餐","已取消"],
    deliveryStatus: ["接单", "", "顾客已取餐", "取消配送", "", "重下配送单", "重下配送单", "", "", "呼叫配送"],
    deliveryTypeDetail: { GKZT: "顾客自提", SJZPS: "商家自配送", LTP: "联拓配", SFTC: "顺丰", SS: "闪送", MTPS: "美团配送", DADA:"达达配送"},
    orderStatus: ["全部状态", "未支付", "已完成", "已退款", "已撤销"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let {takeOutStatus,takeOutIndex,orderType} = options
    this.setData({
      takeOutStatus,
      takeOutIndex,
      orderType
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //限制文本输入框的字数
  limit: function (e) {
    var value = e.detail.value;
    var length = parseInt(value.length);
    if (length > this.data.noteMaxLen) {
      return;
    }

    this.setData({
      current: length,
      remarkStatus:true
    });
  },

    //复制订单编号

    onCopyCoding(e) {
      console.log(e.currentTarget.id)
      wx.setClipboardData({
        data: e.currentTarget.id,
        success(res) {
          console.log(res)
          wx.getClipboardData({
            success(res) {
              console.log(res)
            }
          })
        }
      })
    },

  // 拨打电话
  dialPhone(e) {
    console.log(e.currentTarget.id)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id
    })
  },

  // 退单
  refundOrder(){
    wx.navigateTo({
      url: '/pages/orderRecord/goodsRefund/goodsRefund',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let detail = wx.getStorageSync("itemDetail")
    console.log(detail)
    // detail.deadline = base.deadline(detail.createDate)
    this.setData({
      detail: detail
    })
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