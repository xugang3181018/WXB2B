import { tradeMerchant, trade, merchantList, terminal, merchant, recharge, tradeOperator, newMemberCount, couponConsumeRecordList, couponConsumeCount, employeeList, couponConsumeList,groupList,groupGet} from '../../api/index.js'
const base = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    loading: true,
    srcollLoading: false,
    reportTab: 1, 
    reportDate: null,
    reportDateFormat: null,
    disNext: true,
    navBar: null,
    currentCheck: 0,
    currentCat: 0,
    istolower: false,
    countState: true,
    istoupper: false,
    recordList: [],
    hasmore: true,
    couponPage: 0,
    lineWidth: app.systemInfo.windowWidth,
    r: ['0总部 ', '1门店 ', '2员工 ', '3店长']
  },
  onLoad(options) {
    app.checkLogin()
    const nowDate = new Date()
    try {
      // let role = app.commonParams('role')
      // let headOfficeStaff = wx.getStorageSync("login").headOfficeStaff
      let {headOfficeStaff,role,operatorId} = wx.getStorageSync("login")
      console.log(headOfficeStaff,role,wx.getStorageSync("login"))
      this.setData({
        reportDate: this.lessDate('yyyyMMdd'),
        tradeDateValue: this.lessDate('yyyy-MM-dd'),
        taday: this.lessDate('yyyy-MM-dd'),
        yestaday: this.lessDate('yyyy-MM-dd'),
        couponDate: this.setCouponDate(7),
        couponDates: {
          beginTime: this.lessDate('yyyy-MM-dd', 7),
          endTime: this.lessDate('yyyy-MM-dd'),
        },
        role, //role  0总部 1门店 2员工 3店长,
        headOfficeStaff,  //员工标识
        navBar: role === 0 ? ['营业统计', '会员统计'] : ['营业统计', '会员统计', '核销统计'],
        headTitle: app.commonParams('merchantName'),
        ...app.systemInfo,
        hasmore:headOfficeStaff !=2 && role == 2?false:true
      })
    } catch (error) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },
  lessDate(type, days) {
    const nowDate = new Date()
    return base.formatDate(nowDate.getTime() - base.dayValue * (days || 0), type)
  },
  toggleCount() {
    this.setData({
      countState: !this.data.countState
    })
  },
  reportparams(date) {
    return this.data.searchDate ? this.data.searchDate : {
      beginDate: date,
      endDate: date
    }
  },

  getReport(reportDate) {
    let login = wx.getStorageSync("login")
    let params = this.reportparams(reportDate)
    this.setData({
      srcollLoading: true,
      tolowerEvent: ""
    })
    let role = this.data.role
    if (role == 0){
      role = ""
    }
    //0总部 1门店 2员工 3店长
    let roles = role || app.commonParams('role')
    console.log(role, this.data.role,)
    switch (roles) {
      case 0:
        console.log("总部:::::")
        // params.merchantCode = wx.getStorageSync("selStoreCode") || app.commonParams('merchantCode')
        //获取门店
        let groupId="",_merchantList=[];
        groupList({
          employeeId:Number(app.commonParams('operatorId'))
        }).then(res=>{
          console.log(res,"分组列表")
          if(res.code == "FAILED" || res.merchantGroupList.length >1){
            groupId = 0
          }else{
            groupId = res.merchantGroupList[0].groupId
            params.groupMerchantCodes = res.merchantGroupList[0].merchantCodes
          }
          console.log(groupId,params)
          let report = [trade(params),
            tradeMerchant(params),
            merchantList({}),
            recharge(params),
            newMemberCount(params),
            terminal(params),
            merchant(params),
            groupGet({groupId})
          ]
          Promise.all(report).then(res => {
            console.log(res,params,"全部请求数据",res[1])
            let store = groupId?res[7].merchantList: res[2].merchantList
            let recharge = res[3].rechargeStatistics
            var terminal = (res[5].code != 'FAILED') ? res[5].statistics : null
            store.unshift({
              merchantName: '全部门店'
            })
            this.setData({
              groupId,
              loading: false,
              trade: res[0].statistics,
              department:res[1],
              memberCount: res[4].count,
              srcollLoading: false,
              store,
              terminal,
              recharge,
              selStore: this.data.selStore || 0,
            })
          })
        })
        break
      case 1:
        console.log("门店:::::")
        params.merchantCode = wx.getStorageSync("selStoreCode") || app.commonParams('merchantCode')
        Promise.all(
					[trade(params),
          tradeOperator(params),
          recharge(params),
          newMemberCount(params),
          terminal(params),
          merchant(params)
        ]).then(res => {
          let cashier = (res[1].code != 'FAILED') ? res[1] : null,
            trade = (res[0].code != 'FAILED') ? res[0].statistics : null,
            recharge = res[2].rechargeStatistics,
            terminal = (res[4].code != 'FAILED') ? res[4].statisticsList : null
          this.setData({
            loading: false,
            trade,
            cashier,
            srcollLoading: false,
            recharge,
            terminal,
            memberCount: res[3].count,
            department: null
          })
        })
        break
      case 2:
        console.log("员工:::::::")
        params.merchantCode = app.commonParams('merchantCode')
        params.operatorId = app.commonParams('operatorId')

        Promise.all([trade(params),
          tradeOperator(params),
          recharge(params),
          newMemberCount(params),
          terminal(params),
          merchant(params)
        ]).then(res => {
          let cashier = (res[1].code != 'FAILED') ? res[1] : null,
            trade = (res[0].code != 'FAILED') ? res[0].statistics : null,
            recharge = res[2].rechargeStatistics,
            terminal = (res[4].code != 'FAILED') ? res[4].statisticsList : null
          this.setData({
            trade,
            cashier,
            recharge,
            terminal,
            memberCount: res[3].count,
            srcollLoading: false,
            loading: false,
            department: null
          })
        })
        break
      case 3:
        console.log("店长角色:::::")
        console.log("员工:::::::")
        params.merchantCode = app.commonParams('merchantCode')
        // params.operatorId = app.commonParams('operatorId')
        Promise.all([trade(params),
          tradeOperator(params),
          recharge(params),
          newMemberCount(params),
          terminal(params),
          merchant(params)
        ]).then(res => {
          let cashier = (res[1].code != 'FAILED') ? res[1] : null,
            trade = (res[0].code != 'FAILED') ? res[0].statistics : null,
            recharge = res[2].rechargeStatistics,
            terminal = (res[4].code != 'FAILED') ? res[4].statisticsList : null
          this.setData({
            trade,
            cashier,
            recharge,
            terminal,
            memberCount: res[3].count,
            srcollLoading: false,
            loading: false,
            department: null
          })
        })
        break
    }
  },
  //时间天数切换
  stepDate(e) {
    let reportDate = this.data.tradeDateValue
    const currDate = new Date(reportDate)
    const ms = base.dayValue
    let _prportDate = null
    const tadayMs = new Date().getTime()
    let disNext = this.data.disNext
    let activeDate = null
    let tradeDateValue = null
    if (e.target.id === 'next') {
      this.setData({
        srcollLoading: true
      })
      activeDate = currDate.getTime() + ms
      reportDate = base.formatDate(activeDate, 'yyyyMMdd')
      tradeDateValue = base.formatDate(activeDate, "yyyy-MM-dd")
      console.log(activeDate)
      this.getReport(reportDate)
      this.nextView(activeDate)
    } else if (e.target.id === 'prev') {
      this.setData({
        srcollLoading: true
      })
      activeDate = currDate.getTime() - ms
      reportDate = base.formatDate(activeDate, 'yyyyMMdd')
      tradeDateValue = base.formatDate(activeDate, "yyyy-MM-dd")
      this.getReport(reportDate)
      this.nextView(activeDate)
    }
    if (e.target.id) {
      this.setData({
        reportDate,
        tradeDateValue
      })
    }
  },
  nextView(csTime) {
    let nowTime = new Date().getTime()
    const dayValue = base.dayValue
    let disNext = new Date().Format('yyyy-MM-dd') == new Date(csTime).Format('yyyy-MM-dd') ? true : false
    let reportTab = null
    if (nowTime > csTime) {
      reportTab = 2
    }
    if (new Date(nowTime - dayValue).Format('yyyy-MM-dd') == new Date(csTime).Format('yyyy-MM-dd')) {
      reportTab = 0
    }
    if (disNext) {
      reportTab = 1
    }
    this.setData({
      disNext,
      reportTab
    })
  },
  //切换报表
  toggleReport(e) {
    let id = e.target.dataset.index,
      reportDate = this.data.reportDate
    switch (id) {
      case 0:
        reportDate = this.lessDate('yyyyMMdd', 1)
        this.setData({
          tradeDateValue: this.lessDate('yyyy-MM-dd', 1),
          reportDate,
          searchDates: null,
          searchDate: null,
          disPrv: false,
          disNext: false
        })
        this.getReport(reportDate)
        break
      case 1:
        reportDate = this.lessDate('yyyyMMdd')
        this.setData({
          tradeDateValue: this.data.taday,
          reportDate,
          searchDates: null,
          searchDate: null,
          disPrv: false,
          disNext: true
        })
        this.getReport(reportDate)
        break
      case 2:
        this.toReportDate('trade')
        break
    }
    this.setData({
      reportTab: e.target.dataset.index
    })
  },
  toReportDate(type) {
    wx.navigateTo({
      url: `/pages/reportDate/reportDate?type=${type}`,
    })
  },
  //更多员工
  moreDepartment() {
    let params = this.reportparams(this.data.reportDate)
    params.pageNumber = this.data.department.pageNumber + 1
    tradeMerchant(params)
      .then(res => {
        console.log(res)
        let department = this.data.department
        department.statisticsList = department.statisticsList.concat(res.statisticsList)
        department.pageNumber = res.pageNumber
        this.setData({
          department: department
        })
      })
  },
  //更多门店
  moreCashier() {
    let cashier = this.data.cashier
    let params = this.reportparams(this.data.reportDate)
    params.merchantCode = app.commonParams("merchantCode")
    params.pageNumber = cashier.pageNumber + 1
    tradeOperator(params)
      .then(res => {
        console.log(res)
        if (res.code != 'FAILED') {
          cashier.statisticsList = cashier.statisticsList.concat(res.statisticsList)
          cashier.pageNumber = params.pageNumber

        } else {
          cashier.pageNumber = params.pageNumber
        }
        this.setData({
          cashier: cashier
        })
      })
  },
  //切换统计门店
  storeChange(e) {
    console.log(e,"切换门店")
    let role = null,
      navBar,
      selStore = e.detail.value,
      currentCat = this.data.currentCat
    if (selStore == 0) {
      wx.removeStorageSync("selStoreCode")
      role = 0
      navBar = ['营业统计', '会员统计']
      currentCat = 0
      this.setData({
        selStore,
        role,
        navBar,
        currentCat
      })
      this.getReport(this.data.reportDate)
    } else {
      wx.setStorageSync("selStoreCode", this.data.store[e.detail.value].merchantCode)
      role = 1
      navBar = ['营业统计', '会员统计', '核销统计']
      this.setData({
        selStore,
        role,
        navBar,
        currentCat
      })
      this.getReport(this.data.reportDate)
    }
  },
  //切换分类
  toggleCat(e) {
    console.log(this.data.tradeDateValue)
    let currentCat = e.target.id
    if (currentCat) {
      this.setData({
        currentCat: currentCat,
        offerLeft: e.target.offsetLeft
      })
      this.initPage()
    }
  },
  // 充值统计
  recharge() {
    return recharge(this.reportparams())
  },
  // 会员新增数量
  newMemberCount() {
    return newMemberCount(this.reportparams())
  },
  //核销优惠券记录
  couponConsumeRecordList(arg, days) {
    let params = this.setCouponDate(days)
    console.log(arg, days, "核销优惠券记录386", params)
    const { role } = this.data
    if (arg) {
      params = { 
				...params,
        ...arg
      }
    }
    if (role == 3 || role == 2) params.operatorId = app.commonParams('operatorId')
    if (role == 1) params.merchantCode = app.commonParams('merchantCode')

    if (this.data.selEmployee > 0) {
      params.operatorId = this.data.employeeList[this.data.selEmployee].operatorId
    }
    if (this.data.selCoupon > 0) {
      params.couponId = this.data.couponList[this.data.selCoupon].couponId
    }
    let _couponPage = this.data.couponPage
    let { currentCheck} = this.data
    if (currentCheck == 2){
      params.beginTime = params.startTime
    }
    return couponConsumeRecordList(params).then(res => {
      console.log(_couponPage)
      let couponPage = _couponPage == 0 ? 1 : _couponPage + 1,
        recordList = res.recordList,
        totalCount = res.totalCount,
        _recordList = this.data.recordList,
        hasmore = recordList.length > 0 ? true : false
      recordList = couponPage > 1 ? _recordList.concat(recordList) : recordList
      console.log(recordList)
      this.setData({
        recordList,
        totalCount,
        listloading: false,
        loading: false,
        istolower: false,
        hasmore,
        couponPage
      })
    })
  },


  //员工列表
  employeeList(arg = {}) {
    return employeeList({ ...arg })
  },
	
  //核销统计模块初始化
  initCouponCheck() {
    // ['0总部 ', '1门店 ', '2员工 ', '3店长']
		const {role} = this.data
    let params = {}
		if (role == 2) params.operatorId = app.commonParams('operatorId')
		if (role == 1) params.merchantCode = app.commonParams('merchantCode')
    let init = [
      couponConsumeCount(params),
      couponConsumeList(params),
      employeeList(params)
    ]
    Promise.all(init).then(res => {
      const yesterdayCount = res[0].yesterdayCount,
        employeeList = res[2].employeeList,
        couponList = res[1].couponList
      couponList.unshift({
        couponName: '全部优惠券'
      });
      employeeList.unshift({
        operatorName: '全部店员'
      })
      this.setData({
				...res[1],
        ...res[0],
				...res[2],
        tolowerEvent: 'moreRecordList',
        couponPage: 0,
        selCoupon: 0,
        selEmployee: 0
      })
    }).then(res => {
      this.couponConsumeRecordList()
    })
  },
  changeCoupon(e) {
    let index = e.detail.value,
      setCoupon = this.data.couponList[index]
    let arg = index > 0 ? {
      couponId: setCoupon.couponId
    } : {}
    this.setData({
      selCoupon: index,
      couponPage: 0
    })
    this.couponConsumeRecordList(arg)

  },
  changeEmployee(e) {
    const index = e.detail.value,
      selEmployee = this.data.employeeList[index]
    let arg = index > 0 ? {
      operatorId: selEmployee.operatorId
    } : {}
    this.setData({
      selEmployee: index,
      couponPage: 0
    })
    this.couponConsumeRecordList(arg)
  },

  setCouponDate(day) {
    const days = day || this.data.couponDay
    const couponDate = this.data.searchCouponDate || {
        beginTime: this.lessDate('yyyyMMddhhmmss', days),
        endTime: this.lessDate('yyyyMMddhhmmss'),
      },
      couponDates = {
        beginTime: this.lessDate('yyyy-MM-dd', days),
        endTime: this.lessDate('yyyy-MM-dd'),
      }
    this.setData({
      couponDate,
      couponDates,
      couponDay: days
    })
    return couponDate
  },

  //核券时间切换
  toggleCheckTab(e) {
    const index = e.target.dataset.id
    console.log(index)
    this.setData({
      currentCheck: index,
      couponPage: 0,
      searchCouponDate: null,
      couponDateValue: null
    })
    switch (index) {
      case 0:
        this.setData({
          listloading: true
        })
        this.couponConsumeRecordList({}, 7)
        break
      case 1:
        this.setData({
          listloading: true
        })
        this.couponConsumeRecordList({}, 30)
        break
      case 2:
        this.toReportDate("coupon")
        break
    }
  },
  //优惠券查询
  initPage(currentCat) {
    console.log("角色ROLES::", this.data.r[app.commonParams('role')])
    if (this.data.currentCat == 2) {
      this.initCouponCheck()
    } else {
      this.getReport(this.data.searchDate || this.data.reportDate)
    }
  },
  moreRecordList(e) {
    this.setData({
      istolower: true
    })
    if (this.data.hasmore) {
      this.couponConsumeRecordList({
        pageNumber: this.data.couponPage + 1
      })
    }
  },
  resRecordList(e) {
    console.log("res::::", e);
  },
  goDetail(date, type) {
    let data = this.data,
      d = (date instanceof Object) ?
      wx.setStorageSync("searchDate", date) : `date=${date}`
    wx.navigateTo({
      url: `/pages/reportDetail/reportDetail?${d}&type=${type}&reportTab=${data.reportTab}&tradeDateValue=${data.tradeDateValue}`,
    })
  },
  moreTerimnal() {
    this.goDetail(this.data.searchDate || this.data.reportDate, 'terminal')
  },
  moreOperator() {
    this.goDetail(this.data.searchDate || this.data.reportDate, 'operator')
  },
  onShow() {
    console.log(app)
    this.setData({
    //   selStore:0,
    isPX: app.isPX,
    })
    
    this.initPage()
  }
})