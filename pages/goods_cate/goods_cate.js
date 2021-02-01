import {
  categoryList,
  goodsList,
  goodsList2,
  goodsDetail
} from '../../api/index.js'
import util from '../../utils/util.js';

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navlist: [],
    productList: [],
    navActive: -1,
    parameter: {
      'navbar': '1',
      'return': '0',
      'title': '产品分类'
    },
    orderList: '',
    navH: "",
    number: "",
    triggered: true,
    attribute: {
      'cartAttr': false
    }, //属性是否打开
    isOpen: true, //是否打开属性组件
    attr: '请选择', //属性页面提示
    attrValue: '', //已选属性
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(this.data.navH, options.merchantCode, app.commonParams('merchantCode'), options.merchantType, app.globalData.merchantType, options)
    console.log(app.globalData.merchantType)
  },
  onPullDownRefresh() {
    console.log("正在下拉刷新");
  },
  infoScroll: function () {
    let that = this;
    let len = that.data.productList.length;
    console.log(that.data.productList[len - 1], len)
    that.setData({
      navH: app.globalData.navHeight,
      number: that.data.productList[len - 1].children.length
    })
    //设置商品列表高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: (res.windowHeight) * (750 / res.windowWidth) - 98 - app.globalData.navHeight
          //res.windowHeight:获取整个窗口高度为px，*2为rpx；98为头部占据的高度；
        })
      },
    });
  },

  // 请求分类数据
  getAllCategory: function () {
    var that = this;
    categoryList({
      categoryScene: 1,
      merchantCode: this.data.merchantCode
    }).then(res => {
      that.setData({
        productList: res.result
      });
      that.infoScroll();
    })
  },

  // 请求商品列表数据参数

  listParams() {
    console.log(wx.getStorageSync("supplierCode").code)
    console.log(this.data.merchantCode, this.data.merchantType)
    let params = {
      merchantCode: this.data.merchantCode,
      currentPage: 1,
      pageSize: 20
    }
    return params
  },

  //扫码获取商品条码
  getBarCode() {
    let that = this
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        if (res.result) {
          let params = that.listParams()
          that.setData({
            navActive: -1,
          })
          params.goodsBarcode = res.result
          that.getGoodsList(params)
        }
      }
    })
  },


  // 请求商品列表数据
  getGoodsList(params, isMore, type) {
    console.log(params)
    wx.showLoading()
    goodsList(params).then(res => {
      wx.hideLoading()
      if (res.code == "SUCCESS") {
        if (!res.result.items) {
          wx.showToast({
            title: '暂无数据',
            icon: 'none'
          })
        }
        console.log(res)
        if (isMore) {
          //分页加载更多
          let _tradeMerchant = this.data.orderList
          _tradeMerchant.items = _tradeMerchant.items.concat(res.result.items)
          _tradeMerchant.currentPage = res.result.currentPage
          let summaryHasMore = (res.result.pageCount == _tradeMerchant.currentPage) ? false : true
          this.setData({
            summaryHasMore: summaryHasMore,
            orderList: _tradeMerchant,
          })
        } else {
          let summaryHasMore = (res.result.pageCount && res.result.pageCount > 1) ? true : false
          this.setData({
            summaryHasMore: summaryHasMore,
            orderList: res.result,
          })
        }
      } else if (res.code == "FAILED") {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  //分页数据
  scroll(e) {
    let params = this.listParams()
    console.log(params, this.data.summaryHasMore)
    if (this.data.goodsCategoryId == -1 && this.data.summaryHasMore) {
      params.currentPage = this.data.orderList.currentPage + 1
      this.getGoodsList(params, true)
    } else if (this.data.goodsCategoryId && this.data.summaryHasMore) {
      params.currentPage = this.data.orderList.currentPage + 1
      params.goodsCategoryId = this.data.goodsCategoryId
      console.log(params, "根据id分页加载数据")
      this.getGoodsList(params, true)
    } else if (this.data.goodsName && this.data.summaryHasMore) {
      params.currentPage = this.data.orderList.currentPage + 1
      params.goodsName = this.data.goodsName
      console.log(params, "根据名字分页加载")
      this.getGoodsList(params, true)
    } else if (this.data.summaryHasMore) {
      params.currentPage = this.data.orderList.currentPage + 1
      console.log(params, "分页加载")
      this.getGoodsList(params, true)
    }
  },
  // 搜索商品
  searchSubmitValue: function (e) {
    console.log(e.detail.value)
    let value = e.detail.value
    console.log(value,"搜索商品的数据",isNaN(value))
    if (value.length > 0) {
      let params = this.listParams()
      this.setData({
        navActive: -1,
        goodsName:value
      })
      if(!isNaN(value)){
        params.goodsCode = value
      }else{
        params.goodsName = value
      }
      this.getGoodsList(params)
    } else {
      return app.Tips({
        title: '请填写要搜索的产品信息'
      });
    }
  },

  //切换分类
  tap1(e) {
    let index = e.currentTarget.dataset.index
    console.log(e.currentTarget.id)
    wx.setStorageSync("id", e.currentTarget.id)
    console.log(index, this.data.navOne)
    if (index == this.data.navOne) {
      this.setData({
        goodsCategoryId: e.currentTarget.id,
        navActive: index,
        navOne: -1,
        navThree: -1,
        classifyList:[]
      })
    } else {
      this.setData({
        goodsCategoryId: e.currentTarget.id,
        navActive: index,
        navOne: index,
        navTwo: -1,
        navThree: -1,
        classifyList:[]
      })
    }
    wx.setStorageSync("index", index)
    wx.setStorageSync("navTwo", -1)
    let params = this.listParams()
    //   let info = wx.getStorageSync("supplierCode")
    // console.log(info)
    if (e.currentTarget.id === "-1") {
      this.getGoodsList(params)
      // if (info.type == 1){
      //   this.getGoodsList(params)
      // } else if (info.type == 2){
      //   this.getGoodsList2()
      // }
    } else {
      params.goodsCategoryId = this.data.goodsCategoryId
      this.getGoodsList(params)
      // if (info.type == 1) {
      //   this.getGoodsList(params)
      // } else if (info.type == 2) {
      //   this.getGoodsList2(this.data.goodsCategoryId)
      // }
    }
  },
  tap2(e) {
    console.log(e)
    let data = e.currentTarget.dataset
    let index = data.index
    let classify = data.item
    let tap = data.tap
    console.log(tap)
    if (tap == 2) {
      console.log("2")
      if (classify.children) {
        this.setData({
          classifyList: classify.children
        })
        wx.setStorageSync("classifyList", classify.children)
      }
      this.setData({
        goodsCategoryId: e.currentTarget.id,
        navTwo: index,
        navThree: -1
      })
      // if (index == this.data.navTwo) {
      //   this.setData({
      //     goodsCategoryId: e.currentTarget.id,
      //     navTwo: index,
      //     navThree: -1
      //   })
      // } else {
      //   this.setData({
      //     goodsCategoryId: e.currentTarget.id,
      //     navTwo: index,
      //     // navThree: -1
      //   })
      // }
      wx.setStorageSync("navTwo", index)
      wx.setStorageSync("navThree", -1)
    } else if (tap == 3) {
      console.log("3")
      this.setData({
        navThree: index
      })
      wx.setStorageSync("navThree", index)
    }
    let params = this.listParams()
    params.goodsCategoryId = e.currentTarget.id
    this.getGoodsList(params)
    wx.setStorageSync("id", e.currentTarget.id)
    // let params = this.listParams()
    // params.goodsCategoryId = this.data.goodsCategoryId
    // this.getGoodsList(params)
    // let info = wx.getStorageSync("supplierCode")
    // if (info.type == 1) {
    //   this.getGoodsList(params)
    // } else if (info.type == 2) {
    //   this.getGoodsList2(this.data.goodsCategoryId)
    // }
  },
  tap3(e) {
    let index = e.currentTarget.dataset.index
    if (index == this.data.navThree) {
      this.setData({
        goodsCategoryId: e.currentTarget.id,
        navThree: -1
      })
    } else {
      this.setData({
        goodsCategoryId: e.currentTarget.id,
        navThree: index
      })
    }
    let params = this.listParams()
    params.goodsCategoryId = this.data.goodsCategoryId
    this.getGoodsList(params)
    // let info = wx.getStorageSync("supplierCode")
    // if (info.type == 1) {
    //   this.getGoodsList(params)
    // } else if (info.type == 2) {
    //   this.getGoodsList2(this.data.goodsCategoryId)
    // }
  },

  skipDetail({
    currentTarget
  }) {
    console.log(currentTarget)
    let item = currentTarget.dataset.item,
      {
        merchantType
      } = this.data
    console.log(item)
    if (merchantType == 1 || merchantType == 5) {
      if (!item.wholesalePrice) {
        wx.showToast({
          title: '该商品无法购买',
          icon: 'none',
          duration: 2000
        })
        return
      }
    } else {
      if (!item.deliveryPrice) {
        wx.showToast({
          title: '该商品无法购买',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }

    let data = encodeURIComponent(JSON.stringify(item))
    console.log(data)
    wx.navigateTo({
      // url:`/pages/goods_details/index?id={{$item.supplierGoodsId || item.goodsId}}&title={{item.goodsName}}&code={{item.supplierCode || item.merchantCode}}&unit={{item.goodsUnit}}&goodsCode={{item.goodsCode}}`,
      url: '/pages/goods_details/index?item=' + data,
    })
  },

  /**
   * 打开属性插件
   */
  selecAttr: function ({
    currentTarget
  }) {
    this.setData({
      'attribute.cartAttr':true,
      isOpen: false
    });
    console.log(currentTarget)
    let arr = [{
      merchantCode: app.commonParams('merchantCode'),
      supplierCode: currentTarget.dataset.suppliercode,
      goodsCode: currentTarget.id
    }]
    this.getGoodsDetails(arr, currentTarget.dataset.suppliercode,currentTarget.id);
  },
  onMyEvent: function (e) {
    this.setData({
      'attribute.cartAttr': e.detail.window,
      isOpen: false
    });
  },




  /**
   * 购物车手动填写
   * 
   */
  iptCartNum: function (e) {
    console.log(e)
    var productSelect = this.data.storeInfo;
    productSelect.cart_num = Number(e.detail)
    this.setData({
      storeInfo: productSelect,
      cart_num: e.detail
    });
  },
  /**
   * 购物车数量加和数量减
   * 
   */
  ChangeCartNum: function (e) {
    console.log(e)
    //是否 加|减
    var changeValue = e.detail;
    //获取当前变动属性
    // var productSelect = this.data.storeInfo;
    // if (productSelect.cart_num == undefined) productSelect.cart_num = 1;
    var productSelect = this.data.storeInfo;
    if (!productSelect.packaging) {
      wx.showToast({
        title: '请选择包装',
        icon: 'none',
      })
      return
    }
    //数量+
    if (changeValue) {
      productSelect.cart_num = productSelect.cart_num + (productSelect.packaging.purchaseFactor || 1);
      this.setData({
        storeInfo: productSelect,
        cart_num: productSelect.cart_num
      });
    } else {
      if (productSelect.cart_num <= productSelect.packaging.purchaseFactor){
        app.tip(productSelect.packaging.purchaseFactor + productSelect.packaging.goodsUnitName + "起订",)
        return
      } 
      productSelect.cart_num = productSelect.cart_num - (productSelect.packaging.purchaseFactor || 1);
      //数量减
      this.setData({
        storeInfo: productSelect,
        cart_num: productSelect.cart_num
      });
    }
  },
  /**
   * 属性变动赋值
   * 
   */
  ChangeAttr: function (e) {
    var values = e.detail
    console.log(values,"获取选择的包装")
    // var productSelect = this.data.productValue[values];
    var storeInfo = this.data.storeInfo;
    storeInfo.select = true
    console.log(values, values.goodsPackageId)

    // if (values.goodsPackageId) {
    //   storeInfo.deliveryPrice = values.deliveryPrice || values.wholesalePrice
    //   storeInfo.cart_num = values.purchaseFactor
    //   storeInfo.packaging = values
    //   this.setData({
    //     storeInfo: storeInfo,
    //   });
    // } else {
      if (values.purchaseFactor > storeInfo.cart_num) {
        wx.showToast({
          title: values.purchaseFactor + values.goodsUnitName + "起订",
          icon: 'none'
        })
        storeInfo.cart_num = values.purchaseFactor
      }
      storeInfo.deliveryPrice = values.deliveryPrice || values.wholesalePrice || this.data.money,
        storeInfo.packaging = values,
        storeInfo.cart_num = values.purchaseFactor || 1
        this.setData({
          storeInfo: storeInfo
        });
    // }


    // if (values.goodsPackageId) {
    //   storeInfo.deliveryPrice = values.deliveryPrice || values.wholesalePrice
    //   storeInfo.cart_num = values.purchaseFactor
    //   storeInfo.packaging = values
    //   this.setData({
    //     attrValue: values.goodsUnitName,
    //     storeInfo: storeInfo,
    //     attr: '已选择'
    //   });
    // } else {
    //   if (values.purchaseFactor > storeInfo.cart_num) {
    //     wx.showToast({
    //       title: values.purchaseFactor + values.goodsUnitName + "起订",
    //       icon: 'none'
    //     })
    //     storeInfo.cart_num = values.purchaseFactor
    //   }
    //   storeInfo.deliveryPrice = values.deliveryPrice || values.wholesalePrice || this.data.money,
    //     storeInfo.packaging = values,
    //     storeInfo.cart_num = storeInfo.purchaseFactor || 1
    //     this.setData({
    //       attrValue: values.goodsUnitName,
    //       storeInfo: storeInfo,
    //       attr: '已选择'
    //     });
    // }
  },
  //选择包装规格
  tapAttr: function (e) {
    console.log(e)
    // 选中属性的下标
    let indexn = e.currentTarget.dataset.indexn,
      value = e.currentTarget.dataset.item
    this.setData({
      indexn: indexn
    })
    this.ChangeAttr(value);
  },

  // 数量加减
  CartNumDes: function () {
    var productSelect = this.data.storeInfo;
    console.log(productSelect, "数量减")
    if (!productSelect.packaging) {
      wx.showToast({
        title: '请选择包装',
        icon: 'none',
      })
      return
    }
    if (productSelect.cart_num <= productSelect.packaging.purchaseFactor) return
    productSelect.cart_num = productSelect.cart_num - (productSelect.packaging.purchaseFactor || 1);
    //数量减
    console.log(productSelect)
    this.setData({
      storeInfo: productSelect,
      cart_num: productSelect.cart_num
    });
  },
  CartNumInt: function () {
    //数量加
    var productSelect = this.data.storeInfo;
    console.log(productSelect, "数量加")
    if (!productSelect.packaging) {
      wx.showToast({
        title: '请选择包装',
        icon: 'none',
      })
      return
    }
    productSelect.cart_num = productSelect.cart_num + (productSelect.packaging.purchaseFactor || 1);
    //小于1时,等于1
    // if (productSelect.cart_num < 1) productSelect.cart_num = 1;
    this.setData({
      storeInfo: productSelect,
      cart_num: productSelect.cart_num
    });
  },

  // 手动填写数量
  // bindCode(e){
  //   console.log(e.detail.value)
  //   var productSelect = this.data.storeInfo;
  //   productSelect.cart_num = Number(e.detail.value);
  //   this.setData({
  //     storeInfo: productSelect,
  //     cart_num: productSelect.cart_num
  //   });
  // },

  //手动填写数量失焦事件
  bindAmount(e) {
    let productSelect = this.data.storeInfo;
    if (!productSelect.packaging) {
      wx.showToast({
        title: '请选择包装',
        icon: 'none',
      })
      return
    }
    console.log(productSelect)
    let cart_num = Number(e.detail.value)
    if (cart_num > productSelect.packaging.purchaseFactor) {
      productSelect.cart_num = Number((Math.ceil(cart_num / productSelect.packaging.purchaseFactor)) * productSelect.packaging.purchaseFactor)
    } else if (cart_num < productSelect.packaging.purchaseFactor) {
      productSelect.cart_num = productSelect.packaging.purchaseFactor
    }
    this.setData({
      storeInfo: productSelect,
      cart_num: productSelect.cart_num
    })
  },


  /**
   * 
   * 加入购物车
   */
  addCart() {
    let {
      storeInfo,
      attrValue
    } = this.data
    if(!storeInfo.packaging.wholesalePrice)return app.Tips({title: '该商品不可购买'});
    if (!storeInfo.select) return app.Tips({
      title: '请选择包装'
    });
    if (storeInfo.select) {
      util.addcart(storeInfo, attrValue)
      this.setData({
        'attribute.cartAttr': false,
      })
      app.Tips({
        title: '添加成功'
      })
    }
    let cartList = wx.getStorageSync("cartList") || []
    let sumCount = util.getCartCount(cartList)
    app.cartCount(sumCount)
  },

  /**
   * 获取产品详情
   * 
   */
  getGoodsDetails: function (arr, supplierCode,goodsCode) {
    goodsDetail({
      // superMerchantCode: wx.getStorageSync("login").appId,
      // merchantCode: wx.getStorageSync("login").merchantCode,
      // supplierCode,
      // procurementOrderJson: JSON.stringify(arr)

      merchantCode: wx.getStorageSync("login").merchantCode,
      supplierCode,
      goodsCode,
      procurementOrderJson: JSON.stringify(arr)
    }).then(res => {
      console.log(res.result)
      if (res.code == 'SUCCESS' && res.result) {
        console.log(res)
        res.result.cart_num = 1
        res.result.goodsUnit = this.data.unit
        res.result.select = false
        let status = wx.getStorageSync("supplierCode").type
        console.log(status)
        let money = 0
        if (status == 1) {
          money = res.result.packageResponseList[0].wholesalePrice || res.result.packageResponseList[0].deliveryPrice
        } else {
          money = res.result.packageResponseList[0].deliveryPrice || res.result.packageResponseList[0].wholesalePrice
        }
        // if (res.result.packageResponseList.length == 1) {
          res.result.packaging = res.result.packageResponseList[0]
          res.result.cart_num = res.result.packageResponseList[0].purchaseFactor
          res.result.select = true
          res.result.deliveryPrice = res.result.packageResponseList[0].deliveryPrice || res.result.packageResponseList[0].wholesalePrice
        // }
        this.setData({
          storeInfo: res.result,
          money: money,
        })
        console.log(res.result)
        // if(res.result.packageResponseList.length>1){
        //   this.setData({
        //     'attribute.cartAttr': true,
        //     isOpen: true
        //   })
        // }else{
        //   this.addCart()
        // }
      } else {
        wx.showToast({
          title: '暂无数据',
          icon: 'none',
        })
        // wx.switchTab({
        //   url:'/pages/goods_cate/goods_cate'
        // })
      }

      
      // if (res.code == 'SUCCESS' && res.result) {
      //   console.log(res)
      //   res.result[0].cart_num = 1
      //   res.result[0].goodsUnit = this.data.unit
      //   res.result[0].select = false
      //   let status = wx.getStorageSync("supplierCode").type
      //   console.log(status)
      //   let money = 0
      //   if (status == 1) {
      //     money = res.result[0].packageResponseList[0].wholesalePrice || res.result[0].packageResponseList[0].deliveryPrice
      //   } else {
      //     money = res.result[0].packageResponseList[0].deliveryPrice || res.result[0].packageResponseList[0].wholesalePrice
      //   }
      //   if (res.result[0].packageResponseList.length == 1) {
      //     res.result[0].packaging = res.result[0].packageResponseList[0]
      //     res.result[0].cart_num = res.result[0].packageResponseList[0].purchaseFactor
      //     res.result[0].select = true
      //     res.result[0].deliveryPrice = res.result[0].packageResponseList[0].deliveryPrice || res.result[0].packageResponseList[0].wholesalePrice
      //   }
      //   this.setData({
      //     storeInfo: res.result[0],
      //     money: money,
      //     attr: '请选择'
      //   })
      // } else {
      //   wx.showToast({
      //     title: '暂无数据',
      //     icon: 'none',
      //   })
      //   // wx.switchTab({
      //   //   url:'/pages/goods_cate/goods_cate'
      //   // })
      // }
    })
  },
  /**
   * 默认选中属性
   * 
   */
  DefaultSelect: function () {
    var productAttr = this.data.productAttr,
      storeInfo = this.data.storeInfo,
      productSelect = this.data.productSelect;
    if (productSelect) {
      this.setData({
        productSelect: storeInfo,
        attr: '已选择'
      });
    } else {
      this.setData({
        attrValue: value,
        attr: '已选择'
      });
    }
    this.setData({
      productAttr: productAttr
    });
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // let info = wx.getStorageSync("supplierCode")
    // let params = this.listParams()
    // if (info.type == 1) {
    //   this.getGoodsList(params)
    // } else if (info.type == 2) {
    //   this.getGoodsList2()
    // }
    let type = wx.getStorageSync("merchantType")
    console.log(wx.getStorageSync("index"))
    let navActive = wx.getStorageSync("index") || wx.getStorageSync("index") === 0 ? wx.getStorageSync("index") : -1
    let navOne = wx.getStorageSync("index") == 0 ? wx.getStorageSync("index") : (wx.getStorageSync("index") || -1)
    let navTwo = wx.getStorageSync("navTwo") == 0 ? wx.getStorageSync("navTwo") : (wx.getStorageSync("navTwo") || -1)
    let navThree = wx.getStorageSync("navThree") == 0 ? wx.getStorageSync("navThree") : (wx.getStorageSync("navThree") || -1)
    let classifyList = wx.getStorageSync("classifyList").length ? wx.getStorageSync("classifyList") : []
    let goodsCategoryId = wx.getStorageSync("id")
    console.log(type, navActive)
    this.setData({
      goodsCategoryId,
      navActive,
      navOne,
      navTwo,
      navThree,
      classifyList,
      // navThree: -1,
      type: type,
      // ...wx.getStorageSync('login'),
      merchantCode: app.commonParams('merchantCode'),
      merchantType: app.globalData.merchantType
    })
    console.log(app.commonParams('merchantCode'), app.globalData.merchantType)
    let params = this.listParams()
    if (navActive != -1) {
      params.goodsCategoryId = this.data.goodsCategoryId
    }
    this.getGoodsList(params)


    this.getAllCategory();
    // this.getGoodsList(params)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let cartList = wx.getStorageSync("cartList") || []
    let sumCount = util.getCartCount(cartList)
    app.cartCount(sumCount)
    // let info = wx.getStorageSync("supplierCode")
   
    // if (info.type == 1) {
    //   this.getGoodsList(params)
    // } else if (info.type == 2) {
    //   this.getGoodsList2()
    // }
  },

})