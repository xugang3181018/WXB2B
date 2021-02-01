// pages/retail/popUpBtn/popUpBtn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnList:{
      type:Array,
      value:[]
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
    onScan(){
      this.triggerEvent('onScan')
    },
    onManual(){
      this.triggerEvent('onManual')
    },
    onDeselect(){
      this.triggerEvent('onDeselect')
    }
  }
})
