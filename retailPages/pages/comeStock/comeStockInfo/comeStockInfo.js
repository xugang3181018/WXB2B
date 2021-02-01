// pages/retail/comeStock/comeStockInfo/comeStockInfo.js
let {
  saveRevisionStockOrder,
  getRevisionStockOrderDetail,
  getByBarcode
} = require("../../../../api/index")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cpmBtn: false,
    nameList: [{
        supplierId: 0,
        supplierName: "报损"
      },
      {
        supplierId: 1,
        supplierName: "报溢"
      },
      {
        supplierId: 2,
        supplierName: "领用"
      },
      {
        supplierId: 3,
        supplierName: "其他"
      }
    ],
    orderStatus: ['待提交', '待审核', '已完成'],
    signList:["入库","出库"],
    adjustmentTypisteList: ['报损', '报溢', '领用', '其他'],

    alter: false,
    isPX:app.systemInfo.isPX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.recordNo, options)
    let {
      recordNo,
      recordId
    } = options
    let loginInfo = wx.getStorageSync('login')
    console.log(recordNo,recordId)
    this.setData({
      recordNo,
      recordId,
      loginInfo
    })
    if (recordNo) {
      wx.setStorageSync('message', {
        recordNo,
        recordId
      })
      this.getRevisionStockOrderDetail()
    }
    wx.setStorageSync('name', {count:'数量',amount:'总金额'})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //获取出库状态
  getSupplier(e) {
    console.log(e.detail)
    let adjustmentType = e.detail.supplierId
    if(adjustmentType==0 || adjustmentType==2){
      this.setData({
        adjustmentType,
        signIndex:1,
      })
    }else if(adjustmentType==1){
      this.setData({
        adjustmentType,
        signIndex:0,
      })
    }else{
      this.setData({
        adjustmentType,
        signIndex:false,
      })
    }
   
  },

  //获取调整单标识
  changeSign(e){
    console.log(e)
    this.setData({
      signIndex:Number(e.detail.value)
    })
  },

  //添加出库商品
  onAdd() {
    let {adjustmentType,signIndex} = this.data
    console.log(signIndex)
    console.log(adjustmentType)
    if(!(adjustmentType == 0 || adjustmentType)){
      app.tip("请选择出库原因")
      return
    }
    if(adjustmentType == 3 && !(signIndex === 0 || signIndex)){
      app.tip("请选择标志")
      return
    }
    this.setData({
      cpmBtn: true,
    })
  },

  //扫码出库
  onScan() {
    let {
      recordNo,
      signIndex
    } = this.data,that = this;
    // this.setData({
    //   cpmBtn: false,
    //   alter: recordNo ? true : false
    // })
    wx.scanCode({
      success(res) {
        console.log(res)
        if (res.result) {
          that.getByBarcode(res.result)
          // if(signIndex){
          //   app.pageType = 2
          //   app.signIndex = signIndex
          // }else{
          //   app.pageType = 0
          // }
          // wx.navigateTo({
          //   url: `/pages/retail/stock/stockGoodsDetail/stockGoodsDetail?goodsBarcode=${res.result}`,
          // })
        }
      }
    })
  },

    // 根据条码获取商品信息
    getByBarcode(goodsBarcode) {  
      let {
        recordNo,
        signIndex
      } = this.data
      getByBarcode({
        merchantCode: wx.getStorageSync('login').merchantCode,
        goodsBarcode
      }).then(res => {
        console.log(res, "根据条码获取商品信息")
        if (res.code == "SUCCESS") {
          // this.setData({
          //   goodsDetail: res.result
          // })
          let goodsDetail = JSON.stringify(res.result)
          this.setData({
            cpmBtn: false,
            alter: recordNo ? true : false
          })
          if(signIndex){
            app.pageType = 2
            app.signIndex = signIndex
          }else{
            app.pageType = 0
          }
          wx.navigateTo({
            url: `/retailPages/pages/stock/stockGoodsDetail/stockGoodsDetail?goodsBarcode=${goodsBarcode}&goodsDetail=${goodsDetail}`,
          })
        }else{
          app.tip(res.msg)
        }
      })
    },

  // 手动选择
  onManual() {
    let {
      recordNo,
      signIndex
    } = this.data
    this.setData({
      cpmBtn: false,
      alter: recordNo ? true : false
    })
    if(signIndex){
      app.pageType = 2
      app.signIndex = signIndex
    }else{
      app.pageType = 0
    }
    wx.navigateTo({
      // url: '/pages/retail/comeStock/selectComeStockGoods/selectComeStockGoods',
      url: `/retailPages/pages/stock/selectStockGoods/selectStockGoods`,
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

  // 计算进货总价
  getStockTotalSum(list) {
    let amount = 0
    list.map(item => {
      console.log(item)
      amount += item.amount
    })
    this.setData({
      amount
    })
  },

  // 删除出库单单个商品
  delete(e) {
    let that = this
    console.log(e, e.target.id)
    let {
      goodsDetailList,
      recordNo,
      recordId
    } = that.data
    let index = Number(e.target.id)
    if (recordId && goodsDetailList.length == 1) {
      app.tip("单个商品无法删除")
      return
    } else {
      that.setData({
        cpmBtn: false,
        alter: recordNo ? true : false
      })
      wx.showModal({
        title: '提示',
        content: '确定要删除吗',
        success(res) {
          if (res.confirm) {
            if (recordNo) {
              that.setTitle('编辑库存调整单')
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
    }
  },

  // 动态修改标题
  setTitle(tltle) {
    wx.setNavigationBarTitle({
      title: tltle,
    })
  },

  //删除出库单
  deleteStock() {
    this.saveRevisionStockOrder(3, '确定要删除吗')
  },

  //提交出库单
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
    this.saveRevisionStockOrder(1, title)
  },

  //审核出库单
  onSubmit() {
    this.saveRevisionStockOrder(2, '确定要审核吗')
  },

  //保存提交审核删除数据
  saveRevisionStockOrder(type, title) {
    let that = this
    let {
      adjustmentType,
      goodsDetailList,
      loginInfo,
      goodsDetail,
      recordNo,
      recordId,
      alter,
      signIndex
    } = that.data
    console.log(goodsDetailList, alter, adjustmentType)
    if (recordNo && !alter && (goodsDetail.status == 1 && type == 1)) {
      app.tip('已提交请直接审核')
      return
    }
    if (!recordNo && !(adjustmentType == 0 || adjustmentType)) {
      app.tip('请选择出库原因')
      return
    }
    wx.showModal({
      title: '提示',
      content: title,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定', goodsDetailList, adjustmentType)
          let params = {
            revisionType: type,
            stockInRecordData: app.base.joinComeStockStr(goodsDetailList),
            superMerchantCode: loginInfo.appId,
            merchantCode: loginInfo.merchantCode,
            recordType:signIndex,
            adjustmentType: (adjustmentType == 0 || adjustmentType) ? adjustmentType : goodsDetail.adjustmentType,
            operatorId: loginInfo.operatorId,
            recordId: recordId || '',
            remark: ''
          }
          console.log(params)
          saveRevisionStockOrder(params).then(res => {
            console.log(res)
            if (res.code == "SUCCESS") {
              app.tip(res.msg)
              if (type == 2 || type == 3) {
                wx.navigateBack()
              } else {
                if (alter || (recordNo && (type == 1 && goodsDetail.status == 0))) {
                  that.setData({
                    alter: false
                  }, () => {
                    that.getRevisionStockOrderDetail()
                  })
                } else {
                  if (!recordNo) {
                    wx.setStorageSync('message', {
                      recordNo: res.result.result.recordNo,
                      recordId: res.result.result.id,
                    })
                    that.setTitle('库存调整单详情')
                  }
                  that.setData({
                    recordNo: res.result.result.recordNo,
                    recordId: res.result.result.id,
                    alter: false
                  }, () => {
                    that.getRevisionStockOrderDetail()
                  })
                }
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  //入库单详情
  getRevisionStockOrderDetail() {
    let {
      recordNo,
      loginInfo
    } = this.data
    let params = {
      superMerchantCode: loginInfo.appId,
      recordNo
    }
    getRevisionStockOrderDetail(params).then(res => {
      console.log(res, "出库单详情")
      if (res.code == "SUCCESS") {
        this.setData({
          signIndex:res.result.data.recordType,
          adjustmentType:res.result.data.adjustmentType,
          goodsDetail: res.result.data,
          goodsDetailList: res.result.items
        })
        this.getStockTotalSum(res.result.items)
        wx.setStorageSync('stockGoodsList', res.result.items)
      }
    })
  },

  // 跳转编辑商品页
  redactGoods(e) {
    let {
      goodsDetail,
      recordNo,
      signIndex
    } = this.data
    if (goodsDetail && goodsDetail.status == 2) return
    this.setData({
      alter: recordNo ? true : false
    })
    let item = e.currentTarget.dataset.item
    if(!item.stockSum){
      item.stockSum = item.stock
    }
    wx.setStorageSync('goodsDetail', item)
    if(signIndex){
      app.pageType = 2
      app.signIndex = signIndex
    }else{
      app.pageType = 0
    }
    wx.navigateTo({
      url: `/retailPages/pages/stock/stockGoodsDetail/stockGoodsDetail`,
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.alter)
    let goodsDetailList = wx.getStorageSync('stockGoodsList') || []
    let message = wx.getStorageSync('message')
    this.setData({
      goodsDetailList,
      recordNo: message ? message.recordNo : '',
      recordId: message ? message.recordId : '',
    })
    if (!message) {
      this.setTitle('新建库存调整单')
    } else {
      this.setTitle('库存调整单详情')
    }
    this.getStockTotalSum(goodsDetailList)
  },

  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
     console.log('页面隐藏')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('页面卸载')
  },
})