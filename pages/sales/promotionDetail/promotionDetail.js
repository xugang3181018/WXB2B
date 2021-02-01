import { merchantCouponInfo, merchantList, getShareUrl } from '../../../api/index.js'
const app = getApp()
import {post} from './post.js'
const qrcode = require('../../../libs/qrcode/code.js')
import { rules } from '../../../utils/coupon.js'
Page({
  data: {
    loading:true
  },
  
  onLoad (options) {
    let size = qrcode.size()
    this.setData({
      ...options,
      size,
      ...wx.getStorageSync('detail'), //详情信息
      couponType: app.types.couponType
    })
	
    this.couponInfo(options.id)
  },

  // 优惠券详情
  couponInfo(cardId){
    return merchantCouponInfo({ cardId })
    .then(res => {
      const coupon = res.coupon.cardTemplate
      this.setData({
        ...res,
        ...coupon,
				rules: rules(coupon),
        loading: false
      })
      this.merchantList(coupon.suitShops)
      this.getShareUrl()
    })
  },

  // 适用门店
  merchantList(list) {
    let shoplist = list.split(',')
    merchantList().then(res => {
      let merchantList = [],
        list = res.merchantList || [];
      list.forEach(i => {
        let value = null
        shoplist.forEach(item => {
          if (item = i.merchantCode) {
            value = i
          }
        });
        merchantList.push(value)
      });
      this.setData({
        merchantList
      })
    })
  },

  //获取分享二维码
  getShareUrl(itemId){
    return getShareUrl({
      merchantCode: app.commonParams('merchantCode'),
      type:0,
      itemId:this.data.cardId,
      salesmanId: wx.getStorageSync('salesmanId')
    }).then(res => {
			qrcode.createQrCode(res.shareUrl, "ewmCode", 200, 200)
    })
  },
	getShareCode(){
		wx.canvasToTempFilePath({
			canvasId: 'ewmCode',
			width: 200,
			height: 200,
			fail: (error) => {
				console.log(error)
			},
			success: (res) => {
				this.setData({
					tempImg: res.tempFilePath,
					post: post({ ...this.data, tempImg: res.tempFilePath })
				})
				wx.nextTick(()=>{
					this.selectComponent('#sharePost').togglePost()
				})
			}
		}, this)
	},
	sharePost(){
		this.getShareCode()
	},
  togglePanel({currentTarget}){
    console.log(currentTarget)
    this.selectComponent(`#${currentTarget.dataset.id}`).togglePanel()
  },
  togglePanels({currentTarget}){
    this.selectComponent('#goodsPanel').togglePanel()
  },
  onShareAppMessage () {

  }
})