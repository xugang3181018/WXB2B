import { billDetail, refundDetail, refundQuery } from '../../servers/api'
const base = require('../../utils/util')
Page({
  data: {
    datas: {},
    createTime: '',
    payTime: '',
    type: {
      WXPAY: '微信支付',
      ALIPAY: '支付宝支付',
      MPAY: '会员支付',
      CASH: '现金支付',
      BANK: 'pos支付'
    },
    payType: '',
    status: {
      NOTPAY: '未支付',
      SUCCESS: '支付成功',
      REFUND: '转入退款',
      CLOSED: '已关闭',
      REVOKED: '已撤销'
    },
    orderStatus: '',
    index: '',
    refundTime: '',
    refundsStatus: '',
    refundType: {
      SUCCESS: '退款成功',
      CLOSE: '退款失败',
      REFUNDING: '退款中'
    },
    refundReason: "",
    refundFee: "",
    refundNo: "",
    refundAmount: "",
    operatorName: ""
  },
  onLoad(option) {
    console.log(option)
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    let params = {
      merchantCode: loginInfo.merchantCode,
      operatorId: loginInfo.operatorId,
      outTradeNo: option.outTradeNo
    }
    if (option.index == "0") {
      billDetail(params).then(res => {
        console.log(res)
        if (res.code === "SUCCESS") {
          this.setData({
            datas: res,
            createTime: base.strDateFormat(res.createTime),
            payTime: base.strDateFormat(res.payTime),
            payType: res.payType,
            orderStatus: res.orderStatus,
            index: option.index
          })
        } else {
          my.showToast({
            type: 'fail',
            content: '查询失败',
            duration: 2000,
          });
        }
      })
    } else {
      params = {
        merchantCode: loginInfo.merchantCode,
        operatorId: loginInfo.operatorId,
        refundNo: option.outTradeNo
      }
      refundQuery(params).then(res => {
         console.log(res)
        if (res.code === "SUCCESS") {
          refundDetail({ outTradeNo: res.outTradeNo }).then(res => {
            if (res.code === "SUCCESS") {
              let data = res.refundDetails[0]
              this.setData({
                outTradeNo: data.outTradeNo,
                refundNo: data.refundNo,
                refundAmount: data.refundAmount,
                operatorName: data.operatorName,
                refundFee: data.refundFee,
                refundTime: base.strDateFormat(data.time),
                refundsStatus: data.refundsStatus,
                refundReason: data.refundReason,
                index: option.index
              })
            } else {
              my.showToast({
                type: 'fail',
                content: '查询失败',
                duration: 2000,
              });
            }
          })
        } else {
          my.showToast({
            type: 'fail',
            content: '查询失败',
            duration: 2000,
          });
        }
      })
    }
  },
    onOrderRefund() {
    my.navigateTo({
      url: `/pages/order_refund/order_refund?money=${this.data.datas.receiptAmount}&outTradeNo=${this.data.datas.outTradeNo}`
    })
  },
  onPrintOrder(){
        let {datas,index,payType,type,operatorName,refundAmount,refundFee,outTradeNo,refundNo,refundTime} = this.data,arrList=[];
        console.log(datas,operatorName)
        if(index != 1){
         arrList = [
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'ON', 'ON', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
        { 'cmd': 'addSetLineSpacing', 'args': ['30'] },
        { 'cmd': 'addText', 'args': [type[payType]] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['3'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`结算店员：${datas.operatorName}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`交易单号：${datas.outTradeNo}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`交易金额：${datas.totalAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`优惠金额：${datas.discountAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`实收金额：${datas.receiptAmount}`] },
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
        }else{
         arrList = [
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'ON', 'ON', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
        { 'cmd': 'addSetLineSpacing', 'args': ['30'] },
        { 'cmd': 'addText', 'args': ['退款订单'] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['3'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
        { 'cmd': 'addText', 'args': [`结算店员：${operatorName || datas.operatorName}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`交易单号：${outTradeNo}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`退款单号：${refundNo}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`退款时间：${refundTime}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`退款金额：${refundAmount}`] },
        { 'cmd': 'addPrintAndLineFeed', 'args': [] },
        { 'cmd': 'addPrintAndFeedLines', 'args': ['2'] },
        { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
        { 'cmd': 'addText', 'args': [`退款手续费：${refundFee || 0}`] },
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
        }

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
  },
  onShow() {
  },
});
