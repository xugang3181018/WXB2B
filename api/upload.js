/* 图片上传 */
import base from './file/getSign'
import {host} from './file/host'
import useOcr from './ocr'
const app = getApp()

// 上传
const uploadImg = (url, name, filePath, passType, back, ocrData) => {
  url = encodeURI(`${url}&response_type=json`)
  wx.showLoading({
    mask: true,
    title: '上传中',
    success() {
      wx.uploadFile({
        url,
        name,
        filePath,
        success(res) {
          const data = JSON.parse(res.data)
          if (res.statusCode === 200) {
            wx.hideLoading()
            let pic
            switch (passType) {
              case '7':
                pic = {
                  other_picture_url: data.mybank_pictures_url.replace('|', ''),
                  lt_picture_url: data.lt_picutres_url.replace('|', ''),
                }
                break
              case '8':
                pic = {
                  other_picture_url: data.ksh_picture_url.replace('|', ''),
                  lt_picture_url: data.lt_picture_url.replace('|', ''),
                }
                break
              case '9':
                pic = {
                  other_picture_url: data.leshua_picture_url.replace('|', ''),
                  lt_picture_url: data.lt_picture_url.replace('|', ''),
                }
                break
              case 'card':
                pic = {
                  file_url: data.file_url.replace('|', ''),
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
        fail() {
          app.showToast("上传图片失败")
        },
      })
    }
  })
}

module.exports = (passType, back, picType, ocr) => {
  let upParams = {
    version: '1.0',
    partner_id: app.common('merchantInnerPartnerId'),
    core_merchant_no: app.common('platformNo'),
    input_charset: 'UTF-8'
  }
  let upfile, upParams2
  let random = ''
  while (random.length < 6) {
    random += `${Math.floor(Math.random() * 10)}`
  }
  switch (passType) {
    case '7':
      upParams2 = {
        service: 'mybank_upload_file',
        paymentId: host.getHost('upload', '7').paymentId,
      }
      upfile = host.getHost('upload', '7').upfile
      break
    case '8':
      upParams2 = {
        service: 'kshbank_upload_picture',
        pay_channel: 'ZF0016_03_005',
        out_trade_no: `${app.formatDate(new Date(), 'yyyyMMddhhmmss')}${random}`,
        paymentId: host.getHost('upload', '8').paymentId,
      }
      upfile = host.getHost('upload', '8').upfile
      break
    case '9':
      upParams2 = {
        service: 'leshua_upload',
        paymentId: host.getHost('upload', '9').paymentId,
      }
      upfile = host.getHost('upload', '9').upfile
      break
    case 'card':
      upParams2 = {
        service: 'agent_app_upload_file',
        agreement_no: app.common('merchantInnerPartnerId'),
        applicationName: "com.liantuo.lianfutong",
        operationDatetime: app.nowDate(),
        operationLoginName: app.common('loginName'),
        operatorName: app.common('employeeName'),
        agencyCodeName: app.common('agentNo'),
      }
      upfile = host.getHost('card')
      break
    default:
      null
  }
  upParams = Object.assign(upParams, upParams2)
  new Promise((res) => {
    wx.chooseImage({
      count: 1,
      success: (data) => {
        if (data.tempFiles[0].size > 500 * 1024) {
          app.showToast("上传图片大于500KB，请重新选择")
        } else {
          wx.getImageInfo({
            src: data.tempFilePaths[0],
            success(res2) {
              passType === 'card' ? upParams.file_type = res2.type : null
              res(data)
            }
          })
        }
      },
    })
  }).then((res) => {
    app.showToast('上传中')
    const tempFilePaths = res.tempFilePaths[0]
    const params = base.getSign(upParams, wx.getStorageSync("key"))
    let reqXml = ''
    reqXml += `<ebill>`
    for (let i in upParams) {
      reqXml += `<${i}>${params[i]}</${i}>`
    }
    switch (passType) {
      case '7':
        reqXml += `<mchPays><mchPayInfo><picFile>${tempFilePaths}</picFile><picType>${picType}</picType></mchPayInfo></mchPays>`
        break
      case '8':
        reqXml += `<picture>${tempFilePaths}</picture>`
        break
      case '9':
        reqXml += `<media>${tempFilePaths}</media>`
        break
      default:
        null
    }
    reqXml += `</ebill>`
    let url, name
    switch (passType) {
      case '7':
        url = `${upfile}?reqXml=${reqXml}&${picType}=${tempFilePaths}`
        name = picType
        break
      case '8':
        url = `${upfile}?reqXml=${reqXml}&picture=${tempFilePaths}`
        name = 'picture'
        break
      case '9':
        url = `${upfile}?reqXml=${reqXml}`
        name = 'media'
        break
      case 'card':
        let cardParams = ''
        for (let attr in params) {
          cardParams = cardParams === '' ? `${attr}=${params[attr]}` : `${cardParams}&${attr}=${params[attr]}`
        }
        url = `${upfile}?${cardParams}&files=${tempFilePaths}`
        name = 'files'
        break
      default:
        null
    }
    if (ocr) {
      const ocrParams = {
        out_request_no: `${new Date().getTime()}${Math.floor(Math.random() * 900) + 100}`,
        cert_type: ocr,
      }
      useOcr('front.certificate.identify', ocrParams, res, ocrRes => {
        const ocrData = ocrRes ? ocrRes.body.risk_result : null
        uploadImg(url, name, tempFilePaths, passType, back, ocrData)
      })
      return
    }
    uploadImg(url, name, tempFilePaths, passType, back, null)
  }).catch((error) => {
    app.showToast(error)
  })
}