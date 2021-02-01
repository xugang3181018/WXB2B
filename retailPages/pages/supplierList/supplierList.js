// pages/retail/supplierList/supplierList.js
let {
  supplierList
} = require('../../../api/index')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:'供货商'
    },
    nameList:{
      type:Array,
      value:[]
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      let {nameList} = this.data
      if(nameList.length)return
      supplierList({
        merchantCode: wx.getStorageSync("login").merchantCode
      }).then(res => {
        console.log(res, "供应商列表")
        if (res.code == "SUCCESS") {
          this.setData({
            nameList: res.result
          })
        }
      })
    },
  },


  /**
   * 组件的方法列表
   */
  methods: {
    // 选择供应商
    changeMerchant(e) {
      console.log(e)
      let {
        nameList
      } = this.data
      // let supplierId = nameList[e.detail.value].supplierId
      let supplier = nameList[e.detail.value]
      console.log(supplier)
      this.setData({
        nameIndex: e.detail.value
      })
      this.triggerEvent('getSupplier',supplier)
    },
  }
})