const app = getApp()

Page({
  data: {
    tabIndex: 1, // 当前的选项卡的位置
    list: [], // 内容列表
    pattern: '', // store business
    passType: 0, // 通道类型 1 支付宝 2 微信 3 W银行（光大） 4 支付宝二清 5 微信二清 6-浦发银行 7 网商银行 8 客商银行
    storeNo: '', // 门店编号
    merchantCode: '', // 商户编号
    auditorStatus: 0, // 审核状态:0-全部，1-未提交 2-待审核 3-处理中 4-不通过 6-通过 8-支付开通失败9-银行审核中
    merchangFlag: 0, // 商户标识 0：全部, 1:商户, 2：门店
    pageNo: 1, // 当前页码
    height: wx.getSystemInfoSync().windowHeight - 46,
    waring: app.getImage('waring.png'),
    auditorStatusList: ['未提交', '待审核', '处理中', '未通过', '已重提', '审核通过', '支付开通中', '支付开通失败', '银行审核中', '变更中', '变更失败', '变更成功', '待确认', '待报名', '升级银行审核中', '待打款验证', '入住-待签约', ' 升级-待签约', '审核通过', '待补齐资料', '银行审核中', '银行审核中'],
  },

  onLoad(options) {
    const merchangFlag = options.pattern === 'business' ? 1 : (options.pattern === 'store' ? 2 : 0)
    const url = this.getUrl(options.passType)
    this.setData({merchangFlag, ...options})
    this.getList(1, url)
  },

  onReady() {
    let title = ''
    switch (this.data.passType) {
      case '7':
        title = '网商银行通道'
        break
      case '8':
        title = '客商银行通道'
        break
      case '9':
        title = '乐刷通道'
        break
      default: title = ''
    }
    wx.setNavigationBarTitle({title})
  },

  // 下拉刷新
  pullDownRefresh() {
    this.getList(1, this.data.url)
  },

  // 触底加载
  reachBottom() {
    let {pageNo, url} = this.data
    this.getList(++pageNo, url)
  },

  // 获取url
  getUrl(passType) {
    let url = ''
    if (this.data.tabIndex === 1) {
      switch (passType) {
        case '7':
          url = 'agent_app_mybank_config_list_query'
          break
        case '8':
          url = 'agent_app_ksh_config_list_query'
          break
        case '9':
          url = 'agent_app_leshua_config_list_query'
          break
        case '11':
          url = 'agent_app_huifu_config_list_query'
          break
        default: url = ''
      }
    } else {
      url = 'agent_app_ceb_audit_cfg_list_query'
    }
    return url
  },

  // 切换选项卡
  changeTab({currentTarget}) {
    const index = Number(currentTarget.dataset.index)
    const {passType, tabIndex} = this.data
    if (index !== tabIndex) {
      this.setData({tabIndex: index, list: []})
      const url = this.getUrl(passType)
      this.getList(1, url)
    }
  },

  // 获取列表
  getList(pageNo, url) {
    const {merchantCode, passType, storeNo, pattern, tabIndex, merchangFlag, auditorStatus, list} = this.data
    const params = {agentNo: app.common('agentNo'), coreMerchantCode: merchantCode}
    if (tabIndex === 1) {
      if (passType !== '8') params.currentPage = pageNo
      if (passType === '11') params.column = 10
      if (['7', '8'].includes(passType)) params.passType = passType
    } else {
      const otherParams = {pageNo, passType, merchangFlag, auditorStatus}
      Object.assign(params, otherParams)
    }
    if (pattern === 'store') params.storeNo = storeNo
    app.api(url, params).then(res => {
      // 获取商户列表
      if (res && !res.apiError) {
        const info = {url, pageNo}
        if (res.webMessage) {
          if (pageNo === 1) info.list = []
        } else {
          const count = res.length
          if (count > 0) {
            res.forEach((item) => {
              item.status = null
              if ([6, 12, 19, 20].includes(item.auditorStatus)) item.status = 'aduitSuccess'
              item.auditorStatusText = auditorStatusList[item.auditorStatus - 1]
            })
          }
          info.list = pageNo === 1 ? res : list.concat(res)
        }
        this.setData(info)
      }
    })
  },

  // 跳转到进件详情
  toEntryDetail({currentTarget}) {
    const {merchangFlag, passType, tabIndex} = this.data
    const {agentAuditNo, id} = currentTarget.dataset
    let query = `entryType=${merchangFlag}&agentAuditNo=${agentAuditNo}&passType=${passType}&tabIndex=${tabIndex}`
    query = tabIndex === 1 ? `${query}&id=${id}` : query
    wx.navigateTo({url: `../entryDetail/entryDetail?${query}`})
  },
})
