// 营销中心接口
import {host} from './file/host'
const HOST = host.getHost('api4')

module.exports = (service, params, method) => {
  let app = getApp()
  let url = `${HOST}${service}?`
  for (let attr in params) {
    url += `${attr}=${params[attr]}&`
  }
  url = url.slice(0, url.length - 1)
  return new Promise((res, rej) => {
    wx.showLoading({
      mask: true,
      success() {
        wx.request({
          url,
          method: 'POST' || method,
          dataType: 'json',
          data: {requestJson: JSON.stringify(params)},
          success(data) {
            if (data.statusCode === 200) {
              if (data.data.code === 'S' || data.data.code === 'SUCCESS') {
                wx.hideLoading()
                res(data.data)
              } else {
                app.showToast(data.errMsg)
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