const app = getApp()
var base = require('../../utils/util.js')
import { preauthPay, pay, couponConsume } from '../../api/index.js'

Page({
    data: {
        amt: "0",
        discountAmt: "0",
        amtEmpty: true,
        loadPay: false,
        couponList: null,
        payMsg: '等待输入密码',
        couponChannel: ["微信可用", "支付宝可用"],
        goodsDetail: [],
        borderHeight: null,
        hideBorder: false,
        amtHand: true,
        discountStatus: false,
        couponType: app.types.couponType,
        couponStatus: false,
        leastMax: 0,
        realAmt: 0,
        discountAll: 0,
        goodsList:[]
    },
    onLoad(options) {
        let coupon = null
        if (options.coupon) {
            coupon = wx.getStorageSync("selectCoupon")
        }
        let normalText = options.preauth ? '请输入预授权金额' : '请输入消费金额',
            preauth = options.preauth ? true : false
        this.setData({
            isPX: app.systemInfo.isPX,
            coupon,
            preauth,
            normalText
        })

    },
    onReady() {
        var query = wx.createSelectorQuery()
        query.select('#alipay').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {
            let bheight = res[0].width
            let fheight = bheight.toFixed()
            this.setData({
                borderHeight: fheight * 4,
                keyHeight: fheight
            })
        })
        this.discountRes()
    },
    onShow(){
        let goodsList = wx.getStorageSync('goodsList')
        wx.removeStorageSync('goodsList')
        this.setData({
            goodsList
        })
        console.log(goodsList)
    },
    showKeybord(e) {
        let amtHand = e.currentTarget.id == "amt" ? true : false
        this.setData({
            hideBorder: false,
            couponStatus: false,
            amtHand
        })
    },
    currHand(e) {},
    toggleCoupon(e) {
        this.setData({
            hideBorder: true,
            couponStatus: !this.data.couponStatus,
        })
    },
    inputDiscount() {
        this.setData({
            discountStatus: !this.data.discountStatus,
            amtHand: !this.data.amtHand
        })
    },
    discountInput(e) {
        let discountAmt = e.detail.value
        if (Number(discountAmt) > this.data.amt) {
            app.tip('优惠金额不可超过消费金额')
        } else {
            this.setData({
                discountAmt
            })
        }
    },
    discountBlur(e) {
        let value = e.detail.value
        if (value != '' && Number(value) > 0) {
            this.setData({
                discountStatus: false
            })
        }
    },
    cooseCoupon() {
        this.setData({
            showCoupon: true
        })
    },
    discountRes(amts, coupon) {
        if (this.data.coupon) {
            let c = this.data.coupon,
                a = amts || this.data.amt,
                discount = [],
                goodsArr = [],
                leastArr = [], //最大的满减
                discountAll = 0, //优惠金额 
                realAmt = 0 //实际支付金额
            // 0代金券 1折扣券 2兑换券 5单品代金券 6会员卡 7单品折扣 8单品特价券 9全场满减券
            let amt = Number(a)
            c.forEach((item, index) => {
                let card = item.cardTemplate,
                    type = card.type
                //单品券累计商品总额
                if (type == 5 || type == 8 || type == 7) {
                    goodsArr.push(card.goodItem.itemPrice)
                }
                //满减最大
                if (card.leastCost > 0) {
                    leastArr.push(card.leastCost)
                }
                //优惠金额
                if (type == 7 || type == 1) {
                    //折扣券
                    discount.push(amt - (Number(amt * (card.discount * 0.1))))
                } else if (type == 5) {
                    //代金券
                    discount.push(card.reduceCost)
                } else if (type == 8) {
                    //单品特价
                    discount.push(card.goodItem.itemPrice - card.specialPrice)
                    //其他兑换券其他代金券
                } else if (type != 2 && card.reduceCost) {
                    //reduce coupon
                    discount.push(card.reduceCost)
                }
            })
            let sum = (acc, cur) => acc + cur
            let leastCost = leastArr.length > 0 ? Math.max.apply(null, leastArr) : 0,
                leastGood = goodsArr.length > 0 ? goodsArr.reduce(sum) : 0,
                leastMax = leastCost > leastGood ? leastCost : leastGood
            if (discount.length > 0) {
                discountAll = discount.reduce(sum)
                realAmt = (amt - discountAll).toFixed(2)
            }
            this.setData({
                discountAll: discountAll.toFixed(2),
                realAmt,
                leastMax,
                leastAmt: null
            })
            let leastAmt = amt > leastMax ? null : leastMax,
                lessAmt = leastAmt > Number(amt) ? (leastAmt - amt).toFixed(2) : null
            let res = {
                discountAll: discountAll.toFixed(2),
                realAmt,
                leastMax,
                leastAmt,
                lessAmt
            }
            this.setData(res)
            console.log(discount, discountAll.toFixed(2), res)
        }
    },
    touchKey(e) {
        let num = e.target.dataset.number,
            amt = this.data.amt,
            discountAmt = this.data.discountAmt,
            hideBorder = num != 'h' ? false : true,
            inputValue = (oldnum) => {
                let addAmt = `${oldnum}${num}`,
                    amtReg = /^\d{0,8}\.{0,1}(\d{1,2})?$/,
                    nums = (oldnum == "0" && num == "0") ? oldnum : num,
                    _amt = oldnum == "0" ? (num == '.' ? "0." : num) : (amtReg.test(addAmt) ? addAmt : oldnum)
                console.log(oldnum, num, nums, _amt)
                return _amt.length < 10 ? _amt : oldnum
            }
        if (num != 'h') {
            if (this.data.amtHand) {
                const amts = inputValue(amt)
                if (this.data.coupon) {
                    this.discountRes(amts)
                }
                this.setData({
                    amtEmpty: false,
                    hideBorder,
                    amt: amts
                })
            } else {
                this.setData({
                    discountAmt: inputValue(discountAmt)
                })
            }
        } else {
            this.setData({
                hideBorder: !this.data.hideBorder
            })
        }
    },
    checkCoupon(e) {
        wx.scanCode({
            success: (res) => {
                console.log(res)
                wx.navigateTo({
                    url: `/pages/checkCouponUser/checkCouponUser?id=${res.result}`,
                })
            }
        })
    },
    delChoose(e) {
        let coupon = this.data.coupon
        coupon.splice(e.currentTarget.dataset.index, 1);
        this.discountRes()
        this.setData({
            coupon
        })
    },
    createPay(e) {
        let amt = Number(this.data.amt).toFixed(2)
        if (amt == 0.00) {
            wx.showToast({
                title: '请输入收款金额',
                icon: "none"
            })
        } else {
            if ( this.data.coupon && this.data.lessAmt ) {
                app.tip(`还差${(Number(this.data.lessAmt)).toFixed(2)}元，可使用所选优惠券`)
            } else if (this.data.amt == this.data.leastAmt){
                app.tip(`支付金额大于需大于${this.data.leastAmt}元，可使用所选优惠券`)
            }else{
                this.scanPay()
            }
        }
    },
    markInput(e) {
        this.setData({
            orderRemark: e.detail.value
        })
    },

    scanPay() {
        let {goodsList} = this.data
        let arr = []
        console.log(goodsList)
        if(goodsList.length>0){   
            goodsList.map(item=>{
                let obj = {
                    goodsId:item.goodsNo,
                    goodsName:item.goodsName,
                    price:item.goodsPrice,
                    quantity:item.goodsNum,
                    goodsType:0
                }
                arr.push(obj)
            })
        }
        console.log(JSON.stringify(arr))
        wx.scanCode({
            success: (res) => {
                let outTradeNo = `${new Date().Format('yyyyMMddhhmmss')}${app.base.randomNum(4)}`
                let params = {
                    merchantCode: app.commonParams('merchantCode'),
                    outTradeNo: outTradeNo,
                    totalAmount: this.data.amt,
                    discountAmount: this.data.discountAll,
                    orderSource:5,
                    authCode: res.result,
                    appType:2,
                    operatorId: app.commonParams('operatorId'),
                    goodsDetail:JSON.stringify(arr)
                }
                if (this.data.discountAmt && this.data.discountAmt > 0) {
                    params.unDiscountAmount = Number(this.data.discountAmt).toFixed(2)
                }
                if (this.data.orderRemark && this.data.orderRemark > 0) {
                    params.orderRemark = this.data.orderRemark
                }
                wx.showLoading({
                    title: '等待付款',
                })
                if (this.data.preauth){
                    this.preauthPay(params)
                }else{
                    this.pay(params)
                }
  
            }
        })
    },
    preauthPay(params) {
        return preauthPay(params).then(res => {
            console.log(res)
            if (res.code == 'SUCCESS'){
                wx.showModal({
                    title: res.msg,
                    content: '微信预授权成功',
                    showCancel:false
                })
            }
        })
    },
    pay(params){
        return pay(params).then(res => {
            wx.hideLoading()
            this.setData({
                amt:''
            })
            if (res.code === 'FAILED') {
                wx.showModal({
                    title: res.subMsg,
                    content: res.msg,
                    confirmText: "重新收款",
                    orderSource: 5,
                    success: (res) => {
                        if (res.confirm) {
                            this.scanPay()
                        }
                    }
                })
            } else if (res.code === 'SUCCESS') {
                wx.setStorageSync('payDetail', res)
                app.tip(res.msg)
                if (this.data.coupon.length > 0) {
                    //核销优惠券
                    let coupon = this.data.coupon
                    wx.removeStorageSync('selectCoupon')
                    coupon.forEach((item, index) => {
                        list.push(this.couponConsume(item.couponNo))
                    })
                    Promise.all(list).then(data => {
                        wx.setStorageSync('consumeDetail', data)
                        wx.redirectTo({
                            url: '/pages/posPaySuccess/posPaySuccess',
                        })
                    })
                } else {
                    wx.redirectTo({
                        url: '/pages/posPaySuccess/posPaySuccess',
                    })
                }

            }
        })
    },
    
    paySuccess(data) {
        console.log("POSDATA::::", JSON.parse(data))
        wx.redirectTo({
            url: '/pages/posOk/posOk'
        })
    },
    couponConsume(couponNo, index) {
        wx.showLoading()
        const params = {
            merchantCode: app.commonParams('merchantCode'),
            operatorId: app.commonParams('operatorId'), 
            couponNo
        }
        return couponConsume(params).then(res => {
            wx.hideLoading()
        })
    },

    hideCoupon() {
        this.setData({
            showCoupon: false
        })
    },

    delNumber() {
        let amt = this.data.amt,
            discountAmt = this.data.discountAmt,
            del = (str, amt, status) => {
                let strLength = str.length,
                    _amt = str.substring(0, strLength - 1)
                this.setData({
                    [amt]: _amt == '' ? "0" : _amt
                })
            }

        if (this.data.amtHand) {
            let amtValue = del(amt, "amt")
            if (this.data.coupon) {
                this.discountRes(amtValue)
            }
        } else {
            del(discountAmt, "discountAmt")
        }
    },

    onGoodsList(){
        wx.navigateTo({
          url: '/pages/pos/discountsGoodsList/discountsGoodsList',
        })
    }
})