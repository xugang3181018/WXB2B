const app = getApp()

Page({
  data: {
    loginPwd: null,
  },

  onLoad() {
    const loginInfo = wx.getStorageSync('loginInfo')
    this.setData({loginPwd: loginInfo.loginPwd})
  },

  // 修改密码
  changePwd(e) {
    const pwd = e.detail.value
    if (pwd.oldPassword !== this.data.loginPwd) {
      app.showToast('原密码不正确')
      return
    }
    if (pwd.oldPassword === pwd.newPassword) {
      app.showToast('新密码与原密码相同！')
      return
    }
    if (pwd.newPassword !== pwd.repeat) {
      app.showToast('新密码与确认密码不相同！')
      return
    }
    const params = {
      oldPassword: pwd.oldPassword,
      newPassword: pwd.newPassword,
      coreMerchantCode: app.common('agentNo'),
      loginName: app.common('loginName'),
    }
    app.api('agent_app_modify_merchant_pwd', params).then((res) => {
      if (res && !res.apiError) {
        const loginInfo = wx.getStorageSync('loginInfo')
        loginInfo.loginPwd = params.newPassword
        wx.clearStorageSync()
        wx.setStorageSync('loginInfo', loginInfo)
        wx.reLaunch({url: '../../../pages/login/login'})
      }
    })
  }
})
