// pages/goodsPay/goodsIform/goodsIform.js
import { newGoods, info, getByBarcode, updateGoods } from "../../../api/index.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id, options.code)
    let goodsInfor = wx.getStorageSync("updateGoods")
    console.log(goodsInfor)
    this.setData({
      id: options.id,
      code: options.code,
      goodsInfor,
      purchasingPrice: goodsInfor.goodsCostPrice,
      sellingPrice: goodsInfor.goodsPrice
    })
    wx.removeStorageSync("updateGoods")
    if (options.id == 0) {
      wx.showToast({
        title: "未查询到该商品请添加",
        icon: "none"
      })
      this.setInfo(options.code)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 获取商品信息
  setInfo(code) {
    wx.showLoading()
    info({
      merchantCode: app.commonParams('merchantCode'),
      barcode: code
    }).then(res => {
      wx.hideLoading()
      console.log(res, "商品信息")
      if (res.code == "SUCCESS") {
        this.setData({
          goodsName: res.productName,
          // sellingPrice: res.productPrice
          price: res.productPrice
        })
      }
    })

  },

  // 根据条码查询有无此商品
  getByBarcode() {
    let { code } = this.data
    getByBarcode({
      merchantCode: app.commonParams('merchantCode'),
      goodsBarcode: code,
    }).then(res => {
      console.log(res)
      if (res.code == "FAILED") {
        this.setData({
          id: 0
        })
        this.setInfo(code)
      } else if (res.code == "SUCCESS") {
        wx.setStorageSync("goodsDetail", res.result)
        wx.setStorageSync("id", 1)
        // wx.navigateTo({
        //   url: '/pages/goodsPay/goodsPayList/goodsPayList?id=1',
        // })
        wx.navigateBack()
      }
    })

  },

  // 添加商品
  addGoods() {
    let { code, goodsName, purchasingPrice, sellingPrice, goodsInfor } = this.data
    console.log(code, goodsName, purchasingPrice, sellingPrice, goodsInfor)
    if (Number(sellingPrice)) {
      if (goodsInfor) {
        updateGoods({
          merchantCode: app.commonParams('merchantCode'),
          goodsId: goodsInfor.goodsId,
          goodsUnitId: goodsInfor.goodsUnitId,
          goodsName: goodsInfor.goodsName || goodsName,
          goodsCostPrice: Number(purchasingPrice) || 0,
          goodsPrice: Number(sellingPrice),
          categoryId: goodsInfor.categoryId,
          goodsBrandId: goodsInfor.goodsBrandId,
          goodsStatus: 0
        }).then(res => {
          console.log(res)
          if (res.code == "SUCCESS") {
            wx.setStorageSync("id", { goodsId: goodsInfor.goodsId, id: 2 })
            // wx.navigateTo({
            //   url: `/pages/goodsPay/goodsPayList/goodsPayList?goodsId=${goodsInfor.goodsId}`,
            // })
            wx.navigateBack()
          }
        })
      } else {
        newGoods({
          merchantCode: app.commonParams('merchantCode'),
          categoryId: 0,
          goodsBrandId: 0,
          goodsBarcode: code,
          goodsName: goodsName,
          goodsUnitId: 0,
          goodsPrice: Number(sellingPrice),
          goodsCostPrice: Number(purchasingPrice) || 0,
          goodsStatus: 0,
        }).then(res => {
          console.log(res, "添加商品")
          if (res.code == "SUCCESS") {
            wx.showToast({
              title: '商品添加成功',
              icon: "none"
            })
            res.result.goodsId = res.result.id
            wx.setStorageSync("goodsDetail", res.result)
            wx.setStorageSync("id", 1)
            // wx.navigateTo({
            //   url: '/pages/goodsPay/goodsPayList/goodsPayList?id=1',
            // })
            wx.navigateBack()
          } else {
            wx.showToast({
              title: '商品添加失败',
              icon: "none"
            })
            // wx.navigateTo({
            //   url: '/pages/goodsPay/goodsPayList/goodsPayList',
            // })
            wx.navigateBack()
          }
        })
      }
    } else {
      wx.showToast({
        title: '零售价必须输入',
        icon: "none"
      })
    }

  },

  // 输入的内容
  onInput(e) {
    // 0手动输入商品条码查询商品、1输入的商品名称、2输入的进货价、3输入的零售价
    console.log(e)
    let index = e.target.id, value = e.detail.value
    switch (index) {
      case "0":
        this.setData({
          index: 1,
          code: value
        })
        break;
      case "1":
        this.setData({
          index,
          goodsName: value
        })
        break;
      case "2":
        this.setData({
          index,
          purchasingPrice: value
        })
        break;
      case "3":
        this.setData({
          index,
          sellingPrice: value
        })
        break;
    }
  },

  // 输入框聚焦事件
  onFocus() {
    this.setData({
      price: false
    })
  },

  // 零售价确认事件
  enterText(e) {
    console.log(e.target.id)
    this.setData({
      sellingPrice: Number(e.target.id),
      price: false
    })
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