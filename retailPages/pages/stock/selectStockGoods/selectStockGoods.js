// pages/retail/stock/selectStockGoods/selectStockGoods.js
let {
  queryGoodsCategory,
  goodsList,
  merchantAndSupplierByQueryGoodsList,
  queryGoodsMessage,
  queryList
} = require('../../../../api/index')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    goodsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      supplierId
    } = options
    if (supplierId) {
      this.setData({
        supplierId
      })
      this.merchantAndSupplierByQueryGoodsList()
    } else if(app.pageType == 2 || app.pageType == 3){
      this.getQueryList()
    } else{
      this.goodsList()
    }
    this.queryGoodsCategory()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 商品分类
  queryGoodsCategory() {
    queryGoodsCategory({
      merchantCode: wx.getStorageSync("login").merchantCode,
      categoryScene: 1
    }).then(res => {
      console.log(res, "商品分类")
      if (res.code == 'SUCCESS') {
        res.result.unshift({
          categoryId: '',
          categoryName: "全部分类"
        })
        this.setData({
          classifyList: res.result
        })
      }
    })
  },

  //选择分类
  changeMerchant(e) {
    console.log(e, e.detail.value)
    let {
      classifyList
    } = this.data
    let index = e.detail.value
    let id = classifyList[index].categoryId
    this.setData({
      index,
      id
    })
    if (app.pageType == 1) {
      this.merchantAndSupplierByQueryGoodsList(id)
    } else if(app.pageType == 2){
      this.setData({
        goodsList: []
      })
      this.getQueryList("",id)
    } else {
      this.goodsList(id)
    }
  },

  //商品列表
  goodsList(id) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      goodsList: []
    })
    let params = {
      merchantCode: wx.getStorageSync("login").merchantCode,
    }
    if (id == 0 || id) {
      params.categoryId = id
    }
    goodsList(params).then(res => {
      console.log(res, '商品列表')
      if (res.code == "SUCCESS") {
        let goodsList = this.setGoodsList(res.result)
        this.setData({
          goodsList,
          list: goodsList
        }, () => {
          wx.hideLoading()
        })
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  //获取退货商品列表
  merchantAndSupplierByQueryGoodsList(categoryId) {
    let {
      supplierId
    } = this.data
    let loginInfo = wx.getStorageSync('login')
    let params = {
      superMerchantCode: loginInfo.appId,
      merchantCode: loginInfo.merchantCode,
      supplierId: supplierId,
    }
    if (categoryId) {
      params.categoryId = categoryId
    }
    merchantAndSupplierByQueryGoodsList(params).then(res => {
      console.log(res, "退货单列表")
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        goodsList: []
      })
      if (res.code == "SUCCESS" && res.result.totalCount > 0) {
        this.queryGoodsMessage(res.result.items, supplierId)
      } else {
        wx.hideLoading()
        app.tip("暂无数据")
      }
    })
  },

  //获取库存调整单商品列表
  getQueryList(number,id,goodsInfo) {
    let {appId,merchantCode} = wx.getStorageSync('login')
    let params = {
      superMerchantCode:appId,
      goodsStatus:0,
      merchantCode,
      pageSize:20,
    }
    if(number){
      params.currentPage = number
    }
    if(id){
      params.categoryId = id
    }
    if(goodsInfo){
      params.goodsInfo = goodsInfo
    }
    queryList(params).then(res=>{
      console.log(res,"库存调整单商品列表")
      wx.showLoading({
        title: '加载中',
      })
      if (res.code == "SUCCESS" && res.result.totalCount > 0 && res.result.items) {
        let goodsList = res.result.items.length > 0 ? this.data.goodsList.concat(res.result.items) : this.data.goodsList
        this.setData({
          goodsList,
          currentPage: res.result.currentPage,
          hasMore: goodsList.length < res.result.totalCount,
          loading: false,
        })
        wx.hideLoading()
        console.log(res,res.result.items)
        // this.queryGoodsMessage(res.result.items)   //获取选中商品详情
      } else {
        wx.hideLoading()
        app.tip("暂无数据")
      }
    })
  },

  //上拉加载
  listMore() {
    let {
      currentPage,
      hasMore
    } = this.data
    if (!hasMore) {
      app.tip("没有更多数据了")
      return
    }
      this.getQueryList(currentPage + 1)
    },

  //查询选中商品详情
  queryGoodsMessage(list, id) {
    let params = {
      superMerchantCode: wx.getStorageSync('login').appId,
      goodsJsonData: app.base.refundGoodsDetail(list, id)
    }
    queryGoodsMessage(params).then(res => {
      wx.hideLoading()
      if (res.code == "SUCCESS") {
        let goodsList = res.result.length > 0 ? this.data.goodsList.concat(res.result) : this.data.goodsList
        this.setData({
          goodsList,
          list
        })
      } else {
        wx.hideLoading()
        app.tip("暂无数据")
      }
      console.log(res)
    })
  },

  // 获取商品详情


  // 搜索框失焦事件
  searchMember(e) {
    console.log(e)
    let {
      goodsList,
    } = this.data
    if (!goodsList.length) return
    if(app.pageType == 2 || app.pageType == 3){
      this.setData({
        goodsList:[]
      })
      this.getQueryList("","",e.detail)
    }else{
      var reg = new RegExp(e.detail);
      console.log(reg)
      var arr = [];
      goodsList.map(item => {
        console.log(item)
        if (reg.test(item.goodsName)) {
          arr.push(item)
        }
      })
      console.log(arr)
      if (arr.length) {
        this.setData({
          goodsList: arr
        })
      } else {
        this.setData({
          goodsList: arr,
          loading: false,
          hasMore:false
        })
        wx.showToast({
          title: '您所搜索的商品未找到',
          icon: "none"
        })
      }
    }
  },

  //清空搜索框内容
  clearSearch() {
    let {
      list
    } = this.data
    if(app.pageType == 2 || app.pageType == 3){
      this.getQueryList()
    }else{
      this.setData({
        // searchMember: list
        goodsList:list
      })
    }
  },

  //整合商品列表
  setGoodsList(list) {
    let arr = []
    if (list.length) {
      list.map(item => {
        arr.push(item.shopRetailGoods)
      })
    }
    return arr.flat()
  },

  //跳转商品详情
  onCheckGoods(e) {
    console.log(e, e.currentTarget.dataset.item)
    let data = e.currentTarget.dataset.item
    if (app.pageType == 1) {
    console.log(data)
      if (data.stockCnt <= 0 || data.returnStockCnt <= 0) {
        app.tip("库存不足或可退库存不足")
        return
      } else{
        if (data.stockCnt < data.returnStockCnt) {
          data.returnStockCnt = data.stockCnt
        }
      }
    }
    console.log(data)
    if (app.pageType == 2) {
      if (data.stock <= 0) {
        app.tip("库存不足")
        return
      }
    }
    if(app.pageType == 3){
      console.log(data)
      wx.navigateTo({
        url: `/retailPages/pages/Inventory/lnventoryGoods/lnventoryGoods?goodsBarcode=${data.goodsBarcode}`,
      })
    }else{
      wx.setStorageSync('goodsDetail', data)
      wx.navigateTo({
        url: `/retailPages/pages/stock/stockGoodsDetail/stockGoodsDetail`,
      })
    }
  },
})