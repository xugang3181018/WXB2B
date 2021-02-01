// components/navbar/navbar.js
const app = getApp()
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    backgroundColor: {
      type: String,
      value: 'rgba(0,0,0,0)'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight:0,
    navBarHeight:0,
    navHeight:0
  },
  ready() {
    let {
      statusBarHeight,
      navBarHeight
    } = app.globalData;
    this.setData({
      statusBarHeight,
      navBarHeight,
    },() => {
      // console.log(navBarHeight, statusBarHeight)
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})