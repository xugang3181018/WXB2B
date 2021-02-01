// components/CouponItem/CouponItem.js
const app = getApp()
Component({
  properties: {
    coupon: {
      type: Array,
      value: []
    }
  },
  data: {
    couponType: app.types.couponType
  },
  options: {
    addGlobalClass: true,
  },
  methods: {
    shareCoupon({currentTarget}) {
      wx.setStorageSync('detail', this.data.coupon[currentTarget.dataset.index])
      wx.navigateTo({
        url: `/pages/sales/promotionDetail/promotionDetail?id=${currentTarget.dataset.id}`
      })
    }
  }
})