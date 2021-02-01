// pages/retail/refund/refundOrderList/refundOrderList.js
import {
  returnStockRecord
} from '../../../../api/index'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: ['待提交', '待审核', '已完成','','已完成'],
    orderList: [],
    screenStatus:true,
    isPX:app.systemInfo.isPX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loginInfo: wx.getStorageSync('login'),
    })
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
        this.returnStockRecord({recordNo:value})
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
      wx.removeStorageSync('stockGoodsList')
      let screen = wx.getStorageSync('screen')
      console.log(screen)
      this.returnStockRecord(screen)
      this.setData({
        orderList:[],
        screenStatus:true
      })
      // this.returnStockRecord()
    },

      //筛选   
  onScreen(){
    wx.navigateTo({
      url: '/retailPages/pages/stock/filtrate/filtrate?',
    })
  },

  //获取退货单列表
  returnStockRecord(data) {
    let {
      loginInfo
    } = this.data
    let params = {
      merchantCode: loginInfo.merchantCode,
      recordType: 1,
      recordSource: 3
    }
    let sparams = {...params,...data}
    returnStockRecord(sparams).then(res => {
      if(!data){
        this.setData({
          orderList:[]
        })
      }
      console.log(res, "退货单列表")
      if (res.code == "SUCCESS" && res.result.totalCount > 0) {
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
      this.returnStockRecord(screen)
    } else {
      let params = {
        currentPage: currentPage + 1,
      }
      this.returnStockRecord(params)
    }
  },

  // 跳转详情页
  onSkipDetail(e) {
    console.log(e)
    let {
      orderList
    } = this.data
    let index = e.currentTarget.id
    let recordId = orderList[index].recordId
    wx.navigateTo({
      url: `/retailPages/pages/refund/refundOrderInfo/refundOrderInfo?recordId=${recordId}`,
    })
  },

  //筛选   
  onScreen() {
    wx.navigateTo({
      url: '/retailPages/pages/stock/filtrate/filtrate',
    })
  },

  //新建出库单
  onNew() {
    wx.navigateTo({
      url: '/retailPages/pages/refund/refundOrderInfo/refundOrderInfo',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectComponent('.serch').clearSearch()
    // wx.removeStorageSync('stockGoodsList')
    // let screen = wx.getStorageSync('screen')
    // console.log(screen)
    // this.returnStockRecord(screen)
  },
})