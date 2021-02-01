const app = getApp()
import { billDetail } from '../../api/index.js'
Page({
  data: {

  },
  onLoad (options) {
    this.setData({
      ...options,
      types:app.types
    })
    this.billDetail(options.id)
  },
  billDetail(outTradeNo){ 
    return billDetail({
      merchantCode: app.commonParams('merchantCode'),
      outTradeNo,
      showType:1
    })
    .then(res => {
      this.setData({
        ...res
      })
    })
  }

})