const app = getApp()

Page({
  data: {
    isloading: false, // 控制上拉加载loading的显示
    loading: '加载更多',
    pattern: '', // business store
    nowDate: null, // 当前时间
    list: [], // 交易列表
    currentPage: 1, // 当前页数
    isAdmin: null, // 是否是管理员
    showInfo: true, // 是否显示数据看板
    loseUsers: 0, // 疑似流失用户
    historicalLoss: 0, // 历史流失商户
    scrollTop: 0,
    tab1: 1, // 情况选择
    tab2: 0, // 详细选择
    tabsList1: ['按笔数', '按金额', '按收益', '按门店数'],
    tabsList2: ['按笔数', '按金额', '按收益'],
    tabsList3: ['疑似流失', '历史流失'],
    preStore: app.getImage('pre-store.png'),
    preMerchant: app.getImage('pre-merchant.png'),
    dataempty: app.getImage('dataempty.png'),
    loadingGif: app.getImage('loding.gif'),
  },

  onLoad(options) {
    const isAdmin = app.common('isAdmin')
    const showInfo = isAdmin ? true : false
    const objectType = options.pattern === 'business' ? '商户' : '门店'
    this.setData({objectType, showInfo, isAdmin, ...options})
    this.getStatistics()
    this.getList(1)
    if (options.pattern === 'business') {
      this.getLostUsersList(1)
      this.getHistoricalLoss(1)
    }
  },

  onReady() {
    wx.setNavigationBarTitle({title: this.data.pattern === 'business' ? '商户统计明细' : '门店统计明细'})
  },

  onChange(e) {
    const {tab1, tab2} = this.data
    this.setData({list: [], currentPage: 1, isloading: false, loading: '加载更多', nowDate: e.detail})
    this.getStatistics()
    if (tab1 === 1) {
      this.getList(1)
    } else {
      tab2 === 0 ? this.getLostUsersList(1) : this.getHistoricalLoss(1)
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.data.tab1 === 1 ? this.getList(1) : this.getLostUsersList(1)
  },

  // 触底加载
  onReachBottom() {
    let {isLoading, loading, tab1, currentPage} = this.data
    if (loading === '加载更多' && !isLoading) tab1 === 1 ? this.getList(++currentPage) : this.getLostUsersList(++currentPage)
  },

  // 获取商户统计
  getStatistics() {
    const params = {agentNo: app.common('agentNo'), startDate: this.data.nowDate, queryType: 0}
    app.api('agent_app_mchstore_query', params).then(res => {
      if (res && !res.apiError) {
        res.incomeFromMerchant = res.incomeFromMerchant === 0 ? `${res.incomeFromMerchant}.00` : res.incomeFromMerchant
        res.incomeFromStore = res.incomeFromStore === 0 ? `${res.incomeFromStore}.00` : res.incomeFromStore
        this.setData({mchstore: res})
      }
    })
  },

  // 获取列表
  getList(currentPage) {
    const {nowDate, list, tab2, pattern, isLoading} = this.data
    if (isLoading) return
    this.setData({isLoading: true})
    if (currentPage === 1) this.setData({list: null})
    const url = pattern == 'business' ? 'agent_app_merchant_trade_query' : 'agent_app_store_trade_query'
    const params = {agentNo: app.common('agentNo'), startDate: nowDate, orderType: tab2, currentPage, column: 10}
    app.api(url, params).then(res => {
      wx.stopPullDownRefresh()
      this.setData({isLoading: false})
      if (res && !res.apiError) {
        let info = {}
        if (res.webMessage) {
          info.loading = '已加载全部内容'
          currentPage === 1 ? info.list = [] : null
        } else {
          info.loading = res.length < 10 ? '已加载全部内容' : '加载更多'
          if (currentPage === 1) {
            info.list = res
            wx.pageScrollTo({scrollTop: 0, duration: 0})
          } else {
            info.list = list.concat(res)
          }
        }
        info.currentPage = currentPage
        this.setData(info)
      } else {
        this.setData({loading: '加载失败'})
      }
    })
  },

  // 获取疑似流失列表
  getLostUsersList(currentPage = 1) {
    let {nowDate, isLoading} = this.data
    if (isLoading && currentPage) return
    this.setData({isLoading: true})
    nowDate = nowDate.replace(/-/g, '')
    const params = {
      start_date: nowDate,
      end_date: nowDate,
      agent_no: app.common('agentNo'),
      page_size: 10,
      page_num: currentPage
    }
    if (currentPage === 1) this.setData({list: null})
    app.api2('front.suspectLoss', params).then(res => {
      wx.stopPullDownRefresh()
      this.setData({isLoading: false})
      if (res && !res.apiError) {
        let info = {}
        const list = res.data ? JSON.parse(res.data) : []
        if (res.webMessage) {
          info.loading = '已加载全部内容'
          currentPage === 1 ? info.list = [] : null
        } else {
          info.loading = list.length < 10 ? '已加载全部内容' : '加载更多'
          if (currentPage === 1) {
            info.list = list
            wx.pageScrollTo({scrollTop: 0, duration: 0})
          } else {
            info.list = list.concat(list)
          }
        }
        info.lostUsers = res.totalCount
        info.currentPage = currentPage
        this.setData(info)
      } else {
        this.setData({loading: '加载失败'})
      }
    })
  },

  // 获取历史流失列表
  getHistoricalLoss(currentPage = 1) {
    let {nowDate, isLoading} = this.data
    if (isLoading && currentPage) return
    this.setData({isLoading: true})
    if (currentPage === 1) this.setData({list: null})
    nowDate = nowDate.replace(/-/g, '')
    const params = {
      start_date: nowDate,
      end_date: nowDate,
      agent_no: app.common('agentNo'),
      page_size: 10,
      page_num: currentPage
    }
    app.api2('front.threeDayNoTrade', params).then(res => {
      this.setData({isLoading: false})
      wx.stopPullDownRefresh()
      if (res && !res.apiError) {
        let info = {}
        const list = res.data ? JSON.parse(res.data) : []
        if (res.webMessage) {
          info.loading = '已加载全部内容'
          currentPage === 1 ? info.list = [] : null
        } else {
          info.loading = list.length < 10 ? '已加载全部内容' : '加载更多'
          if (currentPage === 1) {
            info.list = list
            wx.pageScrollTo({scrollTop: 0, duration: 0})
          } else {
            info.list = list.concat(list)
          }
        }
        info.historicalLoss = res.totalCount
        info.currentPage = currentPage
        this.setData(info)
      } else {
        this.setData({loading: '加载失败'})
      }
    })
  },

  // 改变情况tabs
  changeTabs(e) {
    const {tab1, tab2} = this.data
    const type = e.currentTarget.dataset.type
    const index = Number(e.currentTarget.dataset.index)
    const info = {[type]: index}
    if (type === 'tab1' && index !== tab1) info.tab2 = 0
    this.setData(info)
    // 切换情况获取列表
    if (type === 'tab1' && index !== tab1) index === 1 ? this.getList(1) : this.getLostUsersList(1)
    // 商户情况获取列表
    if (type === 'tab2') {
      // 交易情况获取列表
      if (tab1 === 1 && index !== tab2) this.getList(1)
      if (tab1 === 2 && index !== tab2) {
        index === 0 ? this.getLostUsersList(1) : this.getHistoricalLoss(1)
      }
    }
  },

  onPageScroll(ev) {
    const {isAdmin, pattern, scrollTop} = this.data
    if (isAdmin) {
      const scrollHeight = pattern === 'business' ? 205 : 115
      let _this = this    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
      if (ev.scrollTop <= 0) {
        ev.scrollTop = 0
      } else if (ev.scrollTop > wx.getSystemInfoSync().windowHeight) {
        ev.scrollTop = wx.getSystemInfoSync().windowHeight
      }
      if (ev.scrollTop > scrollTop || ev.scrollTop == wx.getSystemInfoSync().windowHeight) {
        //向下滚动
        ev.scrollTop > scrollHeight ? this.setData({showInfo: false}) : null
      } else {
        //向上滚动
        ev.scrollTop < scrollHeight ? this.setData({showInfo: true}) : null
      }
      setTimeout(function () {
        _this.setData({scrollTop: ev.scrollTop})
      }, 0)
    }
  }
})