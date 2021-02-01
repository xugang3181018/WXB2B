// pages/retail/refund/refundOrderInfo/refundOrderInfo.js
const app = getApp()
import {
  returnGoodsStock,
  pagList,
  merchantAndSupplierByQueryGoodsList,
  goodsByStockReturnRecord,
  queryGoodsMessage
} from '../../../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: ['待提交', '待审核', '已完成', '', '已完成'],
    supplierList: [],
    isPX: app.systemInfo.isPX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {
      recordId
    } = options
    this.setData({
      loginInfo: wx.getStorageSync('login'),
      recordId
    })
    wx.setStorageSync('name', {
      count: '退货量',
      amount: '退货金额'
    })
    let title = recordId ? '退货单详情' : '新建退货单'
    this.setTitle(title)
    if (recordId) {
      this.goodsByStockReturnRecord()
    }
  },

  tj(e) {
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 退货单商品详情
  goodsByStockReturnRecord() {
    wx.showLoading({
      title: '加载中',
    })
    let {
      loginInfo,
      recordId
    } = this.data
    goodsByStockReturnRecord({
      superMerchantCode: loginInfo.appId,
      recordId
    }).then(res => {
      console.log(res, "退货单商品详情")
      if (res.code == "SUCCESS") {
        this.setData({
          goodsDetail: res.result,
          goodsDetailList: res.result.detailResponseList,
          supplierId: res.result.supplierId
        })
        // if(res.result.status != 2){
        //   this.setTitle()
        // }
        wx.setStorageSync('stockGoodsList', res.result.detailResponseList)
        this.getStockTotalSum(res.result.detailResponseList)
      }
      wx.hideLoading()
    })
  },

  //添加出库商品
  onAdd() {
    let {
      supplierId,
      recordId
    } = this.data
    if (!recordId && !supplierId) {
      app.tip("请选择供应商")
      return
    }
    this.setData({
      cpmBtn: true,
    })
  },

  //扫码出库
  onScan() {
    let {
      recordId,
      supplierId
    } = this.data, that = this;
    this.setData({
      cpmBtn: false,
      alter: recordId ? true : false
    })
    wx.scanCode({
      success(res) {
        console.log(res)
        if (res.result) {
          // app.pageType = 1
          that.getMerchantAndSupplierByQueryGoodsList(res.result, supplierId)
          // wx.navigateTo({
          //   url: `/pages/retail/stock/stockGoodsDetail/stockGoodsDetail?goodsBarcode=${res.result}&supplierId=${supplierId}`,
          // })
        }
      }
    })
  },

  //获取退货商品信息
  getMerchantAndSupplierByQueryGoodsList(goodsInfo, supplierId) {
    wx.showLoading({
      title: '加载中',
    })
    let {
      appId,
      merchantCode
    } = wx.getStorageSync('login')
    let params = {
      superMerchantCode: appId,
      merchantCode,
      goodsInfo,
    }
    merchantAndSupplierByQueryGoodsList(params).then(res => {
      console.log(res, "扫码获取退货商品信息")
      if (res.code == "SUCCESS" && res.result.totalCount > 0) {
        this.getQueryGoodsMessage(res.result.items, supplierId)
      } else {
        app.tip("为查询到该商品")
        wx.hideLoading()
      }
    })
  },

  //查询选中商品详情
  getQueryGoodsMessage(list, id) {
    console.log(list)
    let params = {
      superMerchantCode: wx.getStorageSync('login').appId,
      goodsJsonData: app.base.refundGoodsDetail(list, id)
    }
    queryGoodsMessage(params).then(res => {
      console.log(res, "退货商品详情")
      wx.hideLoading()
      if (res.code == "SUCCESS") {
        // this.setData({
        //   goodsDetail: res.result[0],
        // })
        let goodsDetail = JSON.stringify(res.result[0])
        app.pageType = 1
        wx.navigateTo({
          url: `/retailPages/pages/stock/stockGoodsDetail/stockGoodsDetail?goodsBarcode=${res.result}&goodsDetail=${goodsDetail}`,
        })
      } else {
        app.tip("暂无数据")
      }
    })
  },

  // 手动选择
  onManual() {
    let {
      recordId,
      supplierId
    } = this.data
    this.setData({
      cpmBtn: false,
      alter: recordId ? true : false
    })
    app.pageType = 1
    wx.navigateTo({
      url: `/retailPages/pages/stock/selectStockGoods/selectStockGoods?supplierId=${supplierId}`,
    })
  },

  //取消
  onDeselect() {
    console.log('取消')
    this.setData({
      cpmBtn: false,
      alter: false
    })
  },

  // 获取供应商信息
  // changeMerchant(e) {
  //   console.log(e)
  //   let {
  //     supplierList
  //   } = this.data
  //   let nameIndex = Number(e.detail.value)
  //   this.setData({
  //     nameIndex,
  //     supplierName: supplierList[nameIndex].supplierName,
  //     supplierCode: supplierList[nameIndex].supplierId
  //   })
  // },


  //获取退货机构
  getSupplier(e) {
    console.log(e.detail)
    this.setData({
      supplierName: e.detail.supplierName,
      supplierId: e.detail.supplierId
    })
  },

  //提交按钮
  save() {
    let {
      goodsDetailList,
      alter
    } = this.data
    if (!goodsDetailList.length) {
      app.tip('请先添加出库商品')
      return
    }
    let title = alter ? '确定要修改吗' : '确定要提交吗'
    this.returnGoodsStock(1, title)
  },

  // 审核按钮
  onSubmit() {
    this.returnGoodsStock(2, '确定要审核吗')
  },

  //删除退货单
  deleteStock() {
    let {
      recordId
    } = this.data
    if (recordId) {
      this.returnGoodsStock(3, '确定要删除吗')
    } else {
      wx.removeStorageSync('stockGoodsList')
      wx.navigateBack()
    }
  },

  // 删除退货单单个商品
  delete(e) {
    let that = this
    console.log(e, e.target.id)
    let {
      goodsDetailList,
      recordId
    } = that.data
    if (recordId && goodsDetailList.length == 1) {
      app.tip("最后一个商品无法删除")
      return
    }
    that.setData({
      cpmBtn: false,
      alter: recordId ? true : false
    })
    let index = Number(e.target.id)
    console.log(goodsDetailList.length)
    // if (goodsDetailList.length == 1) {
    // that.deleteStock()
    // } else {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success(res) {
        if (res.confirm) {
          if (recordId) {
            that.setTitle('编辑出库单')
          }
          goodsDetailList.splice(index, 1)
          that.setData({
            goodsDetailList
          })
          wx.setStorageSync('stockGoodsList', goodsDetailList)
          that.getStockTotalSum(goodsDetailList)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    // }
  },

  // 按商品退货（保存，提交，审核，删除）
  returnGoodsStock(type, title) {
    let {
      loginInfo,
      goodsDetail,
      recordId,
      supplierName,
      supplierId,
      goodsDetailList,
      amount,
      alter
    } = this.data
    if (recordId && !alter && (goodsDetail.status == 1 && type == 1)) {
      app.tip('已提交请直接审核')
      return
    }
    if (!recordId && !supplierName) {
      app.tip('请选择供应商')
      return
    }
    let that = this
    wx.showModal({
      title: '提示',
      content: title,
      success(res) {
        if (res.confirm) {
          let params = {
            amount: amount,
            superMerchantCode: loginInfo.appId,
            operationType: type,
            merchantCode: loginInfo.merchantCode,
            recordNo: goodsDetail ? goodsDetail.recordNo : '',
            id: recordId || '',
            supplierName: supplierName || goodsDetail.supplierName || '',
            supplierId: supplierId || goodsDetail.supplierId || '',
            auditOperator: type == 2 ? loginInfo.operatorId : '',
            operatorId: loginInfo.operatorId,
            stockInRecordData: app.base.joinComeStockStr(goodsDetailList)
          }
          returnGoodsStock(params).then(res => {
            console.log(res)
            if (res.code == "SUCCESS") {
              app.tip(res.msg)
              if (type == 2 || type == 3) {
                wx.navigateBack()
              } else {
                if (alter || (recordId && (type == 1 && goodsDetail.status == 0))) {
                  that.setData({
                    alter: false
                  }, () => {
                    that.goodsByStockReturnRecord()
                  })
                } else {
                  if (!recordId) {
                    wx.setStorageSync('message', {
                      recordId: res.result.id,
                    })
                    that.setTitle('出库单详情')
                  }
                  that.setData({
                    recordId: res.result.id,
                    alter: false
                  }, () => {
                    that.goodsByStockReturnRecord()
                  })
                }
              }
            } else {
              app.tip(res.msg)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  // 计算进货总价
  getStockTotalSum(list) {
    let amount = 0
    list.map(item => {
      console.log(item)
      amount += item.amount || Number(item.purchaseAmt)
    })
    this.setData({
      amount: amount.toFixed(2)
    })
  },

  //获取退货供应商信息
  pagList() {
    let {
      loginInfo
    } = this.data
    console.log(loginInfo)
    let params = {
      superMerchantCode: loginInfo.appId,
      merchantCode: loginInfo.merchantCode,
      pageSize: 2000
    }
    pagList(params).then(res => {
      console.log(res, '获取退货供应商信息')
      if (res.code == "SUCCESS" && res.result.totalCount > 0) {
        this.setData({
          supplierList: res.result.items
        })
      }
    })
  },

  // 跳转编辑商品页
  redactGoods(e) {
    let {
      goodsDetail,
      recordId
    } = this.data
    if (goodsDetail && (goodsDetail.status == 2 || goodsDetail.status == 4)) return
    this.setData({
      alter: recordId ? true : false
    })
    console.log(e.currentTarget.dataset.item)
    wx.setStorageSync('goodsDetail', e.currentTarget.dataset.item)
    app.pageType = 1
    wx.navigateTo({
      url: `/retailPages/pages/stock/stockGoodsDetail/stockGoodsDetail`,
    })
  },

  // 动态修改标题
  setTitle(tltle) {
    wx.setNavigationBarTitle({
      title: tltle,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let goodsDetailList = wx.getStorageSync('stockGoodsList') || []
    if (goodsDetailList.length) {
      this.getStockTotalSum(goodsDetailList)
    }
    this.setData({
      goodsDetailList
    })
    this.pagList()
    // this.merchantAndSupplierByQueryGoodsList()
  },
})