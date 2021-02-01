const base = require('../../utils/util.js')
Page({
  data: {
    details: '',
    total: ''
  },
  onLoad() {
    let details = my.getStorageSync({ key: 'details' }).data
    let total = base.aggregate(details)
    console.log(details)
    this.setData({
      details: details,
      total: total
    })
  },

  //打印
  print() {
    // 开始监听
    my.ix.startMonitorPrinter({
      success: (r) => {
        console.log(r, "success");
        my.showLoading({
          content: '打印中...',
        });
      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
        my.hideLoading();
        my.showToast({
          type: 'none',
          content:'找不到指定打印机',
          duration: 2000,
        });
        return
      }
    });

    // 结束监听
    my.ix.offMonitorPrinter();
    let { total, details } = this.data
    let titleList = ['交易订单总计', '支付宝订单总计', '微信订单总计', '会员订单总计']
    let list = []
    let arrList = [
      { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'ON', 'ON', 'OFF'] },
      { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
      { 'cmd': 'addSetLineSpacing', 'args': ['30'] },
      { 'cmd': 'addText', 'args': ['结算详情'] },
      { 'cmd': 'addPrintAndLineFeed', 'args': [] },
      { 'cmd': 'addPrintAndFeedLines', 'args': ['3'] },
      { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
      { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
      { 'cmd': 'addText', 'args': [`结算店员：${details.cashierName}`] },
      { 'cmd': 'addPrintAndLineFeed', 'args': [] },
      { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
      { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
      { 'cmd': 'addText', 'args': [`开始时间：${details.signInTime}`] },
      { 'cmd': 'addPrintAndLineFeed', 'args': [] },
      { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
      { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
      { 'cmd': 'addText', 'args': [`结束时间：${details.signOutTime}`] },
      { 'cmd': 'addPrintAndLineFeed', 'args': [] },
      { 'cmd': 'addPrintAndFeedLines', 'args': ['2'] },
    ]
    titleList.map((item, index) => {
      console.log(item)
      list = [
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`${item}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`交易金额：${index == 0 ? total.totalOrderAmt : index == 1 ? details.alipayOrderAmt : index == 2 ? details.wechatOrderAmt : details.memberOrderAmt}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`实收金额：${index == 0 ? total.totalTradeAmt : index == 1 ? details.alipayTradeAmt : index == 2 ? details.wechatTradeAmt : details.memberTradeAmt}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`优惠金额：${index == 0 ? total.totalDiscountableAmt : index == 1 ? details.alipayDiscountableAmt : index == 2 ? details.wechatDiscountableAmt : details.memberDiscountableAmt}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`退款金额：${index == 0 ? total.totalRefundAmt : index == 1 ? details.alipayRefundAmt : index == 2 ? details.wechatRefundAmt : details.memberRefundAmt}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['3'] },
      ]
      arrList.push(list)
      console.log(arrList)
    })
    let ending = [
      { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
      { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
      { 'cmd': 'addText', 'args': [`打印日期：${base.formatTime(new Date()).dateTime}`] },
      { 'cmd': 'addPrintAndLineFeed', 'args': [] },
      { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
      { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
      { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
      { 'cmd': 'addText', 'args': ['生意兴隆'] },
      { 'cmd': 'addPrintAndLineFeed', 'args': [] },
      { 'cmd': 'addPrintAndFeedLines', 'args': ['4'] },
    ]
    arrList.push(ending)
    var arr2 = [].concat.apply([], arrList)
    my.ix.printer({
      cmds: arr2,
      success: (r) => {
        console.log(r, "success");
        my.hideLoading();
      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
         my.hideLoading();
        my.showToast({
          type: 'none',
          content:"找不到指定打印机",
          duration: 2000,
        });
        return
      }
    });
  },
  onShow() {
  }
});
