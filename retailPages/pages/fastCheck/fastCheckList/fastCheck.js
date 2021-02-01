// pages/retail/fastCheck/fastCheckList/fastCheck.js
import {
  selectFastRecordList
} from "../../../../api/index"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fastCheckList: [],
    fastCheckStatus: ["待提交", "待审核", "已完成", "已删除"],
    screenStatus:true,
    isPX:app.systemInfo.isPX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loginInfo = wx.getStorageSync('login')
    this.setData({
      ...loginInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectComponent('.serch').clearSearch()
    // this.setData({
    //   fastCheckList: [],
    // })
    // wx.removeStorageSync('fastCheckList')
    // let screen = wx.getStorageSync('screen')
    // wx.removeStorageSync('screen')
    // screen = JSON.parse(JSON.stringify(screen).replace(/recordStatus/g,"status"))
    // console.log(screen)
    // this.getSelectFastRecordList(screen)
  },

  // 获取快速采购单列表
  getSelectFastRecordList(param) {
    wx.showLoading({
      title: '加载中',
    })
    let {
      merchantCode
    } = this.data
    let params = {
      merchantCode,
      ...param
    }
    selectFastRecordList(params).then(res => {
      console.log(res, "快速盘点单列表")
      if (res.code == "SUCCESS" && res.result.totalCount > 0) {
        let data = res.result
        let fastCheckList = data.items.length > 0 ? this.data.fastCheckList.concat(data.items) : this.data.fastCheckList
        this.setData({
          currentPage: data.currentPage,
          fastCheckList,
          hasMore: res.result.items.length < res.result.totalCount,
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
      app.tip("没有更多数据了")
      return
    }
    if (screen) {
      screen.currentPage = currentPage + 1
      this.getSelectFastRecordList(screen)
    } else {
      let params = {
        currentPage: currentPage + 1
      }
      this.getSelectFastRecordList(params)
    }
  },

  //搜索框输入的内容
  searchMember({
    detail
  }) {
    console.log(detail)
    if(detail){
      this.setData({
        fastCheckList: [],
        screenStatus:false
      })
      this.getSelectFastRecordList({
        recordNo: detail
      })
    }
  },

  //输入内容时
  onInput({detail}){
    console.log(detail)
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

  // 清空搜索输入框
  clearSearch(){
    this.setData({
      fastCheckList:[],
      screenStatus:true
    })
    wx.removeStorageSync('fastCheckList')
    let screen = wx.getStorageSync('screen')
    if(screen){
      wx.removeStorageSync('screen')
      screen = JSON.parse(JSON.stringify(screen).replace(/recordStatus/g,"status"))
    }
    console.log(screen)
    this.getSelectFastRecordList(screen)
    // this.getSelectFastRecordList()
  },

  //筛选   
  onScreen() {
    wx.navigateTo({
      url: '/retailPages/pages/stock/filtrate/filtrate',
    })
  },

  // 跳转详情页或新建盘点单
  onSkipDetail({currentTarget}){
    console.log(currentTarget)
    wx.navigateTo({
      url: `/retailPages/pages/fastCheck/fastCheckInfo/fastCheckInfo?recordNo=${currentTarget.id}`,
    })
  }
})