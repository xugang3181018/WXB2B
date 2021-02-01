Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // goodsStatisList:{
    //   type:Object,
    //   value: {},
    // },
    // goodsIndex: {
    //   type: Number,
    //   value: -1
    // },
    // status: {
    //   type: Number,
    //   value: 0
    // }
  },
  options: {
    // multipleSlots: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsStatistics: {
      // goodsName: "商品名称",
      // goodsCategoryName: "商品分类",
      // goodsMaxPrice: "现零售价",
      // totalCount: "单品销量",
      // totalSalesAmount: "应收金额",
      // totalAmount: "实收金额",
      // packageCount: "套餐单品销量",
      // salesProportion: "应收金额占比",
      // totalAmountProportion: "实收金额占比",
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _toggleDetail: function(e) {
      // let index = e.currentTarget.dataset.index;
      // let {goodsStatisList} = this.data;
      // goodsStatisList.currIndex = index == this.data.goodsStatisList.currIndex ? null : index
      // this.setData({
      //   goodsStatisList
      // })
      // this.triggerEvent('toggleDetail',{index,currIndex:goodsStatisList.currIndex});
    }
  }
})