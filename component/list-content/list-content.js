// components/list-content/list-content.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    img: {
      type: String,
      value: ""
    },
    title: {
      type: String,
      value: "支付方式"
    },
    number1: {
      type: Number,
      value: 0
    },
    number2: {
      type: Number,
      value: 0
    },
    content1: {
      type: String,
      value: "笔"
    },
    content2: {
      type: String,
      value: "元"
    },
    payTyle:{
      type:String,
      value:"WXPAY"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
