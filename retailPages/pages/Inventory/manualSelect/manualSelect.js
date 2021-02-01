// pages/Inventory/manualSelect/manualSelect.js
const {getQueryGoodsCategory,getInventoryDetailsGoodsList} = require("../../../../api/index")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    classifyStatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,options.checkNo)
    let {checkNo,code} = options
    this.setData({
      checkNo,
      code,
    })
    this.getQueryGoodsCategory()
    this.getInventoryDetailsGoodsList({checkNo})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 查询分类列表
  getQueryGoodsCategory(){
    let loginInfor = wx.getStorageSync("login")
    let params = {}
    if(loginInfor.role != 0){
      params.merchantCode = loginInfor.merchantCode
    }
    getQueryGoodsCategory(params).then(res=>{
      console.log(res,"分类列表")
      if(res.code == "SUCCESS"){
        this.setData({
          list:res.result.items
        })
      }
    })
  },

  //查询盘点商品
  getInventoryDetailsGoodsList(params){
    wx.showLoading({
      title: '加载中',
    })
    getInventoryDetailsGoodsList(params).then(res=>{
      console.log(res)
      if(res.code == "SUCCESS"){
        this.setData({
          goodsList:res.result
        },()=>{
          wx.hideLoading()
        })
      }else{
        wx.showToast({
          title: '暂无数据',
          icon:"none"
        })
        this.setData({
          goodsList:[]
        },()=>{
          wx.hideLoading()
        })
      }
    })
  },

  //选择的分类
  changeMerchant(e){
    let {list,checkNo} = this.data
    let index = Number(e.detail.value)
    let goodsCategoryId = list[index].goodsCategoryId
    this.setData({
      index
    })
    this.getInventoryDetailsGoodsList({checkNo,goodsCategoryId})
  },

  //展示分分类组件
  classifyName(){
    this.setData({
      classifyStatus:!this.data.classifyStatus
    })
  },

  //确定按钮
  onConfirm(){
    this.setData({
      classifyStatus:false
    })
  },

  // 跳转盘点商品页
  onCheckGoods(e){
    console.log(e,e.currentTarget.id)
    let {goodsList,code,id,checkNo} = this.data
    let index = Number(e.currentTarget.id)
    console.log(index,goodsList[index])
    wx.setStorageSync('goodsDetail', goodsList[index])
    wx.navigateTo({
      url: `/retailPages/pages/Inventory/lnventoryGoods/lnventoryGoods?checkNo=${checkNo}&code=${code}`,
    })
    // wx.navigateTo({
    //   url: `/pages/retail/Inventory/lnventoryGoods/lnventoryGoods`,
    // })
  },
})