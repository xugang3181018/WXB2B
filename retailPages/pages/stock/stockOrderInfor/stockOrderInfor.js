// pages/retail/stock/stockOrderInfor/stockOrderInfor.js
let {
  stockInRecordDetail,
  supplierList,
  retailStock,
  auditStock,
  updateStock,
  deleteStock,
  getByBarcode
} = require('../../../../api/index')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: ['待提交', '待审核', '已完成'],
    goodsDetailList: [],
    alter: app.alter,
    isPX: app.systemInfo.isPX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // if (options.scene) {
    //   let scene = decodeURIComponent(options.scene);
    //   scene = scene.split("&");
    //   let obj = {}
    //   scene.map(item => {
    //     let itemObj = item.split("=")
    //     obj[itemObj[0]] = itemObj[1]
    //   })
    //   console.log(obj)
    // }
    let recordId = options.recordId
    this.setData({
      recordId,
      goodsDetailList: [],
    })
    // if (!recordId) {
    //   this.supplierList()
    // } else {
    //   wx.showLoading({
    //     title: '加载中',
    //   })
    //   this.stockInRecordDetail()
    // }
    // wx.showLoading({
    //   title: '加载中',
    // })
    // this.stockInRecordDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
  },

  // 计算进货总价
  getStockTotalSum(list) {
    let amount = 0
    list.map(item => {
      console.log(item)
      amount += item.amount
    })
    // if(list.length == 0){
    //   amount="0"
    // }
    this.setData({
      amount: amount.toFixed(2)
    })
  },

  //进货单详情
  stockInRecordDetail() {
    let {
      recordId,
      alter
    } = this.data
    if (!recordId) return
    wx.showLoading()
    stockInRecordDetail({
      merchantCode: wx.getStorageSync("login").merchantCode,
      recordId
    }).then(res => {
      console.log(res, '进货单详情')
      wx.hideLoading()
      if (res.code == "SUCCESS") {
        this.setData({
          goodsDetail: res.result,
          goodsDetailList: res.result.stockInRecordDetailList
        })
        this.getStockTotalSum(res.result.stockInRecordDetailList)
        app.supplierId = res.result.supplierId
        if (res.result.status != 2) {
          this.setTitle()
        }
        wx.setStorageSync('stockGoodsList', res.result.stockInRecordDetailList)
      }
    })
    wx.hideLoading()
  },

  //供应商列表
  supplierList() {
    supplierList({
      merchantCode: wx.getStorageSync("login").merchantCode
    }).then(res => {
      console.log(res, "供应商列表")
      if (res.code == "SUCCESS") {
        this.setData({
          supplier: res.result
        })
      }
    })
  },

  // 选择供应商
  changeMerchant(e) {
    console.log(e)
    this.setData({
      nameIndex: e.detail.value
    })
  },

  //添加盘点商品
  onAdd() {
    let {
      recordId,
      alter,
      nameIndex
    } = this.data
    if (!recordId && !(nameIndex == 0 || nameIndex)) {
      app.tip("请选择供货商")
      return
    }
    if (recordId) {
      alter = true
    }
    this.setData({
      cpmBtn: true,
      alter
    })
    app.alter = alter
  },

  //取消
  onDeselect() {
    this.setData({
      cpmBtn: false
    })
  },

  //手动选择商品
  onManual() {
    app.pageType = 0
    wx.navigateTo({
      url: '/retailPages/pages/stock/selectStockGoods/selectStockGoods',
    })
  },

  //扫码添加商品
  onScan() {
    let that = this
    wx.scanCode({
      success(res) {
        console.log(res)
        if (res.result) {
          // app.pageType = 0
          that.getByBarcode(res.result)
          // wx.navigateTo({
          //   // url: `/pages/retail/stock/stockGoodsDetail/stockGoodsDetail?goodsBarcode=${res.result}`,
          // })
        }
      }
    })
  },

  // 根据条码获取商品信息
  getByBarcode(goodsBarcode,sum,amount) {
    getByBarcode({
      merchantCode: wx.getStorageSync('login').merchantCode,
      goodsBarcode
    }).then(res => {
      console.log(res, "根据条码获取商品信息")
      if (res.code == "SUCCESS") {
        if(sum){
          res.result.stockSum = sum
          res.result.amount = amount
        }
        app.pageType = 0
        let goods = JSON.stringify(res.result)
        wx.navigateTo({
          url: `/retailPages/pages/stock/stockGoodsDetail/stockGoodsDetail?goodsDetail=${goods}&goodsBarcode=${goodsBarcode}`,
        })
      } else {
        app.tip(res.msg)
      }
    })
  },

  //提交进货商品
  save() {
    let that = this
    let {
      goodsDetailList,
      nameIndex,
      recordId,
      goodsDetail,
      alter
    } = this.data
    if (recordId && (alter || goodsDetail.status == 0)) {
      this.updateStock()
      return
    }
    if (!recordId && !(nameIndex == 0 || nameIndex)) {
      wx.showToast({
        title: '请选择供应商',
        icon: "none"
      })
      return
    }
    if (!goodsDetailList.length) {
      wx.showToast({
        title: '请选择商品',
        icon: "none"
      })
      return
    }
    if (recordId && goodsDetail.status == 1) {
      wx.showToast({
        title: '已提交可直接审核',
        icon: "none"
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定要提交吗',
      success(res) {
        if (res.confirm) {
          that.retailStock()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //审核进货商品
  onSubmit() {
    let that = this
    let {
      recordId
    } = this.data
    if (!recordId) {
      wx.showToast({
        title: '请先提交再审核',
        icon: "none"
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定要审核吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.auditStock()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //提交保存参数
  submitParams(status) {
    let {
      goodsDetailList,
      nameIndex,
      supplier,
      amount,
      goodsDetail,
      alter
    } = this.data
    let params = {
      merchantCode: wx.getStorageSync('login').merchantCode,
      operatorId: wx.getStorageSync('login').operatorId,
      // amount: amount || goodsDetail.amount,
      operationType: status,
      supplierId: (nameIndex == 0 || nameIndex) ? supplier[nameIndex].supplierId : (goodsDetail.supplierId || app.supplierId),
      stockInRecordData: app.base.joninStockStr(goodsDetailList, alter)
    }
    return params
  },

  //保存提交
  retailStock() {
    wx.showLoading()
    let {
      recordId
    } = this.data
    let params = this.submitParams(1)
    if (recordId) {
      params.recordId = recordId
    }
    retailStock(params).then(res => {
      console.log(res, "保存提交")
      app.tip(res.msg)
      if (res.code == 'SUCCESS') {
        this.setData({
          alter: false,
          recordId: res.result.id
        }, () => {
          this.stockInRecordDetail()
          wx.hideLoading()
        })
      } else {
        wx.hideLoading()
      }
    })
  },

  // 跳转编辑商品页
  redactGoods(e) {
    let item = e.currentTarget.dataset.item
    console.log(item)
    let {
      goodsDetail,
      alter
    } = this.data
    if (goodsDetail && goodsDetail.status == 2) return
    app.pageType = 0
    this.setData({
      alter: true
    })
    app.alter = true
    // wx.setStorageSync('goodsDetail', e.currentTarget.dataset.item)
    this.getByBarcode(item.goodsBarcode,item.stockSum || item.stock,item.amount)
    // wx.navigateTo({
    //   url: `/pages/retail/stock/stockGoodsDetail/stockGoodsDetail`,
    // })
  },

  //修改入库单
  updateStock() {
    let {
      recordId
    } = this.data
    let params = this.submitParams(1)
    if (recordId) {
      params.recordId = recordId
    }
    updateStock(params).then(res => {
      console.log(res, "修改入库单")
      app.tip(res.msg)
      if (res.code == 'SUCCESS') {
        app.alter = false
        this.setData({
          recordId: res.result.id,
          alter: false
        }, () => {
          this.stockInRecordDetail()
        })
      }
    })
  },

  // 审核入库
  auditStock() {
    let {
      recordId,
      goodsDetail
    } = this.data
    console.log(goodsDetail)
    auditStock({
      merchantCode: wx.getStorageSync('login').merchantCode,
      recordId,
    }).then(res => {
      console.log(res, "审核入库")
      wx.showToast({
        title: res.msg,
        icon: "none"
      })
      if (res.code == "SUCCESS") {
        wx.navigateBack()
      }
    })
  },


  // 删除商品
  delete(e) {
    console.log(e, e.target.id)
    let {
      recordId,
      goodsDetailList,
      alter
    } = this.data
    if (recordId && goodsDetailList.length == 1) {
      app.tip("最后一个商品无法删除")
      return
    }
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品吗',
      success(res) {
        if (res.confirm) {
          that.setData({
            cpmBtn: false,
            alter: true
          })
          app.alter = true
          let index = Number(e.target.id)
          goodsDetailList.splice(index, 1)
          that.setData({
            goodsDetailList
          })
          that.getStockTotalSum(goodsDetailList)
          that.setTitle()
          wx.setStorageSync('stockGoodsList', goodsDetailList)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 删除入库单
  deleteStock() {
    let {
      recordId
    } = this.data
    wx.showModal({
      title: '提示',
      content: '确定要删除该订单',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          deleteStock({
            merchantCode: wx.getStorageSync('login').merchantCode,
            recordId
          }).then(res => {
            console.log(res, "删除入库单")
            app.tip("删除成功")
            setTimeout(function () {
              wx.navigateBack()
            }, 1000)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 动态修改标题
  setTitle() {
    wx.setNavigationBarTitle({
      title: '编辑进货单',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let {
      recordId
    } = this.data
    console.log(recordId, app.alter)
    let goodsDetailList = wx.getStorageSync('stockGoodsList') || []
    this.setData({
      cpmBtn: false,
      goodsDetailList,
      // alter: app.alter
    })
    if (recordId && !goodsDetailList.length) {
      this.stockInRecordDetail()
    } else if (!recordId || app.alter) {
      if (!recordId) {
        // this.getStockTotalSum(goodsDetailList)
        wx.setNavigationBarTitle({
          title: '新建进货单',
        })
        this.supplierList()
      } else {
        this.setTitle()
      }
    }
    this.getStockTotalSum(goodsDetailList)
    // this.stockInRecordDetail()
  },
})