// pages/retail/supplier/newSupplier/newSupplier.js
import {
  supplierDetail,
  supplierSave,
  deleteSupplier
} from "../../../../api/index"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplierStatus: ['正常', "淘汰"],
    knot: false,
    maintain: false,
    statusIndex: 0,
    settleType: ['临时指定', '指定账期', '指定日期', '货到付款'],
    settleTypeIdx: 0,
    isPX:app.systemInfo.isPX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      supplierId
    } = options
    let loginInfo = wx.getStorageSync('login')
    this.setData({
      loginInfo,
      supplierId
    })
    if (supplierId) {
        // 动态修改标题
    wx.setNavigationBarTitle({
      title: '供应商详情',
    })
      this.supplierDetail()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 提交的内容
  submit(e) {
    console.log(e)
    let data = e.detail.value
    // data.status = Number(data.status)
    // data.settleType = Number(data.settleType)
    // data.invoiceDay = Number(data.invoiceDay)
    // data.settleDays = Number(data.settleDays)
    console.log(e.detail.value, !(data.supplierName && data.contactName && data.contactMobile && data.address && (data.status == 0 && data.status)), data.supplierName, data.contactName, data.contactMobile, data.address)
    if (!(data.supplierName && data.contactName && data.contactMobile && data.address && (data.status == 0 || data.status))) {
      app.tip("请把供应商信息填写完整")
      return
    }
    this.supplierSave(data)
  },

  //获取状态
  changeStatus(e) {
    console.log(e)
    let statusIndex = Number(e.detail.value)
    console.log(statusIndex)
    this.setData({
      statusIndex,
    })
  },

  //获取结算方式
  changeSettleType(e) {
    let settleTypeIdx = Number(e.detail.value)
    this.setData({
      settleTypeIdx,
    })
  },

  // 获取供应商详情
  supplierDetail() {
    let {
      loginInfo,
      supplierId
    } = this.data
    let params = {
      appId: loginInfo.appId,
      supplierId
    }
    supplierDetail(params).then(res => {
      console.log(res, "供应商详情")
      if (res.code = "SUCCESS") {
        this.setData({
          detail: res.result,
          statusIndex:res.result.status,
          settleTypeIdx:res.result.settleType
        },() => {
          console.log(this.data.detail)
        })
      }
    })
  },

  //显示隐藏
  showHide(e) {
    let index = e.target.id
    let {
      knot,
      maintain
    } = this.data
    console.log(index)
    switch (index) {
      case "1":
        this.setData({
          knot: !knot
        })
        break;
      case "2":
        this.setData({
          maintain: !maintain
        })
        break;
    }
  },

  // 保存供应商
  supplierSave(params) {
    let {
      loginInfo,
      detail
    } = this.data
    console.log(loginInfo)
    params.merchantCode = loginInfo.merchantCode
    params.operatorId = loginInfo.operatorId
    if (detail) {
      params.supplierId = detail.supplierId
      params.updateOperatorId = loginInfo.operatorId
    }
    console.log(params)
    supplierSave(params).then(res => {
      console.log(res, "保存供应商")
      app.tip(res.msg)
      if (res.code == "SUCCESS") {
        setTimeout(function(){
          wx.navigateBack()
        },1000)
      }
    })
  },

  //删除供应商
  deleteSupplier(e) {
    console.log(e.target.id)
    let supplierId = e.target.id
    deleteSupplier({
      supplierId
    }).then(res => {
      console.log(res, "删除供应商")
      app.tip(res.msg)
      if (res.code == "SUCCESS") {
        wx.navigateBack()
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})