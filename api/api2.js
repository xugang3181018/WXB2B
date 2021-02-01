// 新前置
import base from './file/getSign'
import {host} from './file/host'
const HOST = host.getHost('api2').url

module.exports = (service, params, method, needSign = true) => {
  const app = getApp()
  let upParams = {}
  if (needSign) {
    const headParams = {
      service,
      version: '1.0',
      partner_id: app.common('partnerId'),
      core_merchant_no: app.common('platformNo'),
      input_charset: 'UTF-8',
    }
    const signParams = {...headParams, ...params}
    const signedParams = base.getSign(signParams, app.common('partnerKey'))
    upParams = {
      head: {
        ...headParams,
        sign: signedParams.sign,
        sign_type: signedParams.sign_type,
      },
      body: params
    }
  } else {
    upParams = {
      head: {
        service,
        version: '1.0',
        input_charset: 'UTF-8',
      },
      body: params
    }
  }
  return new Promise((res, rej) => {
    wx.showLoading({
      mask: true,
      success() {
        wx.request({
          url: HOST,
          method: 'POST' || method,
          dataType: 'json',
          data: {requestJson: JSON.stringify(upParams)},
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(data) {
            if (data.statusCode === 200) {
              if (data.data.body.is_success === "S") {
                wx.hideLoading()
                res(data.data.body)
              } else {
                app.showToast(data.data.body.message)
                res({apiError: true})
              }
            }
          },
          fail(error) {
            wx.hideLoading()
            rej(error)
          },
        })
      }
    })
  }).catch((e) => {})
}