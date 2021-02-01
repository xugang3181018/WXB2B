// pages/retail/stock/stockList/stockList.js
let {
  stockInRecord
} = require("../../../../api/index")
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus:['待提交','待审核','已完成'],
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

  // 根据收货单查询入库单
  searchMember(e){
    console.log(e)
    if(e.detail){
      this.setData({
        orderList:[],
        screenStatus:false
      })
      this.stockInRecord({recordNo:e.detail})
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

  //筛选进货单列表
  onScreen(){
    wx.navigateTo({
      url: '/retailPages/pages/stock/filtrate/filtrate',
    })
  },

  // 清空搜索框内容
  clearSearch(){
    let screen = wx.getStorageSync('screen')
    screen = JSON.parse(JSON.stringify(screen).replace(/recordStatus/g,"status"))
    wx.removeStorageSync('screen')
    wx.removeStorageSync('stockGoodsList')
    wx.removeStorageSync('alter')
    this.stockInRecord(screen)
    this.setData({
      orderList:[],
      screenStatus:true
    })
    // this.stockInRecord()
  },

  //入库单列表
  stockInRecord(data) {
    wx.showLoading({
      title: '加载中',
    })
    let params = {}
    if(data){
      params = data
      params.merchantCode =  wx.getStorageSync("login").merchantCode
    }else{
      params={
        merchantCode: wx.getStorageSync("login").merchantCode
      }
    }
    stockInRecord(params).then(res=>{
      console.log(res,"入库列表")
      if(!data){
        this.setData({
          orderList:[]
        })
      }
      if(res.code == "SUCCESS" && res.result.totalCount != 0 && res.result.items){
        console.log(res.result.items.length )
        let orderList = res.result.items.length > 0 ? this.data.orderList.concat(res.result.items) : this.data.orderList
        this.setData({
          orderList,
          currentPage: res.result.currentPage,
          hasMore: orderList.length < res.result.totalCount,
          loading: false,
        })
      }else{
        this.setData({
          hasMore: false,
          loading: false,
        })
        wx.showToast({
          title: '暂无数据',
          icon:"none"
        })
      }
      wx.hideLoading()
    })
  },

  //上拉加载
  listMore() {
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
      this.stockInRecord(screen)
    } else {
      let params = {
        currentPage: currentPage + 1,
      }
      this.stockInRecord(params)
    }
  },

  // 跳转详情页
  onSkipDetail(e){
    console.log(e)
    let {orderList} = this.data
    let index = e.currentTarget.id
    let recordId = orderList[index].recordId
    wx.navigateTo({
      url: `/retailPages/pages/stock/stockOrderInfor/stockOrderInfor?recordId=${recordId}`,
    })
  },

  // 新建进货单
  onNew(){
    wx.navigateTo({
      url: `/retailPages/pages/stock/stockOrderInfor/stockOrderInfor`,
    })
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectComponent('.serch').clearSearch()
    // let screen = wx.getStorageSync('screen')
    // wx.removeStorageSync('screen')
    // wx.removeStorageSync('stockGoodsList')
    // wx.removeStorageSync('alter')
    // this.stockInRecord(screen)
  },
})