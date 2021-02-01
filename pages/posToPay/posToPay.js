let app = getApp()
const qrcode = require('../../libs/qrcode/code.js')
import { jspay, pay } from '../../api/index.js'

Page({
    data: {
        isPageLoad:true,
        qrFail:true   //二维码是否生效
    },
    onLoad(options) {
        let size = qrcode.size()
        wx.setNavigationBarTitle({
            title: '收款',
        })
        this.setData({
            size,
            totalPrcie: Number(options.total).toFixed(2),
            mark:options.mark ? options.mark : null
        })
        this.initPay()
    },
    initPay() {
        let params = {
            totalAmount: this.data.totalPrcie,
            merchantCode: app.commonParams('merchantCode'),
            expireSeconds: 120,
            operatorId: app.commonParams('operatorId')
        }
        if(this.data.mark){
            params.orderRemark = this.data.mark
        }
        jspay(params)
            .then(res => {
                let code = res.url
                this.endTime(120)
                qrcode.createQrCode(code, "qrCodeCanvas", 250, 250)
                let animation = wx.createAnimation({
                    transformOrigin: "50% 50%",
                    duration: 1000,
                    timingFunction: "ease",
                    delay: 0
                })
                animation.translateY(0).step()
                this.setData({
                    isPageLoad:false,
                    animation:animation.export(),
                    qrFail:false
                })
            })
    },
    endTime(endTime){
        for(let i=0; i<=endTime; i++){
            setTimeout(()=>{
                let time = endTime - i
                if (time == 0){
                    this.setData({
                        qrFail:true
                    })
                }else{
                    this.setData({
                        endTime: time
                    })
                }
            },i*1000)
        }
    },
    scanPay(){
        wx.scanCode({
            success:(res)=>{
                let outTradeNo = `${new Date().Format('yyyyMMddhhmmss')}${app.base.randomNum(4)}`
                let params = {
                    merchantCode: app.commonParams('merchantCode'),
                    outTradeNo: outTradeNo,
                    totalAmount:this.data.totalPrcie,
                    authCode: res.result,
                }
                console.log(res)
                pay(params).then(res=>{
                    if(res.code == 'FAILED'){
                        wx.showModal({
                            title: res.subMsg,
                            content: res.msg,
                            success:(res)=>{
                                if(res.confirm){
                                    this.scanPay()
                                }
                            }
                        })
                    } else if (res.code == 'SUCCESS'){
                        wx.setStorageSync('payDetail',res)
                        wx.redirectTo({
                            url: '/pages/posPaySuccess/posPaySuccess',
                        })
                    }
                })
            }
        })
    },
})