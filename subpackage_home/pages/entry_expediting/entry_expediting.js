const app = getApp()

Page({
  data: {
    searchCondition: '', // 搜索内容
    list: null, // 进件信息
    currentPage: 1, // 页码
    height: wx.getSystemInfoSync().windowHeight - 60,
    wspay: app.getImage('wspay.png'),
    meizhou: app.getImage('meizhou.png'),
    ls: app.getImage('ls.png'),
    hf: app.getImage('hf.png'),
  },

  onLoad() {
    this.getList(1)
  },

  // 获取搜索内容
  search(e) {
    this.getList(1, e.detail)
  },

  pullDownRefresh() {
    this.getList(1, this.data.searchCondition)
  },

  reachBottom() {
    let {currentPage, searchCondition} = this.data
    this.getList(++currentPage, searchCondition)
  },

  // 当清空搜索框时
  clearSearch() {
    if (this.data.searchCondition) this.getList(1)
  },

  // 获取待催审列表
  getList(currentPage, searchCondition = '') {
    const params = {currentPage, agentNo: app.common('agentNo')}
    const {wspay, meizhou, ls, hf} = this.data
    if (searchCondition !== '') params.searchCondition = searchCondition
    app.api('agent_app_incoming_expediting_list', params).then(res => {
      if (res && !res.apiError) {
        const info = {currentPage, searchCondition}
        if (res.webMessage) {
          currentPage === 1 ? info.list = [] : null
        } else {
          const list = res.list
          if (list && list.length) {
            list.forEach(item => {
              switch (item.passType) {
                case 7:
                  item.src = wspay
                  break
                case 8:
                  item.src = meizhou
                  break
                case 9:
                  item.src = ls
                  break
                case 11:
                  item.src = hf
                  break
                default: item.src = null
              }
              item.formatDate = app.formatDate(item.gmtCreated, 'yyyy-MM-dd hh:mm:ss')
            })
            info.list = currentPage === 1 ? list : this.data.list.concat(list)
          }
        }
        this.setData(info)
      }
    })
  },

  // 发起催审
  expediting(e) {
    const configureCommonAuditId = e.currentTarget.dataset.id
    app.api('agent_app_incoming_expediting_borc', {configureCommonAuditId}).then(res => {
      if (res && !res.apiError) app.showToast('已发起催审')
    })
  },

  // 跳转到进件详情
  toEntryDetail(e) {
    const {index, agentauditno, passtype, entrytype} = e.currentTarget.dataset
    wx.navigateTo({url: `../entryDetail/entryDetail?agentAuditNo=${agentauditno}&index=${index}&passType=${passtype}&entryType=${entrytype}&tabIndex=0`})
  }
})
