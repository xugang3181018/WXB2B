// custom-tab-bar/index.js
Component({

  /**
   * 组件的初始数据
   */
  data: {
    sumCount:0,
    selected: 0,
    color: "#282828",
    selectedColor: "#B19361",
    list: [{
      pagePath: "/pages/goods_cate/goods_cate",
      iconPath: "/images/2-001.png",
      selectedIconPath: "/images/2-002.png",
      text: "分类"
    }, {
      pagePath: "/pages/order_addcart/order_addcart",
      iconPath: "/images/3-001.png",
      selectedIconPath: "/images/3-002.png",
      text: "购物车"
    },{
      pagePath: "/pages/order_list/index",
      iconPath: "/images/1-001.png",
      selectedIconPath: "/images/1-002.png",
      text: "订单"
    },{
      pagePath: "/pages/user/user",
      iconPath: "/images/4-001.png",
      selectedIconPath: "/images/4-002.png",
      text: "我的"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      console.log(e)
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index,
      })
    }
  }
})
