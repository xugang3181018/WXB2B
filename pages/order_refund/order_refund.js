import { orderRefund } from '../../servers/api'
const base = require('../../utils/util')
Page({
  data: {
    money: '',
    receiptAmount: '',
    outTradeNo:'',
    value: '',
    modalOpened: false,
    userName: '',
    passWord: '',
  },
  onLoad(option) {
      this.setData({
      receiptAmount: option.money,
      outTradeNo:option.outTradeNo,
      refund: my.getStorageSync({ key: 'refund' }).data,
      userName:my.getStorageSync({ key: 'refund' }).data.userName
    })
  },
  onShow() {
  
  },
  bindHideKeyboard(e) {
    this.setData({
      money: Number(e.detail.value)
    })
  },

  handlerContent(e) {
    this.setData({
      value: e.detail.value
    })
  },

  onDialogBox() {
    this.setData({
      modalOpened: true
    })
  },

  onRefund() {
    my.showLoading({
      content: '退款中...',
      delay: '1000'
    });
    let { outTradeNo, money, value } = this.data
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    console.log(loginInfo)
    let params = {
      merchantCode: loginInfo.merchantCode,
      operatorId: loginInfo.operatorId,
      outTradeNo: outTradeNo,
      refundNo: base.formatTime(new Date()).time + base.randomNum(3),
      refundAmount: money,
      refundReason: value || ''
    }
    orderRefund(params).then(res => {
      console.log(res)
      my.hideLoading();
      if (res.code === "SUCCESS") {
      let arrList = [
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'ON', 'ON', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
        { 'cmd': 'addSetLineSpacing', 'args': ['30'] },
        { 'cmd': 'addText', 'args': ['退款订单'] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
             { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`结算店员：${loginInfo.operatorName}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`交易单号：${res.outTradeNo}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`退款单号：${res.refundNo}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`退款日期：${base.strDateFormat(res.time)}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`退款金额：${res.refundAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`退款手续费：${res.refundFee}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`备注：${res.refundReason}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
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
          text: '退款成功',
          success: (r) => {
          }
        });
        my.showToast({
          type: 'success',
          content: '退款成功',
          success: () => {
            my.reLaunch({
              url: '/pages/home/home'
            });
          },
        });
      } else {
        my.ix.speech({
          text: '退款失败',
          success: (r) => {
          }
        });
        my.showToast({
          type: 'fail',
          content: res.msg,
          success: () => {
            my.reLaunch({
              url: '/pages/orderDetail/orderDetail'
            });
          },
        });
      }
    })
  },

  nameInput(e) {
    this.setData({
      userName: e.detail.value
    })
  },

  pasInput(e) {
    this.setData({
      passWord: e.detail.value
    })
  },

  onModalClick() {
    this.setData({
      modalOpened: false
    })
    let { userName, passWord, refund } = this.data
    console.log(userName, passWord, refund)
    if (refund.userName === userName && refund.passWord === passWord) {
      this.onRefund()
    } else {
      my.showToast({
        content: '账号密码不正确',
        redation: '2000'
      })
    }
  },

  onModalClose() {
    this.setData({
      modalOpened: false
    })
  }
});
