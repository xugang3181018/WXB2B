const sign = require('../libs/getSign/getSign.js')
const base = require('../utils/util.js')
const app = getApp()
const API = "https://api.liantuofu.com/" //正式环境(登录)
const retailApi = "https://retail.liantuofu.com/" //正式环境 （零售）
const repastApi = "https://clubmall.liantuobank.com/" //正式环境 （餐饮）
// const API = "http://intshop.51ebill.com/"  //灰度环境(登录)
// const retailApi = "http://intretail.51ebill.com/"  //灰度环境 （零售）
//const API ="http://wdtest.liantuo.com/"  //本地调试
// const API = "https://testclubshop.liantuobank.com/" //测试环境
// const retailApi = "https://pretuancai.liantuofu.com/"  //测试环境 （零售） 
// const repastApi = "http://testclubmall.liantuobank.com/"   //测试环境  (餐饮)
//const ksApi = "http://192.168.140.11:8000/front/baseV3/gateway.in"
const siApi = "https://shopcashiersi.liantuobank.com/ShopCashier_SI/"
const kesApi = "https://kshbank.liantuobank.com/front/baseV3/gateway.in"
const oldSi = "http://front.51ebill.com/front/baseV3/gateway.in"
//营销系统 
const host = "https://club.liantuobank.com"
// 营销系统 测试环境：http://open.liantuobank.cn
// 营销系统 线上环境：https://club.liantuobank.com

const wxHost = "https://wx.liantuofu.com"
// const wxHost = "https://wxcs.liantuofu.com"
const qyapi = "https://qyapi.weixin.qq.com"
//营销系统接口
export const request = (url, params) => {
  return new Promise((res, rej) => {
    wx.request({
      url: `${host}/api/${url}.htm?json=${encodeURI(JSON.stringify(params))}`,
      method: 'POST',
      success: (data) => {
        console.log(`${host}/api/${url}.htm====>返回数据`, data.data)
        res(data.data)
      },
      fail: (error) => {
        console.log(`${host}::ERROR:::`, error)
        rej(error)
      }
    })
  })
}

//开放平台接口
export const ajax = (url, params = {}, signs, method) => {
  let sparams = {}
  if (!signs) {
    let loginInfo = wx.getStorageSync("login")
    let commonparams = {
      appId: loginInfo.appId,
      random: base.randomNum(6),
      //key: loginInfo.key
      //merchantCode: loginInfo.merchantCode
    }
    sparams = {
      ...params,
      ...commonparams
    }
  }
  if (params.sign) delete params.sign
  const query = signs ? params : sign(sparams)
  console.log(`${API + url}=======>传入参数`, query)
  return new Promise((res, rej) => {
    wx.request({
      url: API + url,
      data: query,
      method: method || 'GET',
      header: {
        'content-type': method === 'POST' ? 'application/x-www-form-urlencoded;charset=utf-8' : 'application/json' // 默认值
      },
      success: (data) => {
        console.log(`${API+url}=======>返回数据`, data.data)
        let currPage = getApp().currPage()
        if (data.data.code == 'SUCCESS') {
          currPage.setData({
            error: false
          })
          res(data.data)
        } else if (data.data.code == 'FAILED') {
          currPage.setData({
            error: true,
            isPageLoad: false,
            loading: false,
            errorMsg: data.data.msg
          })
          res(data.data)
        } else if (!data.data.code) {
          res(data.data)
        }
      },
      fail(error) {
        console.log(`${url}:FailError=======>`, err)
        rej(error)
      }
    })
  }).catch(err => {
    console.log(`${url}:catchError=======>`, err)
    wx.showModal({
      title: 'ERROR',
      content: JSON.stringify(err.errMsg),
    })
  })
}
//si接口 新版本
export const siAjax = (url, params) => {
  let singparams = sign(params, true)
  return new Promise((res, rej) => {
    wx.request({
      url: `${siApi}${url}`,
      data: singparams,
      success: (data) => {
        if (data.statusCode == 200) {
          res(data.data)
        } else {
          wx.showToast({
            title: '网络连接失败',
            icon: "none"
          })
        }
      },
      fail: (error) => {
        rej(error)
      }
    })
  })
}
//si接口 老版本
export const oldSiAjax = params => {
  let singparams = sign(params)
  return new Promise((res, rej) => {
    wx.request({
      url: `${oldSi}`,
      data: singparams,
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: (data) => {
        let jsonData = base.XMLtoJSON(data.data).ebill
        console.log(jsonData)
        res(jsonData)
      },
      fail: (error) => {
        rej(error)
      }
    })
  })
}
// 零售
export const retailAjax = (url, params = {}, method) => {
  let sparams = {}
  let loginInfo = wx.getStorageSync("login")
  let commonparams = {
    appId: loginInfo.appId,
  }
  sparams = {
    ...params,
    ...commonparams
  }
  console.log(`${retailApi + url}=======>传入参数`, sparams)
  return new Promise((res, rej) => {
    wx.request({
      url: retailApi + url,
      data: sparams,
      method: method || 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: (data) => {
        console.log(`${url}==>返回数据`, data.data)
        let currPage = getApp().currPage()
        if (data.data.code == 'SUCCESS') {
          res(data.data)
          currPage.setData({
            error: false
          })
        } else if (data.data.code == 'FAILED') {
          currPage.setData({
            error: true,
            isPageLoad: false,
            loading: false,
            errorMsg: data.data.msg
          })
          res(data.data)
        } else if (!data.data.code) {
          res(data.data)
        }
      },
      fail(error) {
        rej(error)
      }
    })
  }).catch(err => {
    console.log(err)
    wx.showModal({
      title: 'ERROR',
      content: JSON.stringify(err.errMsg),
    })
  })
}

// 餐饮
export const repastAjax = (url, params = {}, method,signs) => {
  let sparams = {},
    loginInfo = wx.getStorageSync("login");
  let commonparams = {
    appId: loginInfo.appId,
  }
  if (!params.merchantCode && params.merchantCode != "") {
    commonparams.merchantCode = loginInfo.merchantCode
  }
  sparams = {
    ...params,
    ...commonparams
  }
  const query = !signs ? sparams : sign(sparams)
  console.log(`${repastApi + url}=======>传入参数`, query)
  return new Promise((res, rej) => {
    wx.request({
      url: repastApi + url,
      data: query,
      method: method || "GET",
      header: {
        "content-type": method == "POST" ? "application/x-www-form-urlencoded" : 'application/json'
      },
      success: (data) => {
        console.log(`${url}===>返回数据`, data.data)
        let currPage = getApp().currPage()
        if (data.data.code == 'SUCCESS') {
          res(data.data)
          currPage.setData({
            error: false
          })
        } else if (data.data.code == 'FAILED') {
          currPage.setData({
            error: true,
            isPageLoad: false,
            loading: false,
            errorMsg: data.data.msg
          })
          res(data.data)
        } else if (!data.data.code) {
          res(data.data)
        }
      },
      fail(error) {
        rej(error)
      }
    })
  }).catch(err => {
    console.log(err)
    wx.showModal({
      title: 'ERROR',
      content: JSON.stringify(err.errMsg),
    })
  })
}


// 客商接口
export const ksAjax = (params, key = '') => {
  let singparams = sign(params, "ks", key)
  return new Promise((res, rej) => {
    wx.request({
      url: `${kesApi}`,
      data: singparams,
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: (data) => {
        let jsonData = base.XMLtoJSON(data.data).ebill
        res(jsonData)
      },
      fail: (error) => {
        rej(error)
      }
    })
  })
}
// 企业微信id 联拓数科
const qyconfig = {
  corpId: "wx69516bc462dd79e0",
  suiteId: "1000117",
}
// 袁记串串香
// const qyconfig ={
//   corpId: "ww7e3bdce2b61f8092",
//   suiteId: "1000007",
// }

// 微信系统
export const wxRequest = (url, params = {}) => {
  return new Promise((res, rej) => {
    wx.request({
      url: `${wxHost}${url}`,
      data: {
        ...qyconfig,
        ...params
      },
      success: (data) => {
        console.log(`${host}${url}====>返回数据`, data.data)
        res(data.data)
      },
      fail: (error) => {
        console.log(`${host}${url}=======>ERROR`, error)
        rej(error)
      }
    })
  }).catch(error => {
    console.log(`${host}${url}=======>Error`, error)
  })
}

// 企业微信api
export const qyRequest = (url, data = {}) => {
  return new Promise((res, rej) => {
    wx.request({
      url: `${qyapi}${url}`,
      data,
      success: (data) => {
        console.log(`${host}${url}====>返回数据`, data.data)
        res(data.data)
      },
      fail: (error) => {
        console.log(`${host}${url}=======>ERROR`, error)
        rej(error)
      }
    })
  }).catch(error => {
    console.log(`${host}${url}=======>Error`, error)
  })
}

// 上传图片
export const uploadFile = (url, params = {}, signs, method) => {
  let sparams = {}
  let loginInfo = wx.getStorageSync("login")
  let query = {
    appId: loginInfo.appId,
    merchantCode: params.merchantCode
  }
  // if (!signs) {
  //   let loginInfo = wx.getStorageSync("login")
  //   let commonparams = {
  //     appId: loginInfo.appId,
  //     random: base.randomNum(6),
  //     //key: loginInfo.key
  //     //merchantCode: loginInfo.merchantCode
  //   }
  //   sparams = {
  //     ...params,
  //     ...commonparams
  //   }
  // }
  // if (params.sign) delete params.sign
  // const query = signs ? params : sign(sparams)
  console.log(`${API + url}=======>传入参数`, query)
  console.log(`${API + url}=======>传入参数`, params)
  return new Promise((res, rej) => {
    wx.uploadFile({
      url: API + url,
      filePath: params.path,
      name: 'upfiles',
      header:{
        'content-type': 'multipart/form-data',
      },
      formData: query,
      success(data) {
        console.log(data);
        res(data.data)
        //do something
      },
      fail(error) {
        console.log(`${url}:FailError=======>`, error)
        rej(error)
      }
    })
  }).catch(err => {
    console.log(`${url}:catchError=======>`, err)
    wx.showModal({
      title: 'ERROR',
      content: JSON.stringify(err.errMsg),
    })
  })
}