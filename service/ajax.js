const  domain =  "https://testclubmall.liantuobank.com"
const wxcs = "http://wxcs.liantuofu.com"

export const ajax = (url, data = {}, method, appId, type) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${domain}${url}`, //接口地址
      data,
      method: method || 'POST',
      header: {
        'Content-Type': method === 'GET' || type ? 'application/json' : 'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(`${url}====SUCCESS==>`, res.data)
        resolve(res.data)
      },
      fail: error => {
        reject(error)
        console.log(`${url}====FAIL==>`, error)
      }
    })
  }).catch(error => {
    console.warn(error)
  })
}

export const wxAjax = (url, data = {}, method, appId, type) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${wxcs}${url}`,
      data,
      method:'POST',
      header: {
        'Content-Type':'application/x-www-form-urlencoded'
      },
      success: res => {
        console.log(`${url}====SUCCESS==>`, res.data)
        resolve(res.data)
      },
      fail: error => {
        reject(error)
        console.log(`${url}====FAIL==>`, error)
      }
    })
  }).catch(error => {
    console.warn(error)
  })
}