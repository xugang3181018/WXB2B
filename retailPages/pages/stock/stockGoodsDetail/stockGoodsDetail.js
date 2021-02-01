// pages/retail/stock/stockGoodsDetail/stockGoodsDetail.js
let {
  getByBarcode,
  getGoodsCostPriceMax,
  merchantAndSupplierByQueryGoodsList,
  queryGoodsMessage
} = require('../../../../api/index')
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
    let {goodsBarcode,supplierId,goodsDetail} = options
    let name = wx.getStorageSync('name')
    this.setData({
      goodsBarcode,
      goodsDetail:goodsDetail?JSON.parse(goodsDetail):"",
      name
    })
    // if(goodsBarcode){
    //   if(app.pageType == 1){
    //     this.getMerchantAndSupplierByQueryGoodsList(goodsBarcode,supplierId)
    //   }
    //   else{
    //     this.getByBarcode(goodsBarcode)
    //   }
    // }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 根据条码获取商品信息
  getByBarcode(goodsBarcode) {  
    getByBarcode({
      merchantCode: wx.getStorageSync('login').merchantCode,
      goodsBarcode
    }).then(res => {
      console.log(res, "根据条码获取商品信息")
      if (res.code == "SUCCESS") {
        this.setData({
          goodsDetail: res.result
        })
      }else{
        app.tip(res.msg)
        wx.navigateBack()
      }
    })
  },

  //获取退货商品信息
  getMerchantAndSupplierByQueryGoodsList(goodsInfo,supplierId){
    wx.showLoading({
      title: '加载中',
    })
    let {appId,merchantCode} = wx.getStorageSync('login')
    let params = {
      superMerchantCode:appId,
      merchantCode,
      goodsInfo,
    }
    merchantAndSupplierByQueryGoodsList(params).then(res=>{
      console.log(res,"扫码获取退货商品信息")
      if(res.code == "SUCCESS" && res.result.totalCount>0){
        this.getQueryGoodsMessage(res.result.items,supplierId)
      }else{
        app.tip("暂无数据")
        wx.hideLoading()
      }
    })
  },

   //查询选中商品详情
   getQueryGoodsMessage(list,id){
     console.log(list)
    let params = {
      superMerchantCode:wx.getStorageSync('login').appId,
      goodsJsonData:app.base.refundGoodsDetail(list,id)
    }
    queryGoodsMessage(params).then(res=>{
      console.log(res,"退货商品详情")
      wx.hideLoading()
      if(res.code == "SUCCESS"){
        this.setData({
          goodsDetail:res.result[0],
        })
      }else{
        wx.hideLoading()
        app.tip("暂无数据")
      }
      wx.hideLoading()
    })
  },

  // 修改数据  获取多包装商品数据
  setGoodsDetail(data) {
    console.log(data)
    let unitList = [data.goodsUnit],
      packageFactor = [data.packageFactor],
      goodsUnitId = [data.goodsUnitId],
      goodsCostPrice = [data.goodsCostPrice]
    if (data.goodsPackageList) {
      data.goodsPackageList.map(item => {
        unitList.push(item.goodsUnit),
          packageFactor.push(item.packageFactor),
          goodsUnitId.push(item.goodsUnitId)
          goodsCostPrice.push(item.goodsCostPrice)
      })
    }
    this.setData({
      goodsDetail: data,
      unitList,
      packageFactor,
      goodsUnitId,
      goodsCostPrice
    },()=>{
      if(app.pageType == 1){
        this.amendDetailData(data)
      }
    })
  },

  //选择包装
  changeMerchant(e) {
    let {purchasePrice,goodsCostPrice} = this.data
    let price = goodsCostPrice[Number(e.detail.value)] || purchasePrice
    this.setData({
      index: Number(e.detail.value),
      purchasePrice:price
    })
    this.getTotalPrice(price)
  },

  //采购量
  purchaseNumber(e) {  
    let {pageType,goodsDetail} = this.data
    console.log(e)
    let purchaseNum = Number(e.detail.value) 
    if(pageType == 1){
      if(purchaseNum > goodsDetail.returnStockCnt){
        purchaseNum = goodsDetail.returnStockCnt
      }
    }
    console.log(purchaseNum)
    this.setData({
      purchaseNum
    },()=>{
      if(pageType == 1){
        this.getGoodsCostPriceMax(purchaseNum)
      }else{
        this.getTotalPrice(purchaseNum, 'num')
      }
    })
  },

  //输入数量的失焦事件
  onBlur(e){
    console.log(e)
    let {pageType,goodsDetail} = this.data
    let purchaseNum = Number(e.detail.value) 
    let number = goodsDetail.stockCnt || goodsDetail.merchantStock || goodsDetail.stock
    if(pageType == 1){
      if(purchaseNum > goodsDetail.returnStockCnt){
        purchaseNum = goodsDetail.returnStockCnt
      }
    }else if(pageType == 2 && app.signIndex == 1){
      if(purchaseNum > number){
        purchaseNum = goodsDetail.stockCnt || goodsDetail.merchantStock || goodsDetail.stock
      }
    }
    if(purchaseNum < 0){
      purchaseNum = 0
    }
    console.log(purchaseNum)
    this.setData({
      purchaseNum
    })
    this.getTotalPrice(purchaseNum, 'num')
  },

  //采购价格
  purchasePrice(e) {
    console.log(e)
    let {goodsDetail} = this.data
    this.setData({
      purchasePrice: Number(e.detail.value) || goodsDetail.goodsCostPrice || goodsDetail.goodsPrice
    },()=>{
      this.getTotalPrice(Number(e.detail.value))
    })
  },


  //计算总价
  getTotalPrice(data, type) {
    console.log(data,type)
    let {
      goodsDetail
    } = this.data
    console.log(goodsDetail)
    let purchaseTotalPrice = ''
    let {
      purchaseNum,
      purchasePrice,
      refundPrice
    } = this.data
    if (type && (refundPrice || purchasePrice || goodsDetail.goodsCostPrice || goodsDetail.goodsPrice)) {
      purchaseTotalPrice = Number((data * (refundPrice || purchasePrice || goodsDetail.goodsCostPrice || goodsDetail.goodsPrice)).toFixed(4))
    } else if (!type && purchaseNum) {
      purchaseTotalPrice = Number((data * (purchaseNum || goodsDetail.stock || goodsDetail.purchaseCnt)).toFixed(4))
    }
    this.setData({
      purchaseTotalPrice
    })
  },

  // 采购总价
  purchaseTotalPrice(e) {
    console.log(e)
    this.setData({
      purchaseTotalPrice: Number(e.detail.value)
    })
  },

  //获取退货商品的价格
  getGoodsCostPriceMax(stock){
    console.log(this.data.goodsDetail,app)
    let {appId,merchantCode} = wx.getStorageSync('login')
    let {goodsDetail,purchaseNum} = this.data
    let params = {
      appId,
      superMerchantCode:appId,
      merchantCode,
      goodsId:goodsDetail.goodsId,
      stock,
    }
    getGoodsCostPriceMax(params).then(res=>{
      if(res.code == "SUCCESS"){
        this.setData({
          purchasePrice:res.result.amount || res.result
        },()=>{
          this.getTotalPrice(purchaseNum, 'num')
        })
      }else{
        app.tip(res.msg)
      }
      console.log(res,"退货商品的价格")
    })
  },

  //加入进货商品
  onAddCheckList() {
    let that = this
    let {
      goodsDetail,
      index,
      goodsUnitId,
      purchaseNum,
      purchasePrice,
      purchaseTotalPrice,
      unitList
    } = that.data
    console.log(purchaseNum)
    if(goodsDetail.returnStockCnt<=0){
      app.tip("库存不足")
      wx.navigateBack()
    }
    // || goodsDetail.stock 
    purchaseNum =  purchaseNum? purchaseNum : goodsDetail.stockSum || goodsDetail.purchaseCnt 
    purchasePrice = purchasePrice ? purchasePrice : goodsDetail.goodsCostPrice || goodsDetail.goodsPrice || ''
    console.log(purchaseNum,purchasePrice)
    if (!purchaseNum) {
      wx.showToast({
        title: '请输入数量',
        icon: "none"
      })
      return
    }else if(!purchasePrice){
      wx.showToast({
        title: '请输入价格',
        icon: "none"
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定要添加吗',
      success(res) {
        console.log(purchasePrice,goodsDetail)
        if (res.confirm) {
          goodsDetail.selectPacege = index ? goodsDetail.goodsPackageList[index - 1] : ''
          goodsDetail.goodsUnitId = (index == 0 || index) ? goodsUnitId[index] :goodsDetail.goodsUnitId
          goodsDetail.goodsUnit = (index == 0 || index) ? unitList[index] :goodsDetail.goodsUnit
          goodsDetail.goodsCostPrice = purchasePrice || goodsDetail.goodsCostPrice || goodsDetail.goodsPrice
          // goodsDetail.stock = purchaseNum
          goodsDetail.stockSum = purchaseNum
          goodsDetail.amount = purchaseTotalPrice || goodsDetail.amount
          console.log(goodsDetail)
          that.stockGoodsList(goodsDetail)
        } else if (res.cancel) {
          return
        }
      }
    })
  },

  // 进货商品列表
  stockGoodsList(data) {
    console.log(data)
    let {pageType,unitList} = this.data
    console.log(unitList)
    let stockGoodsList = wx.getStorageSync('stockGoodsList') || []
    console.log(stockGoodsList)
    let flg = false
    if (stockGoodsList.length) {
      stockGoodsList.map(item => {
        if(!item.stockSum){
          item.stockSum = 0
        }
        console.log(((pageType == 1 || pageType == 2) && (item.goodsId == data.goodsId)),(pageType == 1 || pageType == 2),(item.goodsId == data.goodsId))
        if((pageType == 1 || pageType == 2) && (item.goodsId == data.goodsId)){
          item.goodsCostPrice = data.goodsCostPrice
          // item.stock = data.stock
          item.stockSum = data.stockSum
          item.amount = data.amount
          return flg = true
        }else if(unitList && unitList.length>1 && (item.goodsId == data.goodsId) && (item.goodsUnitId == data.goodsUnitId || item.goodsUnit === data.goodsUnit)){
            item.goodsCostPrice = data.goodsCostPrice
            // item.stock = data.stock
            item.stockSum = data.stockSum
            item.amount = data.amount
            return flg = true
        } else if(item.goodsId == data.goodsId){
          item.goodsCostPrice = data.goodsCostPrice
          // item.stock = data.stock
          item.stockSum = data.stockSum
          item.amount = data.amount
          return flg = true
        }
      })
    } else {
      flg = false
    }
    if (!flg) {
      stockGoodsList.push(data)
    }
    console.log(stockGoodsList)
    wx.setStorageSync('stockGoodsList', stockGoodsList)
    wx.navigateBack()
    // wx.redirectTo({
    //   url: '/pages/retail/stock/selectStockGoods/selectStockGoods',
    // })
  },

  //修改退货的详情数据
  amendDetailData(data){
    console.log(data)
    if(data.packageResponseList){
      let item = data.packageResponseList[0]
      data.returnStockCnt = item.stock
      data.stockCnt = item.askStock
      data.packageFactor = item.packageFactor
      data.goodsCostPrice = item.wholesalePrice
      console.log(data)
    }
    if(data.returnStockCnt > data.stockCnt){
      data.returnStockCnt = data.stockCnt
    }
    this.setData({
      goodsDetail:data
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.pageType)
    this.setData({
      pageType:app.pageType
    })
    let {
      goodsBarcode
    } = this.data
    let goodsDetail = wx.getStorageSync('goodsDetail')
    console.log(goodsDetail)
    wx.removeStorageSync('goodsDetail')
    if (!goodsBarcode) {
      this.setGoodsDetail(goodsDetail)
      // this.getTotalPrice(goodsDetail,"totalPrice")
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
})