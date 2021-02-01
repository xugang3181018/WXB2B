const app = getApp()

Page({
  data: {
    list: [], // 文档列表
    type: 0, // 0是知识库类别，1是文档列表
    dataempty: app.getImage('dataempty.png'),
    ider: app.getImage('ider.png'),
  },

  onLoad() {
    this.getList(0)
  },

  // 获取企业文件列表列表
  getList(offset) {
    if (offset !== 0) offset = offset * 20 - 1
    const params = {
      type: 'all',
      offset
    }
    app.api5('/groups/lt/repos', params).then(res => {
      if (res && !res.apiError) {
        let info = {}
        if (res.webMessage) {
          info.loading = '已加载全部内容'
          offset === 0 ? info.list = [] : null
        } else {
          info.loading = res.length < 20 ? '已加载全部内容' : '加载更多'
          res.forEach(($0) => {
            $0.formatDate = app.formatDate($0.gmtCreated, 'yyyy-MM-dd hh:mm:ss')
          })
          if (offset === 0) {
            info.list = res
            wx.pageScrollTo({scrollTop: 0, duration: 0})
          } else {
            info.list = this.data.list.concat(res)
          }
          info.offset = offset
          info.type = 0
          this.setData(info)
        }
      }
    })
  },

  onPullDownRefresh() {
    this.getList(0)
  },

  onReachBottom() {
    let {loading, offset, type, q} = this.data
    if (loading === '加载更多') {
      type === 0 ? this.getList(++offset) : this.getFile(++offset, q)
    }
  },

  // 获取文档
  getFile(offset, q) {
    const params = {
      q,
      type: 'doc',
      offset,
      related: true,
    }
    app.api5(`/search`, params).then(res => {
      if (res && !res.apiError) {
        let info = {}
        if (res.webMessage) {
          info.loading = '已加载全部内容'
          offset === 1 ? info.list = [] : null
        } else {
          info.loading = res.length < 20 ? '已加载全部内容' : '加载更多'
          res.forEach(($0) => {
            $0.formatDate = app.formatDate($0.gmtCreated, 'yyyy-MM-dd hh:mm:ss')
          })
          if (offset === 1) {
            info.list = res
            wx.pageScrollTo({scrollTop: 0, duration: 0})
          } else {
            info.list = this.data.list.concat(res)
          }
          info.list.forEach(item => {
            item.public = item.target.book.public
          })
          info.offset = offset
          info.type = 1
          this.setData(info)
        }
      }
    })
  },

  // 获取搜索内容
  search(e) {
    this.setData({q: e.detail})
    this.getFile(1, e.detail)
  },

  // 当清空搜索框时
  clearSearch() {
    if (this.data.q) {
      this.setData({q: ''})
      this.getList(0)
    }
  },

  // 跳转到文档列表
  linkTo(e) {
    let {namespace, slug} = e.currentTarget.dataset
    if (this.data.type === 1) {
      namespace = namespace.replace(`/${slug}`, '')
      namespace = namespace.splice(0, 1)
    }
    const query = `namespace=${namespace}`
    const url = this.data.type === 0 ? `../fileList/fileList?${query}` : `../fileDetail/fileDetail?${query}&slug=${slug}`
    wx.navigateTo({url})
  }
})
