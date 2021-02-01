const base = require('../../utils/util.js')
import { totalBill, shiftlogSave } from '../../servers/api'
Page({
  data: {
    date: "",
    alipayTradeAmt: 0,
    alipayOrderAmt: 0,
    alipayDiscountableAmt: 0,
    alipayRefundAmt: 0,
    wechatOrderAmt: 0,
    wechatTradeAmt: 0,
    wechatDiscountableAmt: 0,
    wechatRefundAmt: 0,
    memberOrderAmt: 0,
    memberActualAmt: 0,
    memberDiscountableAmt: 0,
    memberRefundAmt: 0,
    startTime: "",
    settlementTime: "",
    dataTime: "",
    signInTime:''
  },
  onLoad() {
    my.showLoading({
      content: '查询中...',
    });
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    let date = base.formatTime(new Date()).time
    let timeRecord = my.getStorageSync({ key: "timeRecord" }).data
    console.log(timeRecord, "时间记录")
    let dataTime = ""
    if (timeRecord === null) {
      dataTime = loginInfo.loginTime
    } else {
      dataTime = timeRecord.signOutTime
    }
    let params = {
      merchantCode: loginInfo.merchantCode,
      beginDate: base.formatYearMonthDate(dataTime),
      beginTime: base.formatHHMMSS(dataTime),
      operatorId: loginInfo.operatorId,
      endDate: base.formatYearMonthDate(date),
      endTime: base.formatHHMMSS(date)
    }
    console.log(params)
    this.setData({
      startTime: base.strDateFormat(dataTime),
      settlementTime: base.strDateFormat(date),
      date: date,
      dataTime: dataTime
    })
    this.getTotalBill(params)
    my.hideLoading()
  },

  getTotalBill(params) {
    totalBill(params).then(res => {
      if (res.code === "SUCCESS") {
        let data = res.statistics
        this.setData({
          alipayTradeAmt: data.alipayTradeAmt,
          alipayOrderAmt: data.alipayOrderAmt,
          alipayDiscountableAmt: data.alipayDiscountableAmt,
          alipayRefundAmt: data.alipayRefundAmt,
          wechatOrderAmt: data.wechatOrderAmt,
          wechatTradeAmt: data.wechatTradeAmt,
          wechatDiscountableAmt: data.wechatDiscountableAmt,
          wechatRefundAmt: data.wechatRefundAmt,
          memberOrderAmt: data.memberOrderAmt,
          memberActualAmt: data.memberActualAmt,
          memberDiscountableAmt: data.memberDiscountableAmt,
          memberRefundAmt: data.memberRefundAmt,
        })
      } else {
        my.hideLoading()
        my.showToast({
          type: 'fail',
          content: '查询失败',
          duration: 3000,
        });
      }
    })
  },
  onCancel() {
    my.redirectTo({ url: '../setting/setting' })
  },

  onSettlement() {
    my.showLoading({
      content: '结算中...',
    });
    let { date, dataTime,signInTime } = this.data
    console.log(date,signInTime)
    console.log(dataTime, "1")
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    let judge = my.getStorageSync({ key: 'judge' }).data
    let loginTime = ""
    if (judge) {
      loginTime = judge.loginTime
    }
    let params = {
      merchantCode: loginInfo.merchantCode,
      operatorId:loginInfo.operatorId,
      signInTime:signInTime ||  loginTime || dataTime,
      signOutTime: date
    }
    console.log(params)
    shiftlogSave(params).then(res => {
      console.log(res)
      my.hideLoading()
      if (res.code === 'SUCCESS') {
        my.setStorage({
          key: 'timeRecord',
          data: {
            signInTime:signInTime || dataTime,
            signOutTime: date,
            operatorId: loginInfo.operatorId,
            merchantCode: loginInfo.merchantCode
          },
        });
        my.showToast({
          type: 'success',
          content: '结算成功',
          duration: 2000,
          success: () => {
            my.reLaunch({
              url: '/pages/login/login'
            })
          },
        })
      } else {
        my.showToast({
          type: 'fail',
          content: res.subMsg,
          duration: 2000
        })
      }
    })
  },

  onTimeSelrctor(value) {
     let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    this.setData({
      startTime: base.strDateFormat(value[0]),
      settlementTime: base.strDateFormat(value[1]),
      signInTime:value[0],
      date:value[1]
    })
    let params = {
      merchantCode: loginInfo.merchantCode,
      beginDate: base.formatYearMonthDate(value[0]),
      beginTime: base.formatHHMMSS(value[0]),
      operatorId: loginInfo.operatorId,
      endDate: base.formatYearMonthDate(value[1]),
      endTime: base.formatHHMMSS(value[1])
    }
    console.log(params)
    this.getTotalBill(params)
  },
});
