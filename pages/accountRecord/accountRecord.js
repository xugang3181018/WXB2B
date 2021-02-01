let app = getApp()
import { accountLisTarrivalAmount } from '../../api/index.js'

Page({
  data: {
    loading: true,
    status:["待打款","打款成功","打款失败"]
  },
  onLoad(options) {
    this.setData({
      date: {
        startDate: app.base.startDate(7, 'yyyy-MM-dd'),
        endDate: app.base.startDate(0, 'yyyy-MM-dd'),
      }
    })
  },
  onShow() {
    this.accountList()
  },
  toAccountList(e) {
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    wx.setStorageSync("account", this.data.accountList[index])
    wx.navigateTo({
      url: '/pages/accountDetail/accountDetail',
    })
  },
  accountList(date) {
    // return api.accountList({
    //      merchantCode: app.commonParams('merchantCode') 
    //      }).then(res => {

    //     this.setData({
    //         accountList: res.accountList,
    //         loading: false
    //     })
    // })
    wx.showLoading({
      title: '正在查询...',
    })
    let params
    if (date){
      params = {
        merchantCode: app.commonParams('merchantCode'),
        startSettlementDate: date.startDate,
        endSettlementDate: date.endDate
      }
    }else{
      params ={
        merchantCode: app.commonParams('merchantCode'),
        startSettlementDate: app.base.startDate(7, 'yyyy-MM-dd'),
        endSettlementDate: app.base.startDate(0, 'yyyy-MM-dd')
      }
    }
    return accountLisTarrivalAmount(params).then(res => {
      console.log(res,"查询到账金额")
      if(res.code == "SUCCESS"){
        let list = res.settlementInfos
        list.map(item => {
          console.log(app.base.formattingString(item.settlementBankNo))
          item.dateTime = app.base.formatYearMonthDate(item.settlementTime)
          item.settlementBankNo = app.base.formattingString(item.settlementBankNo)
        })
        this.setData({
          accountList: list,
          loading: false
        })
        wx.hideLoading()
      }else{
        wx.hideLoading()
        this.setData({
          accountList:[],
          loading: false
        })
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration: 2000
        })
      }
    })
  },
  otherDate(event) {
    console.log(event)
    this.setData({
      showCal: true
    })
  },
  changeCalendar(e) {
    console.log(e.detail)
    this.setData({
      showCal: false
    })
    if (e.detail.startDate) {
      this.setData({
        date: e.detail
      })
      this.accountList(e.detail)
    }
  },
  closeCal(e) {
    console.log(e)
    this.setData({
      showCal: false
    })
  },
})