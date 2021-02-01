import { merchantList, memberModify } from '../../../api/index.js'

Page({
  data: {
    remark:'',
  },
  onLoad (options) {
    console.log(wx.getStorageSync("login"))
    // type:0 现金充值 type:1 手动消费
    wx.setNavigationBarTitle({
      title: options.type == 0? "手动消费" : "现金充值",
    })
    this.merchantList()
    this.setData({
      ...options,
      ...wx.getStorageSync("login")
    })
  },
  memberModify(e){
    console.log(e)
    return memberModify({
      ...e.detail.value,
    }).then(res => {
      wx.showToast({
        content: res.msg,
        icon:"none"
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 400)
    })
  },
  merchantList(){
    // 获取门店
    return merchantList()
    .then(res => {
      this.setData({
        ...res
      })
    
    })
  },
  changeMerchant(e){
    console.log(e)
    this.setData({
      merchant:e.detail.value
    })
  },
  remarkChange(e){
    this.setData({
      remark: e.detail.value
    })
  },
  onInput(e){
    console.log(e)
    let value = e.detail.value,id = e.target.id;
    if (value != '' && value.substr(0, 1) == '.') {
      value = "";
      this.setData({

      })
    }
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    if(id == 0){
      this.setData({
        money:value
      })
    }else{
      this.setData({
        sendMoney:value
      })
    }
  }
})