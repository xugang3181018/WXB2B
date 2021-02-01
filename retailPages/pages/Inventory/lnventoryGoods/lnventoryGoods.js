// pages/Inventory/lnventoryGoods/lnventoryGoods.js
const {
  getInventoryDetailsGoodsList,
  getByBarcode
} = require('../../../../api/index.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: []
  },

  onLoad: function (options) {
    // let goodsDetail = wx.getStorageSync('goodsDetail')
    let goodsDetail = options.goodsDetail?JSON.parse(options.goodsDetail):''
    console.log(goodsDetail)
    console.log(options, options.goodsBarcode, options.checkNo, options.code, options.id, goodsDetail)
    let {
      goodsBarcode,
      checkNo,
      code,
      from,
    } = options
    // wx.removeStorageSync('goodsDetail')
    this.setData({
      goodsBarcode,
      checkNo,
      code,
      id: app.newCheck,
      goodsDetail,
      from
    })
    if (!goodsDetail) {
      if (app.pageType == 3) {
        this.getByBarcode()
      }
      //  else {
      //   this.getInventoryDetailsGoodsList()
      // }
    }
  },
  // 根据条码按照盘点任务规则查询商品
  getInventoryDetailsGoodsList() {
    let {
      checkNo,
      goodsBarcode,
      code,
      id,
      from
    } = this.data
    getInventoryDetailsGoodsList({
      checkNo: checkNo,
      goodsBarcode: goodsBarcode
    }).then(res => {
      console.log(res, "根据条码按照盘点任务规则查询商品")
      if (res.code == "SUCCESS") {
        this.setData({
          goodsDetail: res.result[0]
        })
      } else {
        wx.showToast({
          title: '没有找到该商品请重新扫码',
          icon: "none",
        })
        setTimeout(function () {
          if (app.pageType == 3) {
            wx.navigateBack()
          } else {
            app.merchantCode = id == 1 ? code : ""
            app.checkNo = id == 1 ? checkNo : ''
            app.goods = id == 1 ? "goods" : ""
            app.from = from
            // wx.redirectTo({
            //   url: `/pages/retail/Inventory/lnventoryDetail/lnventoryDetail?merchantCode=${id==1?code:""}&checkNo=${id==1?checkNo:''}&goods=${id==1?"goods":""}&from=${from}`,
            // })
            wx.navigateBack()
          }
        }, 2000)
      }
    })
  },

  // //根据条码获取商品
  getByBarcode() {
    wx.showLoading({
      title: '加载中',
    })
    let {
      merchantCode
    } = wx.getStorageSync('login')
    let {
      goodsBarcode
    } = this.data
    getByBarcode({
      merchantCode,
      goodsBarcode
    }).then(res => {
      if (res.code == "SUCCESS") {
        this.setData({
          goodsDetail: res.result
        })
        wx.hideLoading()
      } else {
        app.tip(res.msg)
        setTimeout(function(){
          wx.hideLoading()
          wx.navigateBack()
        },1000)
      }
      console.log(res, "根据条码获取商品")
    })
  },

  // 获取到的库存数
  onInput(e) {
    console.log(e,parseInt(Number(e.detail.value)))
    this.setData({
      value: parseInt(Number(e.detail.value))
    })
  },

  //输入框聚焦时
  onFocus(e) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 添加盘点列表
  onAddCheckList() {
    let {
      goodsDetail,
      checkNo,
      code,
      value,
      id,
      from,
      checkList,
      fastCheckList
    } = this.data
    console.log(goodsDetail)
    if (!(value == 0 || value)) {
      app.tip("请输入盘点数量")
      return
    }
    goodsDetail.checkNo = checkNo || ""
    goodsDetail.merchantCode = code || ""
    goodsDetail.inventoryStock = value || 0
    goodsDetail.profitStock = (value || 0) - goodsDetail.stock
    goodsDetail.profitType = ((value || 0) - goodsDetail.stock) > 0 ? 0 : ((value || 0) - goodsDetail.stock) < 0 ? 1 : 2
    if (app.pageType == 3) {
      console.log(goodsDetail, fastCheckList)
      let flg = false
      if (fastCheckList.length) {
        fastCheckList.map(item => {
          if (item.goodsId == goodsDetail.goodsId) {
            item.inventoryStock = goodsDetail.inventoryStock
            item.profitStock = goodsDetail.profitStock
            item.profitType = goodsDetail.profitType
            flg = true
          }
        })
      }
      if (!flg) {
        fastCheckList.push(goodsDetail)
      }
      wx.setStorageSync('fastCheckList', fastCheckList)
      wx.navigateBack()
    } else {
      app.merchantCode = id == 1 ? code : ""
      app.checkNo = id == 1 ? checkNo : ''
      app.goods = id == 1 ? "goods" : ""
      app.from = from
      console.log("添加商品列表")
      let data = checkList.find(item => {
        return item.goodsId == goodsDetail.goodsId
      })
      if (data) {
        data.inventoryStock = data.inventoryStock + goodsDetail.inventoryStock
        data.profitStock = Math.abs(data.stock - data.inventoryStock)
        data.profitType = (data.inventoryStock + goodsDetail.inventoryStock) - data.stock > 0 ? 0 : (data.inventoryStock + goodsDetail.inventoryStock) - data.stock < 0 ? 1 : 2
      } else {
        checkList.push(goodsDetail)
      }
      wx.setStorageSync('checkList', checkList)

      // wx.setStorageSync('checkGoods', goodsDetail)
      wx.navigateBack()
      // wx.redirectTo({
      //   url: `/pages/retail/Inventory/lnventoryDetail/lnventoryDetail?id=${id==1?id:""}&merchantCode=${id==1?code:""}&checkNo=${id==1?checkNo:''}&goods=${id==1?"goods":""}&from=${from}`,
      // })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    /**
     * app.pageType == 3获取快速盘点单商品列表
     * 获取按盘点任务盘点的商品列表
     */
    if (app.pageType == 3) {
      let fastCheckList = wx.getStorageSync('fastCheckList') || []
      this.setData({
        fastCheckList
      })
    } else {
      let checkList = wx.getStorageSync('checkList') || []
      this.setData({
        checkList
      })
    }
  },
})