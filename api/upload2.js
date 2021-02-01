/* 新前置图片上传 */
import base from './file/getSign'
import {host} from './file/host'
import useOcr from './ocr'
const HOST = host.getHost('api2').url
const paymentId = host.getHost('api2').paymentId
const app = getApp()

module.exports = (info, back) => {
  let app = getApp()
  let headParams = {
    service: info.service,
    version: '1.0',
    partner_id: app.common('partnerId'),
    core_merchant_no: app.common('platformNo'),
    input_charset: 'UTF-8',
  }
  let params = {}
  switch(info.passType) {
    case '11':
      params = {
        channel_type: '1',
        picture_type: info.type,
        paymentId,
        out_request_no: new Date().getTime()
      }
      break
    default: null
  }
  const name = info.passType === '11' ? 'picture' : null
  const signParams = {...headParams, ...params}
  const signedParams = base.getSign(signParams, app.common('partnerKey'))
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
  new Promise((res) => {
    wx.chooseImage({
      count: 1,
      success: (data) => {
        if (data.tempFiles[0].size > 2 * 1024 * 1024) {
          app.showToast("上传图片大于2MB，请重新选择")
        } else {
          res(data)
        }
      },
    })
  }).then((res) => {
    const tempFilePaths = res.tempFilePaths[0]
    if (info.ocr) {
      const ocrParams = {
        out_request_no: `${new Date().getTime()}${Math.floor(Math.random() * 900) + 100}`,
        cert_type: info.ocr,
      }
      useOcr('front.certificate.identify', ocrParams, res, ocrRes => {
        const ocrData = ocrRes ? ocrRes.body.risk_result : null
        uploadImg(tempFilePaths, name, upParams, info.passType, back, ocrData)
      })
      return
    }
    uploadImg(tempFilePaths, name, upParams, info.passType, back, null)
  }).catch((error) => {
    app.showToast(error)
  })
}

const uploadImg = (filePath, name, params, passType, back, ocrData) => {
  wx.showLoading({
    mask: true,
    success() {
      wx.uploadFile({
        url: HOST,
        filePath,
        name,
        formData: {requestJson: JSON.stringify(params)},
        header: {
          'content-type': 'multipart/form-data'
        },
        success: (res)=>{
          const data = JSON.parse(res.data)
          if (res.statusCode === 200) {
            wx.hideLoading()
            let pic
            switch (passType) {
              case '11':
                pic = {
                  liantuo_picture: data.body.liantuo_picture,
                  channel_picture: data.body.channel_picture,
                }
                break
              default:
                null
            }
            ocrData ? pic.ocrData = ocrData : null
            if (ocrData) app.showToast('请核实识别信息是否准确')
            back(pic)
          } else {
            app.showToast(data.message)
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      })
    }
  })
}