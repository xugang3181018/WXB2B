const app = getApp()

Component({
  properties: { // 传输进来的属性
    show: {
      type: Boolean,
      value: null
    },
    width: { // 控制弹窗的宽度，单位rpx
      type: String,
      value: '300rpx'
    },
    height: { // 控制弹窗的高度，单位rpx
      type: String,
      value: '300rpx'
    },
    position: {
      type: String, // 弹窗的名称
      value: 'bottom',
    },
  },

  // 组件的内部数据
  data: {
    style: '',
  },

  ready() {
    let {position, width, height, style} = this.data
    switch (position) {
      case 'top':
        style = `top: 0; right: 0; left: 0; width: 100%; height: ${height}`
        break
      case 'right':
        style = `top: 0; bottom: 0; left: 0; width: ${width}; height: 100%`
        break
      case 'bottom':
        style = `bottom: 0; right: 0; left: 0; width: 100%; height: ${height}`
        break
      case 'left':
        style = `top: 0; right: 0; bottom: 0; width: ${width}; height: 100%`
        break
      default:
        break
    }
    this.setData({style})
  },

  methods: {
    // 关闭弹窗
    close() {
      this.triggerEvent('onClose')
    },
  },
 })