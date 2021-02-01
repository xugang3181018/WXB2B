const app = getApp()

Page({
  data: {
    info: [
      {name: '商户管理', img: '../../images/merchant.png'},
      {name: '快速进件', img: '../../images/entry.png'},
    ],
    info2: [
      {name: '人工服务', img: '../../images/service.png'},
      {name: '数据查看', img: '../../images/data.png'},
    ]
  },

  onLoad() {},

  // 跳转
  toLogin() {
    wx.reLaunch({url: '../login/login'})
  },
})
