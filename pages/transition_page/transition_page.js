const app = getApp()

Page({
  data: {
    time: 1,
    startPage: app.getImage('start-page.png'),
  },

  onLoad() {
    
    console.log(wx.getStorageSync("member"))
    let time = this.data.time
    let timer = setInterval(() => {
      if (time === 0) {
        clearInterval(timer)
        timer = null
        this.toLogin()
      } else {
        this.setData({time: --time})
      }
    }, 1000)
  },

  // 跳转
  toLogin() {
    const loginInfo = wx.getStorageSync('loginInfo')
    if (loginInfo && loginInfo.isLogin) {
      app.sa.login(loginInfo.loginName)
      wx.switchTab({url: '/pages/homePage/homePage'})
    } else {
      wx.redirectTo({url: '/pages/login/login'})
    }
  },
})
