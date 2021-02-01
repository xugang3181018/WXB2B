// pages/sales/consumerDetail/sendCopon/index.js
import { memberGet, getUser, operateMemberCrowd, merchantCouponList, timesCardList, sendPrize } from '../../../../api/index.js'
const app = getApp()
Component({
  properties: {
    memberId:{
      type:String,
      value:'',
    }
  },
  data: {
    loading:true,
    couponLoading:true,
    page: 1,
    timeCard: {},
    list: {
      items: []
    },
  },
  options: {
    addGlobalClass: true,
  },

  lifetimes: {
    attached() {
      this.setData({
        ...wx.getStorageSync('canModify')
      })
    }
  },

  methods: {
    // 打开优惠券列表
    sendCoupon() {
      this.normalCouponList()
      this.couponList()
      this.selectComponent('#sendCoupon').togglePanel()
    },

    // 打开次卡列表
    sendTimeCard() {
      this.normalCouponList()
      this.timesCardList()
      this.selectComponent('#timeCardList').togglePanel()
    },

    //初始化卡券列表
    normalCouponList() {
      this.setData({
        page: 1,
        timeCard: {},
        list: {
          items: []
        },
        couponLoading: true
      })
    },
    moreCoupon(){
      if (this.data.couponHasMore){
        this.couponList()
      }
    },
    //赠送优惠券
    couponList() {
      return merchantCouponList({
        pageNumber: this.data.page++
      })
      .then(coupons => {
        console.log(coupons)
        this.setListData(coupons)
      })
    },
    
    // setData
    setListData(list) {
      list.items.map(item => item.count = 0)
      list.items.map(item => item.checked = false)
      list.items = list.items.length > 0 ? this.data.list.items.concat(list.items) : this.data.list
      this.setData({
        list,
        couponLoading: false,
        couponHasMore: list.totalCount > list.items.length
      })
    },

    //赠送次卡
    timesCardList() {
      return timesCardList({
        pageNumber: this.data.page++
      })
        .then(res => {
          this.setListData(res)
        })
    },

    //赠送用户优惠券
    sendPrize({ currentTarget }) {
      let giveCoupon = []
      this.data.list.items.forEach((item, index) => {
        if (item.count > 0) {
          giveCoupon.push({
            count: item.count,
            cardId: item.cardTemplate.cardId || item.cardId
          })
        }
      })
      return sendPrize({
        memberIds: this.data.memberId,
        giveCoupon: JSON.stringify(giveCoupon),
      }).then(res => {
        app.tip(res.msg)
        this.selectComponent('#sendCoupon').togglePanel()
      })
    },

    // 赠送用户次卡
    sendTimePrize(e) {
      let giveTimescard = []
      this.data.list.items.forEach(item => {
        item.cardTimeLimits.forEach(itm => {
          if (itm.checked) {
            giveTimescard.push({
              cardId: item.cardId,
              cardLimitId: itm.id
            })
          }
        })
      })
      return sendPrize({
        memberIds: this.data.memberId,
        giveTimescard: JSON.stringify(giveTimescard),
      }).then(res => {
        app.tip(res.msg)
        this.selectComponent('#timeCardPage').getList()
        this.selectComponent('#timeCardList').togglePanel()
        
      })
    },


    // 优惠券赠送数量 
	  couponCart(e) {
      const { id } = e.target
      const { index } = e.currentTarget.dataset
      this.setData({
        [`list.items[${index}].count`]: this.data.list.items[index].count + (id == 0 ? -1 : +1)
      })
    },

    timeCardCheck({ currentTarget }) {
      const { index, id } = currentTarget.dataset
      this.setData({
        [`list.items[${index}].cardTimeLimits[${id}].checked`]: !this.data.list.items[index].cardTimeLimits[id].checked
      })
    },
  }
})
