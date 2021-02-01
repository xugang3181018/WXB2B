import { totalBill } from '../../servers/api'
const base = require('../../utils/util')
Page({
  data: {
    date: base.formatTime(new Date()).time,
    details: {},
    startTime: "",
    finishTime: "",
    alipayOrderAmt: 0,
    wechatOrderAmt: 0,
    posOrderAmt: 0,
    cashOrderAmt: 0,
    memberOrderAmt: 0
  },
  onLoad() {
    my.showLoading({
      content: '加载中...'
    });
    let startTimeString = ""
    let finishTimeString = ""
    let time = ""
    let startTime = ""
    let finishTime = ""
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    let times = my.getStorageSync({ key: 'time' }).data
    if (times) {
      startTimeString = times.startTimeString
      finishTimeString = times.finishTimeString
      time = times.time
      startTime = base.strDateFormat(startTimeString + "000000")
      finishTime = base.strDateFormat(finishTimeString + time)
    }
    let params = {
      merchantCode:loginInfo.merchantCode, 
      beginDate: startTimeString || base.formatYearMonthDate(base.formatTime(new Date()).time),
      endDate: finishTimeString || base.formatYearMonthDate(base.formatTime(new Date()).time),
      beginTime: '000000',
      endTime: time || base.formatHHMMSS(base.formatTime(new Date()).time)
    }
    if(loginInfo.role === 2){
      params.operatorId =  loginInfo.operatorId
    }
    console.log(params)
    totalBill(params).then(res => {
      if (res.code === "SUCCESS") {
        this.setData({
          details: res.statistics,
          alipayOrderAmt: res.statistics.alipayOrderAmt,
          wechatOrderAmt: res.statistics.wechatOrderAmt,
          posOrderAmt: res.statistics.posOrderAmt,
          cashOrderAmt: res.statistics.cashOrderAmt,
          memberOrderAmt: res.statistics.memberOrderAmt,
          startTime: startTime || base.formatTime(new Date()).date + " " + "00:00:00",
          finishTime: finishTime || base.formatTime(new Date()).dateTime
        })
      }
    })
    my.hideLoading();
  },

  //打印
  print() {
    // 开始监听
    my.showLoading({
          content: '打印中...',
        });
    my.ix.startMonitorPrinter({
      success: (r) => {
        console.log(r, "success");
      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
        my.hideLoading();
        my.showToast({
          type: 'none',
          content: '找不到指定打印机',
          duration: 2000,
        });
        return
      }
    });

    // 结束监听
    my.ix.offMonitorPrinter();
    let { details, startTime, finishTime } = this.data
    let titleList = ['交易支付汇总', '支付宝支付汇总', '微信支付汇总', '会员支付汇总', 'POS支付汇总', '现金支付汇总']
    let list = []
    let arrList = [
      { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'ON', 'ON', 'OFF'] },
      { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
      { 'cmd': 'addSetLineSpacing', 'args': ['30'] },
      { 'cmd': 'addText', 'args': ['汇总详情'] },
      { 'cmd': 'addPrintAndLineFeed', 'args': [] },
      { 'cmd': 'addPrintAndFeedLines', 'args': ['3'] },
      { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
      { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
      { 'cmd': 'addText', 'args': [`开始时间：${startTime}`] },
      { 'cmd': 'addPrintAndLineFeed', 'args': [] },
      { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
      { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
      { 'cmd': 'addText', 'args': [`结束时间：${finishTime}`] },
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
        { 'cmd': 'addText', 'args': [`交易金额：${index == 0 ? details.totalOrderAmt : index == 1 ? details.alipayOrderAmt : index == 2 ? details.wechatOrderAmt : index == 3 ? details.memberOrderAmt : index == 4 ? details.posOrderAmt : details.cashOrderAmt}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`实收金额：${index == 0 ? details.totalTradeAmt : index == 1 ? details.alipayTradeAmt : index == 2 ? details.wechatTradeAmt : index == 3 ? details.memberTradeAmt : index == 4 ? details.posTradeAmt : details.cashTradeAmt}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`优惠金额：${index == 0 ? details.totalDiscountableAmt : index == 1 ? details.alipayDiscountableAmt : index == 2 ? details.wechatDiscountableAmt : index == 3 ? details.memberDiscountableAmt : index == 4 ? details.cashDiscountableAmt : details.cashDiscountableAmt}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`退款金额：${index == 0 ? details.totalRefundAmt : index == 1 ? details.alipayRefundAmt : index == 2 ? details.wechatRefundAmt : index == 3 ? details.memberRefundAmt : index == 4 ? details.posRefundAmt : details.cashRefundAmt}`] },
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
          content: "找不到指定打印机",
          duration: 2000,
        });
        return
      }
    });
  },
});
