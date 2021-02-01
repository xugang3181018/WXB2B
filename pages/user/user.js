const app = getApp();

import {
  purchaseOrderList,
  resetPassword,
  wholesaleOrderList,
  detailByCode
} from '../../api/index.js';
import util from '../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '0',
      'title': '个人中心',
      'color': true,
      'class': '0'
    },
    userInfo: {},
    isGoIndex: false,
    iShidden: true,
    isAuto: false,
    switchActive: false,
    loginType: app.globalData.loginType,
    orderStatusNum: {},
    promoter_price: 0,
    generalActive: false,
    generalContent: {
      promoterNum: '',
      title: '您未获得推广权限'
    },
    showOneButtonDialog:false
  },

  close: function () {
    this.setData({
      switchActive: false
    });
  },

  amendPsw(){
    // showPopup() {
      this.popup.showPopup();
    // },
  },

  pswInput(e){
    console.log(e)
    resetPassword({
      merchantId:app.commonParams('merchantId'),
      operatorId:app.commonParams('operatorId'),
      password:e.detail.password1
    }).then(res=>{
      console.log(res)
      if(res.code == "SUCCESS"){
        app.Tips({
          title: '修改成功'
        });
        this.popup.showPopup();
      }
    })
  },

  /**
   * 授权回调
   */
  onLoadFun: function (e) {
    // this.getUserInfo();

    this.getMyMenus();
  },
  Setting: function () {
    wx.openSetting({
      success: function (res) {
        console.log(res.authSetting)
        wxh.selfLocation();
      }
    });
  },
  generalWindow: function () {
    this.setData({
      generalActive: false
    })
  },
  /**
   * 页面跳转
   */
  goPages: function (e) {
    if (app.globalData.isLog) {
      if (e.currentTarget.dataset.url == '/pages/user_spread_user/index') {
        if (!this.data.userInfo.is_promoter && this.data.userInfo.statu == 1)
          return app.Tips({
            title: '您还没有推广权限！！'
          });
        if (!this.data.userInfo.is_promoter && this.data.userInfo.statu == 2) {
          return this.setData({
            generalActive: true
          });
        }
      }
      if (e.currentTarget.dataset.url == '/pages/logon/index') return this.setData({
        switchActive: true
      });
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    } else {
      this.setData({
        iShidden: false
      });
    }
  },

  //退出登录
  exitSys() {
    wx.showModal({
      title: '提示',
      content: '是否确定退出',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage()
          wx.redirectTo({
            url: '/pages/login/login',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(wx.getStorageSync('institutionDetail'))
    this.setData({
      MyMenus: app.globalData.MyMenus,
      merchantType: app.globalData.merchantType,
      ...wx.getStorageSync('institutionDetail')
    });
    this.popup = this.selectComponent("#popup");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      switchActive: false
    });
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onShow: function () {
    let cartList = wx.getStorageSync("cartList") || []
    let sumCount = util.getCartCount(cartList)
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
      selected: 3,
      sumCount
    })
  }
    let that = this;
    if (app.globalData.isLog) {
      // this.getUserInfo();
      this.getMyMenus();
    }
    if(app.globalData.merchantType == 5){
      // this.getWholesaleOrderList()
      this.getDetailByCode()
    }else{
      let params = {
        appId: app.commonParams('appId'),
        superMerchantCode: app.commonParams('appId'),
        merchantCode: app.commonParams('merchantCode'),
        currentPage: 1,
        pageSize: 20,
      }
      this.purchaseOrderList(params, 2)
      this.purchaseOrderList(params, 6)
    }
  },

  // 获取采购列表
  purchaseOrderList(params, type) {
    params.status = type
    if (wx.getStorageSync('login').role == 0) {
      params.flag = true
    } else {
      params.flag = false
    }
    purchaseOrderList(params).then(res => {
      console.log(res)
      if (res.code == "SUCCESS") {
        if (type == 2) {
          this.setData({
            deliverNum: res.result.totalCount
          })
        } else {
          this.setData({
            takeNum: res.result.totalCount
          })
        }
      }
    })
  },

  //客户详情
  getDetailByCode() {
    detailByCode({
      appId: app.commonParams('appId'),
      merchantCode: app.commonParams('merchantCode'),
    }).then(res => {
      console.log(res, "客户详情")
      if (res.code === "SUCCESS") {
        this.getWholesaleOrderList(res.result.parentMerchantCode)
      }
    })
  },

    // 请求批发单列表数据
    getWholesaleOrderList(merchantCode) {
      let params = {
        appId: app.commonParams('appId'),
        merchantCode,
        wholesaleMerchantCode: app.commonParams('merchantCode'),
        pageSize:20,
        orderType: 0,
        deliverGoodsStatus:0
      }
      wholesaleOrderList(params).then(res => {
        console.log(res, "批发单列表")
        if (res.code === "SUCCESS") {
          this.setData({
            deliverNum: res.result.totalCount
          })
        }
      })
    },

  onTab({currentTarget}){
    console.log(currentTarget)
    app.globalData.orderStatus = currentTarget.dataset.index
    wx.switchTab({
      url:'/pages/order_list/index',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      } 
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
})