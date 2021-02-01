let app = getApp()
let base = require('../../utils/util.js')
import { payPlatFormInforKs, ksAccountList, getKsWithdrawUrl } from '../../api/index.js'

Page({
    data: {
        role: app.commonParams("role"),
        version: app.version
    },
    onLoad(options) {
        app.checkLogin()
        wx.setNavigationBarTitle({
            title: '个人中心',
        })
    },
    onShow() {
        this.setData({
            member: wx.getStorageSync("login"),
            loginName: wx.getStorageSync("loginName"),
            headOfficeStaff: wx.getStorageSync("login").headOfficeStaff
        })
    },
    ksAccountList() {
        ksAccountList({}).then(res => {
            console.log(res)
            let list = res.accountList
            this.initBag(list, 0)
        })
    },
    cutNum(str) {
        return str.substring(str.length - 4)
    },
    changeAccount(e) {
        this.initBag(this.data.bag, e.detail.value)
    },
    initBag(accountList, index) {
        this.setData({
            bag: accountList,
            selBag: accountList[index],
            selNum: this.cutNum(accountList[index].balanceAccount)
        })
    },
    extract() {
        wx.setStorageSync("selBag", this.data.selBag)
        wx.navigateTo({
            url: `/pages/account/account?id=${this.data.selBag.transactionId}`,
        })
    },
    checkBag() {
        let parmas = {
            codeName: app.commonParams("merchantCode"),
            merchantNo: app.commonParams("appId"),
        }
        payPlatFormInforKs(parmas)
            .then(res => {
                console.log(res)
                if (res.code == "001701") {
                    wx.setStorageSync("bag", res.obj)
                    let bagList = wx.getStorageSync("bag")
                    for (let i in bagList) {
                        bagList[i].endNum = bagList[i].balanceAccount.substr(bagList[i].balanceAccount.length - 4)
                    }
                    wx.setStorageSync("bag", bagList[0])
                    this.setData({
                        bag: bagList
                    })
                    this.getKsUrl()
                }
            })
    },

    getKsUrl() {
        console.log(this.data.bag)
        let parmas = {
            orderNo: `${new Date().Format('yyyyMMddHHmmss')}${base.randomNum(5)}`,
            codeName: app.commonParams("merchantCode"),
            merchantNo: app.commonParams("appId"),
            transactionId: this.data.bag[0].transactionId
        }
        getKsWithdrawUrl(parmas)
            .then(res => {
                console.log(res.obj.resp_url)
                wx.setStorageSync("rsurl", res.obj.resp_url)
            })
    },
    exitSys() {
        wx.showModal({
            title: '提示',
            content: '是否确定退出',
            success: (res) => {
                if (res.confirm) {
                    wx.clearStorage()
                    wx.redirectTo({
                        url: '/pages/login/login',
                    })
                    wx.setNavigationBarColor({
                        frontColor: "#000000",
                        backgroundColor: '#ffffff',
                    })
                    wx.setNavigationBarTitle({
                        title: '收款搭档',
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    clipNo: function(e) {
        console.log(e)
        wx.setClipboardData({
            data: e.currentTarget.id,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {}
                })
            }
        })
    },
    callServ: function() {
        wx.navigateTo({
            url: `/pages/customerService/customerService`,
        })
    },

    onShareAppMessage() {

    }
})