/* 图片识别 */
import base from './file/getSign'
import {host} from './file/host'

module.exports = (service, params, image, back) => {
  let app = getApp()
  let headParams = {
    service,
    version: '1.0',
    partner_id: app.common('merchantInnerPartnerId'),
    core_merchant_no: app.common('platformNo'),
    input_charset: 'UTF-8',
  }
  const signParams = {...headParams, ...params}
  const signedParams = base.getSign(signParams, wx.getStorageSync( "key"))
  const upParams = {
    head: {
      ...headParams,
      sign: signedParams.sign,
      sign_type: signedParams.sign_type,
    },
    body: {
      ...params
    }
  }
  wx.showLoading({
    mask: true,
    success() {
      wx.uploadFile({
        url: host.getHost('ocr'),
        formData: {requestJson: JSON.stringify(upParams)},
        name: 'image_content',
        filePath: image.tempFilePaths[0],
        header: {
          "Content-Type": "multipart/form-data"
        },
        success(res) {
          wx.hideLoading()
          const data = JSON.parse(res.data)
          back(data)
        },
        fail() {
          wx.hideLoading()
          back(null)
          app.showToast("图片识别失败")
        },
      })
    }
  })
}