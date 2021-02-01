/* url地址集合 */
const host = {
  getHost: (type, passType) => {
    // env 环境 grayscale 灰度 test 测试 production 生产
    const env = 'production'
    // type host类型  api  upload
    // passType 7 网商 8 客商 9 乐刷
    let url, paymentId, upfile, role, platformNo, shence
    if (type === "api") { // 老前置
      switch (env) {
        case "production":
          url = "https://front.liantuobank.com/front/baseV3/gateway.in"
          break
        case "grayscale":
          url = "http://intfront.51ebill.com/front/baseV3/gateway.in"
          break
        case "test":
          url = "http://testfront.51ebill.com:8000/front/baseV3/gateway.in"
          break
        default: null
      }
      return url
    } else if (type === 'api2') { // 新前置
      switch (env) {
        case "production":
          url = "https://newfront.liantuobank.com/NewFront/base/gateway.in"
          paymentId = "484"
          break
        case "grayscale":
          url = "http://intnewfront.liantuobank.com/NewFront/base/gateway.in"
          paymentId = "484"
          break
        case "test":
          url = "http://192.168.19.31:8000/NewFront/base/gateway.in"
          paymentId = "1020"
          break
        default: null
      }
      return {url, paymentId}
    } else if (type === 'api3') { // eps
      switch (env) {
        case "production":
          url = "https://eps.liantuobank.com/sahp/base/gateway.in"
          break
        case "grayscale":
          url = "http://inteps.51ebill.com/sahp/base/gateway.in"
          break
        case "test":
          url = "http://192.168.19.119:8000/sahp/base/gateway.in"
          break
        default: null
      }
      return url
    } else if (type === 'api4') { // 营销中心
      switch (env) {
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
    } else if (type === "upload") {
      switch (env) {
        case "production":
          switch(passType) {
            case '7':
              upfile = "https://front.liantuobank.com/front/mybankV3/uploadFile.in"
              paymentId = "107"
              break
            case '8':
              upfile = "https://front.liantuobank.com/front/mzks/uploadFile.in"
              paymentId = "145"
              break
            case '9':
              upfile = "https://front.liantuobank.com/front/leshua/uploadFile.in"
              paymentId = "226"
              break
            default: null
          }
          break
        case "grayscale":
          switch(passType) {
            case '7':
              upfile = "http://intfront.51ebill.com/front/mybankV3/uploadFile.in"
              paymentId = "107"
              break
            case '8':
              upfile = "http://intfront.51ebill.com/front/mzks/uploadFile.in"
              paymentId = "145"
              break
            case '9':
              upfile = "http://intfront.51ebill.com/front/leshua/uploadFile.in"
              paymentId = "226"
              break
            default: null
          }
          break
        case "test":
          switch(passType) {
            case '7':
              upfile = "http://testfront.51ebill.com:8000/front/mybankV3/uploadFile.in"
              paymentId = "273"
              break
            case '8':
              upfile = "http://testfront.51ebill.com:8000/front/mzks/uploadFile.in"
              paymentId = "250"
              break
            case '9':
              upfile = "http://testfront.51ebill.com:8000/front/leshua/uploadFile.in"
              paymentId = "303"
              break
            default: null
          }
          break
        default: null
      }
      return {
        upfile,
        paymentId
      }
    } else if (type === 'card') {
      switch (env) {
        case "production":
          url = 'https://front.liantuobank.com/front/agentAppV3/uploadFile.in'
          break
        case "grayscale":
          url = 'http://intfront.51ebill.com/front/agentAppV3/uploadFile.in'
          break
        case "test":
          url = 'http://192.168.19.47:8000/front/agentAppV3/uploadFile.in'
          break
        default: null
      }
      return url
    } else if (type === 'ocr') {
      switch (env) {
        case "production":
          url = 'https://newfront.liantuobank.com/NewFront/base/gateway.in'
          break
        case "grayscale":
          url = 'http://intnewfront.liantuobank.com/NewFront/base/gateway.in'
          break
        case "test":
          url = 'http://192.168.19.31:8000/NewFront/base/gateway.in'
          break
        default: null
      }
      return url
    } else if (type === 'yq') {
      switch (env) {
        case "production":
          url = 'https://tmall.yuque.com/api/v2' // https://www.yuque.com/api/v2
          break
        case "grayscale":
          url = 'https://tmall.yuque.com/api/v2'
          break
        case "test":
          url = 'https://tmall.yuque.com/api/v2'
          break
        default: null
      }
      return url
    } else if (type === 'role') {
      switch (env) {
        case "production":
          role = 381
          break
        case "grayscale":
          role = 381
          break
        case "test":
          role = 440
          break
        default: null
      }
      return role
    } else if (type === 'image') {
      switch (env) {
        case "production":
          url = 'https://static.liantuobank.com/project/middleStage/'
          break
        case "grayscale":
          url = 'https://static.liantuobank.com/project/middleStage/'
          break
        case "test":
          url = 'https://static.liantuobank.com/project/middleStage/'
          break
        default: null
      }
      return url
    } else if (type === 'ks') {
      switch (env) {
        case "production":
          platformNo = 'EW_N2205246780'
          break
        case "grayscale":
          platformNo = 'EW_N2205246780'
          break
        case "test":
          platformNo = 'EW_N9257434008'
          break
        default: null
      }
      return platformNo
    } else if (type === 'shence') { // 是否启动神策买点
      switch (env) {
        case "production":
          shence = true
          break
        case "grayscale":
          shence = false
          break
        case "test":
          shence = false
          break
        default: null
      }
      return shence
    }
  }
}

module.exports={host}