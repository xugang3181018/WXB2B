const app = getApp()

Page({
  data: {
    info: {}, // 账户信息
    operation: [
      // {name: '合同管理', icon: app.getImage('activity-edit.png'), url: './changePwd/changePwd'},
      {name: '员工管理', icon: app.getImage('useres.png'), url: '../../subpackage_my/pages/employeeList/employeeList'},
      {name: '密码修改', icon: app.getImage('lock.png'), url: '../../subpackage_my/pages/changePwd/changePwd'},
      {name: '更新信息', icon: app.getImage('update_details.png'), url: 'update'}
    ],
    normalcardimg: app.getImage('normalcardimg.png'),
    isUpdate: false,
    updateInfo: {
      title: '服务商助手2.2.7更新',
      content: ['新增对被风控账户的限制，风险账户无法进行进件相关的操作！']
    },
    updatePos: app.getImage('update-pos.png')
  },

  onLoad() {
    const _that = this
    wx.getStorage({
      key: 'member',
      success(res) {_that.setData({info: res.data})}
    })
  },

  onShow() {
    this.closeUpdateModal()
  },

  closeUpdateModal() {
    this.setData({isUpdate: false})
  },

  // 跳转
  linkTo({currentTarget}) {
    const url = currentTarget.dataset.url
    if (url === 'update') {
      this.setData({isUpdate: true})
    } else {
      wx.navigateTo({url: currentTarget.dataset.url})
    }
  },

  // 登出
  logout() {
    const loginInfo = wx.getStorageSync('loginInfo')
    if (loginInfo) {
      loginInfo.isLogin = false
      wx.clearStorageSync()
      wx.setStorageSync('loginInfo', loginInfo)
    }
    wx.reLaunch({url: '../login/login'})
  }
})
