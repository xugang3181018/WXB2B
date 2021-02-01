const base = require('../../utils/util.js')
import { payQuery, memberModify, levelList } from '../../api/index.js'

let app = getApp()
Page({
    data: {
        loading: true,
        btnLoading: false,
        orderStatus:app.types.orderStatus,
        orderStatusSel: app.types.orderStatusSel,
        payTypeSel: app.types.payTypeSel,
        // payType:app.types.payType
      payType: { WXPAY: "微信支付", ALIPAY: "支付宝支付", MPAY: "会员支付", CASH: "现金支付", UNIONPAY: "云闪付", BANK:"银行卡支付"}
    },
    onLoad(options) {
        this.setData({
            checkParmas: options,
            detail: wx.getStorageSync("orderDetail"),
            loading: false,
            role: app.commonParams('role'),
            ...wx.getStorageSync('canModify')
        })
      console.log(wx.getStorageSync("orderDetail").payType, wx.getStorageSync("orderDetail").orderStatus, app.types.payType)
    },
    checkOrder() {
        payQuery(options)
            .then(res => {
                console.log(res)
                this.setData({
                    isPageLoad: false,
                    detail: res
                })
            })
    },
    clipOrderNo (e) {
        console.log(e)
        wx.setClipboardData({
            data: e.currentTarget.id,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        console.log(res.data)
                    }
                })
            }
        })
    },
    checkPay: function(e) {
        this.setData({
            btnLoading: true
        })
        payQuery({
            merchantCode: this.data.detail.merchantCode,
            outTradeNo: this.data.detail.outTradeNo
        }).then(res => {
            this.setData({
                btnLoading: false
            })
            console.log(res)
            if (res.code == 'FAILED') {
                if(res.subMsg){
                    wx.showModal({
                        title: res.msg,
                        content: res.subMsg,
                        showCancel:false
                    })
                }else{
                    wx.showToast({
                        title: res.msg,
                        icon: "none"
                    })
                }
            } else if (res.code == 'SUCCESS') {
                this.setData({
                    detail: res
                })
            }
        })
    },
    goRefund: function(e) {
        console.log(this.data.detail)

        wx.setStorageSync("refundDetail", this.data.detail)
        wx.redirectTo({
            url: '/pages/refund/refund',
        })
    }
})