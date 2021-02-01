const app = getApp()

Component({
  properties: {
    tabs: {
      type: Array,
      value: []
    },
    activeTab: {
      type: Number,
      value: 0
    }
  },

  data: {
    scrollLeft: 0
  },

  attached() {
    const {tabs} = this.data
    tabs.forEach((item, index) => {item.id = index + 1})
    this.setData({tabsList: tabs})
  },

  methods: {
    // 动态改变scroll-left的值
    _handleScroll(selectedId) {
      const query = this.createSelectorQuery()//创建节点查询器
      query.select('#item-' + selectedId).boundingClientRect()//选择id='#item-' + selectedId的节点，获取节点位置信息的查询请求
      query.select('#scroll-view').boundingClientRect()//获取滑块的位置信息
      //获取滚动位置
      query.select('#scroll-view').scrollOffset()//获取页面滑动位置的查询请求
      query.exec((res) => {
        this.setData({scrollLeft: res[2].scrollLeft + res[0].left + res[0].width / 2 - res[1].width / 2})
      })
    },

    changeTabs({currentTarget}) {
      const {activeTab} = currentTarget.dataset
      this._handleScroll(activeTab + 1)
      this.triggerEvent('changeTabs', {activeTab})
    }
  }
})