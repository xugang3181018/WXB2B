const app = getApp()

Page({
  data: {
    list: [], // 商户列表
    pageNo: 1, // 当前页码
    searchContent: '', // 查询的内容
    height: wx.getSystemInfoSync().windowHeight - 60,
  },

  onLoad() {
    this.getList(1)
  },

  // 获取商户列表
  getList(pageNo, searchContent = '') {
    const params = {pageNo, agentNo: app.common('agentNo')}
    if (searchContent !== '') params.merchantFullName = searchContent
    app.api('agent_app_merchant_list_query', params).then(res => {
      if (res && !res.apiError) {
        const info = {searchContent, pageNo}
        if (res.webMessage) {
          if (pageNo === 1) info.list = []
        } else {
          info.list = pageNo === 1 ? res : this.data.list.concat(res)
        }
        this.setData(info)
      }
    })
  },

  // 下拉刷新
  pullDownRefresh() {
    this.getList(1, this.data.searchContent)
  },

  // 触底加载
  reachBottom() {
    let {pageNo, searchContent} = this.data
    this.getList(++pageNo, searchContent)
  },

  // 获取搜索内容
  search(e) {
    this.getList(1, e.detail)
  },

  // 当清空搜索框时
  clearSearch() {
    if (this.data.searchContent) this.getList(1, '')
  },

  // 跳转添加门店页面
  toAddBusinessStore(e) {
    const item = e.currentTarget.dataset.item
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
})
