// pages/salesList/salesList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '退货列表',
      'color': true,
      'class': '0'
    },
    orderStatus: -1, //订单状态
    orderList:[{},{},{},{}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   *切换订货状态
   */
  statusClick({currentTarget}){
    console.log(currentTarget,"切换订货状态")
    this.setData({
      orderStatus:currentTarget.dataset.id
    })
  }
})