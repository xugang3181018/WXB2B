import { login, loginSi } from '../../api/index.js'

Page({
  data: {
    login: {}
  },
  
  onLoad(options) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    wx.setNavigationBarTitle({
      title: '收款小精灵商户通',
    })
  },

  // 权限
  canModify(permission){
    // 	0：有权限，1：无权限 。
    // 排序：0退款权限 refund，1调整余额 balance，2积分变更 point，3等级变更 level，4经验变更exp，5发送礼券 coupon，6商品新建 skuNew，7商品删除 skuDelete，8商品编辑 skuModify，9商品上下架skuUpdate
    const arr = ["refund", "balance", "point", "level", "exp", "coupon", "skuNew", "skuDelete", "skuEdit", "skuUpdate"]
    let modify = {}
    arr.forEach((item, index) => {
      modify['can' + item] = permission[index] == '0' ? true : false
    })
    wx.setStorageSync('canModify', modify)
  },

  // 登录
  login(e) {
    console.log("111")
    let parmas = e.detail.value
    login(parmas)
      .then(res => {
        console.log(res,"登录")
        if (res.code == 'FAILED') {
          wx.showToast({
            title: res.subMsg,
            icon: 'none'
          })
        } else if (res.code == 'SUCCESS') {

          if(res.role == 2 && (res.appId === res.merchantCode)){
            // 总部员工标识
            res.headOfficeStaff = 2
          }else{
            res.headOfficeStaff = ""
          }
          wx.setStorageSync("loginParams", parmas)
          wx.setStorageSync("login", res)
          this.canModify(res.permission.split(''))
          wx.setStorageSync("loginName", parmas.userName)
          this.loginSi(parmas)
            .then(res => {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            })
        }
      })
  },
  loginSi(parmas) {
    let arg = {
      loginName: parmas.userName,
      password: parmas.passWord
    }
    return loginSi(arg)
      .then((res) => {
        // console.log("::::LOGIN&SI::::", res)
        let loginData = res
        if (loginData.state == -1) {
          wx.showToast({
            title: loginData.obj,
            icon: "none"
          })
        } else if (loginData.state == 1) {
          wx.setStorageSync("loginData", loginData.obj)
          wx.setStorageSync("siKey", loginData.partnerKey)
        }
      })
      .catch(err => {
        // console.log(err)
      })
  },
  clearInput(e) {
    // console.log(e)
    let login = this.data.login
    login[e.target.dataset.id] = ''
    this.setData({
      login: login
    })
  },
  loginInput(e) {
    const login = this.data.login
    login[e.target.id] = e.detail.value
    const loginDisable = (login.passWord && login.userName) ? false : true
    this.setData({
      login: login,
      loginDisable: loginDisable
    })
  },
  loginBlur(e) {
    if (e.detail.value == '') {
      this.setData({
        isEmpty: e.target.id
      })
    }
  },
  focusInput(e) {
    this.setData({
      focus: e.currentTarget.dataset.index
    })
  }
})