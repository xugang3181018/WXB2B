// pages/scanOrder/shopSpec/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    specList: [{
      code: "",
      barcode: "",
      stock: "",
      name: "",
      price: "", //原价
      memberPrice: "", // 会员价
      skuStockStatus: 0, // 商品库存状态 0不自动置满 1次日自动置满
      initStock: "", // 商品初始库存
      skuPackFee: "", // 商品包装费
      skuId: "",
    }],
    isPX: app.isPX,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let goodsSpec = JSON.parse(options.goodsSpec) || [];
    if(goodsSpec.length > 0) {
      this.setData({
        specList: goodsSpec
      })
    }
  },


  specStatus({currentTarget}) {
    let {index,name } = currentTarget.dataset;
    let {specList} = this.data;
    specList[index].skuStockStatus = specList[index].skuStockStatus==0? 1: 0;
    this.setData({
      specList
    })
  },


  addSpecList() {
    let {
      specList
    } = this.data;
    specList.push({
      code: "",
      barcode: "",
      stock: "",
      name: "",
      price: "", //原价
      memberPrice: "", // 会员价
      skuStockStatus: 0, // 商品库存状态 0不自动置满 1次日自动置满
      initStock: "", // 商品初始库存
      skuPackFee: "", // 商品包装费
      skuId: "",
    })
    this.setData({
      specList
    })
  },

  delSpecList({
    currentTarget
  }) {
    let {
      index
    } = currentTarget.dataset;
    let {
      specList
    } = this.data;
    specList.splice(index, 1);
    this.setData({
      specList
    })
  },

  // 名称
  specName(e) {
    let {
      index,
      name
    } = e.currentTarget.dataset;
    let value = 0;
    if(!isNaN(e.detail.value)) {
      value = parseInt(e.detail.value);
    } else {
       value = e.detail.value;
    }
    this.handleInput({
      index,
      [name]: value
    })
  },


  // handle
  handleInput(params) {
    let {
      specList
    } = this.data;
    let {
      index
    } = params;
    for (var i in params) {
      if (i != 'index') {
        specList[index][i] = params[i]
      }
    }
    this.setData({
      specList
    })
  },

  // 确认
  sure() {
    let {
      specList
    } = this.data;
    let isBack = 0;
    specList.map((item) => {
      if (!item.name || !item.price || !item.stock) {
        app.tip("请查看规格名称、售价、库存是否填写。")
        isBack = 1;
      }
    })
    if (isBack) return;

    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    prevPage.setData({
      goodsSpec: JSON.stringify(specList)
    })
    wx.navigateBack({
      delta: 1
    })
  }

})