const app = getApp()

Page({
  data: {
    list: null, // 列表
    pattern: '', // store business
    searchContent: '', // 查询的内容
    pageNo: 1, // 当前页码
    url: '',
    tabItem: [
      {item: '商户', isSelected: true},
      {item: '门店', isSelected: false},
    ], // 选项卡
    repidEntry: false, // 是否为快速进件
    popShow: false, // 是否显示版本选择框
    scrollTop: 0,
    add: app.getImage('+.png'),
    alipay: app.getImage('alipay.png'),
    weixin: app.getImage('weixin.png'),
    hf: app.getImage('hf.png'),
    meizhou: app.getImage('meizhou.png'),
    wspay: app.getImage('wspay.png'),
    ls: app.getImage('ls.png'),
    up: app.getImage('up.png'),
    down: app.getImage('down.png'),
    riskStatus: 0, // 风控状态
  },

  onLoad(options) {
    let url = ''
    let pattern = ''
    let title = ""
    let repidEntry = false
    let searchPlaceholder = ''
    let height = wx.getSystemInfoSync().windowHeight
    switch (options.pattern) {
      case 'business':
        url = 'front.agent.app.report'
        title = '商户管理'
        pattern = 'business'
        searchPlaceholder = '请输入搜索关键字'
        height = height - 60
        break
      case 'store':
        url = 'front.agent.app.report'
        title = '门店管理'
        pattern = 'store'
        searchPlaceholder = '请输入搜索关键字'
        height = height - 60
        break
      case 'entry':
        url = 'agent_app_merchant_list_query'
        title = '快速进件'
        pattern = 'business'
        searchPlaceholder = '请输入名称搜索'
        repidEntry = true
        height = height - 104
        break
      default:
        break
    }
    const riskStatus = Number(wx.getStorageSync('member').inputStatus)
    const canChangeProduct = wx.getStorageSync('canChangeProduct')
    this.setData({url, pattern, title, height, repidEntry, canChangeProduct, riskStatus, searchPlaceholder})
    repidEntry ? this.getList(1) : this.getTradeList(1)
  },

  onReady() {
    wx.setNavigationBarTitle({title: this.data.title})
  },

  pullDownRefresh() {
    const {repidEntry, searchConent} = this.data
    repidEntry ? this.getList(1, searchConent) : this.getTradeList(1, searchConent)
  },

  reachBottom() {
    let {pageNo, searchContent, repidEntry} = this.data
    repidEntry ? this.getList(++pageNo, searchContent) : this.getTradeList(++pageNo, searchContent)
  },

  // 风控提示
  isRisk({currentTarget}) {
    const {tap, data} = currentTarget.dataset
    if (this.data.riskStatus && tap === 'toChannelSelection') {
      app.showToast('服务商已被风控，请联系客服处理')
      return
    }
    this[tap](data)
  },

  // 获取搜索内容
  search(e) {
    this.data.repidEntry ? this.getList(1, e.detail) : this.getTradeList(1, e.detail)
  },

  // 清空搜索框
  clearSearch() {
    if (this.data.searchContent) {
      this.data.repidEntry ? this.getList(1) : this.getTradeList(1)
    }
  },

  // 改变选项卡
  changeTab(e) {
    const item = e.currentTarget.dataset.item
    if (item.isSelected) return
    const name = item.item
    const {tabItem} = this.data
    let pattern = ''
    let url = ''
    if (name === '商户') {
      pattern = 'business'
      url = 'agent_app_merchant_list_query'
    } else {
      pattern = 'store'
      url = 'agent_app_store_list_query'
    }
    tabItem.forEach(item => {
      item.isSelected = item.item === name ? true : false
    })
    this.setData({tabItem, pattern, url})
    this.getList(1)
  },

  // 跳转详情页
  toDetail(e) {
    const {list, pattern, repidEntry} = this.data
    if (repidEntry) return
    const index = e.currentTarget.dataset.index
    const merchantCode = `merchantCode=${list[index].merchantCode}`
    const storeCode = `${merchantCode}&storeCode=${list[index].storeCode}`
    const code = pattern === 'business' ? merchantCode : storeCode
    wx.navigateTo({url: `../BSDetail/BSDetail?pattern=${pattern}&${code}`})
  },

  // 获取列表
  getList(pageNo, searchContent = '') {
    const {pattern, url, list} = this.data
    const params = {agentNo: app.common('agentNo'), pageNo: pageNo}
    if (searchContent) pattern === 'business' ? params.merchantFullName = searchContent : params.storeFullName = searchContent
    app.api(url, params).then(res => {
      if (res && !res.apiError) {
        let info = {searchContent, pageNo}
        if (res.webMessage) {
          if (pageNo === 1) info.list = []
        } else {
          if (pageNo === 1) {
            info.list = res
            info.scrollTop = 0
          } else {
            info.list = list.concat(res)
          }
        }
        this.setData(info)
      }
    })
  },

  // 获取交易列表
  getTradeList(currentPage, searchContent = '') {
    const {pattern, url, list} = this.data
    const params = {
      agent_no: app.common('agentNo'),
      current_page: currentPage,
      column: 10,
      order_type: 0,
      out_request_no: app.random(),
      start_date: app.formatDate((new Date().getTime() - 86400000), 'yyyy-MM-dd'), //'2018-08-07'
      admin: `${Number(app.common('isAdmin'))}`,
      operation_login_name: app.common('loginName'),
      operation_name: app.common('loginName'),
    }
    if (searchContent) pattern === 'business' ? params.merchant_no = searchContent : params.store_no = searchContent
    app.api2(url, params).then(res => {
      if (res && !res.apiError) {
        let info = {searchContent, pageNo: currentPage}
        const newList = pattern === 'business' ? res.agentMerchantTradeList : res.agentStoreTradeList
        if (newList && newList.length > 0) {
          newList.forEach(item => {
            item.tradeTotalAmountPM = false // 交易金额增长正负值
            item.tradeTotalCountPM = false // 交易数量增长正负值
            if (item.tradeTotalAmountMoM.indexOf('-') === -1) item.tradeTotalAmountPM = true
            if (item.tradeTotalCountMoM.indexOf('-') === -1) item.tradeTotalCountPM = true
          })
        }
        info.list = currentPage === 1 ? newList : list.concat(newList)
        this.setData(info)
      }
    })
  },

  // 商户添加门店
  addStore(item) {
    const data = {
      merchantCode: item.merchantCode,
      merchantFullName: item.merchantFullName,
      merchantName: item.merchantName,
      salesmanName: item.salesmanName,
      salesmanNo: item.salesmanId,
    }
    wx.setStorageSync('bsInfo', data)
    wx.navigateTo({url: `../BSOperation/BSOperation?pattern=store&operation=create`})
  },

  // 选择进件通道
  toChannelSelection(item) {
    const pattern = this.data.pattern
    const data = {
      pattern,
      merchantCode: item.merchantCode,
      merchantFullName: item.merchantFullName,
      merchantName: item.merchantName,
      salesmanName: item.salesmanName,
      salesmanNo: item.salesmanId
    }
    if (this.data.pattern === 'store') {
      const other = {
        storeFullName: item.storeFullName,
        storeName: item.storeName,
        storeNo: item.storeCode
      }
      Object.assign(data, other)
    }
    wx.setStorageSync('entryInfo', data)
    wx.navigateTo({url: '../entryChannel/entryChannel'})
  },

  // 添加商户/门店
  addItem() {
    const url = this.data.pattern === 'business' ? '../BMode/BMode' : '../businessList/businessList'
    wx.navigateTo({url})
  },

   // 改版本
   changePop(item) {
    if (!this.data.canChangeProduct) {
      app.showToast('您没有权限修改版本')
      return
    }
    const {pattern} = this.data
    const url = pattern === 'business' ? 'agent_app_merchant_details' : 'agent_app_store_details'
    let params = {}
    if (pattern === 'business') {
      params.merchantCode = item.merchantCode
      params.agentNo = app.common('agentNo')
    } else {
      params.storeCode = item.storeCode
    }
    app.api(url, params).then(res => {
      if (res && !res.apiError) {
        res.codeList = res.sysVersionResponse.codeList
        this.setData({popShow: true, merchantCode: item.merchantCode, editInfo: res})
      }
    })
  },

  // 改变版本信息
  changeProduct(e) {
    this.setData(e.detail)
  },
})