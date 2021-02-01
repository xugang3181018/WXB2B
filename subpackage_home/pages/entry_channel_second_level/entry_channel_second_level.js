const app = getApp()

Page({
  data: {
    channelList: [],
  },

  onLoad(options) {
    let channelList = []
    switch(options.passType) {
      case '8':
        channelList = [
          {
            name: '自然人进件',
            url: '../entry/entry8/entry8?type=0&change=0&resubmit=0',
            img: app.getImage('kszrr.png')
          },
          {
            name: '普通进件',
            url: '../entry/entry8/entry8?type=1&change=0&resubmit=0',
            img: app.getImage('kspt.png')
          }
        ]
        break
      default: null
    }
    this.setData({channelList})
  }
})
