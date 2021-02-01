const app = getApp()

Page({
  data: {
    nameFocus: false,
    pswFocus: false,
    loginName: null,
    loginPwd: null,
    items: [{name: 'agreement', checked: false}],
    isChecked: false,
    isShow: false,
    liveImage: app.getImage('live.png')
  },

  onLoad() {
    const loginInfo = wx.getStorageSync('loginInfo')
    if (loginInfo) this.setData(loginInfo)
  },

  checkboxChange(e) {
    let isChecked = false
    if (e.detail.value[0]) isChecked = true
    this.setData({isChecked})
  },

  showPwd() {
    this.setData({isShow: !this.data.isShow})
  },

  login(e) {
    const {loginName, loginPwd} = e.detail.value
    if (loginName === "") {
      app.showToast('请输入用户名')
      return
    }
    if (loginPwd === "") {
      app.showToast('请输入用户密码')
      return
    }
    if (!this.data.isChecked) {
      app.showToast('请阅读并同意《联拓数科服务商协议》')
      return
    }
    const params = e.detail.value
    params.loginName = params.loginName.toLowerCase()
    params.operationDatetime = app.nowDate()
    params.partner_id = '10000002048131212'
    wx.showLoading({mask: true})
    app.api('agent_app_login', params).then(res => {
      if (res && !res.apiError) {
        if (['EW_N7619723563', 'EW_N8636137588', 'EW_N2217583003', 'EW_N8574559771'].includes(res.platformNo)) {
          app.showToast('登录成功！')
          app.sa.login(params.loginName)
          const loginInfo = {loginName: params.loginName, loginPwd: params.loginPwd, isChecked: true, isLogin: true}
          res.loginName = res.loginName.toLowerCase()
          wx.setStorageSync('loginInfo', loginInfo)
          wx.setStorageSync("member", res)
          wx.setStorageSync("key", res.merchantInnerPartnerKey)
          let overtime = new Date().getTime()
          overtime = overtime + 300000
          wx.setStorageSync("overtime", overtime)
          setTimeout(() => {
            app.checkLogin()
          }, 300000)
          wx.switchTab({url: '/pages/homePage/homePage'})
        } else {
          app.showToast('请使用客户拓展助手小程序登录')
        }
      } else {
        app.showToast(`${params.loginName}登录失败`)
      }
    })
  },

  onShareAppMessage() {
    return {title: '联富通'}
  },

  // 跳转
  linkTo(e) {
    wx.navigateTo({url: e.currentTarget.dataset.url})
  },

  // 获取焦点
  getFocus(e) {
    this.changeFocus(e.currentTarget.dataset.type, true)
  },

  // 失去焦点
  loseFocus(e) {
    this.changeFocus(e.currentTarget.dataset.type, false)
  },

  // 焦点变化时进行的操作
  changeFocus(type, operation) {
    type === 'name' ? this.setData({nameFocus: operation}) : this.setData({pswFocus: operation})
  }
})