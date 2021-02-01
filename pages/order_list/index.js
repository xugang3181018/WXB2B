// import { getOrderList, orderData, orderCancel, orderDel, orderPay } from '../../api/order.js';
import {
  purchaseOrderList,
  wholesaleOrderList,
  detailByCode
} from '../../api/index.js';
import util from '../../utils/util.js';
// import { openOrderSubscribe } from '../../utils/SubscribeMessage.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '我的订单',
      'color': true,
      'class': '0'
    },
    loading: false, //是否加载中
    loadend: false, //是否加载完毕
    loadTitle: '加载更多', //提示语
    orderList: [], //订单数组
    orderData: {}, //订单详细统计
    orderStatus: -1, //订单状态
    GoodsState: {
      0: "已保存",
      1: "已提交",
      2: "待发货",
      4: "待发货",
      5: "待发货 ",
      6: "待收货",
      7: "已收货",
      8: "部分收货",
      9: "已取消"
    },
    wholesaleStatus:{ 0: "待发货", 1: "已发货",4:"已取消"},
    page: 1,
    limit: 10,
    isClose: false,
    payMode: [{
        name: "微信支付",
        icon: "icon-weixinzhifu",
        value: 'weixin',
        title: '微信快捷支付'
      },
      {
        name: "余额支付",
        icon: "icon-yuezhifu",
        value: 'yue',
        title: '可用余额:',
        number: 0
      },
    ],
    pay_close: false,
    pay_order_id: '',
    totalPrice: '0',
  },

  onLoad(options) {
    this.setData({
      orderList:[],
      orderStatus:Number(app.globalData.orderStatus),
      merchantType: app.globalData.merchantType,
    })
  },

  /**
   * 去订单详情
   */
  goOrderDetails: function (e) {
    console.log(e)
    let order_id = e.currentTarget.dataset.order_id
    let status = e.currentTarget.dataset.status
    let code = e.currentTarget.dataset.code
    if (!order_id) return app.Tips({
      title: '缺少订单号无法查看订单详情'
    });
    wx.showLoading({
      title: '正在加载',
    })
    wx.navigateTo({
      url: `/pages/order_confirm/index?recordNo=${order_id}&status=${status}&code=${code}`
    })
    wx.hideLoading();
  },
  /**
   * 切换类型
   */
  statusClick: function (e) {
    var status = e.currentTarget.dataset.status;
    if (status == this.data.orderStatus) return;
    console.log(status)
    this.setData({
      orderStatus: status,
      loadend: false,
      page: 1,
      orderList: []
    });
    if(this.data.merchantType == 5){
      this.getDetailByCode()
    }else{
      this.getPurchaseOrderList(status)
    }
  },
  /**
   * 获取采购订单列表 
   */
  getPurchaseOrderList: function (type) {
    let {
      page,
      orderStatus
    } = this.data,
      params = {
        appId: app.commonParams('appId'),
        superMerchantCode: app.commonParams('appId'),
        merchantCode: app.commonParams('merchantCode'),
        currentPage: page,
        pageSize:20,
        status: type || orderStatus ||""
      }
    if (type == -1 && !(type == 2 || type == 6)) {
      delete params.status
    }
    this.purchaseOrderList(params, type)
  },


  //客户详情
  getDetailByCode(status) {
    detailByCode({
      appId: app.commonParams('appId'),
      merchantCode: app.commonParams('merchantCode'),
    }).then(res => {
      console.log(res, "客户详情")
      if (res.code === "SUCCESS") {
        this.setData({
          parentMerchantCode: res.result.parentMerchantCode
        })
        this.getWholesaleOrderList(status)
      }
    })
  },

    /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function () {
        (this.data.page) ++;
        console.log(this.data.page)
        if(this.data. pageCount<this.data.page){
          this.setData({
            page:this.data. pageCount
          })
          return
        } 
        if(this.data.merchantType == 5){
          this.getWholesaleOrderList()
        }else{
          this.getPurchaseOrderList()
        }
      },

  // 请求批发单列表数据
  getWholesaleOrderList(status) {
    wx.showLoading()
    let {
      page,
      parentMerchantCode,
      orderList,
      orderStatus
    } = this.data
    let params = {
      appId: app.commonParams('appId'),
      // orderNo: orderNo,
      merchantCode: parentMerchantCode,
      wholesaleMerchantCode: app.commonParams('merchantCode'),
      currentPage: page,
      pageSize:20,
      orderType: 0,
      deliverGoodsStatus:status == 0 || status?status:orderStatus
    }
    console.log(status,orderStatus)
    if(orderStatus == 4 && status !=0){
      console.log("2222")
      params.orderStatus = orderStatus
      delete params.deliverGoodsStatus
    }else if(!(status == 0 || status == 1 || orderStatus == 0 || orderStatus == 1)){
      console.log("111")
      delete params.deliverGoodsStatus
    }
    console.log(params)
    wholesaleOrderList(params).then(res => {
      console.log(res, "批发单列表")
      if (res.code === "SUCCESS") {
        if(status == 0){
          console.log(status,orderStatus)
          this.setData({
            deliverNum: res.result.totalCount,
            orderList: orderList.concat(!res.result.items?[]:res.result.items),
            pageCount:res.result.pageCount
          })
        }else if(status == 1){
          this.setData({
            takeNum: res.result.totalCount,
            orderList: orderList.concat(!res.result.items?[]:res.result.items),
            pageCount:res.result.pageCount
          })
        }else{
          this.setData({
            orderList: orderList.concat(!res.result.items?[]:res.result.items),
            pageCount:res.result.pageCount
          })
        }
      }
    })
    wx.hideLoading()
  },

  // 请求采购单订单列表数据
  purchaseOrderList(params, type) {
    wx.showLoading()
    console.log(wx.getStorageSync('login').role)
    let {orderList} = this.data
    if (wx.getStorageSync('login').role == 0) {
      params.flag = true
    } else {
      params.flag = false
    }
    purchaseOrderList(params).then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.code == "SUCCESS") {
        if (type == 2 || params.status == 2) {
          console.log(res, "代发货",)
          this.setData({
            deliverNum: res.result.totalCount,
            orderList:orderList.concat(!res.result.items?[]:res.result.items),
            pageCount:res.result.pageCount
          })
        } else if (type == 6 || params.status == 6) {
          console.log(res, "待收货")
          this.setData({
            takeNum: res.result.totalCount,
            orderList:orderList.concat(!res.result.items?[]:res.result.items),
            pageCount:res.result.pageCount
          })
        }
        if (!(type == 2 || type == 6)) {
          this.setData({
            allNum: res.result.totalCount,
            orderList:orderList.concat(!res.result.items?[]:res.result.items),
            pageCount:res.result.pageCount
          })
        }
      }
    })
  },

  /**
   * 删除订单
   */
  // delOrder:function(e){
  //   var order_id = e.currentTarget.dataset.order_id;
  //   var index = e.currentTarget.dataset.index, that = this;
  //   orderDel(order_id).then(res=>{
  //     that.data.orderList.splice(index, 1);
  //     that.setData({ orderList: that.data.orderList, 'orderData.unpaid_count': that.data.orderData.unpaid_count - 1 });
  //     that.getOrderData();
  //     return app.Tips({ title: '删除成功', icon: 'success' });
  //   }).catch(err=>{
  //     return app.Tips({title:err});
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let cartList = wx.getStorageSync("cartList") || []
    let sumCount = util.getCartCount(cartList)
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
      selected: 2,
      sumCount
    })
  }
    this.setData({
      // orderStatus:wx.getStorageSync('orderStatus') || -1,
      merchantType: app.globalData.merchantType,
      orderList:[]
    })
    if (app.globalData.merchantType == 5) {
      this.getDetailByCode(0)
      // this.getDetailByCode(1)
      this.getDetailByCode()
    } else {
      this.getPurchaseOrderList(6)
      this.getPurchaseOrderList(2)
      this.getPurchaseOrderList(Number(app.globalData.orderStatus))
    }
    //第一个参数代表状态    后边的参数1代表第一次请求  
    // if (app.globalData.isLog && this.data.isClose){
    //   this.getOrderData();
    //   this.setData({ loadend: false, page: 1, orderList:[]});
    //   // this.getOrderList();
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isClose: true
    });
  },

    /**
   * 跳转退货页面
   */
  sales({currentTarget}){
    let order_id = currentTarget.dataset.order_id
    let code = currentTarget.dataset.code
    if (!order_id) return
    wx.navigateTo({
      url: `/pages/refnudDetail/refundDetail?recordNo=${order_id}&code=${code}`,
    })
  },
})