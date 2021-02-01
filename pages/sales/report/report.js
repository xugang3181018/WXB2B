// pages/sales/report/report.js
const moment = require('../../../utils/moment.js')
const app = getApp()
import {
  statisticsApi,
  groupList
} from "./../../../api/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateArr: [], // 展示出来的时间
    momentDate: 1, // 选中的时间
    btmLeft: '15', // 底部下面的动画
    btmWidth: '42', // 底部下面的宽度动画
    showCal: false, // 自定义时间空间是否展示
    reportStatus: 1, // 1 商品销售报表  2  商品分类报表  3 套餐销售报表   4 随心配套餐报表
    statistics: 0, // 统计类型 0商品销售报表 1商品分类报表 4套餐销售报表 5随心配套餐销售报表
    sortList: [{
      sortName: '全部门店',
      id: '-1'
    }],
    sorts: {
      sortName: '全部门店',
      id: '-1'
    },
    reportList: [], // 报表数据展示
    operatorId: "", // 操作人Id。
    currentPage: 1,
    totalCount: 2, // 总页数
    goodsStatistics: [], // 展示的报表数据。
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 
    this.init();
  },

  // 判断核心与否
  async init() {
    let loginInfo = wx.getStorageSync('login');
    this.data.loginInfo = loginInfo;
    // role 0 核心门店
    // role 2 headOfficeStaff = 2  核心员工
    let groupInfo = {},
      sorts = {},
      isChangeSorts = false;

    if (loginInfo.role == 0 || (loginInfo.role == 2 && loginInfo.headOfficeStaff == 2)) {
      isChangeSorts = true
      groupInfo = await this.groupLists(loginInfo.operatorId, loginInfo.headOfficeStaff);
      sorts = this.data.sorts;
    } else {
      isChangeSorts = false
      sorts = {
        sortName: loginInfo.merchantName,
        id: loginInfo.merchantCode
      }
    }
    this.setData({
      sorts,
      isChangeSorts,
    })
    this.getMomentDate(1);
  },


  // 获取时间日期  今天、昨天、本周、本月、上月
  getMomentDate(e) {
    // 1 今天 2 昨天  3本周  4本月 5上月
    let moments = e.currentTarget ? Number(e.currentTarget.dataset.moment) : 1
    let start = moment().subtract('days', 0).format('YYYY-MM-DD');
    let end = moment().subtract('days', 0).format('YYYY-MM-DD');
    let weekOfday = parseInt(moment().format('d'));
    let dateArr = [];
    switch (moments) {
      case 1:
        start;
        end;
        break;
      case 2:
        start = moment().subtract('days', 1).format('YYYY-MM-DD');
        end = moment().subtract('days', 1).format('YYYY-MM-DD');
        break;
      case 3:
        start = moment().subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
        end = moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD')
        break;
      case 4:
        start = moment().add('month', 0).format('YYYY-MM') + '-01'
        end = moment(start).add('month', 1).add('days', -1).format('YYYY-MM-DD')
        break;
      case 5:
        start = moment().subtract('month', 1).format('YYYY-MM') + '-01';
        end = moment(start).subtract('month', -1).add('days', -1).format('YYYY-MM-DD')
        break;
      default:
        start;
        end;
    }
    dateArr.push(start, end)
    this.setData({
      dateArr,
      momentDate: moments
    })
    this.currentPageIdx();
    this.bottomAns();
  },

  // 自定义时间
  changeCalendar(e) {
    let {
      startDate,
      endDate
    } = e.detail;
    let {
      dateArr,
      momentDate
    } = this.data;
    if (startDate) {
      startDate = `${startDate}`;
      endDate = `${endDate}`;
      dateArr.splice(0, 1, startDate);
      dateArr.splice(1, 1, endDate);
      momentDate = 6;
    }
    this.setData({
      dateArr,
      momentDate,
      showCal: false
    })
    this.currentPageIdx();
    this.bottomAns();
  },


  // 动画
  bottomAns() {
    const query = wx.createSelectorQuery().in(this)
    query.select('.date-active').boundingClientRect((res) => {
      let {
        left,
        width
      } = res;
      this.setData({
        btmLeft: `${left}`,
        btmWidth: `${width}`
      })
    }).exec()
  },

  custom() {
    this.setData({
      showCal: true
    })
  },

  //切换门店
  saleSort(e) {
    console.log(e);
    let {
      value
    } = e.detail;
    let {
      sorts,
      sortList
    } = this.data;
    this.setData({
      sorts: sortList[value]
    })
    this.currentPageIdx()
  },

  // 切换报表类型
  changeReportList(e) {
    let index = e.currentTarget ? Number(e.currentTarget.dataset.index) : 1;
    let statistics = 0; // 0商品销售报表 1商品分类报表 4套餐销售报表 5随心配套餐销售报表
    switch (index) {
      case 1:
        statistics = 0;
        break;
      case 2:
        statistics = 1;
        break;
      case 3:
        statistics = 4;
        break;
      case 4:
        statistics = 5;
        break;
      default:
        statistics = 0
    }
    this.setData({
      reportStatus: index,
      statistics
    })
    this.currentPageIdx();
  },

  // 获取分类
  async groupLists(operatorId, headOfficeStaff) {
    let groupMerchantCodes = [],
      groupMerchantName = [],
      merchantCodeList = [],
      merchantNameList = [];
    let sortList = [],
      sorts = {};
    let {
      loginInfo
    } = this.data;
    headOfficeStaff = headOfficeStaff ? headOfficeStaff : loginInfo.headOfficeStaff;
    operatorId = operatorId ? operatorId : loginInfo.operatorId;
    let params = {}
    if (headOfficeStaff == 2) {
      params.employeeId = operatorId
    }
    let res = await groupList(params);
    if (res.code == "SUCCESS") {
      let merchantGroupList = res.merchantGroupList;
      merchantGroupList.map(v => {
        merchantCodeList = v.merchantCodes.split(",")
        merchantNameList = v.merchantNames.split(",")
        groupMerchantCodes = [...new Set([...groupMerchantCodes, ...merchantCodeList])];
        groupMerchantName = [...new Set([...groupMerchantName, ...merchantNameList])];

      })
      if (headOfficeStaff == 2) {
        sorts = {
          sortName: merchantGroupList[0].groupName,
          id: groupMerchantCodes.join(',')
        }
      } else {
        sorts = {
          sortName: "全部门店",
          id: groupMerchantCodes.join(',')
        }
      }
      sortList.push(sorts);
      groupMerchantCodes.forEach((v, idx) => {
        sortList.push({
          sortName: groupMerchantName[idx],
          id: v
        })
      })

      res.groupMerchantCodes = groupMerchantCodes.join(",")
      res.groupMerchantName = groupMerchantName.join(",")
      this.setData({
        sortList,
        sorts
      })
      return res
    } else {
      app.tip(res.msg)
    }
  },

  // 获取报表
  async statistics() {
    // reportStatus: 1, // 1 商品销售报表  2  商品分类报表  3 套餐销售报表   4 随心配套餐报表
    let {
      statistics,
      currentPage,
      dateArr,
      sorts,
      loginInfo,
      goodsStatistics,
      totalCount,
      sortList
    } = this.data;

    if (totalCount < currentPage) return;

    let params = {
      type: statistics,
      currentPage,
      orderType: 2,
      beginTime: `000000`,
      endTime: `235959`,
      pageSize: 20
    }

    params.beginDate = dateArr[0].split("-").join("");
    params.endDate = dateArr[1].split("-").join("");

    if (loginInfo.role == 0 || (loginInfo.role == 2 && loginInfo.headOfficeStaff == 2)) {
      if (sorts.id == sortList[0].id) {
        params.groupMerchantCodes = `${sorts.id}`
      } else {
        params.merchantCode = `${sorts.id}`
      }
    } else {
      params.merchantCode = `${sorts.id}`
    }

    let res = await statisticsApi(params);

    if (res.code == "SUCCESS") {
      res.goodsStatistics = res.goodsStatistics ? res.goodsStatistics : [];
      // if (currentPage == 1) {
      //   goodsStatistics = [...res.goodsStatistics]
      // } else {
        goodsStatistics = [...goodsStatistics, ...res.goodsStatistics];
      // }
      goodsStatistics.map(v => {
        if (v.dopen == undefined) {
          v.dopen = true;
          v.currIndex = null
        }
        if(v.salesProportion) {
          v.salesProportion = `${this.tofixed(v.salesProportion)}%`;
        }
        if(v.totalAmountProportion) {
          v.totalAmountProportion = `${this.tofixed(v.totalAmountProportion)}%`;
        }
        if(v.goodsMaxPrice){
          v.goodsMaxPrice = this.tofixed(v.goodsMaxPrice)
        }
        
        if(v.totalSalesAmount){
          v.totalSalesAmount = this.tofixed(v.totalSalesAmount)
        }
        if(v.totalAmount){
          v.totalAmount = this.tofixed(v.totalAmount)
        }
      })
      if (currentPage <= res.totalCount) {
        currentPage = currentPage + 1;
      }
      this.setData({
        goodsStatistics,
        currentPage,
        totalCount: res.totalCount,
        isLoading: false
      })
    } else {
      this.setData({
        isLoading: false
      })
      app.tip(res.msg);
    }
  },

  tofixed(item){
    return parseFloat(item).toFixed(2)
  },

  toggleDetail(e) {
    let {
      goodsStatistics
    } = this.data;
    let {
      currIndex,
      index
    } = e.detail;
    if (currIndex !== null) {
      goodsStatistics[index].dopen = false
      goodsStatistics[index].currIndex = currIndex
    } else {
      goodsStatistics[index].dopen = true
      goodsStatistics[index].currIndex = null
    }
    this.setData({
      goodsStatistics
    })
  },

  // currentPage 为1；
  currentPageIdx() {
    this.data.currentPage = 1;
    this.data.totalCount = 2;
    this.data.goodsStatistics = [];
    this.setData({
      isLoading: true,
    })
    this.statistics();
  },
  onReachBottom() {
    let {
      totalCount,
      currentPage
    } = this.data;
    if (totalCount >= currentPage) {
      this.statistics();
    }
  },
})