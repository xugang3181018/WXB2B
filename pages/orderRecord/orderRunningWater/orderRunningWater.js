// pages/orderRecord/orderRunningWater/orderRunningWater.js
import {
  billAll,
  orderList,
  terminalList
} from '../../../api/index.js'

const base = require('../../../utils/util.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTypeIndex: 0,
    receiptIndex: 0,
    payIndex: 0,
    statusIndex: 0,
    facilityIndex: 0,
    takeOutIndex: 1,
    orderStateIndex: 0,
    interfaceType: 1,
    searchParmas: {},
    orderSource: ["全部来源", "支付码牌", "插件收款", "APP收款", "接口收款", "银行卡刷卡", "小程序收款", "押金收款"],
    orderStatus: ["全部状态", "未支付", "已完成", "已退款", "已关闭", "已撤销"],
    theCheckout: ["全部款台"],
    payType: ['全部支付方式', '微信支付', '支付宝支付', '会员支付', '现金支付', 'POS支付', '云闪付'],
    payTypeObj: {
      WXPAY: '微信支付',
      ALIPAY: '支付宝支付',
      MPAY: '会员支付',
      BANK: 'POS支付',
      CASH: '现金支付'
    },
    orderStatusObj: {
      NOTPAY: '支付检测',
      SUCCESS: '已支付',
      REFUND: '已退款 ',
      CLOSED: '支付检测',
      REVOKED: '已撤销'
    },
    terminalList: "",
    orderStatusObjStatus: true,
    takeOutStatus: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.setData({
      merchantCode: options.id || app.commonParams('merchantCode')
    })
    if (options.index) {
      this.setData({
        orderTypeIndex: options.index
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //下拉选项

  orderStatus(e) {
    console.log(e.detail.value)
    let { totalStatus, searchParmas, orderTypeIndex, orderStatusObj, payTypeObj, interfaceType, terminalList } = this.data
    // receiptIndex:全部来源、statusIndex：全部状态、facilityIndex：全部款台、payIndex：全部支付方式
    switch (e.currentTarget.id) {
      case 'receiptIndex':
        this.setData({
          receiptIndex: e.detail.value
        })
        break;
      case 'statusIndex':
        this.setData({
          statusIndex: e.detail.value
        })
        break;
      case 'facilityIndex':
        this.setData({
          facilityIndex: e.detail.value
        })
        break;
      case 'payIndex':
        this.setData({
          payIndex: e.detail.value
        })
        break;
    }

    function getValues(arr) {
      let ars = []
      for (let i in arr) {
        ars.push(i)
      }
      console.log(ars[Number(e.detail.value) - 1])
      return ars[Number(e.detail.value) - 1]
    }
    // let searchParmas = this.data.searchParmas
    if (e.detail.value == 0) {
      if (e.currentTarget.id == 'receiptIndex') {
        delete searchParmas.orderSource
      } else if (e.currentTarget.id == 'statusIndex') {
        delete searchParmas.orderStatus
      } else if (e.currentTarget.id == 'facilityIndex') {
        delete searchParmas.terminalId
      } else if (e.currentTarget.id == 'payIndex') {
        delete searchParmas.payType
      }
    } else {
      console.log(e)
      if (e.currentTarget.id == 'receiptIndex') {
        searchParmas.orderSource = Number(e.detail.value) - 1
      } else if (e.currentTarget.id == 'statusIndex') {
        if (orderTypeIndex == 4) {
          searchParmas.orderStatus = Number(e.detail.value) - 1
        } else if (orderTypeIndex == 6) {
          searchParmas.orderStatus = totalStatus[Number(e.detail.value) - 1]
        } else {
          searchParmas.orderStatus = getValues(orderStatusObj)
        }
      } else if (e.currentTarget.id == 'facilityIndex') {
        searchParmas.terminalId = terminalList[Number(e.detail.value) - 1].terminalId
      } else if (e.currentTarget.id == 'payIndex') {
        searchParmas.payType = getValues(payTypeObj)
      }
    }
    this.setData({
      searchParmas: searchParmas
    })
    if (interfaceType == 1) {
      let billParmas = this.billParmas()
      console.log(billParmas)
      this.orderDataInit(billParmas)
    } else if (interfaceType == 2) {
      let billParmas = this.billParmas("", 2)
      console.log(billParmas)
      this.getOrderList(billParmas)
    }

  },

  //请求数据的参数

  billParmas(pageNumber, type = 1, status) {
    let params, { merchantCode, deliveryOrderStatus, orderType, orderTypeIndex, searchParmas, takeOutIndex} = this.data;
    if (type == 2) {
      params = {
        merchantCode:merchantCode,
        pageNumber: pageNumber || 1,
        pageSize: 20,
        refundType: '0',
        orderStatus: deliveryOrderStatus || '4',
        orderTypeOut: takeOutIndex,
        orderSource: '1',
        orderType:orderType
      }
    } else if (type == 1) {
      params = {
        pageNumber: pageNumber || 1,
        pageSize: 20,
        merchantCode:merchantCode,
        orderType:orderTypeIndex,
      }
    }
    let _params = {}
    if (status == 0) {
      _params = params
    } else {
      _params = Object.assign({}, params,searchParmas)
    }

    console.log(params, _params)
    return _params
  },

  // 请求账单交易数据

  orderDataInit(params, isMore) {
    wx.showLoading()
    this.setData({
      istolower: true,
      hasmore: true
    })
    if (this.data.statusIndex == 0 && this.data.orderTypeIndex != 6) {
      params.orderStatus = 'SUCCESS,REFUND'
    }
    params.refundType = 0
    billAll(params).then(res => {
      console.log(res)
      wx.hideLoading()
      if (res.code == "SUCCESS" && res.orderDetails) {
        res.orderDetails.map(item => {
          if (item.payTime) {
            item.payTime = base.strDateFormat(item.payTime)
            item.createDate = base.strDateFormat(item.createDate)
            item.preAuthCancelOrCompleteDate = base.strDateFormat(item.preAuthCancelOrCompleteDate)
          }
        })
      }
      if (isMore) {
        //分页加载更多
        let _tradeMerchant = this.data.orderList
        _tradeMerchant.orderDetails = _tradeMerchant.orderDetails.concat(res.orderDetails)
        _tradeMerchant.pageNumber = res.pageNumber
        console.log()
        let summaryHasMore = (res.pageNumber == _tradeMerchant.totalPage) ? false : true
        this.setData({
          summaryHasMore: summaryHasMore,
          orderList: _tradeMerchant,
          hasmore: summaryHasMore
        })
      } else {
        if (res.totalCount == 0) {
          this.setData({
            istolower: false
          })
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 2000
          })
        }
        let summaryHasMore = (res.totalPage > 1) ? true : false
        this.setData({
          summaryHasMore: summaryHasMore,
          orderList: res,
          hasmore: summaryHasMore
        })
      }
    })
  },

  //获取订单列表数据

  getOrderList(params, isMore) {
    wx.showLoading()
    orderList(params).then(res => {
      console.log(params, res)
      wx.hideLoading()
      let data = res.result
      if (res.code == "SUCCESS" && data.orderDetails) {
        data.orderDetails.map(item => {
          if (item.payTime) {
            item.payTime = base.strDateFormat(item.payTime)
          }
        })
        if (isMore) {
          //分页加载更多
          let _tradeMerchant = this.data.orderList
          _tradeMerchant.orderDetails = _tradeMerchant.orderDetails.concat(data.orderDetails)
          _tradeMerchant.page = data.page
          let summaryHasMore = (data.page == _tradeMerchant.totalPage) ? false : true
          this.setData({
            summaryHasMore: summaryHasMore,
            orderList: _tradeMerchant,
            hasmore: summaryHasMore
          })
        } else {
          if (res.totalCount == 0) {
            this.setData({
              istolower: false
            })
            wx.showToast({
              title: '暂无数据',
              icon: 'none',
              duration: 2000
            })
          }
          let summaryHasMore = (data.totalPage > 1) ? true : false
          this.setData({
            summaryHasMore: summaryHasMore,
            orderList: data,
            hasmore: summaryHasMore
          })
        }
      } else {
        this.setData({
          orderList: {},
        })
      }
    })
  },

  //获取款台数据

  getTerminalList() {
    terminalList({
      merchantCode: this.data.merchantCode
    }).then(res => {
      console.log(res, '款台列表')
      let list = []
      if (res.code == "SUCCESS" && res.terminalList.length) {
        res.terminalList.map(item => {
          console.log(item.terminalName)
          list.push(item.terminalName)
        })
        this.setData({
          terminalList: res.terminalList,
          theCheckout: this.data.theCheckout.concat(list)
        })
      }
    })
  },

  // 分页加

  moreSummary() {
    this.setData({
      orderIsBottm: true
    })
    let { summaryHasMore, interfaceType, takeOutStatus} = this.data
    if (this.data.summaryHasMore) {
      // 1收银订单、订单充值、押金订单、付费卡卷、付费会员，2扫码点餐、外卖自提、在线商城
      if (this.data.interfaceType == 1) {
        let billParmas = this.billParmas()
        billParmas.pageNumber = this.data.orderList.pageNumber + 1
        this.orderDataInit(billParmas, true)
      } else if (this.data.interfaceType == 2) {
        let billParmas = this.billParmas("", 2)
        if(this.data.status == 4){
          this.formatting(billParmas)
        }
        billParmas.pageNumber = this.data.orderList.page + 1
        if (takeOutStatus == 1){
          delete billParmas.orderStatus
          billParmas.deliveryStatus = '-1'
        } else if (takeOutStatus == 3){
          delete billParmas.orderStatus
          billParmas.refundStatus = 4
        }
        this.getOrderList(billParmas, true)
      }
    }
  },

  //订单类型

  changeOrderType(e) {
    console.log(e)
    //0消费收银，1订单充值，2付费会员，3付费卡卷，4扫码点餐，5外面自提，6押金订单，7在线商城
    let status = e.currentTarget.id
    switch (status) {
      case '0':
        this.setData({
          orderSource: ["全部来源", "支付码牌", "插件收款", "APP收款", "接口收款", "银行卡刷卡", "小程序收款", "押金收款"],
          orderStatus: ["全部状态", "未支付", "已完成", "已退款", "已关闭", "已撤销"],
          theCheckout: ["全部款台"],
          payType: ['全部支付方式', '微信支付', '支付宝支付', '会员支付', '现金支付', 'POS支付', '云闪付'],
          orderStatusObj: {
            NOTPAY: '支付检测',
            SUCCESS: '已支付',
            REFUND: '已退款 ',
            CLOSED: '支付检测',
            REVOKED: '已撤销'
          },
          orderStatusObjStatus: true,
          interfaceType: 1,
          hidden: false
        })
        break;
      case '1':
        this.setData({
          orderSource: ["全部来源", "线上充值", "预存开卡", "手动充值", "营销赠送"],
          orderStatus: ["全部状态", "未支付", "已完成", "已退款", "已关闭", "已撤销"],
          theCheckout: ["全部款台"],
          payType: ['全部支付方式', '微信支付', '支付宝支付', '现金支付'],
          orderStatusObj: {
            NOTPAY: '支付检测',
            SUCCESS: '已支付',
            REFUND: '已退款 ',
            CLOSED: '支付检测',
            REVOKED: '已撤销'
          },
          orderStatusObjStatus: true,
          interfaceType: 1,
          hidden: false
        })
        break;
      case '2':
        this.setData({
          orderSource: ["全部来源", "付费开卡", "付费升级"],
          orderStatus: ["全部状态", "未支付", "已完成", "已退款", "已关闭", "已撤销"],
          payType: ['全部支付方式', '微信支付', '支付宝支付'],
          orderStatusObj: {
            NOTPAY: '支付检测',
            SUCCESS: '已支付',
            REFUND: '已退款 ',
            CLOSED: '支付检测',
            REVOKED: '已撤销'
          },
          orderStatusObjStatus: true,
          interfaceType: 1,
          hidden: false
        })
        break;
      case '3':
        this.setData({
          orderSource: ["全部来源", "付费优惠券", "付费次卡", "付费礼品卡"],
          orderStatus: ["全部状态", "未支付", "已完成", "已退款", "已关闭", "已撤销"],
          payType: ['全部支付方式', '微信支付', '支付宝支付', '会员支付'],
          orderStatusObj: {
            NOTPAY: '支付检测',
            SUCCESS: '已支付',
            REFUND: '已退款 ',
            CLOSED: '支付检测',
            REVOKED: '已撤销'
          },
          orderStatusObjStatus: true,
          interfaceType: 1,
          hidden: false
        })
        break;
      case '4':
        this.setData({
          orderSource: ["全部来源", "公众号", "小程序"],
          orderStatus: ["全部状态", "未支付", "已完成", "已退款", "已撤销"],
          payType: ['全部支付方式', '微信支付', '支付宝支付', '会员支付'],
          orderStatusObjStatus: false,
          interfaceType: 2,
          orderType: '2',
          hidden: true,
        })
        break;
      case '5':
        this.setData({
          orderStatusObjStatus: false,
          interfaceType: 2,
          orderType: '1',
          hidden: false,
          payStatus: ["未支付", "已支付", "支付失败"],
          refundStatus: ["", "", "部分退款"],
          deliveryStatus: ["接单", "", "顾客已取餐", "取消配送", "", "重下配送单", "重下配送单", "", "", "呼叫配送"],
          refundStatus: ["", "", "", "", "", "",]
        })
        break;
      case '6':
        this.setData({
          orderSource: ["全部来源", "码牌", "插件", "APP", "接口", "银行卡", "小程序",],
          orderStatus: ["全部状态", "押金收款", "押金退还", "消费完成", "已关闭", "未支付"],
          payType: ['全部支付方式', '微信支付', '支付宝支付'],
          orderStatusObj: {
            NOTPAY: '支付检测',
            CLOSED: '支付检测',
            REVOKED: '押金退还'
          },
          totalStatus: ['SUCCESS', 'REVOKED', 'SUCCESS,REFUND', 'CLOSED', 'NOTPAY'],
          orderStatusObjStatus: false,
          interfaceType: 1,
          hidden: false
        })
        break;
      case '7':
        this.setData({
          orderStatusObjStatus: true,
          interfaceType: 2,
          orderType: '0',
          hidden: false
        })
        break;
    }
    this.setData({
      orderTypeIndex: status,
      receiptIndex: 0,
      statusIndex: 0,
      facilityIndex: 0,
      payIndex: 0,
      status: status
    })
    if (status == 0 || status == 1 || status == 2 || status == 3 || status == 6) {
      let billParmas = this.billParmas("", 1, 0)
      // this.formatting(billParmas)
      this.orderDataInit(billParmas)
    } else {
      let billParmas = this.billParmas("", 2, 0)
      if(status == 4){
        this.formatting(billParmas)
      }
      billParmas.orderType = this.data.orderType
      if (this.data.orderType == 5) {
        billParmas.orderTypeOut = 1
        billParmas.orderStatus = '4'
      }
      console.log(billParmas)
      this.getOrderList(billParmas)
    }
  },

  // 初始化下拉选项

  formatting(billParmas) {
    delete billParmas.orderSource
    delete billParmas.orderStatus
    delete billParmas.terminalId
    delete billParmas.payType
    delete billParmas.orderTypeOut
    delete billParmas.orderStatus
  },

  //外卖形式

  onTakeOutForm(e) {
    console.log(e.currentTarget.id)
    this.setData({
      takeOutIndex: e.currentTarget.id
    })
    let billParmas = this.billParmas("", 2, 0)
    billParmas.orderTypeOut = Number(e.currentTarget.id)
    this.getOrderList(billParmas)
  },

  //外卖订单状态

  onOrderState(e) {
    this.setData({
      orderStateIndex: e.currentTarget.id
    })
    let billParmas = this.billParmas("", 2, 0)
    console.log(billParmas)
    switch (e.currentTarget.id) {
      case '0':
        billParmas.orderStatus = '4'
        this.setData({
          takeOutStatus: e.currentTarget.id,
          deliveryOrderStatus:'4'
        })
        break;
      case '1':
        delete billParmas.orderStatus
        billParmas.deliveryStatus = '-1'
        this.setData({
          takeOutStatus: e.currentTarget.id
        })
        break;
      case '2':
        billParmas.orderStatus = '5'
        this.setData({
          takeOutStatus: e.currentTarget.id,
          deliveryOrderStatus: '5'
        })
        break;
      case '3':
        delete billParmas.orderStatus
        billParmas.refundStatus = 4
        this.setData({
          takeOutStatus: e.currentTarget.id
        })
        break;
      case '4':
        billParmas.orderStatus = '1'
        this.setData({
          takeOutStatus: e.currentTarget.id,
          deliveryOrderStatus: '1'
        })
        break;
    }
    this.getOrderList(billParmas)
  },

  //复制订单编号

  onCopyCoding(e) {
    console.log(e.currentTarget.id)
    wx.setClipboardData({
      data: e.currentTarget.id,
      success(res) {
        console.log(res)
        wx.getClipboardData({
          success(res) {
            console.log(res)
          }
        })
      }
    })
  },

  // 拨打电话
  dialPhone(e) {
    console.log(e.currentTarget.id)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id
    })
  },

  // 缓存详情数据

  onOrderDetail(e) {
    console.log(e)
    let outTradeNo = e.currentTarget.id,type = e.currentTarget.dataset.type,mode = e.currentTarget.dataset.mode,orderType=e.currentTarget.dataset.ordertype;
    wx.setStorageSync('itemDetail', this.data.orderList.orderDetails[outTradeNo])
    if (this.data.orderTypeIndex == 5 || this.data.orderTypeIndex == 4){
      wx.navigateTo({
        url: `/pages/orderRecord/takeOutDetail/takeOutDetail?takeOutStatus=${type}&takeOutIndex=${mode}&orderType=${orderType}`,
      })
    }else{
      wx.navigateTo({
        url: '/pages/orderRecord/orderDetail/orderDetail',
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let billParmas = this.billParmas(),orderStatus,
      { orderTypeIndex, statusIndex } = this.data;
    if (statusIndex == 0) {
      // billParmas.orderStatus = 'SUCCESS,REFUND'
    }
    this.getTerminalList()
    if (orderTypeIndex == 0 || orderTypeIndex == 1 || orderTypeIndex == 2 || orderTypeIndex == 3 || orderTypeIndex == 6) {
      this.orderDataInit(billParmas)
    } else {
      if (orderTypeIndex == 5) {
        this.getOrderList(this.billParmas("", 2, 0))
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})