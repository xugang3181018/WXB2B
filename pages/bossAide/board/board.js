// pages/bossAide/board/board.js
var wxCharts = require('../../../utils/wxcharts.js');
let app = getApp()
var ringChart = null;
const {
  trade,
  grossProfit,
  saleStatisticsForApp
} = require('../../../api/index.js')
Page({
  data: {
    date: {
      startDate: app.base.startDate(1, 'yyyy.MM.dd'),
      endDate: app.base.startDate(1, 'yyyy.MM.dd'),
    },
    date1: {
      startDate: app.base.startDate(1, 'yyyy-MM-dd'),
      endDate: app.base.startDate(1, 'yyyy-MM-dd'),
    },
    currentIndex: 0,
    disparity: "与前一日",
    yesterdayData: "",
    lastWeekData: "",
    lastMonthData: "",
    hidden: true,
    orderingRule: ["销售额降序", "销售额升序", "销售量降序", "销售量升序"],
    sortIndex: 0,
    takeOutIndex: 0,
    // sum:''
  },


  onLoad(options) {
    console.log(options.id)
    if (options.name) {
      wx.setNavigationBarTitle({
        title: options.name
      })
    } else {
      wx.setNavigationBarTitle({
        title: app.commonParams('merchantName')
      })
    }
    this.setData({
      merchantCode: options.id || app.commonParams('merchantCode'),
      sum: options.sum
    })
    // 交易汇总数据
    this.getTransactionData({
      merchantCode: this.data.merchantCode,
      beginDate: app.base.startDate(1, 'yyyyMMdd'),
      endDate: app.base.startDate(1, 'yyyyMMdd'),
    })
    // 总毛利
    this.getGrossProfit({
      appId: app.commonParams('appId'),
      merchantCode: this.data.merchantCode,
      startTime: app.base.startDate(1, 'yyyy-MM-dd'),
      endTime: app.base.startDate(1, 'yyyy-MM-dd')
    })
    // 商品销售汇总
    this.getBusinessIncomeStatistics({
      merchantCode: this.data.merchantCode,
      startTime: app.base.startDate(1, 'yyyy-MM-dd'),
      endTime: app.base.startDate(1, 'yyyy-MM-dd'),
      currentPage: 1,
      pageSize: 20
    })
  },
  onReady() {
    // 交易汇总数据，-1昨天的、1这周的、2这个月的
    this.getTransactionData({
      merchantCode: this.data.merchantCode,
      beginDate: app.base.startDate(2, 'yyyyMMdd'),
      endDate: app.base.startDate(2, 'yyyyMMdd')
    }, -1)
    this.getTransactionData({
      merchantCode: this.data.merchantCode,
      beginDate: app.base.getTime(7, 'yyyyMMdd'),
      endDate: app.base.getTime(1, 'yyyyMMdd')
    }, 1)
    this.getTransactionData({
      merchantCode: this.data.merchantCode,
      beginDate: app.base.getLastMonthStartDate('yyyyMMdd')[0],
      endDate: app.base.getLastMonthStartDate('yyyyMMdd')[1]
    }, 2)
  },

  payWayRatio(currentData) {
    console.log(currentData)
    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 25,
      },
      series: [{
        data: currentData.wechatTradeCnt || 0,
        color: '#40BA49'
      }, {
        data: currentData.alipayTradeCnt || 0,
        color: '#40BCFE'
      }, {
        data: currentData.qpTradeCnt || 0,
        color: '#E73228'
      }, {
        data: currentData.memberTradeCnt || 0,
        color: '#FFAB41'
      }, {
        data: currentData.posTradeCnt || 0,
        color: '#FF6565'
      }, {
        data: currentData.cashTradeCnt || 0,
        color: '#FF7538'
      }],
      // 饼图里的白色分割线
      disablePieStroke: true,
      width: 180,
      height: 180,
      dataLabel: false,
      legend: false,
      background: '#ffffff',
    });
  },

  //选择日期事件

  checkCurrent(e) {
    console.log(e)
    this.setData({
      currentIndex: e.currentTarget.id,
      hidden: true
    })
    let startDate, endDate
    switch (e.currentTarget.id) {
      case "0":
        startDate = app.base.startDate(1, 'yyyy.MM.dd')
        this.setData({
          disparity: "与上一日",
          date: {
            startDate: startDate,
            endDate: startDate
          },
          date1: {
            startDate: app.base.startDate(1, 'yyyy-MM-dd'),
            endDate: app.base.startDate(1, 'yyyy-MM-dd')
          }
        })
        // 交易汇总数据
        this.getTransactionData({
          merchantCode: this.data.merchantCode,
          beginDate: app.base.startDate(1, 'yyyyMMdd'),
          endDate: app.base.startDate(1, 'yyyyMMdd'),
        }, false, -1)
        // 总毛利
        this.getGrossProfit({
          appId: app.commonParams('appId'),
          merchantCode: this.data.merchantCode,
          startTime: app.base.startDate(1, 'yyyy-MM-dd'),
          endTime: app.base.startDate(1, 'yyyy-MM-dd')
        })
        // 商品销售汇总
        this.getBusinessIncomeStatistics({
          merchantCode: this.data.merchantCode,
          startTime: app.base.startDate(1, 'yyyy-MM-dd'),
          endTime: app.base.startDate(1, 'yyyy-MM-dd'),
          currentPage: 1,
          pageSize: 20
        })
        break;
      case "1":
        startDate = app.base.getMondayDate('yyyy.MM.dd'),
          endDate = app.base.startDate(0, 'yyyy.MM.dd')
        this.setData({
          disparity: "与上周",
          date: {
            startDate,
            endDate: endDate
          },
          date1: {
            startDate: app.base.getMondayDate("yyyy-MM-dd"),
            endDate: app.base.startDate(0, 'yyyy-MM-dd')
          }
        })
        // 交易汇总数据
        this.getTransactionData({
          merchantCode: this.data.merchantCode,
          beginDate: app.base.getMondayDate("yyyyMMdd"),
          endDate: app.base.startDate(0, 'yyyyMMdd'),
        }, false, 1)
        // 总毛利
        this.getGrossProfit({
          appId: app.commonParams('appId'),
          merchantCode: this.data.merchantCode,
          startTime: app.base.getMondayDate("yyyy-MM-dd"),
          endTime: app.base.startDate(0, 'yyyy-MM-dd')
        })
        // 商品销售汇总
        this.getBusinessIncomeStatistics({
          merchantCode: this.data.merchantCode,
          startTime: app.base.getMondayDate("yyyy-MM-dd"),
          endTime: app.base.startDate(0, 'yyyy-MM-dd'),
          currentPage: 1,
          pageSize: 20
        })
        break;
      case "2":
        const date = new Date();
        date.setDate(1);
        startDate = app.base.formatDate(date.getTime(), 'yyyy.MM.dd'),
          endDate = app.base.startDate(0, 'yyyy.MM.dd')
        this.setData({
          disparity: "与上月",
          date: {
            startDate,
            endDate: endDate
          },
          date1: {
            startDate: app.base.formatDate(date.getTime(), "yyyy-MM-dd"),
            endDate: app.base.startDate(0, 'yyyy-MM-dd')
          }
        })
        // 交易汇总数据
        this.getTransactionData({
          merchantCode: this.data.merchantCode,
          beginDate: app.base.formatDate(date.getTime(), "yyyyMMdd"),
          endDate: app.base.startDate(0, 'yyyyMMdd'),
        }, false, 2)
        // 总毛利
        this.getGrossProfit({
          appId: app.commonParams('appId'),
          merchantCode: this.data.merchantCode,
          startTime: app.base.formatDate(date.getTime(), "yyyy-MM-dd"),
          endTime: app.base.startDate(0, 'yyyy-MM-dd')
        })
        // 商品销售汇总
        this.getBusinessIncomeStatistics({
          merchantCode: this.data.merchantCode,
          startTime: app.base.formatDate(date.getTime(), "yyyy-MM-dd"),
          endTime: app.base.startDate(0, 'yyyy-MM-dd'),
          currentPage: 1,
          pageSize: 20
        })
        break;
    }
  },

  // 烟和非烟的切换
  onTakeOutForm(e) {
    console.log(e)
    this.setData({
      takeOutIndex: e.currentTarget.id
    })
    this.getBusinessIncomeStatistics({
      merchantCode: this.data.merchantCode,
      startTime: this.data.date1.startDate,
      endTime: this.data.date1.endDate,
      currentPage: 1,
      pageSize: 20
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
      showCal: false,
      hidden: false,
      date1: e.detail
    })
    let startDate = app.base.amendDateFormat(e.detail.startDate)
    let endDate = app.base.amendDateFormat(e.detail.endDate)
    let date = {
      startDate,
      endDate
    }
    if (e.detail.startDate) {
      this.setData({
        date: date,
        currentIndex: -1
      })
      // 交易汇总数据
      this.getTransactionData({
        merchantCode: this.data.merchantCode,
        beginDate: app.base.formatDate(e.detail.startDate, "yyyyMMdd"),
        endDate: app.base.formatDate(e.detail.endDate, "yyyyMMdd"),
      })
      // 总毛利
      this.getGrossProfit({
        appId: app.commonParams('appId'),
        merchantCode: this.data.merchantCode,
        startTime: e.detail.startDate,
        endTime: e.detail.endDate
      })
      // 商品销售汇总
      this.getBusinessIncomeStatistics({
        merchantCode: this.data.merchantCode,
        startTime: e.detail.startDate,
        endTime: e.detail.endDate,
        currentPage: 1,
        pageSize: 20
      })
    }
  },

  // 获取交易汇总统计数据

  getTransactionData(params, type, status) {
    wx.showLoading({
      title: '加载中',
    })
    let { sum } = this.data
    if (sum) {
      params = JSON.parse(JSON.stringify(params).replace(/merchantCode/g, "groupMerchantCodes"));
    }
    trade(params).then(res => {
      console.log(params, res)
      if (res.code == "SUCCESS") {
        if (!type) {
          // if (res.statisticsList && res.statisticsList.length == 1) {
          let data = res.statistics
          console.log(data.totalTradeAmt.toString().length, data, "交易汇总数据")
          this.setData({
            currentData: data,
            totalTradeAmt: data.totalTradeAmt.toString(),
            totalTradeCnt: data.totalTradeCnt,
          }, () => {
            this.payWayRatio(data)
          })
          if (data.totalTradeCnt) {
            this.setData({
              unitPrice: (data.totalTradeAmt / data.totalTradeCnt).toFixed(2),
            })
          } else {
            this.setData({
              unitPrice: 0,
            })
          }
        } else {
          if (type == -1) {
            this.setData({
              yesterdayData: res.statistics
            })
          } else if (type == 1) {
            this.setData({
              lastWeekData: res.statistics
            })
          } else if (type == 2) {
            this.setData({
              lastMonthData: res.statistics
            })
          }
        }
      }
      this.turnoverDifference(status)
      wx.hideLoading()
    })
  },

  // 获取总的毛利额数据

  getGrossProfit(params) {
    let { sum } = this.data
    if (sum) {
      params = JSON.parse(JSON.stringify(params).replace(/merchantCode/g, "groupMerchantCodes"));
    }
    grossProfit(params).then(res => {
      console.log(res)
      if (res.code == "SUCCESS") {
        if (res.result) {
          this.setData({
            result: res.result
          })
        } else {
          this.setData({
            result: '--'
          })
        }
      }
    })
  },

  //与上周或上月得营业额差别

  turnoverDifference(status = -1) {
    console.log(status)
    let currentData = this.data.currentData,
      yesterdayData = this.data.yesterdayData,
      lastWeekData = this.data.lastWeekData,
      lastMonthData = this.data.lastMonthData
    // 1与上周的、2与上月的、-1与上日的
    let totalTradeAmt = currentData.totalTradeAmt,
      totalTradeCnt = currentData.totalTradeCnt,
      yesterdayTotalTradeAmt = yesterdayData.totalTradeAmt,
      yesterdayTotalTradeCnt = yesterdayData.totalTradeCnt,
      lastWeekTotalTradeAmt = lastWeekData.totalTradeAmt,
      lastWeekTotalTradeCnt = lastWeekData.totalTradeCnt,
      lastMonthTotalTradeAmt = lastMonthData.totalTradeAmt,
      lastMonthTotalTradeCnt = lastMonthData.totalTradeCnt
    if (status == 1) {
      this.setData({
        money: Math.abs(totalTradeAmt - lastWeekTotalTradeAmt).toFixed(2),
        moneyStatus: (totalTradeAmt - lastWeekTotalTradeAmt).toFixed(2),
        cnt: Math.abs(totalTradeCnt - lastWeekTotalTradeCnt).toFixed(2),
        cntStatus: (totalTradeCnt - lastWeekTotalTradeCnt).toFixed(2)
      })
      if (totalTradeCnt) {
        if (lastWeekTotalTradeCnt) {
          this.setData({
            yesterdayUnitPrice: Math.abs((totalTradeAmt / totalTradeCnt) - (lastWeekTotalTradeAmt / lastWeekTotalTradeCnt)).toFixed(2),
            unitPriceStatus: (totalTradeAmt / totalTradeCnt) - (lastWeekTotalTradeAmt / lastWeekTotalTradeCnt).toFixed(2)
          })
        } else {
          this.setData({
            yesterdayUnitPrice: Math.abs(((totalTradeAmt / totalTradeCnt) - 0).toFixed(2)),
            unitPriceStatus: ((totalTradeAmt / totalTradeCnt) - 0).toFixed(2)
          })
        }
      } else {
        if (lastWeekTotalTradeCnt) {
          this.setData({
            yesterdayUnitPrice: Math.abs((0 - (lastWeekTotalTradeAmt / lastWeekTotalTradeCnt)).toFixed(2)),
            unitPriceStatus: (0 - (lastWeekTotalTradeAmt / lastWeekTotalTradeCnt)).toFixed(2)
          })
        }
        this.setData({
          yesterdayUnitPrice: 0,
          unitPriceStatus: 0
        })
      }
    } else if (status == 2) {
      this.setData({
        money: Math.abs(totalTradeAmt - lastMonthTotalTradeAmt).toFixed(2),
        moneyStatus: (totalTradeAmt - lastMonthTotalTradeAmt).toFixed(2),
        cnt: Math.abs(totalTradeCnt - lastMonthTotalTradeCnt).toFixed(2),
        cntStatus: (totalTradeCnt - lastMonthTotalTradeCnt).toFixed(2)
      })
      if (totalTradeCnt) {
        if (lastMonthTotalTradeCnt) {
          console.log(Math.abs((totalTradeAmt / totalTradeCnt) - (lastMonthTotalTradeAmt / lastMonthTotalTradeCnt)).toFixed(2))
          this.setData({
            yesterdayUnitPrice: Math.abs((totalTradeAmt / totalTradeCnt) - (lastMonthTotalTradeAmt / lastMonthTotalTradeCnt)).toFixed(2),
            unitPriceStatus: ((totalTradeAmt / totalTradeCnt) - (lastMonthTotalTradeAmt / lastMonthTotalTradeCnt)).toFixed(2)
          })
        } else {
          this.setData({
            yesterdayUnitPrice: Math.abs(((totalTradeAmt / totalTradeCnt) - 0).toFixed(2)),
            unitPriceStatus: ((totalTradeAmt / totalTradeCnt) - 0).toFixed(2)
          })
        }
      } else {
        if (lastMonthTotalTradeCnt) {
          this.setData({
            yesterdayUnitPrice: Math.abs((0 - (lastMonthTotalTradeAmt / lastMonthTotalTradeCnt)).toFixed(2)),
            unitPriceStatus: (0 - (lastMonthTotalTradeAmt / lastMonthTotalTradeCnt)).toFixed(2)
          })
        } else {
          this.setData({
            yesterdayUnitPrice: 0,
            unitPriceStatus: 0
          })
        }
      }
    } else if (status == -1) {
      this.setData({
        money: Math.abs((totalTradeAmt - yesterdayTotalTradeAmt).toFixed(2)),
        moneyStatus: (totalTradeAmt - yesterdayTotalTradeAmt).toFixed(2),
        cnt: Math.abs((totalTradeCnt - yesterdayTotalTradeCnt).toFixed(2)),
        // cnt: Math.abs((currentData.totalTradeCnt - yesterdayData.totalTradeCnt).toFixed(2)),
        cntStatus: (totalTradeCnt - yesterdayTotalTradeCnt).toFixed(2)
      })
      if (totalTradeCnt) {
        if (yesterdayTotalTradeCnt) {
          console.log(Math.abs(((totalTradeAmt / totalTradeCnt) - (yesterdayTotalTradeAmt / yesterdayTotalTradeCnt)).toFixed(2)))
          this.setData({
            yesterdayUnitPrice: Math.abs(((totalTradeAmt / totalTradeCnt) - (yesterdayTotalTradeAmt / yesterdayTotalTradeCnt)).toFixed(2)),
            unitPriceStatus: ((totalTradeAmt / totalTradeCnt) - (yesterdayTotalTradeAmt / yesterdayTotalTradeCnt)).toFixed(2)
          })
        } else {
          this.setData({
            yesterdayUnitPrice: Math.abs(((totalTradeAmt / totalTradeCnt) - 0).toFixed(2)),
            unitPriceStatus: ((totalTradeAmt / totalTradeCnt) - 0).toFixed(2)
          })
        }
      } else {
        if (yesterdayTotalTradeCnt) {
          this.setData({
            yesterdayUnitPrice: Math.abs((0 - (yesterdayTotalTradeAmt / yesterdayTotalTradeCnt)).toFixed(2)),
            unitPriceStatus: (0 - (yesterdayTotalTradeAmt / yesterdayTotalTradeCnt)).toFixed(2)
          })
        } else {
          this.setData({
            yesterdayUnitPrice: 0,
            unitPriceStatus: 0
          })
        }
      }
    }
  },

  // 商品销售汇总

  getBusinessIncomeStatistics(params, isMore) {
    wx.showLoading({
      title: '加载中',
    })
    let { sum, takeOutIndex } = this.data
    if (sum) {
      params = JSON.parse(JSON.stringify(params).replace(/merchantCode/g, "groupMerchantCodes"));
    }
    console.log(params)
    params.cigaretteCategory = takeOutIndex
    saleStatisticsForApp(params).then(res => {
      wx.hideLoading()
      console.log(res, "商品销售汇总")
      if (res.result.items) {
        this.setData({
          istolower: true,
          hasmore: true
        })
      } else {
        hasmore: false
      }
      if (isMore) {
        //分页加载更多
        let _tradeMerchant = this.data.orderList
        _tradeMerchant.items = _tradeMerchant.items.concat(res.result.items)
        _tradeMerchant.currentPage = res.result.currentPage
        console.log()
        let summaryHasMore = (res.result.pageCount == _tradeMerchant.currentPage) ? false : true
        this.setData({
          summaryHasMore: summaryHasMore,
          orderList: _tradeMerchant,
          // list: _tradeMerchant.items.sort(app.base.fallCompare('salesCnt')),
          istolower: true,
          hasmore: summaryHasMore
        })
        wx.hideLoading()
      } else {
        console.log(res.result.pageCount)
        if (!res.result.items) {
          this.setData({
            istolower: false
          })
        }
        let summaryHasMore = (res.result.pageCount > 1) ? true : false
        this.setData({
          summaryHasMore: summaryHasMore,
          orderList: res.result,
          // list: res.result.items.sort(app.base.fallCompare('salesCnt')),
          hasmore: summaryHasMore
        })
        // wx.hideLoading()
      }
      this.onSort(this.data.sortIndex)
    })
  },

  // 分页加

  moreSummary() {
    this.setData({
      orderIsBottm: true
    })
    if (this.data.summaryHasMore) {
      let params = {
        merchantCode: this.data.merchantCode,
        startTime: this.data.date1.startDate,
        endTime: this.data.date1.endDate,
        currentPage: this.data.orderList.currentPage + 1,
        pageSize: 20
      }
      // 商品销售汇总
      this.getBusinessIncomeStatistics(params, true)
    }
  },

  //选择排序规则

  orderStatus(e) {
    console.log(e.detail.value)
    let index = Number(e.detail.value)
    this.setData({
      sortIndex: index,
    })
    this.onSort(index)
  },

  //排序

  onSort(index) {
    if (!this.data.orderList.items) return
    switch (index) {
      case 0:
        this.setData({
          list: this.data.orderList.items.sort(app.base.fallCompare('salesAmt')),
        })
        break;
      case 1:
        this.setData({
          list: this.data.orderList.items.sort(app.base.litreCompare('salesAmt')),
        })
        break;
      case 2:
        this.setData({
          list: this.data.orderList.items.sort(app.base.fallCompare('salesCnt')),
        })
        break;
      case 3:
        this.setData({
          list: this.data.orderList.items.sort(app.base.litreCompare('salesCnt')),
        })
        break;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },
})