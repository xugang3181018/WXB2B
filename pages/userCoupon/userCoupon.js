const app = getApp()
import { memberCouponList, getMemberTimesCardInfo  } from '../../api/index.js'

Page({
  data: {
    items: [],
    list: null,
    loading: true,
    hasMore: false,
    page: 1,
    list: null,
  },

  onLoad (options) {
    this.setData({
      ...wx.getStorageSync('canModify'),
      ...options
    })
    this.getTimeList(options.id)
    this.couponList(options.id)
  },


  getTimeList(id) {
    return getMemberTimesCardInfo({
      memberId:id|| wx.getStorageSync("member").memberId,
      pageSize:50,
    })
      .then(res => {
        this.setData({
          ...res,
          loading: false
        })
      })
  },

  getList(toggle) {
    this.list().then(res => {
      let items = res.items.length > 0 ? this.data.items.concat(res.items) : this.data.items
      this.setData({
        items,
        hasMore: items.length < res.totalCount,
        loading: false,
      })
    })
  },
  
  listMore() {
    if (this.data.hasMore) {
      this.getList()
    }
  },

  couponList(id) {
    return memberCouponList({
      merchantCode: app.commonParams('merchantCode'),
      memberId: id || wx.getStorageSync('member').memberId,
      pageNumber: this.data.page++,
      pageSize: 50,
    })
    .then(res=>{
      this.setData({
        ...res
      })
    })
  }

})
