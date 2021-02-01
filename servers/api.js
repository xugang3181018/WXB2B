const sign = require('../libs/getSign/getSign.js')
const base = require('../utils/util.js')
const app = getApp()
const API = "https://api.liantuofu.com/"//正式环境 
function ajax(url, params, signs, method) {
  //  my.showLoading({
  //     content: '加载中...'
  //   });
  let sparams
  if (!signs) {
    let loginInfo = my.getStorageSync({
      key: 'loginInfo', // 缓存数据的key
    }).data;
    let commonparams = {
      appId: loginInfo.appId,
      random: base.randomNum(4)
    }
    sparams = Object.assign(params, commonparams)
  }
  if (params.sign) {
    delete params.sign
  }
  let signparams = signs ? params : sign(sparams)
  // console.log(signparams)
  return new Promise((res, rej) => {
    my.request({
      url: API + url,
      data: signparams,
      method: method || 'GET',
      success(data) {
        // console.log(`${url}==>返回数据`, data.data)
        res(data.data)
      },
      fail(error) {
        rej(error)
      }
    })
    //  my.hideLoading();
  }).catch(err => {
    // console.log(err)
    my.showModal({
      title: 'ERROR',
      content: JSON.stringify(err.errMsg),
    })
     my.hideLoading();
  })
}

//登录
export const login = params => ajax('open/login', params, true, "GET")
//支付
export const pay = params => ajax('open/pay', params)
//获取openID
export const open = params => ajax('open/getOpenIdByAuthCode',params)
//通过openId判断是否是会员
export const member = params => ajax('open/member/miniGet',params,true)
//获取会员授权码
export const payAuthCode = params => ajax('open/member/payAuthCode',params)
//订单查询
export const query = params => ajax('/open/pay/query',params)
//账单流水查询
export const billList = params => ajax('/open/billList',params)
//订单详情
export const billDetail = params => ajax('/open/bill/detail',params)
//订单退款  
export const orderRefund = params => ajax('/open/refund',params)
//退款查询  
export const refundQuery = params => ajax('/open/refund/query',params)
//退款详情
export const refundDetail = params => ajax('/open/bill/refundOrderList',params)
//交班记录
export const shiftlogQuery = params => ajax('/open/shiftlog/query',params)
//上传交班记录
export const shiftlogSave = params => ajax('/open/shiftlog/save',params)
//交易汇总总计
export const totalBill = params => ajax('/open/statistics/trade',params)