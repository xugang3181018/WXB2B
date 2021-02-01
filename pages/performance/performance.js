const app = getApp()

Page({
  data: {
    isAdmin: null, // 是否是管理员
    mchstore: null, // 商户、门店统计
    trade: null, // 交易，支付方式统计
    nowDate: app.formatDate((new Date(new Date().getTime() - 86400000)), "yyyy-MM-dd"),
    dataupWithe: app.getImage('dataupWithe.png'),
    datadownWithe: app.getImage('datadownWithe.png'),
    dataup: app.getImage('dataup.png'),
    datadown: app.getImage('datadown.png'),
    preEarnings: app.getImage('pre-earnings.png'),
    prePay: app.getImage('pre-pay.png'),
    preStore: app.getImage('pre-store.png'),
    preMerchant: app.getImage('pre-merchant.png'),
    isCloseOutside: false,
  },

  onLoad() {
    const isAdmin = app.common('isAdmin')
    this.setData({isAdmin})
    this.getMchStore()
    this.getTrade()
    this.getHistoricalLoss()
    this.getLostUsersList()
  },

  onShow() {
    this.setData({isCloseOutside: false})
  },

  // 改变日期
  onChange(e) {
    this.setData({nowDate: e.detail})
    this.getMchStore()
    this.getTrade()
    this.getHistoricalLoss()
    this.getLostUsersList()
  },

  // 获取交易信息
  getMchStore() {
    const params = {
      agentNo: app.common('agentNo'),
      startDate: this.data.nowDate,
      queryType: 0
    }
    app.api('agent_app_mchstore_query', params).then(res => {
      if (res && !res.apiError) this.setData({mchstore: res})
    })
  },

  // 获取支付信息
  getTrade() {
    const params = {
      agentNo: app.common('agentNo'),
      startDate: this.data.nowDate,
      queryType: 0
    }
    app.api('agent_app_trade_query', params).then(res => {
      if (res && !res.apiError) {
        res.tradeAmountMoM = res.tradeAmountMoM.replace('%', '')
        res.tradeCountMoM = res.tradeCountMoM.replace('%', '')
        res.incomeAmountMoM = res.incomeAmountMoM.replace('%', '')
        this.setData({trade: res, nowDate: params.startDate})
      }
    })
  },

  // 获取疑似流失列表
  getLostUsersList() {
    const nowDate = this.data.nowDate.replace(/-/g, '')
    const params = {
      start_date: nowDate,
      end_date: nowDate,
      agent_no: app.common('agentNo'),
      page_size: 10,
      page_num: 1
    }
    app.api2('front.suspectLoss', params).then(res => {
      if (res && !res.apiError) {
        this.setData({lostUsers: res.totalCount})
      }
    })
  },

  // 获取历史流失
  getHistoricalLoss() {
    const nowDate = this.data.nowDate.replace(/-/g, '')
    const params = {
      start_date: nowDate,
      end_date: nowDate,
      agent_no: app.common('agentNo'),
      page_size: 10,
      page_num: 1
    }
    app.api2('front.threeDayNoTrade', params).then(res => {
      if (res && !res.apiError) {
        this.setData({historicalLoss: res.totalCount})
      }
    })
  },

  // 跳转到商户统计
  toStatisticalDetail(e) {
    wx.navigateTo({url: `../../subpackage_performance/pages/statistical_detail/statistical_detail?pattern=${e.currentTarget.dataset.pattern}&nowDate=${this.data.nowDate}`})
  },

  // 跳转到支付方式统计
  toPaymentStatistics() {
    wx.navigateTo({url: `../../subpackage_performance/pages/paymentStatistics/paymentStatistics?nowDate=${this.data.nowDate}`})
  }
})