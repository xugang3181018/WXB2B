import { totalBill, billList } from '../../servers/api'
const base = require('../../utils/util')
Page({
  data: {
    list: [],
    data: {},
    tabs: [
      {
        title: '订单流水',
      },
      {
        title: '退款记录',
      },
    ],
    type: {
      WXPAY: '微信支付',
      ALIPAY: '支付宝支付',
      MPAY: '会员支付',
      CASH: '现金支付',
      BANK: 'pos支付'
    },
    activeTab: 0,
    signInTime: "",
    signOutTime: "",
    status: "",
    pageNumber: 1,
    params: {},
    loginInfo: "",
    date: "",
    FullYear: "",
    time: "",
    modalOpened: false,
    value: 0,
    ditchContent: ["全部", "支付宝", "微信", "会员", "现金", "POS"],
    ditchList: ["", "ALIPAY", "WXPAY", "MPAY", "CASH", "BANK"],
    payType: "",
    signInTimeString: "",
    signOutTimeString: ""
  },
  onLoad() {
    let realTime = new Date()
    this.setData({
      signInTime: base.formatTime(realTime).date + " " + "00:00:00",
      signOutTime: base.formatTime(realTime).dateTime,
      date: base.formatTime(realTime).time,
      FullYear: base.formatYearMonthDate(base.formatTime(realTime).time),
      time: base.formatHHMMSS(base.formatTime(realTime).time),
      loginInfo: my.getStorageSync({ key: 'loginInfo' }).data
    })
    this.onTotalChange()
  },
  onShow() {
  },

  onTotalChange() {
    let { loginInfo, FullYear, time, signInTimeString, signOutTimeString } = this.data
    let params = {
      merchantCode: loginInfo.merchantCode,
      beginDate: base.formatYearMonthDate(signInTimeString) || FullYear,
      endDate: base.formatYearMonthDate(signOutTimeString) || FullYear,
      beginTime: '000000',
      endTime: base.formatHHMMSS(signOutTimeString) || time
    }
    if(loginInfo.role === 2){
      params.operatorId =  loginInfo.operatorId
    }
    totalBill(params).then(res => {
      console.log(res, "总计")
      this.setData({
        data: res.statistics
      })
    })
    this.onBillList()
  },

  onBillList() {
    let { loginInfo, FullYear, date, pageNumber, list, payType, signInTimeString, signOutTimeString } = this.data
    let params = {
      merchantCode: loginInfo.merchantCode,
      billBeginTime: signInTimeString || FullYear + '000000',
      billEndTime: signOutTimeString || date,
      pageNumber: pageNumber,
      pageSize: 20,
      payType: payType
    }
      if(loginInfo.role === 2){
      params.operatorId =  loginInfo.operatorId
    }
    billList(params).then(res => {
      console.log(res, '列表')
      if (res.code === 'SUCCESS') {
        if (res.orderDetails !== undefined) {
          this.setData({
            list: list.concat(res.orderDetails),
            status: true
          })
          my.hideLoading();
        } else {
          my.hideLoading();
          my.showToast({
            content: '没有更多数据',
            deration: '2000'
          });
        }
      } else {
        this.setData({
          status: false
        })
      }
    })
  },
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },
  onOrderDetail(value) {
    console.log(value, this.data.activeTab)
    my.navigateTo({ url: `/pages/orderDetail/orderDetail?outTradeNo=${value.target.dataset.data.outTradeNo}&index=${this.data.activeTab}` })
  },
  onReachBottom() {
    this.data.pageNumber++
    this.onBillList()
  },

  openModal() {
    this.setData({
      modalOpened: !this.data.modalOpened
    })
  },

  onChange(e) {
    this.setData({
      value: e.detail.value
    })
  },

  onCancelBtn() {
    this.setData({
      modalOpened: !this.data.modalOpened
    })
  },

  onAffirmBtn() {
    let { value, ditchList, list, pageNumber } = this.data
    this.setData({
      modalOpened: !this.data.modalOpened,
      payType: ditchList[value],
      pageNumber: 1,
      list: [],
      calendarStatus: false,
    })
    this.onBillList()
  },

  onTimeSelrctor(value) {
    this.setData({
      pageNumber: 1,
      list: [],
      signInTimeString: value[0],
      signOutTimeString: value[1],
      signInTime: base.strDateFormat(value[0]),
      signOutTime: base.strDateFormat(value[1])
    })
      this.onTotalChange()
  }
});
