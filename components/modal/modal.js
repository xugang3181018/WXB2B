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
    title: {
      type: String, // 弹窗的名称
      value: null,
    },
    titleColor: { // 标题颜色
      type: String,
      value: '#000'
    },
    titleWidth: { // 标题长度
      type: String,
      value: '300rpx'
    },
  },

  data: {
    closeImg: app.getImage('close.png')
  },

  methods: {
    // 关闭弹窗
    close() {
      this.triggerEvent('onClose')
    }
  },
 })