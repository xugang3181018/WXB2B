import { memberModify } from '../../../api/index.js'
Page({
  data: {

  },
  onLoad(options){
    wx.setNavigationBarTitle({
      title: options.type == 0 ? '减少积分':'增加积分',
    })
    this.setData({
      ...options,
      ...wx.getStorageSync("login")
    })
  },
  memberModify(e) {
    let params = e.detail.value
    console.log(params)
    let index = (params.modPoint + '').indexOf('.')
    if(index != -1){
      wx.showToast({
        title:"积分不能存在小数点",
        icon:"none"
      })
      return
    }
    params.modPoint = this.data.type == 0 ? Number(-params.modPoint) : params.modPoint
    return memberModify({
      ...e.detail.value,
    }).then(res => {
      wx.showToast({
        title: res.msg,
            icon:"none"
      })
      setTimeout(()=>{
        wx.navigateBack()
      },400)
    })
  },
})