// pages/Inventory/trueCheck/trueCheck.js
const {
  selectInventoryRecordList
} = require('../../../../api/index.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkList: [],
    checkStatus: ["盘点中", "已审核", "已完成", "已作废"],
    loading: true,
    screenStatus:true,
    sPX:app.systemInfo.isPX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
    // if (!this.data.screen) {
    //   this.getSelectInventoryRecordList()
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady")
  },

  //搜索
  searchMember(e) {
    console.log(e, e.detail.value, "搜索")
    this.setData({
      checkList:[],
      screenStatus:false
    })
    this.getSelectInventoryRecordList({
      recordNo: e.detail
    })
  },

  //清空搜索框内容
  clearSearch(){
    this.setData({
      checkList: [],
      screenStatus:true
    })
    if(app.newCheck !=1){
      wx.removeStorageSync('checkList')
      wx.removeStorageSync('checkInfo')
    }
    wx.removeStorageSync('checkMessage')
    wx.removeStorageSync('checkDetail')
    app.merchantCode = ""
    app.checkNo = ''
    app.goods = ""
    app.from = ""
    let screen = wx.getStorageSync('screen')
    if (screen) {
      this.setData({
        screen,
      })
      this.getSelectInventoryRecordList(screen)
      wx.removeStorageSync('screen')
    } else {
      this.getSelectInventoryRecordList()
    }
    // this.setData({
    //   checkList:[],
    //   screenStatus:true
    // })
    // this.getSelectInventoryRecordList()
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

  //跳转筛选页
  onScreen() {
    wx.navigateTo({
      url: '/retailPages/pages/Inventory/screen/screen',
    })
  },

  // 跳转详情页
  onSkipDetail(e) {
    console.log(e)
    let {
      checkList
    } = this.data
    let index = Number(e.currentTarget.id)
    app.newCheck = ""
    wx.setStorageSync('checkDetail', checkList[index])
    wx.navigateTo({
      url: '/retailPages/pages/Inventory/lnventoryDetail/lnventoryDetail',
    })
  },

  // 获取实物盘点列表
  getSelectInventoryRecordList(params) {
    wx.showLoading()
    console.log(params)
    if(params){
      params.merchantCode =  wx.getStorageSync("login").merchantCode
    }else{
      var params={
        merchantCode: wx.getStorageSync("login").merchantCode
      }
    }
    selectInventoryRecordList(params).then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.code == "SUCCESS") {
        if (!res.result.items) {
          this.setData({
            hasMore: false,
            loading: false,
          })
          return
        }
        let checkList = res.result.items.length > 0 ? this.data.checkList.concat(res.result.items) : this.data.checkList
        this.setData({
          checkList,
          load:checkList.length?true:false,
          currentPage: res.result.currentPage,
          hasMore: res.result.items.length < res.result.totalCount,
          loading: false,
        })
      }
    })
  },

  //新建实物盘点
  onNew() {
    app.newCheck = 1
    wx.navigateTo({
      url: '/retailPages/pages/Inventory/lnventoryDetail/lnventoryDetail',
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
      this.getSelectInventoryRecordList(screen)
    } else {
      let params = {
        currentPage: currentPage + 1
      }
      this.getSelectInventoryRecordList(params)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectComponent('.serch').clearSearch()
    // this.setData({
    //   checkList: []
    // })
    // if(app.newCheck !=1){
    //   wx.removeStorageSync('checkList')
    //   wx.removeStorageSync('checkInfo')
    // }
    // wx.removeStorageSync('checkMessage')
    // wx.removeStorageSync('checkDetail')
    // app.merchantCode = ""
    // app.checkNo = ''
    // app.goods = ""
    // app.from = ""
    // let screen = wx.getStorageSync('screen')
    // if (screen) {
    //   this.setData({
    //     screen,
    //   })
    //   this.getSelectInventoryRecordList(screen)
    //   wx.removeStorageSync('screen')
    // } else {
    //   this.getSelectInventoryRecordList()
    // }
  },

})