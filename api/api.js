// 老前置接口
import {host} from './file/host'
import sign from './file/getSign'
const HOST = host.getHost('api')

module.exports = (service, params = {}, operationLoginName, method) => {
  let app = getApp()
  const key = wx.getStorageSync("key") || ''
  let commonParams = {
    response_type: 'json',
    applicationName: "com.liantuo.lianfutong",
    service,
    version: '1.0',
    input_charset: 'UTF-8',
  }
  let otherCommonParams
  // 除了登录接口都含有的业务字段
  if (service !== 'agent_app_login') {
    otherCommonParams = {
      agencyCodeName: app.common('agentNo'),
      core_merchant_no: app.common('platformNo'),
      isAdmin: app.common('isAdmin'),
      operationDatetime: app.nowDate(),
      operationLoginName: operationLoginName || app.common('loginName'),
      operatorName: app.common('employeeName'),
      partner_id: app.common('merchantInnerPartnerId'),
    }
  }
  const _params = Object.assign(params, commonParams, otherCommonParams)
  const signParmas = sign.getSign(_params, key)
  return new Promise((res, rej) => {
    service === 'agent_app_login' ? null : wx.showLoading({mask: true})
    wx.request({
      url: HOST,
      method: 'POST' || method,
      data: signParmas,
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(data) {
        let useData = null
        data.data.ccDetails ? useData = data.data.ccDetails : null
        data.data.mcDetails ? useData = data.data.mcDetails : null
        const info = useData ? JSON.parse(useData) : {webMessage: 'SUCCESS'}
        if (data.statusCode === 200) {
          if (data.data.is_success === 'S') {
            if (service !== 'agent_app_login') wx.hideLoading()
            res(info)
          } else {
            console.log(data.data.message)
            if (service !== 'agent_app_login') app.showToast(data.data.message)
            res({apiError: true, msg: data.data.message})
          }
        }
      },
      fail(error) {
        wx.hideLoading()
        rej(error)
      },
    })
  }).catch((e) => {})
}