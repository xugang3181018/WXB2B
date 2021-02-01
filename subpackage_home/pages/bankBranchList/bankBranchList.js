const app = getApp()
import ppevent from '../../../utils/ppevent'

Page({
  data: {
    list: [], // 开户支行列表
    subbranchName: '', // 搜索的支行名称
    subbranchProvince: null, // 开户行所在的省
    subbranchCity: null, // 开户行所在
    bankName: null,
    height: wx.getSystemInfoSync().windowHeight - 60,
  },

  onLoad(options) {
    let url = ''
    switch(options.passType) {
      case '9':
        url = 'agent_app_leshua_inquire'
        break
      case '11':
        url = 'agent_app_huifu_inquire'
        break
      default: url = ''
    }
    this.setData({url, ...options})
  },

  getName() {
    const {subbranchName, subbranchProvince, subbranchCity, bankName, url, passType} = this.data
    let params = {}
    switch(passType) {
      case '9':
        params = {subbranchName, subbranchProvince, subbranchCity, bankName}
        break
      case '11':
        params = {
          bankName,
          bankProvince: subbranchProvince,
          bankCity: subbranchCity,
          branchName: subbranchName
        }
        break
      default: null
    }
    app.api(url, params).then((res) => {
      if (res && !res.apiError) {
        const list = res.webMessage ? [] : res
        this.setData({list})
      } else {
        this.setData({list: []})
      }
    })
  },

  // 选择支行
  selectBank(e) {
    const data = e.currentTarget.dataset
    const info = {bankBranchName: data.bankbranchname, bankBranch: data.bankbranch}
    ppevent.emit("bankBranchName", info)
    wx.navigateBack()
  },

  // 获取搜索内容
  search(e) {
    this.setData({subbranchName: e.detail})
    if (e.detail === '') {
      app.showToast('请输入开户支行名称')
      return
    }
    this.getName()
  },

  // 当清空搜索框时
  clearSearch() {
    if (this.data.subbranchName) {
      this.setData({subbranchName: ''})
    }
  },
})
