import {
  login,
  refund
} from '../../api/index.js'
const base = require('../../utils/util.js')
let app = getApp()

Page({
  data: {
    checkMa: false,
    mrkList: ["撤销重新下单", "商品不合格"],
    mrkToggle: [false, false],
    mrk: false,
    markNum: 0,
    roles: app.commonParams('role'),
    savePwd: false,
    refDidable: true,
    diableTextarea: false,
    orderStatus: app.types.orderStatus,
    orderStatusSel: app.types.orderStatusSel,
    payTypeSel: app.types.payTypeSel,
    payType: app.types.payType
  },
  onShow() {
    let refKey = wx.getStorageSync("refKey") ? wx.getStorageSync("refKey") : null,
      savePwd = refKey ? true : false
    this.setData({
      detail: wx.getStorageSync("refundDetail"),
      role: app.commonParams("role"),
      refKey,
      savePwd
    })
  },
  refInput(e) {
    let num = e.detail.value,
      decimalReg = /^\d{0,8}\.{0,1}(\d{1,2})?$/,
      newTotal = decimalReg.test(num) ? num : total,
      detail = this.data.detail
    if (Number(e.detail.value).toFixed(2) > Number(detail.receiptAmount).toFixed(2)) {
      wx.showToast({
        title: '退款金额不能大于订单实收金额',
        icon: 'none'
      })
      this.setData({
        refDidable: true
      })
    } else if (e.detail.value == '') {
      this.setData({
        refDidable: true
      })
    } else if (Number(e.detail.value).toFixed(2) != 0) {
      this.setData({
        refAmt: newTotal,
        refDidable: false
      })
    }
  },
  refundAll() {
    this.setData({
      refAmt: this.data.detail.receiptAmount,
      refDidable: false
    })
  },
  goRefund(e) {
    let nowDate = new Date()
    if (this.data.refAmt) {
      this.setData({
        checkMa: true
      })
    } else {
      wx.showToast({
        title: '请输入退款金额',
        icon: 'none'
      })
    }
  },
  refundReq(e) {
    const value = e.detail.value
    if (value.passWord == '' || value.userName == '') {
      wx.showToast({
        title: '请输入店长管理员账号密码',
        icon: 'none'
      })
    } else {
      this.login(value)
    }
  },
  login(value) {
    return login(value).then(res => {
      if (res.code == 'SUCCESS') {
        if (this.data.savePwd) {
          wx.setStorageSync('refKey', value)
        } else {
          wx.removeStorageSync("refKey")
          this.setData({
            refKey: null
          })
        }
        this.setData({
          checkMa: false
        })
        wx.showModal({
          title: "确定是否退款吗？",
          content: `退款金额${this.data.refAmt}元`,
          success: (res) => {
            if (res.confirm) {
              this.refund()
            } else if (res.cancel) {
              wx.showToast({
                title: '退款取消',
                icon: 'none'
              })
            }
          }
        })
      } else {
        app.tip(res.subMsg)
      }
    })
  },
  refund() {
    wx.showLoading()
    let nowDate = new Date(),
      detail = this.data.detail,
      refAmt = this.data.refAmt
    let parmas = {
      refundNo: `${nowDate.Format("yyyyMMddhhmmss")}${nowDate.getTime()}${base.randomNum(4)}`,
      refundAmount: this.data.refAmt,
      merchantCode: detail.merchantCode
    }
    if (detail.outTradeNo) {
      parmas.outTradeNo = detail.outTradeNo
    } else if (detail.outTransactionId) {
      parmas.outTransactionId = detail.outTransactionId
    }
    //退款原因
    if (this.data.refundReason && this.data.refundReason.length > 0) {
      parmas.refundReason = this.data.refundReason
    }
    refund(parmas)
      .then(res => {
        wx.hideLoading()
        wx.showModal({
          title: res.msg || res.subMsg,
          content: res.subMsg || res.msg,
          showCancel: false,
          confirmColor: '#00cc99',
          success: (data) => {
            if (res.code == 'SUCCESS') {
              if ((data.confirm)) {
                if (res.code == "SUCCESS") {
                  // wx.navigateTo({
                  //   url: '/pages/order/order',
                  // })
                  wx.navigateBack()
                }
              }
            }
          },
        })
      })
  },
  togglePwd(e) {
    this.setData({
      savePwd: !this.data.savePwd
    })
  },
  hideMa(e) {
    console.log(e)
    this.setData({
      checkMa: false
    })
  },
  selMrk(e) {
    let mrkToggle = this.data.mrkToggle
    let mrkList = this.data.mrkList
    mrkToggle[e.target.dataset.index] = !mrkToggle[e.target.dataset.index]
    let selMrk = []
    for (let i in mrkToggle) {
      if (mrkToggle[i]) {
        selMrk.push(mrkList[i])
      }
    }
    const mrks = selMrk.join()
    this.setData({
      mrkToggle: mrkToggle,
      selMrk: mrks
    })
  },
  mrkSubmit() {
    this.setData({
      mrk: false
    })
  },
  selectMrk() {
    this.setData({
      mrk: !this.data.mrk
    })
  },
  mrkOk() {
    this.setData({
      mrk: false
    })
  },
  mrkInput(e) {
    let markNum = e.detail.value.length
    if (markNum <= 50) {
      this.setData({
        refundReason: e.detail.value,
        markNum: e.detail.value.length
      })
    } else {
      app.tip('不超过50个字')
      this.setData({
        diableTextarea: true
      })
    }
  }
})