const sign = require('../libs/getSign/getSign.js')
const base = require('../utils/util.js')
const app = getApp()
const API = "https://api.liantuofu.com" //正式环境  
// const API2 = "http://testclubmall.liantuobank.com" //毛利额的测试环境
function ajax(url, params, signs, method) {
  let sparams
  if (!signs) {
    try {
      var loginInfo = wx.getStorageSync('loginInfo')
    } catch (e) {
    }
    let commonparams = {
      appId: loginInfo.appId,
      random: base.randomNum(5)
    }
    // console.log(loginInfo)
    sparams = Object.assign(commonparams, params)
  }
  if (params.sign) {
    delete params.sign
  }
  let signparams = signs ? params : sign(sparams)
  console.log(signparams)
  // console.log(signparams)
  return new Promise((res, rej) => {
    wx.request({
      url: API + url,
      data: signparams,
      method: method || 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success(data) {
        // console.log(`${url}==>返回数据`, data.data)
        res(data.data)
      },
      fail(error) {
        rej(error)
      }
    })
  }).catch(err => {
    // console.log(err)
    wx.showModal({
      title: 'ERROR',
      content: JSON.stringify(err.errMsg),
    })
  })
}
//登录
export const login = params => ajax('/open/login', params, true)
//交易汇总总计   
export const totalBill = params => ajax('/open/statistics/trade', params)
//商户分组交易概要统计(今日和昨日的消费情况)
export const summaryMerchant = params => ajax('/open/statistics/trade/summaryMerchant', params)
//新增会员统计
export const memberStatistics = params => ajax('/open/statistics/newMemberCount', params)
//商户列表
export const merchantList = params => ajax('/open/merchant/listNoSign', params, true)
//到账金额
export const accountMoney = params => ajax('/open/settlement/query', params, false, "POST")
//总的毛利额
export const grossProfit = params => ajax('/open/merchant/salesGrossProfit', params, true, "POST")
//会员充值 
export const memberRecharge = params => ajax('/open/statistics/recharge', params)
//快收银商品统计  
export const goodsCount = params => ajax('/open/queryGoodsCount', params)
//会员查询 
export const member = params => ajax('/open/member/get', params, false, "POST")
//会员标签  
export const memberLabel = params => ajax('/open/operateMemberCrowd', params, false, "POST")
//商户交易分组汇总统计
export const merchantStatistics = params => ajax('/open/statistics/trade/merchant', params, false, "POST")

