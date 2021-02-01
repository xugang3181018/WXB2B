import { memberModify, memberGet } from '../../../api/index.js'
const app = getApp()
Page({
  data: {

  },
  onLoad(options) {
    this.setData({
      ...options,
      ...wx.getStorageSync("login"),
      ...wx.getStorageSync("member")
    })
    
  },
  memberGet(){

  },
  memberModify(e) {
    let params = e.detail.value
    return memberModify({
      ...e.detail.value,
    }).then(res => {
      const currpage = app.currPage(2)
      currpage.getMember(this.data.id)
      setTimeout(() => {
        wx.navigateBack()
      }, 400)
    })
  },
})