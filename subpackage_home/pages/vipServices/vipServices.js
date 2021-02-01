const app = getApp()

Page({
  data: {
    isAdmin: true,
    notes: null,
    isVipImg: app.getImage('isVip.png'),
    notVipImg: app.getImage('notVip.png')
  },

  onLoad(options) {
    const isVip = ['VIP', "SVIP"].includes(options.level)
    this.setData({isVip, isAdmin: app.common('isAdmin')})
  },

  linkTo(e) {
    const {url} = e.currentTarget.dataset
    wx.navigateTo({url})
  },
})
