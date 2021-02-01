// pages/orderRecord/orderDetail/orderDetail.js
import {
  refundOrderList,
  billDetail,
  payQuery,
  preauthReverse,
  preauthComplete
} from '../../../api/index.js'
const base = require('../../../utils/util.js')
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: {
      NOTPAY: "未支付",
      SUCCESS: "支付成功",
      REFUND: "已退款",
      CLOSED: "已关闭",
      REVOKED: "已撤销"
    },
    payType: {
      WXPAY: "微信支付",
      ALIPAY: "支付宝支付",
      MPAY: "会员支付",
      CASH: "现金支付",
      BANK: "pos支付"
    },
    refundStatus: false,
    refund: true,
    dialogStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 请求退款列表
  onShowRefundList(e, outTradeNo) {
    console.log(outTradeNo)
    refundOrderList({
      outTradeNo: outTradeNo || this.data.detail.outTradeNo
    }).then(res => {
      console.log(res)
      this.setData({
        refundStatus: !this.data.refundStatus,
        refundList: res.refundDetails
      })
    })
  },

  //展示退款列表事件
  showList() {
    this.setData({
      refundStatus: !this.data.refundStatus,
    })
  },

  //获取订单详情

  getBillDetail(params) {
    billDetail(params).then(res => {
      this.setData({
        orderGoods: res.orderGoods
      })
    })
  },

  // 押金查询

  orderQuery(type) {
    // 1退款，2检测
    wx.showLoading()
    let params = {
      merchantCode: app.commonParams('merchantCode'),
      outTradeNo: this.data.detail.outTradeNo,
      showType: 1,
    }
    payQuery(params).then(res => {
      wx.hideLoading()
      if (res.code == "SUCCESS") {
        if (type == 1) {
          wx.setStorageSync("refundDetail", this.data.detail)
          wx.redirectTo({
            url: '/pages/refund/refund',
          })
        } else if (type == 2) {
          console.log(res)
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  // 支付检测
  payDetection() {
    this.orderQuery(2)
  },

  // 退款
  refund() {
    let data = this.orderQuery(1)
  },

  //押金撤销
  depositReverse() {
    let params = {
      merchantCode: app.commonParams('merchantCode'),
      outTradeNo: this.data.detail.outTradeNo
    }
    wx.showModal({
      title: '温馨提示',
      content: '确定撤销该流水吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          preauthReverse(params).then(res => {
            if (res.code == "SUCCESS") {
              wx.showToast({
                title: '已撤销',
                icon: 'none',
                duration: 2000
              })
              wx.navigateTo({
                url: '/pages/orderRecord/orderRunningWater/orderRunningWater?index=6',
              })
            } else {
              wx.showToast({
                title: '订单异常',
                icon: 'none',
                duration: 2000
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 展示押金完成组件
  closeDialogBox() {
    this.setData({
      dialogStatus: false
    })
  },

  // 获取消费的金额
  inputContent(e) {
    console.log(e)
    this.setData({
      money: Number(e.detail.value)
    })
  },

  // 确认收款
  affirmPay() {
    wx.showLoading()
    let {
      money,
      detail
    } = this.data
    console.log(money)
    let params = {
      merchantCode: app.commonParams('merchantCode'),
      originOutTradeNo: detail.outTradeNo,
      outTradeNo: `88${(new Date()).getTime()}${base.randomNum(6)}`,
      totalAmount: money
    }
    preauthComplete(params).then(res => {
      wx.hideLoading()
      this.setData({
        dialogStatus: false
      })
      if (res.code == "SUCCESS") {
        wx.showToast({
          title: '收款成功',
          icon: 'none',
          duration: 2000
        })
        wx.navigateTo({
          url: `/pages/orderRecord/orderRunningWater/orderRunningWater?index=6`,
        })
      } else {
        wx.showToast({
          title: '收款失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  //押金完成
  depositComplete() {
    this.setData({
      dialogStatus: true
    })
  },

  // 跳转退款详情
  refundDetail(e) {
    console.log(e.currentTarget.dataset)
    let {
      detail,
      refundList
    } = this.data,
      index = e.currentTarget.dataset.index;
    let detailStr = JSON.stringify(detail),
      refundStr = JSON.stringify(refundList[index]);
    console.log(refundList[index])
    wx.navigateTo({
      url: `/pages/orderRecord/refundDetail/refundDetail?detail=${detailStr}&refund=${refundStr}`,
    })
  },

  //复制订单编号

  onCopyCoding(e) {
    console.log(e.currentTarget.id)
    wx.setClipboardData({
      data: e.currentTarget.id,
      success(res) {
        console.log(res)
        wx.getClipboardData({
          success(res) {
            console.log(res)
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let detail = wx.getStorageSync("itemDetail")
    detail.deadline = base.deadline(detail.createDate)
    this.setData({
      detail: detail
    })
    console.log(detail)
    let params = {
      merchantCode: app.commonParams('merchantCode'),
      outTradeNo: detail.outTradeNo,
      showType: 1,
    }
    if (detail.orderType == 2 || detail.orderType == 3) {
      this.getBillDetail(params)
    } else if (detail.orderType == 6) {
      if (detail.receiptAmount && detail.receiptAmount < detail.totalAmount) {
        this.onShowRefundList("", detail.preAuthRelationOrderNo)
      }
    }
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})