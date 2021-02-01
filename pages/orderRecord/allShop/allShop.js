// pages/orderRecord/allShop/allShop.js
import {
  tradeSummaryMerchant,
  groupList,
  trade
} from '../../../api/index.js'

const base = require('../../../utils/util.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: ["门店名称", "昨日实收金额", "今日实收金额"],
    summaryHasMore: true,
    orderIsBottm: false,
    orderingRule: ["昨日销售额降序", "昨日销售额升序", "今日销售额降序", "今日销售额升序", "昨日笔数降序", "昨日笔数升序", "今日笔数降序", "今日笔数升序", "昨日较前日提升率降序", "昨日较前日提升率升序"],
    sortIndex: 0,
    tabIndex: 0,
    shopType: ["门店类型"],
    typeIndex: 0,
    shopLabel: ["标签类型"],
    labelIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    this.setData({
      id: options.id
    })
  },

  //切换标签

  tab(e) {
    console.log(e)
    let {
      tabIndex,
      headOfficeStaff
    } = this.data
    if (headOfficeStaff == 2) {
      this.setData({
        tabIndex: e.currentTarget.id,
        tradeMerchant: '',
        groupIndex: -1
      })
    } else {
      this.setData({
        tabIndex: e.currentTarget.id,
        merchantCodes: "",
        tradeMerchant: '',
        groupIndex: -1
      })
    }
    if (e.currentTarget.id == 0) {
      console.log(this.data.merchantCodes)
      this.orderInit()
    }
    if (e.currentTarget.id == 1) {
      // 分组列表
      if (headOfficeStaff == 2) return
      this.getGroupList()
    }
  },

  // 请求数据

  orderInit(pageNumber, isMore) {
    this.setData({
      istolower: true,
      hasmore: true,
    })
    
    let params = {
      endDate: base.startDate(0, 'yyyyMMdd'),
      beginDate: base.startDate(1, 'yyyyMMdd'),
      // merchantCode: this.data.role == 0 ? "" : app.commonParams('merchantCode'),
      pageNumber: pageNumber || 1,
      beforeYesterday: 1,
      pageSize: 1500
    }
    if (this.data.merchantCodes) {
      params.groupMerchantCodes = this.data.merchantCodes
    }
    if (params.pageNumber == 1) {
      this.setData({
        listloading: true,
      })
    }
    return tradeSummaryMerchant(params)
      .then(res => {
        console.log(res, params, "概要")
        if (isMore) {
          //分页加载更多
          let _tradeMerchant = this.data.tradeMerchant
          _tradeMerchant.statisticsList = this.increaseRate(_tradeMerchant.statisticsList.concat(res.statisticsList))
          _tradeMerchant.pageNumber = res.pageNumber
          let summaryHasMore = (res.pageNumber == _tradeMerchant.totalPage) ? false : true
          this.setData({
            summaryHasMore: summaryHasMore,
            tradeMerchant: _tradeMerchant,
            listloading: false,
            hasmore: summaryHasMore
          })
        } else {
          let summaryHasMore = (res.totalPage > 1) ? true : false
          res.statisticsList = this.increaseRate(res.statisticsList)
          console.log(res)
          this.setData({
            summaryHasMore: summaryHasMore,
            tradeMerchant: res,
            hasmore: summaryHasMore,
            listloading: false
          })
        }
        this.onSort(this.data.sortIndex)
      })
  },

  //交易汇总总计

  getTrade(params, type) {
    // if (this.data.headOfficeStaff == 2){
    //   params.operatorId = app.commonParams('operatorId')
    // }
    trade(params).then(res => {
      //0代表今日、1代表昨日、2代表前日
      if (type == 0) {
        this.setData({
          today: res.statistics
        })
      }
      if (type == 1) {
        this.setData({
          yesterday: res.statistics
        })
      }
      if (type == 2) {
        this.setData({
          before: res.statistics
        })
      }
    })
  },

  //昨日与前日的对比

  increaseRate(data) {
    data.map(item => {
      if (item.beforeYesterdayTradeAmt) {
        item.percent = Number(((item.yesterdayTradeAmt - item.beforeYesterdayTradeAmt) / item.beforeYesterdayTradeAmt * 100).toFixed(2))
        // item.todayTotalTradeAmt
        // item.yesterdayTotalTradeAmt
      } else {
        item.percent = ""
      }
    })
    return data
  },

  // 分页加

  moreSummary() {
    this.setData({
      orderIsBottm: true
    })
    // if(this.data.tabIndex == 0){}
    if (this.data.summaryHasMore) {
      let pageNumber = this.data.tradeMerchant.pageNumber + 1
      this.orderInit(pageNumber, true)
    }
  },

  //分组列表

  getGroupList(params, type) {
    groupList(params).then(res => {
      console.log(res, "分组列表")
    if(res.code == "SUCCESS"){
      let {
        shopType,
        shopLabel,
        headOfficeStaff,
        tabIndex
      } = this.data
      // 0为门店类型、1门店标签、headOfficeStaff总部员工
      if (type == 0 && shopType.length == 1) {
        res.merchantGroupList.map(item => {
          // console.log(item.groupName)
          shopType.push(item.groupName)
        })
        this.setData({
          summaryHasMore: false,
          shopType: shopType
        })
      } else if (type == 1 && shopLabel.length == 1) {
        res.merchantGroupList.map(item => {
          // console.log(item.groupName)
          shopLabel.push(item.groupName)
        })
        // console.log(shopLabel)
        this.setData({
          summaryHasMore: false,
          shopLabel: shopLabel
        })
      } else if (headOfficeStaff == 2) {
        // let i = 1
        // console.log(res.merchantGroupList, i++)
        this.screenGrouping(res.merchantGroupList)
      } else if (tabIndex == 1) {
        this.setData({
          summaryHasMore: false,
          groupList: res.merchantGroupList
        })
      }
    }
    })
  },

  // 查询分组

  getGroupGet(e) {
    let {
      index,
      code
    } = e.target.dataset
    console.log(this.data.groupIndex, index)
    if (this.data.groupIndex == index) {
      this.setData({
        groupIndex: -1
      })
    } else {
      this.setData({
        merchantCodes: code,
        groupIndex: index
      })
      this.orderInit()
    }
  },

  //根据员工ID筛选所属分组
  screenGrouping(groupList) {
    let id = app.commonParams('operatorId'), merchantCodes
    let seekIndex = ""
    if (groupList.length == 1){
      seekIndex = 0
    }else{
      console.log(id)
      seekIndex = groupList.findIndex((item, index) => {
        console.log(item)
        let array = [],
          pitchId = ""
        if (item.employeeIds) {
          array = (item.employeeIds).split(",")
        }
        console.log(array,"获取id")
        if (array.length > 1) {
          let idx = array.findIndex(item => {
            return item == id
          })
          if (idx != -1) {
            console.log(index)
            pitchId = array[index]
            // pitchIndex = index
          }
        } else if (array[0] == id){
            pitchId = array[0]
            // pitchIndex = index
        }
        return pitchId == id
      })
    }
    console.log(groupList, seekIndex,id)
    console.log(groupList[seekIndex].merchantCodes)
    this.setData({
      merchantCodes: groupList[seekIndex].merchantCodes,
      groupList: [groupList[seekIndex]],
      // headOfficeStaff:''
    })
    // console.log(groupList[index])
    this.orderInit()
  },

  //排序

  onSort(index) {
    // console.log(this.data.tradeMerchant.statisticsList, index)
    let sortStatus = ['yesterdayTradeAmt', 'yesterdayTradeAmt', 'todayTradeAmt', 'todayTradeAmt', 'yesterdayOrderCnt', 'yesterdayOrderCnt','todayOrderCnt', 'todayOrderCnt', 'percent', 'percent']
    if (index % 2 == 0) {
      this.setData({
        list: this.data.tradeMerchant.statisticsList.sort(app.base.fallCompare(sortStatus[index])),
      })
    } else {
      this.setData({
        list: this.data.tradeMerchant.statisticsList.sort(app.base.litreCompare(sortStatus[index])),
      })
    }
  },

  //选择排序规则

  orderStatus(e) {
    // console.log(e)
    let index = Number(e.detail.value)
    this.setData({
      sortIndex: index
    })
    this.onSort(index)
  },

  // 切换分组类型

  groupFiltrate(e) {
    // console.log(e, e.currentTarget.id)
    let id = e.currentTarget.id,
      index = Number(e.detail.value),
      {
        shopType,
        shopLabel
      } = this.data
    if (id == 'shopType') {
      this.setData({
        labelIndex: 0,
        typeIndex: index,
        groupIndex: -1,
      })
      if (index == 0) {
        // 分组列表
        this.getGroupList()
      } else {
        // 分组列表 
        this.getGroupList({
          groupName: shopType[index]
        })
      }
    } else if (id == 'shopLabel') {
      this.setData({
        typeIndex: 0,
        labelIndex: index,
        groupIndex: -1,
      })
      if (index == 0) {
        // 分组列表
        this.getGroupList()
      } else {
        // 分组列表
        this.getGroupList({
          groupName: shopLabel[index]
        })
      }
    }
  },

  // 跳转订单流水页

  orderPage(e) {
    console.log(e)
    // 1跳转老板助手2跳转订单
    if (this.data.id == "1") {
      wx.navigateTo({
        url: `/pages/bossAide/board/board?id=${e.currentTarget.id}&name=${e.currentTarget.dataset.name}&sum=${e.currentTarget.dataset.sum}`,
      })
    } else if (this.data.id == "2") {
      wx.navigateTo({
        url: `/pages/orderSing/orderSing?id=${e.currentTarget.id}&name=${e.currentTarget.dataset.name}&sum=${e.currentTarget.dataset.sum}`,
      })
    }else{
      wx.navigateTo({
        url: `/pages/orderRecord/orderRunningWater/orderRunningWater?id=${e.currentTarget.id}&name=${e.currentTarget.dataset.name}`,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 分组列表
    this.getGroupList({
      groupType: 0
    }, 0)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let headOfficeStaff = wx.getStorageSync("login").headOfficeStaff,
     role = wx.getStorageSync("loginData").identity;
    this.setData({
      merchantCode: app.commonParams('merchantCode'),
      headOfficeStaff: headOfficeStaff,
      role: role
    })
    console.log()
    this.getTrade({
      endDate: base.startDate(0, 'yyyyMMdd'),
      beginDate: base.startDate(0, 'yyyyMMdd'),
    }, 0)
    this.getTrade({
      endDate: base.startDate(1, 'yyyyMMdd'),
      beginDate: base.startDate(1, 'yyyyMMdd'),
    }, 1)
    this.getTrade({
      endDate: base.startDate(2, 'yyyyMMdd'),
      beginDate: base.startDate(2, 'yyyyMMdd'),
    }, 2)
    // 分组列表
    this.getGroupList({
      groupType: 1
    }, 1)
    if (headOfficeStaff == 2) {
      this.getGroupList()
    } else {
      this.orderInit()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})