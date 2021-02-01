import types from './utils/types'
import {
  accessToken,
  jscode2session
} from './api/index'
App({
  onLaunch() {
    //适配iPhone X //role  0总部 1门店 2员工 3店长
    this.updateManager()
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        const {
          model
        } = res
        const isPX = /iphone\sx/i.test(model) || /iphone\11/i.test(model) || (/iphone/i.test(model) && /unknown/.test(model)) || /iphone\s11/i.test(model) ? true : false
        console.log(isPX)
        this.isPX = isPX
        this.systemInfo = {
          isPX,
          headHeight: isPX ? 88 : 64,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        }
      }
    })
    this.qySession()
    this.types = types
    this.base = require('./utils/util.js')
    this.checkLogin()
  },
  version: '版本号:2.0.27',
  pageType: "", //1 按商品退货，2库存调整单，3快速盘点单
  signIndex: "",
  supplierId: "",
  globalData: {
    userInfo: null,
    alter: false,
    newCheck: "",
    merchantCode: "",
    checkNo: "",
    goods: "",
    from: "",
    checkArea:'',
    remark:''
  },

  // //向右滑动渐入渐出
  sliderightshow: function (that, param, px, opacity) {
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateX(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },
  qySession() {
    if (wx.qy) {
      return accessToken().then(res => {
        console.log('22222222222222222222222222222222');
        wx.qy.login({
          success: (code) => {
            console.log("1111111111111111111111")
            jscode2session({
                'access_token': res.result,
                'js_code': code.code,
                'grant_type': 'authorization_code'
              })
              .then(data => {
                console.log('session-result:: ==========>', data)
                return data
                wx.qy.getEnterpriseUserInfo({
                  success: (info) => {
                    console.log('企业成员信息result:: ==========>', info)
                  }
                })
              })
          }
        })
      })
    }
  },

  currPage(length) {
    let curPageArr = getCurrentPages()
    return curPageArr[curPageArr.length - (length || 1)]
  },

  // 全局参数
  commonParams(arg) {
    try {
      let login = wx.getStorageSync("login")
      if (arg.constructor == Array) {
        let params = {}
        arg.forEach(item => params[item] = login[item])
        return params
      } else if (arg.constructor == String) {
        return login[arg]
      }
    } catch (error) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },

  // 检测登录
  checkLogin() {
    if (wx.getStorageSync("login")) {
      this.merchant = wx.getStorageSync("login")
    } else {
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }
  },

  //检测更新
  updateManager() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      // 请求完新版本信息的回调
      console.log("是否有更新??===", res.hasUpdate)
    })
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(() => {
      // 新版本下载失败
      wx.showToast({
        title: '新版本下载失败',
        icon: "none"
      })
    })
  },
  tip(title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },

  //截取URL参数
  getQueryString(url) {
    let str = url.split('?')
    let arr = str[1].split("&")
    let obj = {}
    for (let i = 0; i < arr.length; i++) {
      let num = arr[i].indexOf("=")
      if (num > 0) {
        obj[arr[i].substring(0, num)] = arr[i].substr(num + 1)
      }
    }
    return obj
  }
})