import {
  memberGet,
  getUser,
  operateMemberCrowd,
  merchantCouponList,
  timesCardList,
  sendPrize,
  login
} from '../../../api/index.js'
const app = getApp()

Page({
  data: {
    loading: true,
    sex: ['未知', '男', '女'],
    current: 0,
    page: 1,
    couponLoading: false,
    couponHasMore: true,
    list: {
      items: []
    },
    coupons: {
      items: []
    }
  },

  onShow() {
    if (wx.qy) {
      wx.qy.getCurExternalContact({
        success: (res) => {
          console.log('企业联系人Userid============>', res)
        }
      })
    }
  },

  onLoad(options) {
    memberGet({
        memberId: options.id
      })
      .then(res => {
        this.setData({
          ...res,
          ...options,
          ...wx.getStorageSync("canModify"),
          isPX: app.isPX
        })
        wx.setStorageSync('member', res.member)
      })
    getUser({
        merchatCode: app.commonParams('merchantCode'),
        memberId: options.id
      })
      .then(info => {
        this.operateMemberCrowd(info.memberId)
          .then(res => {
            const member = {
              ...this.data.member,
              ...info
            }
            this.setData({
              member,
              ...res,
              loading: false,
            })
            wx.setStorageSync('member', member)
          })
      })
  },

  toggleTab({
    target
  }) {
    this.setData({
      current: target.id
    })
  },

  //编辑用户信息
  editUser() {
    this.login()
    let {
      permission
    } = this.data
    wx.navigateTo({
      url: `/pages/membersModify/membersModify?id=${this.data.member.memberId}&permission=${permission.levelConfig}`
    })
  },

  //赠送优惠券
  couponList() {
    console.log(this.data.couponHasMore,"赠送卡卷的分页加载")
    if (this.data.couponHasMore) {
      return merchantCouponList({
          merchantCode:app.commonParams('merchantCode'),
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

  //赠送次卡
  timesCardList() {
    if (this.data.couponHasMore) {
    return timesCardList({
      currentPage: this.data.page++
      })
      .then(res => {
        console.log(res)
        this.setListData(res)
        // timeCard.items = (timeCard.items.length > 0) ? this.data.items.concat(timeCard.items) : this.data.items
        // this.setData({
        //   timeCard,
        //   couponLoading:false,
        //   couponHasMore: timeCard.totalCount > timeCard.items.length
        // })
      })
    }
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
    let {
      permission
    } = this.data
    if (permission.couponConfig == 1) {
      wx.showToast({
        title: '您没有卡券赠送权限',
        icon: "none"
      })
      return
    }
    this.normalCouponList()
    this.couponList()
    this.selectComponent('#sendCoupon').togglePanel()
  },

  // 打开次卡列表
  sendTimeCard() {
    let {
      permission
    } = this.data
    console.log(permission)
    if (permission.couponConfig == 1) {
      wx.showToast({
        title: '您没有次卡赠送权限',
        icon: "none"
      })
      return
    }
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
      couponLoading: true,
      couponHasMore:true
    })
  },

  //赠送用户优惠券
  sendPrize({
    currentTarget
  }) {
    console.log()
    let giveCoupon = []
    this.data.list.items.forEach((item, index) => {
      console.log(item)
      if (item.count > 0) {
        giveCoupon.push({
          count: item.count,
          cardId: item.cardTemplate.cardId || item.cardId
        })
      }
    })
    console.log(giveCoupon)
    return sendPrize({
      memberIds: this.data.member.memberId,
      giveCoupon: JSON.stringify(giveCoupon),
    }).then(res => {
      console.log(res)
      app.tip(res.msg)
      this.selectComponent('#couponPage').getList(1)
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
    const {
      id
    } = e.target
    const {
      index
    } = e.currentTarget.dataset
    this.setData({
      [`list.items[${index}].count`]: this.data.list.items[index].count + (id == 0 ? -1 : +1)
    })
  },

  timeCardCheck({
    currentTarget
  }) {
    const {
      index,
      id
    } = currentTarget.dataset
    this.setData({
      [`list.items[${index}].cardTimeLimits[${id}].checked`]: !this.data.list.items[index].cardTimeLimits[id].checked
    })
  },

  // 手动消费  
  memberModify(
    currentTarget
  ) {
    let {
      permission
    } = this.data
    console.log(permission, currentTarget)
    if (permission.balanceConfig == 1) {
      wx.showToast({
        title: '您没有余额调整权限',
        icon: "none"
      })
      return
    }
    const {
      id,
      type
    } = currentTarget
    wx.navigateTo({
      url: `/pages/sales/banlanceForm/banlanceForm?id=${id}&type=${type}`,
    })
  },
  pointModify(
    currentTarget
  ) {
    let {
      permission
    } = this.data
    console.log(permission, currentTarget)
    if (permission.pointConfig == 1) {
      wx.showToast({
        title: '您没有积分调整权限',
        icon: "none"
      })
      return
    }
    const {
      id,
      type
    } = currentTarget
    wx.navigateTo({
      url: `/pages/sales/pointModify/pointModify?id=${id}&type=${type}`,
    })
  },
  login(e) {
    let params = wx.getStorageSync("loginParams")
    login(params).then(res => {
      if (res.code == 'FAILED') {
        wx.clearStorage()
        wx.showToast({
          title: res.subMsg,
          icon: 'none'
        })
        wx.reLaunch({
          url: '/pages/login/login',
        })
      } else if (res.code == 'SUCCESS') {
        this.setData({
          permission: res.permissionJson
        })
        this.permission(e.currentTarget.dataset)
      }
    })
  },
  permission(data) {
    // 1卡卷、2次卡、3余额、4积分、5编辑
    console.log(data)
    switch (data.index) {
      case 1:
        this.sendCoupon()
        break;
      case 2:
        this.sendTimeCard()
        break;
      case 3:
        this.memberModify(data)
        break;
      case 4:
        this.pointModify(data)
        break;
      case 5:
        this.editUser()
        break;
    }
  }
})