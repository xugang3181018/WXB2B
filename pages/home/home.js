let app = getApp()
// import * as echarts from '../../ec-canvas/echarts';
import {
  totalBill,
  memberStatistics,
  merchantList,
  accountMoney,
  grossProfit,
  // summaryMerchant
} from '../../servers/api'
const base = require("../../utils/util.js")
var barec = null
Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: function (canvas, width, height) {
        barec = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(barec);
        return barec;
      }
    },
    data: {},
    yesterdayData: {},
    timeData: base.formatTimes(new Date()),
    date1: base.formatTimes(new Date()),
    date2: base.formatTimes(new Date()),
    yesterday: base.formatTimes(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)) //前一天的时间
    ,
    currentData: 0,
    contrastStatus: false,
    singleton: "",
    day: base.getLastDay(),
    difference: "",
    timeStatus: "今日",
    hide: true,
    hideBtn: false,
    count: 0,
    memberContribution: 0,
    mondayData: "",
    tuesdayData: "",
    wednesdayData: "",
    thursdayData: "",
    fridayData: "",
    saturdayData: "",
    weekData: "",
    accountMoney: 0,
    merchantLists: [],
    merchantName: "门店",
    loginInfo: {},
    merchantCode: "",
    grossProfit: "",
    grossRate: "",
    length: "",
    index: 0
  },
  onLoad() {
    let that = this
    wx.getStorage({
      key: "loginInfo",
      success: function (res) {
        that.setData({
          loginInfo: res.data
        })
        that.init(res.data)
      }
    })
  },
  onReady() {
    setTimeout(this.getData, 500);
  },
  //初始换数据
  init(loginInfo) {
    // console.log(loginInfo)
    merchantList({
      appId: loginInfo.merchantCode
    }).then(res => {
      console.log(res.merchantList)
      res.merchantList.splice(0, 0, { merchantName: "全部门店" })
      if (res.code === "SUCCESS") {
        this.setData({
          merchantLists: res.merchantList,
          length: res.merchantList.length,
        })
        // console.log(app.globalData)
        app.globalData.merchantLists = res.merchantList
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'fail',
          duration: 2000
        })
      }
    })
    let {
      date1,
      date2,
      // yesterday,
      day,
    } = this.data
    this.getTotalBill()
    this.increaseMemberStatistics(base.formatDateTime(date1), base.formatDateTime(date2))
    this.getYesterdayData()
    this.getAccountMoney(date1, date2)
  },

  //获取上周每一天的销售额
  getYesterdayData() {
    let { day } = this.data
    for (var i = 0; i < 7; i++) {
      this.getTotalBillData(base.formatDateTime(day[i]), base.formatDateTime(day[i]), i)
    }
  },

  //获取昨日的数据
  getTotalBill() {
    let {
      date1,
      date2,
      yesterday,
      merchantCode
    } = this.data
    console.log(merchantCode)
    let params
    if (merchantCode) {
      params = {
        beginDate: base.formatDateTime(yesterday),
        endDate: base.formatDateTime(yesterday),
        merchantCode: merchantCode
      }
    } else {
      params = {
        beginDate: base.formatDateTime(yesterday),
        endDate: base.formatDateTime(yesterday)
      }
    }
    totalBill(params).then(res => {
      // console.log(res)
      if (res.code === "SUCCESS") {
        let data = res.statistics
        this.setData({
          yesterdayData: data
        })
        this.getTotalBillData(base.formatDateTime(date1), base.formatDateTime(date2))
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'fail',
          duration: 2000
        })
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    let {
      loginInfo
    } = this.data
    this.init(loginInfo)
    setTimeout(this.getData, 500);
    wx.showLoading({
      title: '加载中...'
    });
    setTimeout(function () {
      wx.stopPullDownRefresh() //停止下拉刷新
      wx.hideLoading()
    }, 1000);
  },
  //切换门店

  bindPickerChange(e) {
    // console.log(e)
    let { merchantLists, date1, date2 } = this.data
    let index = e.detail.value
    if (index !== '0') {
      let merchantCode = merchantLists[index].merchantCode
      // console.log(merchantCode)
      this.setData({
        merchantCode: merchantCode,
        index: index
      }, () => {
        this.getAccountMoney(date1, date2)
        // this.getTotalBillData(base.formatDateTime(date1), base.formatDateTime(date2))
        this.getTotalBill()
        this.increaseMemberStatistics(base.formatDateTime(date1), base.formatDateTime(date2))
        this.getGrossProfit()
        this.getYesterdayData()
      })
    } else {
      this.setData({
        merchantCode: "",
        index: index
      }, () => {
        this.getAccountMoney(date1, date2)
        // this.getTotalBillData(base.formatDateTime(date1), base.formatDateTime(date2))
        this.getTotalBill()
        this.increaseMemberStatistics(base.formatDateTime(date1), base.formatDateTime(date2))
        this.getGrossProfit()
        this.getYesterdayData()
      })
    }
  },

  getDate: function (e) {
    // console.log(e.detail)
    let {
      date1,
      date2
    } = this.data
    // this.setData({
    //   yesterdayData: ""
    // })
    if (e.detail.text) {
      let merchantCode = e.detail.text.merchantCode
      this.setData({
        merchantCode: merchantCode
      }, () => {
        this.getAccountMoney(date1, date2)
        // this.getTotalBillData(base.formatDateTime(date1), base.formatDateTime(date2))
        this.getTotalBill()
        this.increaseMemberStatistics(base.formatDateTime(date1), base.formatDateTime(date2))
        this.getGrossProfit()
        this.getYesterdayData()
      })
    } else {
      this.setData({
        merchantCode: ""
      }, () => {
        this.getAccountMoney(date1, date2)
        // this.getTotalBillData(base.formatDateTime(date1), base.formatDateTime(date2))
        this.getTotalBill()
        this.increaseMemberStatistics(base.formatDateTime(date1), base.formatDateTime(date2))
        this.getGrossProfit()
        this.getYesterdayData()
      })
    }
  },
  //折线图标
  getData() {
    let {
      mondayData,
      tuesdayData,
      wednesdayData,
      thursdayData,
      fridayData,
      saturdayData,
      weekData,
      day,
      merchantLists,
      merchantName,
      loginInfo,
      merchantCode
    } = this.data
    // let params = {
    //   beginDate: base.formatDateTime(day[0]),
    //   endDate: base.formatDateTime(day[6])
    // }
    let params = {}
    // console.log(merchantCode)
    if (merchantCode) {
      params = {
        merchantCode,
        beginDate: base.formatDateTime(day[0]),
        endDate: base.formatDateTime(day[6])
      }
    } else {
      if (loginInfo.merchantCode === loginInfo.appId) {
        params = {
          // merchantCode: loginInfo.merchantCode,
          beginDate: base.formatDateTime(day[0]),
          endDate: base.formatDateTime(day[6]),
          trendType: 3
        }
      } else {
        params = {
          merchantCode: loginInfo.merchantCode,
          beginDate: base.formatDateTime(day[0]),
          endDate: base.formatDateTime(day[6]),
          trendType: 3
        }
      }
    }
    totalBill(params).then(res => {
      console.log(res)
      if (res.code === "SUCCESS") {
        let data = res.statistics
        // console.log(data)
        // barec.setOption({
        //   title: {
        //     text: '销售额(元)',
        //     textStyle: { //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
        //       fontSize: 12,
        //     },
        //     left: 20
        //   },
        //   color: ['#84BAED', '#EDE384'],
        //   legend: {
        //     data: ['销售额', '上周平均'],
        //     icon: "circle",
        //     itemWidth: 10, // 设置宽度
        //     itemHeight: 10, // 设置高度
        //     itemGap: 20, // 设置间距
        //     right: 20,
        //   },
        //   grid: {
        //     left: 20,
        //     right: 20,
        //     bottom: 15,
        //     top: 40,
        //     containLabel: true
        //   },
        //   xAxis: [{
        //     type: 'category',
        //     data: [day[0], day[1], day[2], day[3], day[4], day[5], day[6]],
        //     axisLine: {
        //       lineStyle: {
        //         color: '#cccccc'
        //       }
        //     },
        //     axisLabel: {
        //       interval: 0, //这个一定要有，别忘记了
        //       // rotate: 20,
        //       color: "#000000",
        //       textStyle: {
        //         fontSize: 6
        //       }
        //     }
        //   }],
        //   yAxis: [{
        //     type: 'value',
        //     axisTick: {
        //       show: false
        //     },
        //     data: [],
        //     axisLine: {
        //       lineStyle: {
        //         color: '#ffffff'
        //       }
        //     },
        //     axisLabel: {
        //       color: '#000000',
        //       textStyle: {
        //         fontSize: 6
        //       }
        //     }
        //   }],
        //   series: [{
        //     name: '销售额',
        //     type: 'line',
        //     label: {
        //       normal: {
        //         show: true,
        //         color: "#000000"
        //       }
        //     },
        //     data: [mondayData, tuesdayData, wednesdayData, thursdayData, fridayData, saturdayData, weekData],
        //   },
        //   {
        //     name: '上周平均',
        //     type: 'line',
        //     stack: '总量',
        //     symbol: 'circle',
        //     label: {
        //       normal: {
        //         show: true,
        //         color: "#000000",
        //         position: "right"
        //       }
        //     },
        //     data: [((data.totalSettleAmt) / 7).toFixed(2)],
        //   }
        //   ]
        // })
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'fail',
          duration: 2000
        })
      }
    })
  },
  //切换日期查询数据事件
  clickQuery() {
    let {
      date1,
      date2
    } = this.data
    this.getAccountMoney(date1, date2)
    this.getTotalBillData(base.formatDateTime(date1), base.formatDateTime(date2))
    this.increaseMemberStatistics(base.formatDateTime(date1), base.formatDateTime(date2))
    this.getGrossProfit()
    this.setData({
      hideBtn: false,
      currentData: -1,
      timeStatus: "该日期",
      hide: false,
    })
  },
  //获取数据
  getTotalBillData(beginDate, endDate, index) {
    let params = {}
    let {
      merchantCode,
      loginInfo,
      length
    } = this.data
    // console.log(length)
    if (merchantCode) {
      params = {
        merchantCode,
        beginDate,
        endDate
      }
    } else {
      if (loginInfo.merchantCode === loginInfo.appId) {
        params = {
          // merchantCode: loginInfo.merchantCode,
          beginDate,
          endDate
        }
      } else {
        params = {
          merchantCode: loginInfo.merchantCode,
          beginDate,
          endDate
        }
      }

    }
    // console.log(params)
    totalBill(params).then(res => {
      if (res.code === "SUCCESS") {
        let data = res.statistics
        let {
          yesterdayData,
          contrastStatus,
          arr,
        } = this.data
        if (index < 7) {
          // console.log(data)
          switch (index) {
            case 0:
              this.setData({
                mondayData: data.totalSettleAmt
              })
              break;
            case 1:
              this.setData({
                tuesdayData: data.totalSettleAmt
              })
              break;
            case 2:
              this.setData({
                wednesdayData: data.totalSettleAmt
              })
              break;
            case 3:
              this.setData({
                thursdayData: data.totalSettleAmt
              })
              break;
            case 4:
              this.setData({
                fridayData: data.totalSettleAmt
              })
              break;
            case 5:
              this.setData({
                saturdayData: data.totalSettleAmt
              })
              break;
            case 6:
              this.setData({
                weekData: data.totalSettleAmt
              })
          }
          setTimeout(this.getData, 500);
        } else {
          let differences = (data.totalSettleAmt - yesterdayData.totalSettleAmt).toFixed(2)
          if (differences >= 0) {
            this.setData({
              contrastStatus: false
            })
          } else {
            this.setData({
              contrastStatus: true
            })
          }
          this.data.data = data
          console.log(data)
          this.setData({
            data: data,
            difference: Math.abs(differences)
          })
          if (data.totalTradeCnt && data.totalSettleAmt) {
            this.setData({
              singleton: (data.totalSettleAmt / data.totalTradeCnt).toFixed(2),
              memberContribution: ((data.memberTradeAmt / data.totalSettleAmt) * 100).toFixed(2)
            })
          } else {
            this.setData({
              singleton: 0,
              memberContribution: 0,
            })
          }
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 2000
        })
        this.setData({
          data: {}
        })
      }
      if (!index && index !== 0) {
        this.getGrossProfit()
      }
    })
  },
  //获取毛利额数据
  getGrossProfit() {
    let {
      loginInfo,
      merchantCode,
      date1,
      date2,
      data
    } = this.data
    // console.log(data)
    let params = {}
    if (merchantCode) {
      params = {
        appId: loginInfo.appId,
        merchantCode: merchantCode || loginInfo.merchantCode,
        startTime: date1,
        endTime: date2
      }
    } else {
      if (loginInfo.merchantCode === loginInfo.appId) {
        params = {
          appId: loginInfo.appId,
          startTime: date1,
          endTime: date2
        }
      } else {
        params = {
          appId: loginInfo.appId,
          merchantCode: loginInfo.merchantCode,
          startTime: date1,
          endTime: date2
        }
      }
    }

    // console.log(params)  //有意义
    grossProfit(params).then(res => {
      console.log(res)
      if (res.code === "SUCCESS") {
        if (res.result) {
          this.setData({
            grossProfit: (res.result).toFixed(2),
            grossRate: ((res.result / data.totalSettleAmt) * 100).toFixed(2)
          })
        } else {
          this.setData({
            grossProfit: 0,
            grossRate: 0
          })
        }
      }
    })
  },
  //获取到账金额数据
  getAccountMoney(date1, date2) {
    wx.showLoading({
      title: '加载中...'
    });
    let that = this
    let {
      loginInfo,
      merchantCode,
    } = that.data
    let params = {
      merchantCode: merchantCode || loginInfo.merchantCode,
      startSettlementDate: date1,
      endSettlementDate: date2
    }
    accountMoney(params).then(res => {
      console.log(res, params, "到账金额")
      if (res.code === "SUCCESS") {
        if (res.count > "0") {
          that.setData({
            accountMoney: res.settlementInfos[0].amount
          })
        } else {
          that.setData({
            accountMoney: 0
          })
        }
        wx.hideLoading();
      } else {
        wx.hideLoading();
        wx.showToast({
          title: "到账金额" + res.msg,
          icon: "none",
          duration: 3000
        })
        that.setData({
          accountMoney: 0
        })
      }
    })
  },
  //新增会员查询
  increaseMemberStatistics(beginDate, endDate) {
    let params = {}
    let {
      merchantCode
    } = this.data
    // console.log(merchantCode)
    if (merchantCode) {
      params = {
        merchantCode,
        beginDate,
        endDate
      }
    } else {
      params = {
        beginDate,
        endDate
      }
    }
    memberStatistics(params).then(res => {
      // console.log(res)
      if (res.code = "SUCCESS") {
        this.setData({
          count: res.count
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //切换日期
  bindDateChange1(e) {
    console.log(111)
    let { date2 } = this.data
    console.log(date2)
    if (e.detail.value > date2) {
      this.setData({
        date1: e.detail.value,
        date2: e.detail.value,
        hideBtn: true
      })
    } else {
      this.setData({
        date1: e.detail.value,
        hideBtn: true
      })
    }
  },
  bindDateChange2(e) {
    console.log(222)
    this.setData({
      date2: e.detail.value,
      hideBtn: true
    })
  },
  //选项卡切换
  checkCurrent(e) {
    const that = this;
    let {
      yesterday,
      day
    } = this.data
    let myDate = new Date();
    // let params = {}
    let index = e.currentTarget.dataset.current
    if (that.data.currentData === index) {
      return false;
    } else {
      if (index === "0") {
        let date = base.formatTimes(myDate)
        this.setData({
          date1: date,
          date2: date,
          timeStatus: "今日",
          hide: true
        })
        this.getAccountMoney(date, date)
        this.getTotalBillData(base.formatDateTime(date), base.formatDateTime(date))
        this.increaseMemberStatistics(base.formatDateTime(date), base.formatDateTime(date))
        this.getGrossProfit()
      } else if (index === "1") {
        this.setData({
          date1: yesterday,
          date2: yesterday,
          timeStatus: "昨日",
          hide: false,
        })
        this.getAccountMoney(yesterday, yesterday)
        this.getTotalBillData(base.formatDateTime(yesterday), base.formatDateTime(yesterday))
        this.increaseMemberStatistics(base.formatDateTime(yesterday), base.formatDateTime(yesterday))
        this.getGrossProfit()
      } else {
        this.setData({
          date1: day[0],
          date2: day[6],
          timeStatus: "上周",
          hide: false,
        })
        this.getAccountMoney(day[0], day[6])
        this.getTotalBillData(base.formatDateTime(day[0]), base.formatDateTime(day[6]))
        this.increaseMemberStatistics(base.formatDateTime(day[0]), base.formatDateTime(day[6]))
        this.getGrossProfit()
      }
      that.setData({
        currentData: index
      })
    }
  },
  onQuit() {
    wx.reLaunch({
      url: '/pages/login/login'
    })
  }
});