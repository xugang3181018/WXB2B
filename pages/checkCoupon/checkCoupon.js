let app = getApp()
import {
    couponConsume,
    giftConsume,
    updateStatusForApp
} from '../../api/index.js'

Page({
    data: {
        couponNo: null
    },
    onLoad() {
        wx.setNavigationBarTitle({
            title: '核销',
        })
    },
    scanCopuon() {
        let that = this
        wx.scanCode({
            success: (res) => {
                console.log(res)
                let couponNo = res.result
                let num = res.result.substr(0, 1)
                console.log(couponNo, num)
                if (couponNo.length == 6 && num < 4) {
                    console.log(couponNo, '外卖核销')
                    that.updateStatusForApp(couponNo)
                }
                that.setData({
                    couponNo
                })
            },
        })
    },
    updateStatusForApp(fetchCode) {
        updateStatusForApp({
            merchantCode: wx.getStorageSync('login').merchantCode,
            fetchCode
        }).then(res => {
            console.log(res)
            if (res.code == "SUCCESS") {
                let data = JSON.stringify(res.result)
                wx.redirectTo({
                    url: `/pages/checkCoupon/cancel/cancel?data=${data}`,
                })
            } else {
                app.tip(res.msg)
            }
        })
    },
    couponInput(e) {
        this.setData({
            couponNo: e.detail.value
        })
    },
    checkCoupon() {
        let {
            couponNo
        } = this.data
        let num = couponNo.substr(0, 1)
        if (couponNo) {
            if(couponNo.length == 6 && num<4){
                this.updateStatusForApp(couponNo)
            }else{
                this.couponConsume(couponNo)
            }
        } else {
            app.tip("请输入优惠券号")
        }
    },
    couponConsume(couponNo){
        let params = {
            couponNo: this.data.couponNo,
            merchantCode: app.commonParams("merchantCode"),
            operatorId:app.commonParams("operatorId")
        }
        couponConsume(params).then(res => {
            app.tip(res.msg)
        })
    },
    giftConsume(couponNo) {
        let params = {
            couponNo: this.data.couponNo,
            merchantCode: app.commonParams("merchantCode")
        }
        giftConsume(params).then(res => {
            console.log(res)
            app.tip(res.msg)
        })
    }
})