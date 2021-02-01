// pages/pos/discountsGoodsList/discountsGoodsList.js
import {
  alipayDiscountGoodsList
} from "../../../api/index"
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.alipayDiscountGoodsList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //输入框失焦事件
  onBlur(e) {
    let {
      goodsList
    } = this.data
    let index = e.currentTarget.id
    goodsList[index].goodsNum = e.detail.value<0?0:e.detail.value || 0
    this.setData({
      goodsList,
    })
  },

  // 搜索框失焦事件
  searchBlur(e) {
    console.log(e)
    let {
      goodsList
    } = this.data
    if (!goodsList.length) return
    var reg = new RegExp(e.detail.value);
    var arr = [];
    goodsList.map(item => {
      if (reg.test(item.search)) {
        arr.push(item)
      }
    })
    if (arr.length) {
      this.setData({
        list: arr
      })
    } else {
      this.setData({
        list: arr
      })
      wx.showToast({
        title: '您所搜索的商品未找到',
        icon: "none"
      })
    }
  },

  // 扫码获取优惠商品
  onSaoMa() {
    let {
      goodsList
    } = this.data
    let that = this
    if (!goodsList.length) return
    wx.scanCode({
      success(res) {
        console.log(res)
        if (res.result) {
          let index = goodsList.findIndex(value => value.goodsNo == res.result)
          let item = goodsList[index]
          goodsList.splice(index, 1)
          let saomaGoods = goodsList
          saomaGoods.unshift(item)
          console.log(item)
          that.setData({
            status: false,
            goodsList: [item],
            saomaGoods,
          })
        } else {
          wx.showToast({
            title: '条码有误',
            icon: "none"
          })
        }
      }
    })
  },

  // 输入框聚焦事件
  onFocus(e) {
    let {
      goodsList
    } = this.data
    let index = e.currentTarget.id
    goodsList[index].goodsNum = ""
    console.log(e.currentTarget.id, index, goodsList)
    this.setData({
      goodsList
    })
  },

  //商品数量减
  minus(e) {
    console.log("商品数量减")
    let {
      goodsList
    } = this.data
    let index = e.currentTarget.id
    if (goodsList[index].goodsNum == 0) return
    goodsList[index].goodsNum = goodsList[index].goodsNum - 1
    this.setData({
      goodsList
    })
  },

  // 商品数量加
  add(e) {
    console.log("商品数量加")
    let {
      goodsList
    } = this.data
    let index = e.currentTarget.id
    goodsList[index].goodsNum = goodsList[index].goodsNum + 1
    this.setData({
      goodsList
    })
  },

  //获取支付宝优惠商品列表
  alipayDiscountGoodsList() {
    let params = {
      merchantCode: app.commonParams("merchantCode")
    }
    alipayDiscountGoodsList(params).then(res => {
      let list = res.discountGoodsVos
      console.log(res, "优惠商品列表")
      if (res.code == "SUCCESS" && list.length) {
        list.map(item => {
          item.search = item.goodsName + item.goodsNo
          item.goodsNum = 0
        })
        console.log(list)
        this.setData({
          goodsList: list
        })
      }
    })
  },

  // 重置按钮
  reset() {
    this.alipayDiscountGoodsList()
  },

  // 确认按钮
  onSubmit() {
    let {
      saomaGoods,
      goodsList,
      status
    } = this.data
    if (!status) {
      this.setData({
        status: true,
        goodsList: saomaGoods || goodsList
      })
    }else{
      let arr=[]
      goodsList.map(item=>{
        if(item.goodsNum>0){
          arr.push(item)
        }
      })
      console.log(arr)
      wx.setStorageSync('goodsList', arr)
      wx.redirectTo({
        url: '/pages/pos/pos',
      })
    }
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