// 语雀
import {host} from './file/host'
const HOST = host.getHost('yq')

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
          method: 'GET' || method,
          dataType: 'json',
          header: {
            'content-type': 'application/json',
            'X-Auth-Token': 's33YuVqD2mGYssPcHxmUs62pQUuRtAw0nsrF8ZSD'
          },
          success(data) {
            if (data.statusCode === 200) {
              wx.hideLoading()
              res(data.data.data)
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