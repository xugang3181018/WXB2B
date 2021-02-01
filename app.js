//app.js
import base from './utils/index'
import { promisifyAll, promisify } from 'miniprogram-api-promise'
const wxp = {}
promisifyAll(wx, wxp)
App({
  onLaunch () {
    const { model } = wx.getSystemInfoSync()
    const {miniProgram} = wx.getAccountInfoSync()
    const ext = wx.getExtConfigSync() || {}
    this.globalData = {
      isIphoneX: /iphone\sx/i.test(model) || (/iphone/i.test(model) && /unknown/.test(model)) || /iphone\s11/i.test(model),
      model,
      ...miniProgram,
      ...ext
    }
  },
  globalData:{},
  tip(msg) {
    if (msg) {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    }
  },
  resSet(res, success, fail) {
    if (res) {
      switch (res.code) {
        case 'SUCCESS':
          success && success(res)
          break;
        case 'FAILED':
          if (res.subMsg) {
            wx.showModal({
              title: res.msg,
              content: res.subMsg,
              showCancel: false
            })
          } else {
            this.tip(res.msg || res.message)
          }
          fail && fail()
          break;
        default: {
          return false
        }
      }
    }
  }
})