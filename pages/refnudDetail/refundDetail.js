// pages/refnudDetail/refundDetail.js
import {
  refundSave,
  wholesaleOrderDetail
} from '../../api/index.js';
const util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '申请退货',
      'color': true,
      'class': '0'
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "获取到的商品详情")
    let {
      recordNo,
      code
    } = options
    console.log(recordNo, code)
    // this.setData({
    //   recordNo: options.recordNo,
    //   supplierCode:options.code,
    //   merchantType:app.globalData.merchantType
    // })
    this.getWholesaleOrderDetail(recordNo, code)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 获取批发单详情
   */
  getWholesaleOrderDetail(recordNo = "PFDD2012141538520829", supplierCode = "EW_N0724464528") {
    wholesaleOrderDetail({
      appId: app.commonParams('appId'),
      merchantCode: supplierCode,
      orderNo: recordNo,
    }).then(res => {
      console.log(res, "批发单详情")
      if (res.code === "SUCCESS") {
        this.setData({
          detail: res.result,
        })
        this.init(res.result.detailDtoList)
      }
    })
  },

  /**
   * 初始化数据
   */
  init(list = [], value = true) {
    list.map(item => {
      item.sales = item.goodsCnt
      item.check = value
    })
    this.setData({
      isAllSelect: list.every(item => item.check == true),
      list,
    })
    this.totalMoney()
  },
  /**
   * 判断是否有退货商品
   */
  judgeSales() {
    let {
      list
    } = this.data
    console.log(list.some(item => item.check == true))
    this.setData({
      judgeSales: list.some(item => item.check == true)
    })
  },
  /**
   * 计算选中商品的金额
   */
  totalMoney() {
    let {
      list
    } = this.data
    let total = 0
    let salesGoods = []
    list.map(item => {
      if (item.check) {
        total += Math.abs((item.sales * item.wholesalePrice).toFixed(2))
        salesGoods.push(item)
      }
    })
    this.setData({
      totalMoney: total,
      salesGoods
    })
    this.judgeSales()
  },
  /**
   * 输入框输入时触发
   */
  onInput(e) {
    console.log(e, "输入时触发")
    let value = e.detail.value,
      index = Number(e.currentTarget.dataset.id),
      {
        list
      } = this.data;
    let count = list[index].goodsCnt
    if (value > count) {
      this.setData({
        [`list[${index}].sales`]: count
      })
    }
  },
  /**
   * 输入框失焦时触发
   */
  onBlur(e) {
    console.log(e, "失焦时触发")
    let value = e.detail.value,
      index = Number(e.currentTarget.dataset.id),
      {
        list
      } = this.data;
    this.setData({
      [`list[${index}].sales`]: value
    })
    this.totalMoney()
  },
  /** 
   *退货数量减
   */
  subCart({currentTarget}) {
    console.log(currentTarget)
    let index =  currentTarget.dataset.id,{list} = this.data;
    let count = Number(list[index].sales) - 1
    if(count<1)return
    this.setData({
      [`list[${index}].sales`]: count
    })
    this.totalMoney()
  },
  /** 
   * 退货数量加
   */
  addCart({currentTarget}) {
    console.log(currentTarget)
    let index =  currentTarget.dataset.id,{list} = this.data; 
    let count = Number(list[index].sales) + 1
    if(count>list[index].goodsCnt)return
    this.setData({
      [`list[${index}].sales`]: count
    })
    this.totalMoney()
  },
  /** 
   * 文本框失焦获取退货原因
   */
  textBlur({
    detail
  }) {
    this.setData({
      remarks: detail.value,
    })
  },
  /**
   * 改变商品选中状态
   */
  checkbox({
    currentTarget
  }) {
    console.log(currentTarget)
    let index = currentTarget.dataset.id,
      {
        list
      } = this.data;
    this.setData({
      [`list[${index}].check`]: !list[index].check
    }, () => {
      this.setData({
        isAllSelect: list.every(item => item.check == true)
      })
    })
    this.totalMoney()
  },
  /**
   * 全选全不选事件
   */
  checkboxAllChange({
    detail
  }) {
    console.log(detail, "全选全不选")
    let {
      list
    } = this.data, value = detail.value;
    if (value.length) {
      this.init(list)
    } else {
      this.init(list, false)
    }
    this.totalMoney()
  },
  /**
   * 申请退货事件
   */
  sales() {
    let {
      salesGoods,
      detail,
      remarks
    } = this.data
    console.log(detail, "退货信息", remarks)
    refundSave({
      merchantCode: detail.merchantCode,
      relationWholesaleOrderNo: detail.orderNo,
      wholesaleOrderJson: util.refundOrderJson(salesGoods),
      remarks,
      orderStatus: 1
    }).then(res => {
      console.log(res, "退货单")
    })
  }
})