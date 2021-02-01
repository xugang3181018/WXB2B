// import {
//   getCartList,
//   getCartCounts,
//   changeCartNum,
//   cartDel
// } from '../../api/order.js';
import {
  addPurchaseOrder,
  orderSave,
  detailByCode,
  orderStorageByBatch
} from '../../api/index.js';

const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '0',
      'title': '购物车',
      'color': false
    },
    navH: 0,
    cartCount: 0,
    goodsHidden: true,
    footerswitch: true,
    host_product: [],
    cartList: [],
    isAllSelect: true, //全选
    selectValue: [], //选中的数据
    selectCountPrice: 0.00,
    isGoIndex: true,
    iShidden: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      navH: app.globalData.navHeight,
    });
    if (app.globalData.token) that.setData({
      iShidden: true
    });
  },
  /**
   * input阻止冒泡
   * 
   */
  proventD: function () {},
  /**
   * 手动输入数量失焦事件
   */
  inpBlur(e) {
    console.log(Number(e.detail.value))
    let cart_num = Number(e.detail.value)
    let that = this,
      data = e.currentTarget.dataset.item;
    that.data.cartList.map(item => {
      if (item.merchantCode == data.merchantCode) {
        item.list.map(i => {
          if (i.id == data.id) {
            console.log(i)
            if (cart_num < i.packaging.purchaseFactor) {
              i.cart_num = i.packaging.purchaseFactor
              wx.showToast({
                title: item.packaging.purchaseFactor + item.packaging.goodsUnitName + "起购",
                icon: "none"
              })
            } else {
              i.cart_num = Number((Math.ceil(cart_num / i.packaging.purchaseFactor)) * i.packaging.purchaseFactor)
            }
          }
        })
      }
    })
    this.setData({
      cartList: this.data.cartList
    })
    this.switchSelect();
    this.getCartCount(this.data.cartList)
    wx.setStorageSync("cartList", this.data.cartList)
    this.cartNum(this.data.cartList)
  },
  /**
   * 删除商品
   * 
   */
  subDel: function (event) {
    console.log(event)
    let that = this,
      validList = that.data.cartList,
      selectValue = that.data.selectValue;
    console.log(validList, selectValue)
    if (selectValue.length > 0) {
      validList.map(item => {
        item.list = item.list.filter(i => i.checked == false)
      })
      that.setData({
        cartList: validList
      })
      that.getCartCount(validList)
      wx.setStorageSync("cartList", validList)
      this.cartNum(validList)
    } else {
      return app.Tips({
        title: '请选择产品'
      });
    }
  },
  getSelectValueProductId: function () {
    var that = this;
    var validList = that.data.cartList.valid;
    var selectValue = that.data.selectValue;
    var productId = [];
    if (selectValue.length > 0) {
      for (var index in validList) {
        if (that.inArray(validList[index].id, selectValue)) {
          productId.push(validList[index].product_id);
        }
      }
    };
    return productId;
  },
  subCollect: function (event) {
    let that = this,
      selectValue = that.data.selectValue;
    if (selectValue.length > 0) {
      var selectValueProductId = that.getSelectValueProductId();
      collectAll(that.getSelectValueProductId().join(',')).then(res => {
        return app.Tips({
          title: res.msg,
          icon: 'success'
        });
      }).catch(err => {
        return app.Tips({
          title: err
        });
      });
    } else {
      return app.Tips({
        title: '请选择产品'
      });
    }
  },
  subOrder: function (event) {
    let {
      cartList,
      selectValue,
      merchantType
    } = this.data, list = [],
      index;
    if (selectValue.length > 0) {
      cartList.map(item => {
        console.log(item)
        item.list.map((data, index) => {
          if (item.merchantCode == data.merchantCode && data.checked) {
            console.log("333", index)
            list.push(item.list[index])
          }
        })
        // if (app.globalData.merchantType == 5 || merchantType == 5) {
        //   this.getDetailByCode(item, JSON.parse(JSON.stringify(list)))
        // } else {
        //   this.procurementOrder(item, JSON.parse(JSON.stringify(list)))
        // }
      })
      console.log(list,merchantType, "商品列表")
      if (merchantType == 5) {
        this.getDetailByCode(list)
      }else if (merchantType != 5) {
        this.procurementOrder(list)
      }
    } else {
      return app.Tips({
        title: '请选择商品'
      });
    }
  },

  delete({currentTarget}){
    let data = currentTarget.dataset,{cartList} = this.data;
    cartList.map(item=>{
      if(item.merchantCode === data.code){
        item.list.splice(data.index,1)
        return
      }
    })
    this.switchSelect();
    this.getCartCount(cartList)
    wx.setStorageSync("cartList", cartList)
    this.cartNum(cartList)
    this.setData({
      cartList
    })
  },

  //客户详情
  getDetailByCode(list) {
    detailByCode({
      appId: app.commonParams('appId'),
      merchantCode: app.commonParams('merchantCode')
    }).then(res => {
      console.log(res, res.result.salesMan, "客户详情")
      if (!res.result.salesMan) {
        wx.showToast({
          title: "业务员不存在",
          icon: 'none',
        })
        return
      }
      this.wholesaleOrder(list, res.result.salesMan)
    })
  },

  //批发单保存
  wholesaleOrder( list, salesOperatorId) {
    let params = {
      appId: app.commonParams('appId'),
      superMerchantCode: app.commonParams('appId'),
      wholesaleMerchantCode: app.commonParams('merchantCode'),
      merchantCode:this.data.parentMerchantCode,
      orderStatus: 1,
      salesOperatorId,
      operatorId: app.commonParams('operatorId'),
      wholesaleOrderJson: JSON.stringify(util.wholesaleOrderString(list)),
      orderSource: 1,
      // areaId: this.siteList[this.pichIndex].areaId
    }
    console.log(params,"下单参数")
    orderSave(params).then(res => {
      console.log(res)
      wx.showToast({
        title: res.msg,
        icon: 'none',
      })
      if (res.code == "SUCCESS") {
        this.subDel()
        wx.switchTab({
          url: '/pages/order_list/index?status=-1',
        })
      }
    })
  },

  //采购单保存
  procurementOrder(list) {
    console.log(JSON.stringify(util.concatString(list)))
    console.log(list)
    orderStorageByBatch({
      appId: app.commonParams('appId'),
      merchantCode: app.commonParams('merchantCode'),
      operatorId: app.commonParams('operatorId'),
      goodsDataJson: JSON.stringify(util.concatStringSave(list))
    }).then(res => {
      console.log(res, "采购单保存")
      wx.showToast({
        title: res.msg,
        icon: 'none',
      })
      if (res.code == "SUCCESS") {
        this.subDel()
        wx.switchTab({
          url: '/pages/order_list/index?status=-1',
        })
      }
    })
  },

  //全选全不选
  checkboxAllChange: function (event) {
    let value = event.detail.value,{cartList} = this.data;
    console.log(value, '全选')
    cartList.map(item=>{
      item.list.map(i=>{
        if (value.length > 0){
          item.checked = true
          i.checked = true
        }else{
          item.checked = false
          i.checked = false
        }
      })
    })
    this.setData({
      cartList
    })
    // if (value.length > 0) {
    //   // this.data.selectValue = []
    //   this.setAllSelectValue(1)
    //   console.log(this.data.selectValue, "全选")
    // } else {
    //   this.setAllSelectValue(0)
    //   this.data.selectValue = []
    //   console.log(this.data.selectValue, "全不选")
    // }
    this.switchSelect()
  },
  setAllSelectValue: function (status) {
    var valid = this.data.cartList;
    console.log(valid)
    valid.map(item => {
      item.list = this.formattingData(item.list, status)
    })
    this.setData({
      cartList: valid,
    })
    console.log(valid)
    wx.setStorageSync("cartList", valid)
    this.switchSelect()
    this.all(valid)
  },

  //格式化数据
  formattingData(list, status) {
    var that = this;
    console.log(list)
    var selectValue = that.data.selectValue;
    if (list.length > 0) {
      for (var index in list) {
        if (status == 1) {
          list[index].checked = true;
          selectValue.push(list[index].id);
        } else list[index].checked = false;
      }
      that.setData({
        // cartList: list,
        selectValue,
      });
      console.log(selectValue)
      // that.switchSelect();
    }
    return list
  },
  // 机构(复选框)
  supplierAll({
    currentTarget
  }) {
    console.log(currentTarget, "2222")
    var value = currentTarget.dataset.code;
    var cartList = this.data.cartList;
    cartList.map(item => {
      console.log(value)
      if (item.merchantCode == value && item.checked) {
        console.log(item.merchantCode, value, item.checked)
        item.checked = false
        console.log(item.checked)
        item.list.map((i, idx) => {
          i.checked = false
        })
      } else if (item.merchantCode == value && !item.checked) {
        item.checked = true
        console.log(item.checked)
        item.list.map((i, idx) => {
          i.checked = true
        })
      }
    })
    this.setData({
      cartList
    }, () => {
      this.all(cartList)
    })
    this.switchSelect();
    wx.setStorageSync("cartList", cartList)
  },

  // 全选全不选
  all(list) {
    let idx = -1
    list.map(item => {
      let index =-1
      console.log(item.checked,"机构全选")
      item.list.map(i=>{
        if(item.merchantCode == i.merchantCode){
          if(!i.checked){
            return index = 1
          }
        }
        console.log(index)
        if(index == 1){
          item.checked = false
        }else{
          item.checked = true
        }
      })
      if(!item.checked){
        return idx = 1
      }
    })
    if(idx == 1){
      this.setData({
        isAllSelect:false,
        cartList:list
      })
    }else{
      this.setData({
        isAllSelect:true,
        cartList:list
      })
    }
    // this.setData({cartList:list})
  },

  checkbox({currentTarget}){
    let data = currentTarget.dataset,{cartList,supplierAll} = this.data;
    console.log(supplierAll)
    let idx = -1
    cartList.map(item=>{
      if(item.merchantCode == data.code){
        item.list[data.index].checked = !item.list[data.index].checked
        console.log(!item.list[data.index].checked,"机构全选")
        if(!item.list[data.index].checked){
          item.checked = false
          // this.setData({
          //   isAllSelect:false
          // })
        }else{
          console.log("全选")
            item.checked=item.list.length == supplierAll
        }
      }
      if(!item.checked){
        return idx = 1
      }
    })
    if(idx == 1){
      this.setData({
        cartList,
        isAllSelect:false
      })
    }else{
      this.setData({
        cartList,
        isAllSelect:true
      })
    }
    this.switchSelect()
  },

  // 机构下的商品（复选框）
  checkboxChange: function (event) {
    console.log(event, "1111")
    var value = event.detail.value;
    this.setData({
      supplierAll:value.length
    })
  },
  inArray: function (search, array) {
    for (var i in array) {
      console.log(search, array[i])
      if (array[i] == search) {
        return true;
      }
    }
    return false;
  },
  switchSelect: function () {
    var that = this;
    var validList = that.data.cartList;
    var selectValue = that.data.selectValue;
    console.log(selectValue)
    var selectCountPrice = 0.00;
    // validList.map(item => {
    //   item.list.map(i => {
    //     selectCountPrice += Number(selectCountPrice) + Number(i.cart_num) * Number(i.deliveryPrice || i.wholesalePrice || i.packaging.deliveryPrice || i.packaging.wholesalePrice)
    //   })
    // })
    // this.setData({
    //   selectCountPrice:selectCountPrice.toFixed(2)
    // })
    if (selectValue.length < 1) {
      that.setData({
        selectCountPrice: selectCountPrice
      });
    } else {
      validList.map(item => {
        console.log(item)
        item.list.map(i => {
          if(i.checked){
            selectCountPrice = Number(selectCountPrice) + Number(i.cart_num) * Number(i.deliveryPrice || i.wholesalePrice || i.packaging.deliveryPrice || i.packaging.wholesalePrice)
          }
          // if (that.inArray(i.id, selectValue)) {
          //   console.log(i)
          //   console.log(i.cart_num, i.deliveryPrice)
          //   selectCountPrice = Number(selectCountPrice) + Number(i.cart_num) * Number(i.deliveryPrice || i.wholesalePrice || i.packaging.deliveryPrice || i.packaging.wholesalePrice)
          // }
        })
      })
      that.setData({
        selectCountPrice: selectCountPrice.toFixed(2)
      });
    }
  },
  //商品数量减
  subCart: function (event) {
    let that = this,
      data = event.currentTarget.dataset.item;
    that.data.cartList.map(item => {
      if (item.merchantCode == data.merchantCode) {
        item.list.map(i => {
          if (i.id == data.id) {
            if (i.cart_num > i.packaging.purchaseFactor) {
              i.cart_num = i.cart_num - i.packaging.purchaseFactor;
            } else {
              wx.showToast({
                title: i.packaging.purchaseFactor + i.packaging.goodsUnitName + "起购",
                icon: "none"
              })
              return
            }
            // if (item.cart_num < 1) status = true;
            if (i.cart_num <= i.packaging.purchaseFactor) {
              i.cart_num = i.packaging.purchaseFactor;
              i.numSub = true;
            } else {
              i.numSub = false;
              i.numAdd = false;
            }
          }
        })
      }
    })
    this.setData({
      cartList: this.data.cartList
    })
    // var that = this;
    // var status = false;
    // var index = event.currentTarget.dataset.index;
    // var item = that.data.cartList[index];
    // console.log(item)
    // if (item.cart_num > item.packaging.purchaseFactor) {
    //   item.cart_num = item.cart_num - item.packaging.purchaseFactor;
    // } else {
    //   wx.showToast({
    //     title: item.packaging.purchaseFactor + item.packaging.goodsUnitName + "起购",
    //     icon: "none"
    //   })
    //   return
    // }
    // // if (item.cart_num < 1) status = true;
    // if (item.cart_num <= item.packaging.purchaseFactor) {
    //   item.cart_num = item.packaging.purchaseFactor;
    //   item.numSub = true;
    // } else {
    //   item.numSub = false;
    //   item.numAdd = false;
    // }

    // var itemData = "cartList[" + index + "]";
    // that.setData({
    //   [itemData]: item
    // });
    that.switchSelect();
    that.getCartCount(this.data.cartList)
    wx.setStorageSync("cartList", this.data.cartList)
    this.cartNum(this.data.cartList)
  },
  /**
   * 购物车手动填写
   * 
   */
  // iptCartNum: function (e) {
  //   console.log(e)
  //   let index = e.currentTarget.dataset.index;
  //   let item = this.data.cartList[index];
  //   item.cart_num = Number(e.detail.value) ? Number(e.detail.value) : 1;
  //   console.log(item)
  //   let itemData = "cartList[" + index + "]";
  //   this.setData({
  //     [itemData]: item
  //   });
  //   this.switchSelect();
  //   this.getCartCount(this.data.cartList)
  //   wx.setStorageSync("cartList", this.data.cartList)
  // },
  // 商品数量加
  addCart: function (event) {
    console.log(event)
    let that = this,
      data = event.currentTarget.dataset.item;
    that.data.cartList.map(item => {
      if (item.merchantCode == data.merchantCode) {
        item.list.map(i => {
          if (i.id == data.id) {
            i.cart_num = parseInt(i.cart_num) + i.packaging.purchaseFactor
            if (i.cart_num > 1) {
              i.numSub = false;
            }
          }
        })
      }
    })
    this.setData({
      cartList: this.data.cartList
    })
    // var index = event.currentTarget.dataset.index;
    // var item = that.data.cartList[index];
    // item.cart_num = parseInt(item.cart_num) + item.packaging.purchaseFactor
    // if (item.cart_num > 1) {
    //   item.numSub = false;
    // }
    // let itemData = "cartList[" + index + "]";
    // this.setData({
    //   [itemData]: item
    // });
    that.switchSelect();
    that.getCartCount(this.data.cartList)
    wx.setStorageSync("cartList", this.data.cartList)
    this.cartNum(this.data.cartList)
  },
  getHostProduct: function () {
    var that = this;
    getProductHot().then(res => {
      that.setData({
        host_product: res.data
      });
    });
  },
  goodsOpen: function () {
    var that = this;
    that.setData({
      goodsHidden: !that.data.goodsHidden
    })
  },
  manage: function () {
    var that = this;
    that.setData({
      footerswitch: !that.data.footerswitch
    })
  },
  /**
   * 获取购物车数量
   */
  getCartCount: function (data) {
    let sumCount = 0,
      listLength = 0;

    if (data.length > 0) {
      data.map((item) => {
        item.list.map((i, idx) => {
          sumCount += Number(i.cart_num)
          if (!i.id) {
            i.id = util.randomNum(99) + idx
          }
        })
        listLength += item.list.length
      })
    }
    console.log(listLength)
    this.setData({
      sumCount,
      listLength
    })
  },

  //购物车数量
  cartNum(cartList){
    console.log("购物车数量")
    let sumCount = util.getCartCount(cartList)
    app.cartCount(sumCount)
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let cartList = wx.getStorageSync("cartList") || []
    this.cartNum(cartList)
    console.log(cartList,"购物车数据")
    this.getCartCount(cartList)
    this.setData({
      cartList: cartList,
      // isAllSelect:false,
      footerswitch: true,
      ...wx.getStorageSync("institutionDetail"),
    })
    this.setAllSelectValue(1)
    // this.switchSelect()
  },
  unsetCart: function () {
    let that = this,
      ids = [];
    for (var i = 0, len = that.data.cartList.invalid.length; i < len; i++) {
      ids.push(that.data.cartList.invalid[i].id);
    }
    cartDel(ids).then(res => {
      app.Tips({
        title: '清除成功'
      });
      that.setData({
        'cartList.invalid': []
      });
    }).catch(res => {

    });
  },

  // 跳转详情页
  skipDetail(e) {

    console.log(e.target.id)
  },

})