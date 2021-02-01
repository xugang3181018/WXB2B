const base = require('../../utils/util')
//倒计时
function countdown(that) {
  let second = that.data.second
  if (second == 0) {
    clearTimeout(that.time)
    that.time = null
    that.onQuit()
    return;
  }
  let time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }, 1000)
}

Page({
  data: {
    second: 5,
    receiptAmount: '',
    discountAmount: "",
    wxpay: '',
    alipay: ''
  },
  onLoad(options) {
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    console.log(loginInfo)
    let data = JSON.parse(options.data)
    let totalAmount = JSON.stringify(data.totalAmount)
    if (data.payType === 'WXPAY') {
      this.setData({
        wxpay: true,
        receiptAmount: data.receiptAmount,
        discountAmount: data.discountAmount
      })
      let arrList = [
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'ON', 'ON', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
        { 'cmd': 'addSetLineSpacing', 'args': ['30'] },
        { 'cmd': 'addText', 'args': ['微信支付'] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['3'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`结算店员：${loginInfo.operatorName}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`交易单号：${data.outTradeNo}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`交易金额：${data.totalAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`优惠金额：${data.discountAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`实收金额：${data.receiptAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['2'] },
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
      my.ix.printer({
        cmds: arrList,
        success: (r) => {
          console.log(r, "success");
          my.hideLoading();
        },
        fail: (r) => {
          console.log("fail, errorCode:" + r.error);
          my.hideLoading();
          // my.showToast({
          //   type: 'none',
          //   content: "找不到指定打印机",
          //   duration: 2000,
          // });
          return
        }
      });
      my.ix.speech({
        text: `微信到账${totalAmount}元`,
        success: (r) => {
          console.log(r)
        }
      });
    } else if (data.payType === 'ALIPAY') {
      this.setData({
        alipay: true,
        receiptAmount: data.receiptAmount,
        discountAmount: data.discountAmount
      })
      let arrList = [
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'ON', 'ON', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
        { 'cmd': 'addSetLineSpacing', 'args': ['30'] },
        { 'cmd': 'addText', 'args': ['支付宝支付'] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['3'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`结算店员：${loginInfo.operatorName}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`交易单号：${data.outTradeNo}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`交易金额：${data.totalAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`优惠金额：${data.discountAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`实收金额：${data.receiptAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['2'] },
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
      my.ix.printer({
        cmds: arrList,
        success: (r) => {
          console.log(r, "success");
          my.hideLoading();
        },
        fail: (r) => {
          console.log("fail, errorCode:" + r.error);
          my.hideLoading();
          // my.showToast({
          //   type: 'none',
          //   content: "找不到指定打印机",
          //   duration: 2000,
          // });
          return
        }
      });
      my.ix.speech({
        text: `支付宝到账${totalAmount}元`,
        success: (r) => {
          console.log(r)
        }
      });
    } else {
      this.setData({
        receiptAmount: data.receiptAmount,
        discountAmount: data.discountAmount
      })
      let arrList = [
        { 'cmd': 'addCutPaper', 'args': [] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'ON', 'ON', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
        { 'cmd': 'addSetLineSpacing', 'args': ['30'] },
        { 'cmd': 'addText', 'args': ['会员支付'] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['3'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`结算店员：${loginInfo.operatorName}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`交易单号：${data.outTradeNo}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`交易金额：${data.totalAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`优惠金额：${data.discountAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`实收金额：${data.receiptAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['2'] },
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
      my.ix.printer({
        cmds: arrList,
        success: (r) => {
          console.log(r, "success");
          my.hideLoading();
        },
        fail: (r) => {
          console.log("fail, errorCode:" + r.error);
          my.hideLoading();
          // my.showToast({
          //   type: 'none',
          //   content: "找不到指定打印机",
          //   duration: 2000,
          // });
          return
        }
      });
      my.ix.speech({
        text: `余额支付到账${totalAmount}元`,
        success: (r) => {
          console.log(r)
        }
      });
    }
    // my.ix.voicePlay({
    //   eventId: 'ZFDZ',
    //   number: totalAmount,
    //   success: (r) => {
    //   }
    // });
    countdown(this);
  },

  onQuit() {
    my.reLaunch({
      url: '../home/home',
    });
  }
});

