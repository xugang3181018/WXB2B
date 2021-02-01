import {
  loginAccount,
  institutionDetail
} from '../../api/index.js'
import util from '../../utils/util.js';
let app = getApp()

Page({
  data: {
    login: {},
  },

  onLoad(options) {

  },

  // 登录
  login(e) {
    let parmas = e.detail.value
    loginAccount(parmas).then(res => {
      console.log(res)
      if (res.appId == "EW_N6247753906") {
        wx.navigateTo({
          url: '/pages/home/home',
        })
        wx.setStorage({
          key: 'loginInfo',
          data: res // 要缓存的数据
        });
      } else {
        if (res.code == 'FAILED') {
          wx.showToast({
            title: res.subMsg,
            icon: 'none'
          })
        } else if (res.code == 'SUCCESS') {
          wx.showToast({
            title: "登录中",
            icon: 'none'
          })
          console.log(res)
          app.globalData.merchantCode = res.merchantCode
          wx.setStorageSync("login", res)
          wx.setStorageSync("merchantType", res.merchantType)
          let merchantCode = res.merchantCode
          institutionDetail({ appId: res.appId, merchantCode }).then(data => {
            console.log(res)
            if (data.code == "SUCCESS") {
              app.globalData.merchantType = data.result.merchantType
              wx.setStorageSync("institutionDetail", data.result)
              wx.switchTab({
                url: `/pages/goods_cate/goods_cate`,
              })
            } else if (data.code == "FAILED") {
              wx.switchTab({
                url: '/pages/login/login',
              })
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  clearInput(e) {
    let login = this.data.login
    login[e.target.dataset.id] = ''
    this.setData({
      login: login
    })
  },
  loginInput(e) {
    const login = this.data.login
    login[e.target.id] = e.detail.value
    const loginDisable = (login.passWord && login.userName) ? false : true
    this.setData({
      login: login,
      loginDisable: loginDisable
    })
  },
  loginBlur(e) {
    if (e.detail.value == '') {
      this.setData({
        isEmpty: e.target.id
      })
    }
  },
  focusInput(e) {
    this.setData({
      focus: e.currentTarget.dataset.index
    })
  }
})