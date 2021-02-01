import { purchaseOrderDetail, addPurchaseOrder, selectGoodsDeliver, getWarehousingGoodsByDeliveryOrder, savePurchaseWarehousing, auditPurchaseWarehousing, getPurchaseWarehousingDetail, purchaseWarehousingRecord,wholesaleOrderDetail,wholesaleCancel,refundSave } from '../../api/index.js';
// import { openPaySubscribe } from '../../utils/SubscribeMessage.js';
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shippingType: 0,
    GoodsState: { 0: "已保存", 1: "已提交", 2: "待发货", 4: "待发货", 5: "待发货 ", 6: "待收货", 7: "已收货", 8: "部分收货", 9: "已取消" },
    wholesaleStatus:{ 0: "待发货", 1: "已发货",2:"已取消"},
    textareaStatus: true,
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '订单详情',
      'color': true,
      'class': '0'
    },
    address: { address: false },//地址组件
    addressInfo: {},//地址信息
    status: 0,
    is_address: false,
    isClose: false,
    toPay: false,//修复进入支付时页面隐藏从新刷新页面
    shippingType: 0,
    system_store: {},
    storePostage: 0,
    contacts: '',
    contactsTel: '',
    mydata: {},
    storeList: []
  },
  /**
   * 授权回调事件
   * 
  */
  onLoadFun: function () {

  },

    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.recordNo, options.status)
    this.setData({
      // cartInfo: wx.getStorageSync('cartList'),
      recordNo: options.recordNo,
      status: options.status,
      supplierCode:options.code,
      merchantType:app.globalData.merchantType
    })
    if(app.globalData.merchantType == 5){
      // this.getWholesaleOrderDetail()
    }else{
      if (options.status == 7 || options.status == 8) {
        console.log("获取商品入库详情")
        this.getPurchaseWarehousingDetail(options.recordNo)
      }
    }
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
    this.getTabBar()) {
    this.getTabBar().setData({
    })}
    if(app.globalData.merchantType == 5){
      this.getWholesaleOrderDetail()
    }else{
      this.getPurchaseOrderDetail(1)
    }
    let institutionDetail = wx.getStorageSync("institutionDetail")
    this.setData({
      institutionDetail: institutionDetail
    })
  },
  addressType: function (e) {
    let index = e.currentTarget.dataset.index;
    // this.getPurchaseOrderDetail()
    this.setData({
      shippingType: index,
      merchantType:app.globalData.merchantType
    })
  },


  //获取过期时间
  getPastDueTime(createTime){
    let startTime = new Date(createTime)
    let pastDueTime = util.formatDate(new Date(startTime.getTime() + 7 * 24 * 3600 * 1000))
    console.log(pastDueTime)
    this.setData({
      pastDueTime
    })
  },

  // 获取批发单详情
  getWholesaleOrderDetail(){
    let {recordNo,supplierCode} = this.data
    wholesaleOrderDetail({
      appId:app.commonParams('appId'),
      merchantCode:supplierCode,
      orderNo:recordNo,
    }).then(res=>{
      console.log(res,"批发单详情")
      if(res.code === "SUCCESS"){
        this.getPastDueTime(res.result.createTime)
        let totalAmount = this.totalAmount(res.result.detailDtoList,"SUCCESS")
        this.setData({
          dataDetail:res.result,
          institutionDetail:res.result.wholesaleMerchantInfo,
          totalAmount
        })
      }
    })
  },

  // 获取采购单详情
  getPurchaseOrderDetail(type) {
    // if (this.data.status == 7) return
    let {recordNo,supplierCode} = this.data
    purchaseOrderDetail({
      appId: app.commonParams('appId'),
      superMerchantCode: app.commonParams('appId'),
      merchantCode: app.commonParams('merchantCode'),
      recordNo:recordNo,
      supplierCode:supplierCode,
    }).then(res => {
      console.log(res.result, "订单详情")
      if (res.code == "SUCCESS") {
        let totalAmount
        if (res.result.status != 6) {
          totalAmount = this.totalAmount(res.result.detailResponseList)
        }
        if (this.data.status == 8 || this.data.status == 7){
          this.setData({
            dataDetail: res.result
          })
        }else{
          this.setData({
            dataDetail: res.result,
            totalAmount
          })
        }
       
        // type为1时（初始化只执行一次）
        if (type == 1 && res.result.status == 6) {
          this.getSelectGoodsDeliver()
        }
      }
    })
  },

  //订单总计
  totalAmount(data, type) {
    let money = 0
    data.map(item => {
      console.log(item)
      if (type == 'SUCCESS'){
        money += item.amount
      }else{
        if (type == 1) {
          item.amount = Number((item.deliveryPrice * (item.num == 0 ? item.num : (item.num || item.deliveryStock))).toFixed(2))
          money += item.amount
        } else {
          money += Number(item.purchaseAmt)
        }
      }
     
    })
    console.log(data, money)
    return money.toFixed(2)
  },

  //商品数量
  quantitytNum(e) {
    console.log(e.detail)
    let data = e.detail, { stockInRecordData, dataDetail } = this.data;
    console.log(data.num)
    if (data.num) {
      stockInRecordData.stockInRecordDetailList[data.index].num = data.num
    } else {
      stockInRecordData.stockInRecordDetailList[data.index].num = 0
    }
    this.setData({
      stockInRecordData
    })
    let totalAmount = this.totalAmount(stockInRecordData.stockInRecordDetailList, 1)
    this.setData({
      totalAmount
    })
  },

  // 商品售价
  sellingPricetNum(e) {
    let data = e.detail, { stockInRecordData } = this.data
    console.log(e.detail)
    stockInRecordData.stockInRecordDetailList[data.index].goodsPrice = data.num
    console.log(stockInRecordData)
    this.setData({
      stockInRecordData
    })
  },

  //取消
  cancel() {
    console.log(app.globalData.merchantType)
    if(app.globalData.merchantType == 5){
      this.cancelWholesaleOrder()
    }else{
  this.getAddPurchaseOrder(9)
    }
  
  },

  //审核
  audit() {
    this.getAddPurchaseOrder(2)
  },

  //数量剪
  cut(e){
    let {stockInRecordData} = this.data
    let dataList = stockInRecordData.stockInRecordDetailList,index = e.detail;
    console.log("剪",e,stockInRecordData)
    dataList[index].deliveryStock--
    console.log(dataList[index].deliveryStock)
    this.setData({
      stockInRecordData
    })
  },

  //数量加
  add(e){
    let {stockInRecordData} = this.data
    let dataList = stockInRecordData.stockInRecordDetailList,index = e.detail;
    console.log("加",e,stockInRecordData)
    dataList[index].deliveryStock++
    console.log(dataList[index].deliveryStock)
    this.setData({
      stockInRecordData
    })
  },

  //确认收货
  affirm() {
    let list = [],
      obj = {},
      { stockInRecordData } = this.data;
    stockInRecordData.stockInRecordDetailList.map((item, index) => {
      console.log(item.deliveryStock, item.goodsPrice,item)
      obj = {
        goodsBarcode:item.goodsBarcode,
        goodsId: item.goodsId,
        goodsPackageId: item.goodsPackageId || "",
        packageFactor: item.packageFactor,
        // 收货数量
        stock: item.num || item.deliveryStock,
        purchaseFactor: item.purchaseFactor,
        deliveryStock: item.deliveryStock,
        goodsCostPrice: item.goodsCostPrice,
        //  商品售价
        goodsPrice: item.goodsPrice,
        wholesalePrice: item.wholesalePrice,
        deliveryPrice: item.deliveryPrice,
        amount: item.amount,
        // 进货总金额
        // amount: money,
        // 生产日期
        productionDate: util.dataTime(0),
        // 过期日期
        expirationDate: util.dataTime(10),
      }

      list.push(obj)
    })
    savePurchaseWarehousing({
      appId: app.commonParams('appId'),
      originalOrderId: this.data.stockInRecordData.relationRecordId,
      stockInRecordData: JSON.stringify(list),
      operationType: 1
    }).then(res => {
      console.log(res)
      if (res.code == 'SUCCESS') {
        auditPurchaseWarehousing({
          appId: app.commonParams('appId'),
          recordId: res.result.recordId,
        }).then(res => {
          console.log(res)
          if (res.code == 'SUCCESS') {
            wx.switchTab({
              url: '/pages/order_list/index?status=-1'
            });
          }
        })
      }
    })
  },

  //获取配Id
  getSelectGoodsDeliver(status) {
    console.log(status, '获取商品详情')
    selectGoodsDeliver({
      appId: app.commonParams('appId'),
      superMerchantCode: app.commonParams('appId'),
      recordNo: this.data.recordNo,
    }).then(res => {
      if (res.code == 'SUCCESS' && res.result.items) {
        console.log(res.result.items[0].id)
        this.getWarehousingGoodsByDeliveryOrder(res.result.items[0].id)
      } else {
        wx.showToast({
          title: '已过期',
          icon: 'none'
        })
        let itemData = "dataDetail.status";
        this.setData({
          [itemData]: 9
        })
      }
    })
  },

  //由配送单生成入库信息
  getWarehousingGoodsByDeliveryOrder(id) {
    getWarehousingGoodsByDeliveryOrder({
      appId: app.commonParams('appId'),
      shopDeliveryOrderId: id
    }).then(res => {
      console.log(res, "待入库信息")
      if (res.code = 'SUCCESS') {
        let totalAmount = this.totalAmount(res.result.stockInRecordDetailList, 1),
        dataList = this.alterData(res.result.stockInRecordDetailList)
        this.setData({
          stockInRecordData: res.result,
          totalAmount
        })
      }
    })
  },

  //修改改发货数据（把发货数量复制一下）
  alterData(dataList){
    if(!dataList.length) return
    dataList.map(item=>{
      item.stock = item.deliveryStock
    })
    return dataList
  },


  //审核、取消
  getAddPurchaseOrder(status) {
    let {dataDetail,recordNo} = this.data
    let params = {
      appId: app.commonParams('appId'),
      superMerchantCode: app.commonParams('appId'),
      merchantCode: app.commonParams('merchantCode'),
      supplierCode:dataDetail.supplierCode,
      recordNo:recordNo,
      operatorId: app.commonParams('operatorId'),
      status: status,
      auditStatus: status,
      shopDate: util.dataTime(10),
      // picture:dataDetail.picture || "",
      procurementOrderJson: JSON.stringify(util.concatString(this.data.dataDetail.detailResponseList, 2))
    }
    console.log(params)
    addPurchaseOrder(params).then(res => {
      console.log(res)
      if (res.code == "SUCCESS") {
        wx.switchTab({
          url: '/pages/order_list/index?status=-1'
        });
      } else {
        wx.showToast({
          title: '审核失败',
          icon: 'none'
        })
      }
    })
  },

  //取消批发订单
  cancelWholesaleOrder(){
    let {dataDetail} = this.data
    wholesaleCancel({
      appId: app.commonParams('appId'),
      superMerchantCode: app.commonParams('appId'),
      wholesaleOrderId:dataDetail.orderId,
      operatorId: app.commonParams('operatorId'),
    }).then(res=>{
      if (res.code == "SUCCESS") {
        wx.switchTab({
          url: '/pages/order_list/index?status=-1'
        });
      } else {
        wx.showToast({
          title: '取消失败',
          icon: 'none'
        })
      }
    })
  },

  bindPickerChange: function (e) {
    let value = e.detail.value;
    this.setData({ shippingType: value })
    this.computedPrice();
  },

  //获取入库商品详情
  getPurchaseWarehousingDetail(recordNo) {
    getPurchaseWarehousingDetail({ relationPurchaseRecordNo: recordNo }).then(res => {
      console.log(res.result.stockInRecordDetailList, "获取入库详情")
      if(res.code == "SUCCESS"){
        let totalAmount = this.totalAmount(res.result.stockInRecordDetailList,"SUCCESS")
        this.setData({
          deliveryDetail: res.result.stockInRecordDetailList,
          totalAmount
        })
      }

    })
  },
  bindHideKeyboard: function (e) {
    this.setData({ mark: e.detail.value });
  },

  // // 退货
  // salesInfo(e){
  //   console.log(e)
  //   let {dataDetail} = this.data
  //   console.log(e,"退货信息",util.refundOrderJson(e.detail),dataDetail)
  //   refundSave({
  //     merchantCode:dataDetail.merchantCode,
  //     relationWholesaleOrderNo:dataDetail.orderNo,
  //     wholesaleOrderJson:util.refundOrderJson(e.detail),
  //     remarks:"的开始JFK军事对抗肌肤",
  //     orderStatus:1
  //   }).then(res=>{
  //     console.log(res,"退货单")
  //   })
  // }
})