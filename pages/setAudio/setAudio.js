const sign = require('../../libs/getSign/getSign.js')
const base = require('../../utils/util.js')
const app = getApp()
import { bindYunlaba } from '../../api/index.js'

Page({
    data: {
        ids: "", //07863
        audioList: null,
        addForm: false,
        isPageLoad: true
    },
    onLoad: function(options) {
        this.checkAudio()
        wx.setNavigationBarTitle({
            title: '云喇叭设置',
        })
    },
    bindCode() {
        this.bindAudio("BIND")
    },
    unBindCode(e) {
        let selItem = this.data.audioList[e.target.id]
        this.setData({
            ids: selItem.speakerid
        })
        wx.showModal({
            title: '提示',
            content: `您确定要解除该喇叭盒子(${selItem.speakerid})的绑定吗？`,
            success: (res) => {
                if (res.confirm) {
                    this.codes("UNBIND")
                        .then(res => {
                            console.log(res)
                            wx.hideLoading()
                            if (res.code == "SUCCESS") {
                                wx.showToast({
                                    title: res.message,
                                    icon: "none"
                                })
                                this.checkAudio()
                            }
                        })
                }
            },

        })
        console.log(e)
        //this.bindAudio(0)
    },
    bindAudio(status) {
        console.log(this.data.ids)
        if (status == "UNBIND") {
            if (this.data.ids && this.data.ids != '') {
                this.codes(status)
                    .then(res => {
                        this.setData({
                            tid: '',
                            addForm: false
                        })
                    })
            }
        } else if (status == "BIND") {
            if (this.data.ids && this.data.ids != '') {
                this.codes(status)
                    .then(res => {
                        wx.hideLoading()
                        console.log(res)
                        if (res.code == "FAILED") {
                            wx.showToast({
                                title: `${res.msg},${res.subMsg}`,
                                icon: 'none'
                            })
                        } else if (res.code == "SUCCESS") {
                            this.checkAudio()
                            this.setData({
                                tid: '',
                                ids: '',
                                addForm: false
                            })
                        }
                    })
            } else {
                wx.showToast({
                    title: '请输入产品ID',
                    icon: 'none'
                })
            }
        }

    },
    codes(status) {
        wx.showLoading()
        var parmas = {
            bindCode: app.commonParams("merchantCode"),
            status: status,
            speakerId: this.data.ids,
            appId: app.commonParams("merchantCode")
        }
        return bindYunlaba(parmas)
    },
    inputId(e) {
        console.log(e)
        this.setData({
            ids: e.detail.value,
            tid: e.detail.value
        })
    },
    checkAudio() {
        let that = this
        wx.request({
            url: 'https://ylb1.top/list_bind.php',
            data: {
                token: "5032g0BL2tdi",
                uid: app.commonParams("merchantCode")
            },
            success: (res) => {
                var audioList = null
                if (res.errcode == 6) {} else if (res.data.records) {
                    var audioList = res.data.records
                }
                that.setData({
                    audioList: audioList
                })
            },
            complete: () => {
                this.setData({
                    isPageLoad: false
                })
            }
        })
    },
    toggleAdd() {
        this.setData({
            addForm: !this.data.addForm,
            tid: '',
            ids: ''
        })
    }
})