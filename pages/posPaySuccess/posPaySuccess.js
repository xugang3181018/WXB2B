let app = getApp()
Page({
  data: {

  },
  onLoad(options) {
    if (wx.getStorageSync("payDetail")) {
      console.log(wx.getStorageSync("payDetail"))
      this.setData({
        payType: app.types.payType,
        detail: wx.getStorageSync("payDetail"),
        cDetail: wx.getStorageSync("consumeDetail") ? wx.getStorageSync("consumeDetail") : {}
      })
    }
  },
  paySuccess() {
    wx.navigateBack()
    wx.removeStorageSync('payDetail')
  }
})