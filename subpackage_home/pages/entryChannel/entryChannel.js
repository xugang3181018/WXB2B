const app = getApp()
import {host} from '../../../api/file/host'
const platformNo = host.getHost('ks')

Page({
  data: {
    pattern: '', // business store
    isReturn: '', // 是否返回index
    leshua: app.getImage('leshua.png'),
    wspay: app.getImage('wspay.png'),
    hf: app.getImage('hf.png'),
    meizhou: app.getImage('meizhou.png'),
  },

  onLoad() {
    const isReturn = wx.getStorageSync('return')
    const pattern = wx.getStorageSync('entryInfo').pattern
    const ksUrl = app.common('platformNo') === platformNo ? '../entry_channel_second_level/entry_channel_second_level?passType=8' : '../entry/entry8/entry8?type=1&change=0&resubmit=0'
    this.setData({isReturn, ksUrl, pattern})
  },

  onReady() {
    wx.setNavigationBarTitle({title: `${this.data.pattern === 'business' ? '商户' : '门店'}进件-通道选择`})
  },

  onUnload() {
    if (this.data.isReturn === 'true') {
      wx.setStorageSync('return', "false")
      wx.reLaunch({url: '/pages/homePage/homePage'})
    }
  },
})
