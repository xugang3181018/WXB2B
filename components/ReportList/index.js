Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsStatisList: {
      type: Object,
      value: {}
    },
    goodsIndex: {
      type: Number,
      value: -1
    },
    status: {
      type: Number,
      value: -1,
      observer: function (new_val, old_val, path) {
        console.log(new_val)
        console.log(old_val)
        if (new_val!=old_val) {
          this.isGroup();
        }
      }
    }
  },
  options: {
    multipleSlots: true
  },

  lifetimes: {
    // attached: function() {
    //   this.isGroup();
    // },
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsStatistics: {
      goodsCategoryName: "商品分类",
      goodsMaxPrice: "现零售价",
      totalCount: "单品销量",
      totalSalesAmount: "应收金额",
      totalAmount: "实收金额",
      packageCount: "套餐单品销量",
      salesProportion: "应收金额占比",
      totalAmountProportion: "实收金额占比",
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    isGroup() {
      let {
        status
      } = this.data;
      let goodsStatistics = {}
      // 0商品销售报表 1商品分类报表 4套餐销售报表 5随心配套餐销售报表
      switch (status) {
        case 0:
          goodsStatistics= {
            goodsCategoryName: "商品分类",
            goodsMaxPrice: "现零售价",
            totalCount: "单品销量",
            totalSalesAmount: "应收金额",
            totalAmount: "实收金额",
            packageCount: "套餐单品销量",
          }
          break;
        case 1:
          goodsStatistics= {
            totalSalesAmount: "应收金额",
            salesProportion: "应收金额占比",
            totalCount: "单品销量",
            totalAmount: "实收金额",
            totalAmountProportion: "实收金额占比",
            packageCount: "套餐单品销量",
          }
          break;
        case 4:
          goodsStatistics= {
            goodsCategoryName: "商品分类",
            goodsMaxPrice: "现零售价",
            totalCount: "套餐销量",
            totalSalesAmount: "应收金额",
            totalAmount: "实收金额",
          }
          break;
        case 5:
          goodsStatistics= {
            goodsCategoryName: "商品分类",
            goodsMaxPrice: "现零售价",
            totalCount: "套餐销量",
            totalSalesAmount: "应收金额",
            totalAmount: "实收金额",
          }
          break;
        default:
          goodsStatistics= {
            goodsCategoryName: "商品分类",
            goodsMaxPrice: "现零售价",
            totalCount: "套餐销量",
            totalSalesAmount: "应收金额",
            totalAmount: "实收金额",
          }

      }
      this.setData({
        goodsStatistics
      })
    },
    _toggleDetail: function (e) {
      let index = e.currentTarget.dataset.index;
      let {
        goodsStatisList
      } = this.data;
      goodsStatisList.currIndex = index == this.data.goodsStatisList.currIndex ? null : index
      this.setData({
        goodsStatisList
      })
      this.triggerEvent('toggleDetail', {
        index,
        currIndex: goodsStatisList.currIndex
      });
    }
  }
})