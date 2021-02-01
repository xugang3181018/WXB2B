// pages/retail/supplier/supplierList/supplierList.js
import {
  psList
} from "../../../../api/index"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplierList: [],
    sPX:app.systemInfo.isPX
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

  // 新建供应商
  onNew(e) {
    console.log(e)
    let supplierId = e.currentTarget.id
    wx.navigateTo({
      url: `/retailPages/pages/supplier/newSupplier/newSupplier?supplierId=${supplierId}`,
    })
  },

  /**
   * 清空搜索框
   */
  clearSearch(e){
    this.setData({
      supplierList:[]
    })
    this.psList()
  },

  //获取供应商列表
  psList(number,supplierName) {
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      appId: wx.getStorageSync('login').appId,
      pageSize: 10
    }
    if(number){
      params.currentPage = number
    }
    if(supplierName){
      params.supplierName = supplierName
    }
    psList(params).then(res => {
      console.log(res, "供应商列表")
      if (res.code == "SUCCESS" && res.result.totalCount > 0) {
        let supplierList = res.result.items.length > 0 ? this.data.supplierList.concat(res.result.items) : this.data.supplierList
        this.setData({
          currentPage: res.result.currentPage,
          hasMore: supplierList.length < res.result.totalCount,
          supplierList,
        })
      }
      wx.hideLoading()
    })
  },

  //上拉加载
  listMore() {
    let {
      currentPage,
      hasMore
    } = this.data
    if (!hasMore) {
      wx.showToast({
        title: "没有更多数据了",
        icon: "none"
      })
      return
    }
    this.psList(currentPage + 1)
  },

  // 搜索供应商
  searchMember(e){
    console.log(e)
    this.setData({
      supplierList:[]
    })
    this.psList("",e.detail)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.selectComponent('.serch').clearSearch()
  },
})