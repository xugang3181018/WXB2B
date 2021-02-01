const sign = require('../libs/getSign/getSign.js')
const base = require('../utils/util.js')
const app = getApp()
// const API = "https://api.liantuofu.com/" //正式环境
// const retailApi = "https://retail.liantuofu.com/" //正式环境 （零售）
// const orderApi = 'https://clubmall.liantuobank.com/' //正式环境
// const API = "http://intshop.51ebill.com/" //灰度环境
// const retailApi = "http://intclubb2b.liantuofu.com/"  //灰度环境 （零售）
// const API = 'https://testclubshop.liantuobank.com/' //测试环境
// const retailApi = "https://pretuancai.liantuofu.com/"  //测试环境 （零售）

const host = {
  getHost: (type) => {
    // env 环境 grayscale 灰度 test 测试 production 生产
    const env = 'test'
    let url=""
    if (type === "API") {
      switch (env){
        case "production":
          url = "https://api.liantuofu.com/"
          break
        case "grayscale":
          url = "http://intshop.51ebill.com/"
          break
        case "test":
          url = "https://testclubshop.liantuobank.com/"
          break
        default: null
      }
      return url
    }else if(type === "retailApi"){
      switch(env){
        case "production":
          url = "https://retail.liantuofu.com/"
          break
        case "grayscale":
          url = "http://intretail.51ebill.com/"
          break
        case "test":
          url = "https://pretuancai.liantuofu.com/"
          break
        default: null
      }
      return url
    }else if(type === "orderApi"){
      switch(env){
        case "production":
          url = "https://clubmall.liantuobank.com/"
          break
          default: null
      }
      return url
    }
  }
}

//开放平台接口
export const ajax = (url, params = {}, signs, method) => {
  let sparams = {}
  if (!signs) {
    let loginInfo = wx.getStorageSync("login")
    let commonparams = {
      appId: loginInfo.appId,
      random: base.randomNum(6),
    }
    sparams = {
      ...params,
      ...commonparams
    }
  }
  if (params.sign) delete params.sign
  const query = signs ? params : sign(sparams)
  console.log(`${host.getHost("API") + url}=======>传入参数`, query)
  return new Promise((res, rej) => {
    wx.request({
      // url: API + url,
      url:host.getHost("API") + url,
      data: query,
      method: method || 'GET',
      header: {
        'content-type': method === 'POST' ? 'application/x-www-form-urlencoded;charset=utf-8' : 'application/json' // 默认值
      },
      success: (data) => {
        console.log(`${host.getHost("API")+url}=======>返回数据`, data.data)
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
  console.log(`${host.getHost("retailApi") + url}=======>传入参数`, sparams)
  return new Promise((res, rej) => {
    wx.request({
      // url: retailApi + url,
      url:host.getHost("retailApi") + url,
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

export const orderAjax = (url, params = {}, method) => {
  let sparams = {}
  let loginInfo = wx.getStorageSync("login")
  let commonparams = {
    appId: loginInfo.appId,
  }
  sparams = {
    ...params,
    ...commonparams
  }
  console.log(`${host.getHost("orderApi") + url}=======>传入参数`, sparams)
  return new Promise((res, rej) => {
    wx.request({
      // url: orderApi + url,
      url:host.getHost("orderApi") + url,
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