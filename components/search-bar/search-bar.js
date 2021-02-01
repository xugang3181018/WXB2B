const app = getApp()

Component({
  properties: { // 传输进来的属性
    placeholder: {
      type: String,
      value: '请输入'
    },
  },
  // 组件的内部数据
  data: {
    content: '', // 当前搜索栏显示的内容
    hasValue: '', // 当前搜索框是否有值
    isFocus: false, // 当前是否获取焦点
    search: app.getImage('search.png'),
    off: app.getImage('off.png')
  },

  methods: {
    // 焦点触发
    onFocus() {
      this.setData({isFocus: true})
    },

    // 失去焦点
    onBlur() {
      this.setData({isFocus: false})
    },

    onInput(e) {
      if (e.detail.value === '') {
        this.setData({hasValue: false})
        this.triggerEvent('onClear')
      } else if (!this.data.hasValue) {
        this.setData({hasValue: true})
      }
    },

    // 确认输入
    onConfirm(e) {
      this.triggerEvent('onConfirm', e.detail.value)
    },

    // 取消
    onCancel() {
      this.setData({isFocus: false})
    },

    // 清除
    onClear() {
      this.setData({content: '', hasValue: false})
      this.triggerEvent('onClear')
    }
  },
 })