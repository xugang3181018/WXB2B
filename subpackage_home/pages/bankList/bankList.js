const app = getApp()
import ppevent from '../../../utils/ppevent'
import bankJS from '../../../components/pickers/data/bank'

Page({
  data: {
    allList: [], // 当前通道所有银行列表
    list: [], // 银行列表
    searchContent: '', // 搜索的名称
    bankName: null, // 银行的名称
    height: wx.getSystemInfoSync().windowHeight - 60,
  },

  onLoad(options) {
    const list = []
    bankJS[options.passType].forEach(item => {
      if (options.passType === '9') {
        list.push({bankName: item, bank: 0})
      } else {
        const bankItem = item.split('|')
        list.push({bankName: bankItem[1], bank: bankItem[0]})
      }
    })
    this.setData({list, allList: list})
  },

  // 选择支行
  selectBank(e) {
    const data = e.currentTarget.dataset.item
    const info = {bankName: data.bankName, bank: data.bank}
    ppevent.emit("bankName", info)
    wx.navigateBack()
  },

  // 获取搜索内容
  search(e) {
    const {allList} = this.data
    this.setData({searchContent: e.detail})
    if (e.detail === '') {
      app.showToast('请输入开户银行名称')
      return
    }
    const newList = []
    allList.forEach(item => {
      if (item.bankName.indexOf(e.detail) !== -1) {
        newList.push(item)
      }
    })
    this.setData({list: newList})
  },

  // 当清空搜索框时
  clearSearch() {
    if (this.data.searchContent) {
      this.setData({searchContent: '', list: this.data.allList})
    }
  },
})
