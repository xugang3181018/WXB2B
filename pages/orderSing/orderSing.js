const base = require('../../utils/util.js')
import {
  bill,
  billAll,
  tradeSummaryMerchant,
  trade
} from '../../api/index.js'
let app = getApp()

Page({
  data: {
    isPageLoad: true,
    orderIsBottm: false,
    orderHasMore: true,
    searchParmas: {},
    cancelSearch: true,
    payIndex: 0,
    orderIndex: 0,
    orderStatus: {
      'NOTPAY': '未支付',
      'SUCCESS': '已支付 ',
      'REFUND': '已退款',
      'CLOSED': '已关闭',
      'REVOKED': '已撤销',
      'PAYERROR': '失败'
    },
    orderStatusSel: ['全部支付状态', '未支付', '已支付', '已退款', '已关闭', '已撤销'],
    payTypeSel: ['全部支付方式', '微信', '支付宝 ', '会员', '云闪付', 'POS', '现金'],
    payType: {
      WXPAY: '微信',
      ALIPAY: '支付宝 ',
      MPAY: '会员',
      UNIONPAY: '云闪付',
      BANK: 'POS',
      CASH: '现金',
    }
  },
  onLoad(options) {
    this.setData({
      merchantCode: options.id || app.commonParams('merchantCode'),
      role: app.commonParams('role'),
      sum: options.sum
    })
    this.setData({
      orderIndex: 2,
      searchParmas: {
        orderStatus: "SUCCESS"
      }
    })
  },
  summaryParmas() {
    let { sum,merchantCode } = this.data
    let {headOfficeStaff,role,operatorId} = wx.getStorageSync("login")
    console.log(headOfficeStaff,',',role,operatorId)
    let parmas ={
      endDate: base.startDate(0, 'yyyyMMdd'), //new Date().Format('yyyyMMddhhmmss'),
      beginDate: base.startDate(0, 'yyyyMMdd'),
      merchantCode: this.data.merchantCode
    }
    if(headOfficeStaff != 2 && role == 2){
			parmas.operatorId = operatorId
		}
    if (sum) {
      parmas = JSON.parse(JSON.stringify(parmas).replace(/merchantCode/g, "groupMerchantCodes"));
    }
    return parmas
  },
  billParmas() {
    let { sum, searchParmas, merchantCode } = this.data
    let {headOfficeStaff,role,operatorId} = wx.getStorageSync("login")
    let parmas = {
      pageNumber: 1,
      pageSize: 20,
      billEndTime: base.startDate(0, 'yyyyMMddhhmmss'),
      billBeginTime: base.startDate(15, 'yyyyMMddhhmmss'),
      merchantCode:merchantCode
    }
    if(headOfficeStaff != 2 && role == 2){
			parmas.operatorId = operatorId
		}
    if (sum) {
      parmas = JSON.parse(JSON.stringify(parmas).replace(/merchantCode/g, "groupMerchantCodes"));
    }
    // if (role == 1) {
    //   parmas.operatorId = app.commonParams("operatorId")
    // }
    let _parmas = Object.assign(parmas,searchParmas)
    return _parmas
  },
  getBill(arg) {
    function toDate(bill) {
      if (bill) {
        let str = bill.orderDetails
        for (let i in str) {
          if (str[i].payTime) {
            str[i].payTime = base.strDateFormat(str[i].payTime)
          }
        }
      }
    }

    if (arg.isSelect) {
      this.setData({
        searchLoad: true
      })
    }
    //获取账单
    let summary = () => {
      return trade(arg.summaryParmas)
        .then(res => {
          console.log(res)
          this.setData({
            summary: res.statistics
          },()=>{
            console.log(this.data.summary)
          })
        })
    }
    let bills = () => {
      // return bill(arg.billParmas)
      return billAll(arg.billParmas)
        .then(res => {
          console.log(res, arg.billParmas)
          if (arg.isMore) {
            let bill = this.data.bill
            bill.orderDetails = bill.orderDetails.concat(res.orderDetails)
            bill.pageNumber = res.pageNumber
            let orderHasMore = (res.pageNumber == bill.totalPage) ? false : true
            toDate(bill)
            this.setData({
              bill: bill,
              isPageLoad: false,
              orderHasMore: orderHasMore,
              role: 3
            })
          } else {
            let orderHasMore = (res.totalPage > 1) ? true : false
            let bill = res.code != 'FAILED' ? res : null
            toDate(bill)
            this.setData({
              bill: bill,
              isPageLoad: false,
              orderHasMore: orderHasMore,
              searchLoad: false
            })
          }
        })
    }

    if (arg.isMore || arg.isSelect) {
      bills(arg.parmas)
    } else {
      summary()
        .then(res => {
          bills(arg.parmas)
        })
    }
  },
  moreBill(e) {
    this.setData({
      orderIsBottm: true
    })
    if (this.data.orderHasMore) {
      let billParmas = this.billParmas()
      billParmas.pageNumber = this.data.bill.pageNumber + 1
      console.log(billParmas)
      this.getBill({
        isMore: true,
        billParmas: billParmas
      })
    }
  },
  orderStatus(e) {
    this.setData({
      [e.target.id]: e.detail.value,
      orderIsBottm: false,
    })

    function getValues(arr) {
      let ars = []
      for (let i in arr) {
        ars.push(i)
      }
      return ars[Number(e.detail.value) - 1]
    }
    let searchParmas = this.data.searchParmas
    if (e.detail.value == 0) {
      if (e.target.id == 'orderIndex') {
        delete searchParmas.orderStatus
      } else if (e.target.id == 'payIndex') {
        delete searchParmas.payType
      }
    } else {
      if (e.target.id == 'orderIndex') {
        console.log(getValues(this.data.orderStatus))
        searchParmas.orderStatus = getValues(this.data.orderStatus)
      } else if (e.target.id == 'payIndex') {
        searchParmas.payType = getValues(this.data.payType)
      }
    }
    this.setData({
      searchParmas: searchParmas
    })
    let billParmas = this.billParmas()
    this.getBill({
      isSelect: true,
      billParmas: billParmas
    })
  },
  normalSearch(e) {
    this.setData({
      searchValue: "",
      cancelSearch: true,
      showSearch: false,
      searchParmas: wx.getStorageSync("tempSearchParmas"),
    })
    this.getBill({
      billParmas: this.billParmas(),
      summaryParmas: this.summaryParmas()
    })

  },
  toggleSearch(e) {
    this.setData({
      showSearch: true
    })
  },
  //订单搜索
  searchOrder(e) {
    this.setData({
      orderIsBottm: false
    })
    if (e.detail.value != '') {
      wx.setStorageSync("tempSearchParmas", this.data.searchParmas)
      this.setData({
        searchParmas: {}
      })
      let billParmas = this.billParmas()
      billParmas.outTradeNo = e.detail.value
      this.getBill({
        billParmas: billParmas,
        isSelect: true
      })
    } else {
      wx.showToast({
        title: '请输入搜索订单号',
      })
    }
  },
  viewDetail(e) {
    let outTradeNo = e.currentTarget.dataset.detail.outTradeNo
    wx.setStorageSync("orderDetail", e.currentTarget.dataset.detail)
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?merchantCode=${this.data.merchantCode}&outTradeNo=${outTradeNo}`
    })
  },
  onShow() {
    this.getBill({
      billParmas: this.billParmas(),
      summaryParmas: this.summaryParmas()
    })
  }
})