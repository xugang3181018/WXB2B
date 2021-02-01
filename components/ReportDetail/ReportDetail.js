Component({
  properties: {
    details: {
      type: Array,
      value: [],
      observer: "_changeDetail"
    }
  },
  data: {
    currIndex: null,
    orderDetial: {
      wechatOrder: '微信订单金额',
      wechatTrade: '微信实收',
      wechatRefund: '微信退款',
      alipayOrder: '支付宝订单金额',
      alipayTrade: '支付宝实收',
      alipayRefund: '支付宝退款',
      memberOrder: '会员订单金额',
      memberTrade: '会员实收',
      memberRefund: '会员退款',
      qpOrder: "云闪付订单金额",
      qpTrade: "云闪付实收",
      qpRefund: "云闪付退款",
      posOrder:"银行卡订单金额",
      posTrade:"银行卡实收",
      posRefund:"银行卡退款",
      cashOrder:"现金订单金额",
      cashTrade:"现金实收",
      cashRefund:"现金退款",
      totalOrder: '总计订单金额',
      totalTrade: '总计实际收金额',
      totalRefund: '总计退款金额',
    }
  },
  options: {
    addGlobalClass: true,
  },
  methods: {
    _toggleDetail: function(e) {
      let currIndex = e.currentTarget.dataset.index == this.data.currIndex ? null : e.currentTarget.dataset.index
      this.setData({
        currIndex: currIndex
      })
    },
    _changeDetail: function(newData, oldData) {
      console.log(newData)
      newData.map(item =>{
        item.totalOrderAmt = (item.wechatOrderAmt + item.alipayOrderAmt + item.memberOrderAmt + item.qpOrderAmt + item.posOrderAmt + item.cashOrderAmt).toFixed(2)
        item.totalOrderCnt = item.wechatOrderCnt + item.alipayOrderCnt + item.memberOrderCnt + item.qpOrderCnt + item.posOrderCnt + item.cashOrderCnt
        item.totalTradeAmt = (item.wechatTradeAmt + item.alipayTradeAmt + item.memberTradeAmt + item.qpTradeAmt + item.posTradeAmt + item.cashTradeAmt).toFixed(2)
        item.totalTradeCnt = item.wechatTradeCnt + item.alipayTradeCnt + item.memberTradeCnt + item.qpTradeCnt + item.posTradeCnt + item.cashTradeCnt
        item.totalRefundAmt = (item.wechatRefundAmt + item.alipayRefundAmt + item.memberRefundAmt + item.qpRefundAmt + item.posRefundAmt + item.cashRefundAmt).toFixed(2)
        item.totalRefundCnt = item.wechatRefundCnt + item.alipayRefundCnt + item.memberRefundCnt + item.qpRefundCnt + item.posRefundCnt + item.cashRefundCnt
      })
      this.setData({
        detail: newData,
      })
    }
  }
})