const app = getApp()

Component({
  properties: {
    height: {
      type: Number,
      value: wx.getSystemInfoSync().windowHeight,
    },
    count: { // 数据列表数量
      type: Number,
      value: 0,
    },
    pageNo: { // 当前页码
      type: Number,
      value: 1
    },
    pageSize: { // 分页大小
      type: Number,
      value: 10,
    },
    scrollTop: { // 控制滚动条位置
      type: Number,
      value: 0
    }
  },

  data: {
    dataempty: app.getImage('dataempty.png'),
    isRefresh: false, // 是否刷新
    hasMore: false, // 是否加载更多
    hasData: true, // 是否有数据
  },

  observers: {
    'count, pageNo': function (count, pageNo) {
      const info = {}
      const pageSize = this.data.pageSize
      info.hasMore = count === (pageSize * pageNo) ? true : false
      if (pageNo === 1) {
        if (count > 0) info.isRefresh = false
        info.hasData = count === 0 ? false : true
      }
      this.setData(info)
    }
  },

  methods: {
    // 下拉刷新
    pullDownRefresh() {
      this.triggerEvent('pullDownRefresh')
    },

    // 触底加载
    reachBottom() {
      if (!this.data.hasMore) return
      this.triggerEvent('reachBottom')
    }
  }
})