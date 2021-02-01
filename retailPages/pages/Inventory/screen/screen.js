// pages/Inventory/screen/screen.js
const {selectInventoryCheckList} = require("../../../../api/index")
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: {
      startDate: app.base.startDate(0, 'yyyy-MM-dd'),
      endDate: app.base.startDate(0, 'yyyy-MM-dd'),
    },
    status:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      role: wx.getStorageSync("login").role
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  
  // 日期选择组件
  changeCalendar(e) {
    if(!e.detail.startDate){
      this.setData({
        showCal: false,
        hidden: false
      })  
    }else{
      this.setData({
        showCal: false,
        hidden: false,
        date: e.detail
      }) 
    }
  },

  // 日期组件的展示
  otherDate(event) {
    console.log(event)
    this.setData({
      showCal: true
    })
  },

  //重置
  reset(){
    this.setData({
      merchant:"",
      recordNo:'',
      index:-1,
      status:false
    })
  },

  // 确定筛选
  onConfirm(){
      let {index,recordNo,date,merchantCode,merchantList,role,status} = this.data
      console.log(index,recordNo,date,merchantCode)
      let data ={
        status:index==0?0:index || "",
        recordNo:recordNo || "",
        startTime:date.startDate || "",
        endTime:date.endDate || "",
        // merchantCode:role != 0?merchantList[0].merchantCode : merchantCode || ""
        merchantCode:merchantCode
      }
      if(status){
        data.operatorId = wx.getStorageSync("login").operatorId
      }
      wx.setStorageSync('screen', data)
      wx.navigateBack()
  },

  // // 盘点中
  // underway(e){
  //   let data = e.target.dataset
  //   this.setData({
  //     value:data.value,
  //     index:data.index
  //   })
  // },

  // // 已完成
  // succeed(e){
  //   let data = e.target.dataset
  //   this.setData({
  //     value:data.value,
  //     index:data.index
  //   })
  // },

  // //已作废
  // obsolete(e){
  //   let data = e.target.dataset
  //   this.setData({
  //     value:data.value,
  //     index:data.index
  //   })
  // },

  onOperator(){
    this.setData({
      status:!this.data.status
    })
  },

  // 选择状态
  statusScreen(e){
    let data = e.target.dataset
    this.setData({
      value:data.value,
      index:data.index
    })
  },

  //获取盘点单号
  onInput(e){
    console.log(e)
    this.setData({
      recordNo:e.detail.value
    })
  },

  //选择盘点机构
  changeMerchant(e){
    console.log(e)  
    let {merchantList} = this.data
    let index = Number(e.detail.value)
    this.setData({
      merchant:index,
      merchantCode:merchantList[index].merchantCode
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    selectInventoryCheckList({merchantCode: wx.getStorageSync("login").merchantCode}).then(res=>{
      console.log(res)
      if(res.code == "SUCCESS"){
        this.setData({
          merchantList:res.result.items
        })
      }
    })
  },
})