// pages/userBill/userBill.js
import { billMember } from '../../api/index.js'
const app = getApp()

Page({
  data: {
    loading:true,
    params: {
      orderType: 1,
    },
  },

  onLoad (options) {
    this.setData({
      ...options,
      ...wx.getStorageSync('canModify')
    })
    this.getList()

  },
  getList() {
    return billMember({
      memberId:this.data.id || wx.getStorageSync("member").memberId,
      orderStatus: "SUCCESS",
      ...this.data.params,
    })
      .then(res => {
        this.setData({
          ...res,
          loading: false,
        })
      })
  },

  toDetail({ currentTarget }) {
    wx.navigateTo({
      url: currentTarget.dataset.url
    })
  },
})

