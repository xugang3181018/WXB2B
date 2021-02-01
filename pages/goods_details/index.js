import {
  goodsDetails,
  goodsDetail
} from '../../api/index.js';
import util from '../../utils/util'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '商品详情'
    },
    attribute: {
      'cartAttr': false
    }, //属性是否打开
    coupon: {
      'coupon': false,
      list: [],
    },
    attr: '请选择', //属性页面提示
    attrValue: '', //已选属性
    animated: false, //购物车动画
    id: 0, //商品id
    storeInfo: {}, //商品详情
    productAttr: [], //组件展示属性
    productValue: [], //系统属性
    productSelect: {}, //属性选中规格
    cart_num: 1, //购买数量
    isOpen: false, //是否打开属性组件
    actionSheetHidden: true,
    posterImageStatus: false,
    posterbackgd: '/images/posterbackgd.png',
    uid: 0, //用户uid
    circular: false,
    autoplay: false,
    interval: 3000,
    duration: 500,
    clientHeight: "",
    good_list: [],
    isDown: true,
    storeSelfMention: true,
    storeItems: {},
    storeList: [],
    activity: [],
    iSplus: true,
    navH: "",
    navList: [],
    opacity: 0,
    scrollY: 0,
    topArr: [],
    toView: '',
    height: 0,
    heightArr: [],
    lock: false,
  },
  returns: function () {
    wx.navigateBack();
  },
  tap: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    if (!this.data.good_list.length && id == "past2") {
      id = "past3"
    }
    this.setData({
      toView: id,
      navActive: index,
      lock: true
    });
  },
  scroll: function (e) {
    var that = this,
      scrollY = e.detail.scrollTop;
    var opacity = scrollY / 200;
    opacity = opacity > 1 ? 1 : opacity;
    that.setData({
      opacity: opacity,
      scrollY: scrollY
    })
    if (that.data.lock) {
      that.setData({
        lock: false
      })
      return;
    }
    for (var i = 0; i < that.data.topArr.length; i++) {
      if (scrollY < that.data.topArr[i] + that.data.heightArr[i]) {
        that.setData({
          navActive: i
        });
        break
      }
    }
  },
  /**
   * 购物车手动填写
   * 
   */
  iptCartNum: function (e) {
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
      // productSelect.cart_num++;
      // this.setData({
      //   storeInfo: productSelect,
      //   cart_num: productSelect.cart_num
      // });
      productSelect.cart_num = productSelect.cart_num + (productSelect.packaging.purchaseFactor || 1);
      //小于1时,等于1
      // if (productSelect.cart_num < 1) productSelect.cart_num = 1;
      this.setData({
        storeInfo: productSelect,
        cart_num: productSelect.cart_num
      });
    } else {
      // //数量减
      // productSelect.cart_num--;
      // //小于1时,等于1
      // if (productSelect.cart_num < 1) productSelect.cart_num = 1;
      // this.setData({
      //   storeInfo: productSelect,
      //   cart_num: productSelect.cart_num
      // });
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
    let {
      merchantType
    } = this.data
    // var productSelect = this.data.productValue[values];
    var storeInfo = this.data.storeInfo;
    storeInfo.select = true
    if (values.goodsPackageId) {
      storeInfo.deliveryPrice = merchantType == 1 || merchantType == 5 ? values.wholesalePrice : values.deliveryPrice
      storeInfo.cart_num = values.purchaseFactor
      storeInfo.packaging = values
      this.setData({
        attrValue: values.goodsUnitName,
        storeInfo: storeInfo,
        attr: '已选择',
      });
    } else {
      if (values.purchaseFactor > storeInfo.cart_num) {
        wx.showToast({
          title: values.purchaseFactor + values.goodsUnitName + "起订",
          icon: 'none'
        })
        storeInfo.cart_num = values.purchaseFactor
      }
      storeInfo.deliveryPrice = merchantType == 1 || merchantType == 5 ? values.wholesalePrice : values.deliveryPrice,
        storeInfo.packaging = values,
        // storeInfo.cart_num = storeInfo.purchaseFactor || 1
        this.setData({
          attrValue: values.goodsUnitName,
          storeInfo: storeInfo,
          attr: '已选择'
        });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.removeStorageSync('cartList')
    let item = options.item
    let data = JSON.parse(decodeURIComponent(item))
    var that = this;
    this.setData({
      navH: app.globalData.navHeight,
      id: data.supplierGoodsId || data.goodsId,
      code: data.supplierCode,
      unit: data.goodsUnit,
      goodsCode: data.goodsCode,
      merchantType: app.globalData.merchantType
    });
    let arr = [{
      // wx.getStorageSync('supplierCode').code,
      merchantCode: wx.getStorageSync("login").merchantCode,
      supplierCode: data.supplierCode,
      goodsCode: data.goodsCode
    }]
    this.getGoodsDetails(arr);
    // goodsDetail({

    //   }).then(res => {
    //   console.log(res)
    // })
    //设置商品列表高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: (res.windowHeight) * (750 / res.windowWidth) - 98 - that.data.navH
          //res.windowHeight:获取整个窗口高度为px，*2为rpx；98为头部占据的高度；
        })
      },
    });
    // this.getGoodsDetails();
    // this.getList();
  },
  setClientHeight: function () {
    if (!this.data.good_list.length) return;
    var query = wx.createSelectorQuery().in(this);
    query.select("#list0").boundingClientRect();
    var that = this;
    query.exec(function (res) {
      that.setData({
        clientHeight: res[0].height + 20
      });
    });
  },
  infoScroll: function () {
    var that = this,
      topArr = [],
      heightArr = [];
    for (var i = 0; i < that.data.navList.length; i++) { //productList
      //获取元素所在位置
      var query = wx.createSelectorQuery().in(this);
      var idView = "#past" + i;
      if (!that.data.good_list.length && i == 2) {
        var idView = "#past" + 3;
      }
      query.select(idView).boundingClientRect();
      query.exec(function (res) {
        var top = res[0].top;
        var height = res[0].height;
        topArr.push(top);
        heightArr.push(height);
        that.setData({
          topArr: topArr,
          heightArr: heightArr
        });
      });
    };
  },

  //选择包装规格
  tapAttr: function (e) {
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
    this.setData({
      storeInfo: productSelect,
      cart_num: productSelect.cart_num
    });
  },
  CartNumInt: function () {
    //数量加
    var productSelect = this.data.storeInfo;
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
   * 获取产品详情
   * 
   */
  getGoodsDetails: function (arr) {
    goodsDetail({
      // superMerchantCode: wx.getStorageSync("login").appId,
      // merchantCode: wx.getStorageSync("login").merchantCode,
      // supplierCode: this.data.code,
      // procurementOrderJson: JSON.stringify(arr)
      
      merchantCode: wx.getStorageSync("login").merchantCode,
      supplierCode: this.data.code,
      goodsCode:this.data.goodsCode,
      procurementOrderJson: JSON.stringify(arr)
    }).then(res => {
      if (res.code == 'SUCCESS' && res.result) {
        console.log(res,"商品详情")
        res.result.cart_num = 1
        res.result.goodsUnit = this.data.unit
        res.result.select = false
        // let status = wx.getStorageSync("supplierCode").type
        let {
          merchantType
        } = this.data
        // console.log(status)
        let money = 0
        if (merchantType == 1 || merchantType == 5) {
          money = res.result.packageResponseList[0].wholesalePrice || res.result.packageResponseList[0].deliveryPrice || ""
        } else {
          money = res.result.packageResponseList[0].deliveryPrice || res.result.packageResponseList[0].wholesalePrice || ""
        }
        // if (res.result.packageResponseList.length == 1) {
          res.result.packaging = res.result.packageResponseList[0]
          res.result.cart_num = res.result.packageResponseList[0].purchaseFactor
          res.result.select = true
          if (merchantType == 1 || merchantType == 5) {
            res.result.deliveryPrice = res.result.packageResponseList[0].wholesalePrice
          } else {
            res.result.deliveryPrice = res.result.packageResponseList[0].deliveryPrice
          }
        // }
        this.setData({
          storeInfo: res.result,
          money: money,
          attr: '请选择',
          title: res.result.goodsCategoryName
        })
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
      //   // let status = wx.getStorageSync("supplierCode").type
      //   let {
      //     merchantType
      //   } = this.data
      //   // console.log(status)
      //   let money = 0
      //   if (merchantType == 1 || merchantType == 5) {
      //     money = res.result[0].packageResponseList[0].wholesalePrice || res.result[0].packageResponseList[0].deliveryPrice || ""
      //   } else {
      //     money = res.result[0].packageResponseList[0].deliveryPrice || res.result[0].packageResponseList[0].wholesalePrice || ""
      //   }
      //   if (res.result[0].packageResponseList.length == 1) {
      //     res.result[0].packaging = res.result[0].packageResponseList[0]
      //     res.result[0].cart_num = res.result[0].packageResponseList[0].purchaseFactor
      //     res.result[0].select = true
      //     if (merchantType == 1 || merchantType == 5) {
      //       res.result[0].deliveryPrice = res.result[0].packageResponseList[0].wholesalePrice
      //     } else {
      //       res.result[0].deliveryPrice = res.result[0].packageResponseList[0].deliveryPrice
      //     }
      //   }
      //   this.setData({
      //     storeInfo: res.result[0],
      //     money: money,
      //     attr: '请选择',
      //     title: res.result[0].goodsCategoryName
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
  goPages: function (e) {
    wx.navigateTo({
      url: 'pages/goods_details/index?id=' + e.currentTarget.dataset.id
    });
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
   * 打开属性插件
   */
  selecAttr: function () {
    let {
      storeInfo,
    } = this.data
    console.log(storeInfo)
    // if(storeInfo.packageResponseList.length>1){
      this.setData({
        'attribute.cartAttr': true,
        isOpen: true
      })
    // }
  },
  onMyEvent: function (e) {
    this.setData({
      'attribute.cartAttr': e.detail.window,
      isOpen: false
    });
  },
  /**
   * 打开属性加入购物车
   * 
   */
  // addCart: function (e) {
  //   this.goCat();
  // },
  /*
   * 加入购物车
   */
  goCat: function (isPay) {
    let {
      storeInfo,
      attrValue
    } = this.data
    console.log(storeInfo)
    if(!storeInfo.packaging.wholesalePrice)return app.Tips({title: '该商品不可购买'});
    // let storeInfo = this.data.storeInfo;
    //打开属性
    // this.setData({
    //   'attribute.cartAttr': !this.data.attribute.cartAttr
    // });
    //如果有属性,没有选择,提示用户选择
    if (!storeInfo.select) return app.Tips({
      title: '请选择包装'
    });
    if (storeInfo.select) {
      let cartList = util.addcart(storeInfo, attrValue)
      let sumCount = util.getCartCount(cartList)
      app.cartCount(sumCount)
      this.setData({
        // cartList: cartList,
        sumCount: sumCount,
        'attribute.cartAttr': false,
        isOpen: false
      })
      app.Tips({
        title: '添加成功'
      })
    }
  },
  goCatBtn(){
    wx.switchTab({
      url:'/pages/order_addcart/order_addcart'
    })
  },
  goListBtn(){
    wx.switchTab({
      url:'/pages/goods_cate/goods_cate'
    })
  },
  /**
   * 获取购物车数量
   */
  // getCartCount: function (data) {
  //   let sumCount = 0
  //   data.map(item => {
  //     item.list.map(i => {
  //       sumCount += Number(i.cart_num)
  //     })
  //   })
  //   wx.setStorageSync('sumCount', sumCount)
  //   return sumCount
  // },
  onShow() {
    let cartList = wx.getStorageSync("cartList") || []
    let sumCount = util.getCartCount(cartList)
    app.cartCount(sumCount)
    this.setData({
      cartList: cartList,
      sumCount: sumCount,
      merchantType: app.globalData.merchantType
    })
  },
  // onHide(){
  //   console.log(this.data.cartList)
  //   wx.setStorageSync("cartList", this.data.cartList)
  // },
  // onUnload(){
  //   console.log(this.data.cartList)

  // },
})