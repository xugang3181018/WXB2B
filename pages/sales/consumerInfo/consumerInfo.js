import { memberGet, getUser, operateMemberCrowd, merchantCouponList, timesCardList, sendPrize, externalContact,getAppToken} from '../../../api/index.js'
const app = getApp()

Page({
  data: {
    loading: true,
    sex: ['未知', '男', '女'],
    current: 0,
    page: 1,
    couponLoading: false,
    couponHasMore: true,
    member:null,
    error:false,
    list: {
      items: []
    },
    coupons: {
      items: []
    }
  },

  toTags({ currentTarget}){
    wx.navigateTo({
      url:currentTarget.dataset.url,
    })
  },

  toPages({currentTarget}){
    wx.navigateTo({
      url: currentTarget.dataset.url,
    })
  },

  async onLoad(options) {
    this.setData({
      ...options
    })
    // this.userIds('wmmN5uDgAAahl5chPMbuUduAxROz8Ddw') //("wmUsvLBgAAsmBiPHtXROwU6Kg_XdIVrw") // wmUsvLBgAAsmBiPHXROwU6kg_XdIVrw wmUsvLBgAACVu_nQLlRE54dJ4HCLZgXw
    // if (options.userId) this.userIds(options.userId)
    // this.getUser({unionId:'odL8ruGAFyYOuLqj1xDDE7sOyPxE'})
    if (wx.qy && options.type) {
      wx.qy.getCurExternalContact({
        success: (res) => {
          console.log('企业微信跳转获取userId=========>', res)
          this.setData({
            ...res
          })
          if (res.userId){
            this.userIds(res.userId)
          } 
        },
        fail:(error)=> {
          console.log('企业微信跳转获取userId=========>', error)
        }
      })
    }else{
      await this.getUser({ memberId: options.id})
      await this.getMember(options.id)
    }
  },

   // 企业微信获取userId
  userIds(externalUserid) {
    // getAppToken({
    //   corpid:'wx69516bc462dd79e0',
    //   corpsecret:'psbj9rJLW_RqiVZLiOPUc2Mshva46Z2QRrL6Z5H0U-s'
    // })
    // .then(res => {
    //   console.log(res)
    // })
    // console.log(externalUserid)
    return externalContact({
      externalUserid,// 'wmUsvLBgAA7hpMGA2rEK-evatrYSqS7g' //'wmUsvLBgAACVu_nQLlRE54dJ4HCLZgXw',
    }).then(res=>{
      console.log('企业微信用户信息========》',res)
      if (res['external_contact'].unionid) {
        this.getUser({
          unionId: res['external_contact'].unionid
        })
      }
    })
  },

  async getUser(arg = {}){
    const info = await getUser({ merchatCode: app.commonParams('merchantCode'), ...arg})
    console.log('会员用户信息========>',info)
    if(info.memberId){
      this.operateMemberCrowd(info.memberId)
        .then(res => {
          console.log('会员标签========>',res)
          const member = {
            ...this.data.member,
            ...info
          }
          this.setData({
            ...res,
            member,
            loading: false,
          })
          if(this.data.userId){
            this.getMember(info.memberId)
          }
          wx.setStorageSync('member', member)
        })
    }
  },
  
  async getMember(memberId){
    const res = await memberGet({ memberId})
    if(res.member.memberId){
    this.setData({
      member:{...this.data.member,...res.member},
      ...wx.getStorageSync("canModify"),
      isPX: app.isPX
    })
    wx.setStorageSync('member', res.member)
    }else{
      this.setData({
        error:true,
        errorMsg:'还不是会员',
        loading:false,
      })
    }
  },

  toggleTab({ target }) {
    this.setData({
      current: target.id
    })
  },

  //编辑用户信息
  editUser() {
    wx.navigateTo({
      url: `/pages/membersModify/membersModify?id=${this.data.member.memberId}`
    })
  },

  //赠送优惠券
  couponList() {
    if (this.data.couponHasMore) {
      return merchantCouponList({
        pageNumber: this.data.page++
      })
        .then(coupons => {
          this.setListData(coupons)
          // res.items.map(item => item.count = 0)
          //   coupons.items = res.items.length > 0 ? this.data.coupons.items.concat(coupons.items) : this.data.coupons.items
          // this.setData({
          // 	coupons,
          // 	couponLoading: false,
          // 	couponHasMore:!(coupons.items.length == res.totalCount)
          // })
        })
    }
  },

  toCoupons(){
    wx.navigateTo({
      url: `/pages/sales/promotion/promotion`,
    })
  },

  //赠送次卡
  timesCardList() {
    return timesCardList({
      pageNumber: this.data.page++
    })
      .then(res => {
        this.setListData(res)
        // timeCard.items = (timeCard.items.length > 0) ? this.data.items.concat(timeCard.items) : this.data.items
        // this.setData({
        //   timeCard,
        //   couponLoading:false,
        //   couponHasMore: timeCard.totalCount > timeCard.items.length
        // })
      })
  },

  userProfile(){
    wx.qy.openUserProfile({
      type:2,
      userid:this.data.userId,
    })
  },

  //list setData
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
      memberIds: this.data.member.memberId,
      giveCoupon: JSON.stringify(giveCoupon),
    }).then(res => {
      app.tip(res.msg)
      this.selectComponent('#couponPage').getList()
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
      memberIds: this.data.member.memberId,
      giveTimescard: JSON.stringify(giveTimescard),
    }).then(res => {
      app.tip(res.msg)
      this.selectComponent('#timeCardPage').getList()
      this.selectComponent('#timeCardList').togglePanel()
    })
  },

  // 会员标签
  operateMemberCrowd(memberId) {
    return operateMemberCrowd({
      merchantCode: app.commonParams('appId'),
      memberId,
      type: 3
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

  // 手动消费  
  memberModify({ currentTarget }) {
    const { id, type } = currentTarget.dataset
    wx.navigateTo({
      url: `/pages/sales/banlanceForm/banlanceForm?id=${id}&type=${type}`,
    })
  },

  //积分
  pointModify({ currentTarget }) {
    const { id, type } = currentTarget.dataset
    wx.navigateTo({
      url: `/pages/sales/pointModify/pointModify?id=${id}&type=${type}`,
    })
  }
})