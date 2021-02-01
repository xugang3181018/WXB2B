// pages/retail/comeStock/comeStockList/coneStockList.js
let {
  getRevisionStockOrder
} = require('../../../../api/index')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus:['待提交','待审核','已完成','已删除'],
    orderList:[],
    screenStatus:true,
    isPX:app.systemInfo.isPX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 获取进货单号
  searchMember(e){
    console.log(e)
    let value = e.detail
    console.log(value)
    if(value){
      this.setData({
        orderList:[],
        screenStatus:false
      })
      this.getRevisionStockOrder({recordNo:value})
    }
  },
  
  //输入内容时
  onInput({detail}){
    if(detail){
      this.setData({
        screenStatus:false
      })
    }else{
      this.setData({
        screenStatus:true
      })
    }
  },
 
  //初始化数据
  clearSearch(){
    let screen = wx.getStorageSync('screen')
    wx.removeStorageSync('stockGoodsList')
    wx.removeStorageSync('recordNo')
    wx.removeStorageSync('message')
    console.log(screen)
    if(screen){
      screen = JSON.parse(JSON.stringify(screen).replace(/recordStatus/g,"operationType"))
      wx.removeStorageSync('screen')
    }
    this.setData({
      orderList:[],
      screenStatus:true
    })
    this.getRevisionStockOrder(screen)
    // this.getRevisionStockOrder()
  },

  //筛选   
  onScreen(){
    wx.navigateTo({
      url: '/retailPages/pages/stock/filtrate/filtrate?type=1',
    })
  },

   //上拉加载
   listMore(){
    let {
      currentPage,
      screen,
      hasMore
    } = this.data
    if (!hasMore) {
      wx.showToast({
        title: "没有更多数据了",
        icon: "none"
      })
      return
    }
    if (screen) {
      screen.currentPage = currentPage + 1
      this.getRevisionStockOrder(screen)
    } else {
      let params = {
        superMerchantCode:wx.getStorageSync('login').appId,
        currentPage: currentPage + 1,
      }
      this.getRevisionStockOrder(params)
    }
  },

  // 库存调整单列表
  getRevisionStockOrder(data){
    if(!data){
      var params ={}
    }else{
      params = data
    }
    console.log(wx.getStorageSync('login'))
    params.merchantCode = wx.getStorageSync('login').merchantCode
    params.superMerchantCode = wx.getStorageSync('login').appId
    getRevisionStockOrder(params).then(res=>{
      console.log(res,"库存单调整列表")
      if(res.code == "SUCCESS"){
        if(!data){
          this.setData({
            orderList:[]
          })
        }
        let orderList = res.result.items.length > 0 ? this.data.orderList.concat(res.result.items) : this.data.orderList
        this.setData({
          orderList,
          currentPage: res.result.currentPage,
          hasMore: orderList.length < res.result.totalCount,
          loading: false,
        })  
      }
    })
  },

  //新建出库单
  onNew(){
    wx.navigateTo({
      url: '/retailPages/pages/comeStock/comeStockInfo/comeStockInfo',
    })
  },

  // 跳转进货单信息页
  onSkipDetail(e){
    console.log(e)
    let {orderList} = this.data
    let index = e.currentTarget.id
    let recordNo = orderList[index].recordNo
    let recordId = orderList[index].recordId
    wx.navigateTo({
      url: `/retailPages/pages/comeStock/comeStockInfo/comeStockInfo?recordNo=${recordNo}&recordId=${recordId}`,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectComponent('.serch').clearSearch()
    // let screen = wx.getStorageSync('screen')
    // screen = JSON.parse(JSON.stringify(screen).replace(/recordStatus/g,"operationType"))
    // wx.removeStorageSync('stockGoodsList')
    // // wx.removeStorageSync('screen')
    // wx.removeStorageSync('recordNo')
    // wx.removeStorageSync('message')
    // console.log(screen)
    // this.getRevisionStockOrder(screen)
  },
})