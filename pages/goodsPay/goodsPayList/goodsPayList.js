// pages/goodsPay/goodsPayList/goodsPayList.js
import {
  getByBarcode,
  cashPay,
  pay,
  getGoodsDetail
} from '../../../api/index.js'
const app = getApp()
const base = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    show: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorageSync("cartList")
    // else{
    //   this.totailPrice(cartList)
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 修改商品信息
  onRedact(e) {
    console.log(e)
    let {
      goodsList
    } = this.data
    let index = e.currentTarget.dataset.index
    console.log(goodsList[index])
    wx.setStorageSync("updateGoods", goodsList[index])
    wx.navigateTo({
      url: `/pages/goodsPay/goodsIform/goodsIform?id=3`,
    })
  },

  // 更新商品
  updateGoods(data) {
    wx.showLoading()
    console.log(data)
    let {
      goodsList
    } = this.data
    let element = goodsList.find(item => {
      return item.goodsId == data.goodsId
    })
    console.log(element)
    element.goodsName = data.goodsName
    element.goodsCostPrice = data.goodsCostPrice || 0
    element.goodsPrice = data.goodsPrice
    element.singleTotal = Number((element.cart_num * data.goodsPrice).toFixed(2))
    console.log(goodsList)
    this.setData({
      goodsList,
    })
    wx.setStorageSync("cartList", goodsList)
    this.totailPrice(goodsList)
    wx.hideLoading()
  },

  //手动输入条码
  codeBtn() {
    wx.navigateTo({
      url: '/pages/goodsPay/goodsIform/goodsIform',
    })
  },

  // 扫码
  scanBtn() {
    let that = this
    wx.showLoading()
    wx.scanCode({
      success(res) {
        console.log(res)
        let code = res.result,
          {
            goodsList
          } = that.data;
        if (code) {
          getByBarcode({
            merchantCode: app.commonParams('merchantCode'),
            goodsBarcode: code,
          }).then(res => {
            wx.hideLoading()
            console.log(res)
            if (res.code == "FAILED") {
              console.log(code.length)
              if (code.length == 13) {
                wx.navigateTo({
                  url: `/pages/goodsPay/goodsIform/goodsIform?id=0&code=${code}`,
                })
              } else {
                console.log(code.length)
                wx.showToast({
                  title: '条码错误',
                  icon: "none"
                })
              }
            } else if (res.code == "SUCCESS") {
              // goodsList.push(res.result)
              that.addCart(res.result, "扫码添加商品")
              // that.setData({
              //   goodsList,
              // })
            }
          })
        }
      }
    })
  },

  //加入商品列表
  addCart(data, type) {
    wx.showLoading()
    console.log(type)
    let {
      goodsList
    } = this.data
    if (!data.cart_num) {
      console.log("没有笔数")
      data.cart_num = 1,
        data.singleTotal = Number((1 * data.goodsPrice).toFixed(2))
    }
    // let cartList = wx.getStorageSync("cartList") || []
    console.log(goodsList)
    var exist = goodsList.find(function (item) {
      return item.goodsBarcode === data.goodsBarcode
    })
    console.log(exist)
    if (exist) {
      //如果存在，则增加该货品的购买数量
      exist.cart_num += parseInt(data.cart_num)
      exist.singleTotal = Number((exist.singleTotal + (data.cart_num * data.goodsPrice)).toFixed(2))
    } else {

      //如果不存在，传入该货品信息
      goodsList.push(data)
    }
    console.log(goodsList)
    this.setData({
      goodsList,
    })
    wx.setStorageSync("cartList", goodsList)
    console.log(goodsList, "商品添加成功")
    this.totailPrice(goodsList)
    wx.hideLoading()
  },

  // 计算商品的总价格
  totailPrice(cartList) {
    let totailMoney = 0
    cartList.map(item => {
      totailMoney += Number(item.singleTotal)
    })
    this.setData({
      totailMoney:totailMoney.toFixed(2)
    })
  },

  // 数量减
  CartNumDes(e) {
    console.log(e, "数量减")
    let {
      goodsList
    } = this.data
    let index = e.currentTarget.dataset.index
    if (goodsList[index].cart_num > 1) {
      goodsList[index].cart_num--
      goodsList[index].singleTotal = Number((goodsList[index].cart_num * goodsList[index].goodsPrice).toFixed(2))
      this.setData({
        goodsList,
      })
      wx.setStorageSync("cartList", goodsList)
      this.totailPrice(goodsList)
    } else {
      this.deleteGoods(goodsList, index)
    }
  },

  //数量加
  CartNumInt(e) {
    console.log(e, "数量加")
    let index = e.currentTarget.dataset.index
    let {
      goodsList
    } = this.data
    goodsList[index].cart_num++
    goodsList[index].singleTotal = Number((goodsList[index].cart_num * goodsList[index].goodsPrice).toFixed(2))
    this.setData({
      goodsList,
    })
    wx.setStorageSync("cartList", goodsList)
    this.totailPrice(goodsList)
  },

  // 手动输入
  bindCode(e) {
    console.log(e, "手动输入")
    let {
      goodsList
    } = this.data
    let index = e.currentTarget.dataset.index
    goodsList[index].cart_num = Number(e.detail.value)
    goodsList[index].singleTotal = Number((Number(e.detail.value) * goodsList[index].goodsPrice).toFixed(2))
    this.setData({
      goodsList,
    })
    wx.setStorageSync("cartList", goodsList)
    this.totailPrice(goodsList)
  },

  // 删除商品
  deleteGoods(goodsList, index) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认要删除该商品吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          goodsList.splice(index, 1)
          that.setData({
            goodsList,
          })
          wx.setStorageSync("cartList", goodsList)
          that.totailPrice(goodsList)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //结算
  onAccount() {
    if (this.data.totailMoney == 0) {
      wx.showToast({
        title: '支付金额不能为零',
        icon: "none",
        duration: 2000
      })
      return
    }
    this.setData({
      show: true
    })
  },

  // 手动输入金额
  moneyBtn() {
    wx.navigateTo({
      url: '/pages/goodsPay/goodsIform/goodsIform',
    })
  },

  //隐藏支付方式
  hidePayBox() {
    this.setData({
      show: false
    })
  },

  // 现金支付
  cashPayBtn() {
    let {
      goodsList
    } = this.data
    this.setData({
      show: false
    })
    wx.showLoading({
      title: '支付中',
    })
    let outTradeNo = `${new Date().Format('yyyyMMddhhmmss')}${app.base.randomNum(4)}`
    let goodsDetail = this.goodsDetail(goodsList)
    console.log(goodsDetail)
    cashPay({
      merchantCode: app.commonParams('merchantCode'),
      outTradeNo: outTradeNo,
      totalAmount: this.data.totailMoney,
      goodsDetail: goodsDetail
    }).then(res => {
      wx.hideLoading()
      if (res.code == "SUCCESS") {
        wx.showToast({
          title: '支付成功',
          icon: 'none'
        })
        wx.removeStorageSync('cartList')
        this.setData({
          goodsList: [],
          show: false
        })
        wx.setStorageSync("payDetail", {
          totalAmount: this.data.totailMoney,
          hide: true
        })
        wx.navigateTo({
          url: '/pages/posPaySuccess/posPaySuccess',
        })
      } else {
        wx.showToast({
          title: '支付失败重新支付',
          icon: "none"
        })
        this.setData({
          show: false
        })
      }
      console.log(res)
    })
  },

  // 扫码支付
  scanPayBtn() {
    let {
      goodsList
    } = this.data
    this.setData({
      show: false
    })
    wx.scanCode({
      success: (res) => {
        let outTradeNo = `${new Date().Format('yyyyMMddhhmmss')}${app.base.randomNum(4)}`
        let goodsDetail = this.goodsDetail(goodsList)
        let params = {
          merchantCode: app.commonParams('merchantCode'),
          outTradeNo: outTradeNo,
          totalAmount: this.data.totailMoney,
          // discountAmount: this.data.discountAll,
          orderSource: 5,
          authCode: res.result,
          appType: 2,
          operatorId: app.commonParams('operatorId'),
          goodsDetail: goodsDetail
        }
        wx.showLoading({
          title: '等待付款',
        })
        this.pay(params)
      }
    })
  },

  // 商品信息
  goodsDetail(data) {
    let detail = []
    data.map(item => {
      console.log(item)
      let obj = {
        goodsId: item.goodsBarcode,
        goodsName: item.goodsName,
        price: item.goodsPrice,
        quantity: item.cart_num,
        goodsType: 0,
      }
      detail.push(obj)
    })
    console.log(detail, JSON.stringify(detail))
    return JSON.stringify(detail)
  },

  // 支付
  pay(params) {
    return pay(params).then(res => {
      console.log(res,params)
      wx.hideLoading()
      if (res.code === 'FAILED') {
        wx.showModal({
          title: res.subMsg,
          content: res.msg,
          confirmText: "重新收款",
          orderSource: 5,
          success: (res) => {
            if (res.confirm) {
              this.scanPay()
            }
          }
        })
      } else if (res.code === 'SUCCESS') {
        app.tip(res.msg)
        res.payTime = base.strDateFormat(res.payTime)
        wx.setStorageSync("payDetail", res)
        wx.navigateTo({
          url: '/pages/posPaySuccess/posPaySuccess',
        })
        wx.removeStorageSync('cartList')
        this.setData({
          goodsList: [],
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // id为1时添加商品否则时更新商品
    let id = wx.getStorageSync("id")
    console.log(id)
    this.setData({
      name: app.commonParams('merchantName'),
      goodsList: wx.getStorageSync("cartList") || []
    })
    if (id == 1) {
      wx.removeStorageSync('id')
      let data = wx.getStorageSync("goodsDetail")
      this.addCart(data, "手动输入添加商品")
    } else if (id.id == 2) {
      getGoodsDetail({
        merchantCode: app.commonParams('merchantCode'),
        goodsId: id.goodsId
      }).then(res => {
        wx.removeStorageSync('id')
        this.updateGoods(res.result)
      })
    }
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