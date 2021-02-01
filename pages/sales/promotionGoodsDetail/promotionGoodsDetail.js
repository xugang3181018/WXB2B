// pages/sales/promotionGoodsDetail/promotionGoodsDetail.js
var WxParse = require('./../../../vendor/wxParse/wxParse.js');
import {
  post
} from './post.js'
const qrcode = require('../../../libs/qrcode/code.js')
import {
  couponMall,
  getByGoodsSceneApi,
  getWXACodeUnlimitApi
} from '../../../api/index.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    isPX: app.isPX,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goodsId = options.goodsId;
    let commission = options.commission || 0;
    let login = wx.getStorageSync('login')
    this.setData({
      goodsId,
      login,
      commission
    })
    // WxParse.wxParse('goodsDescription', 'html', `<div>123</div>`, this, 20);
    this.goodsDetail(goodsId)
  },

  bannerChange({
    detail
  }) {
    this.setData({
      currentBanner: detail.current + 1
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  async goodsDetail(id) {
    let {
      login
    } = this.data
    let params = {

      goodsId: id,
      merchantCode: login.merchantCode
    }
    let res = await getByGoodsSceneApi(params);
    console.log(res);
    if (res.code == 'SUCCESS') {
      let detail = res.result[0];
      WxParse.wxParse('goodsDescription', 'html', detail.goodsDesc, this, 20);
      this.setData({
        detail
      })
      this.minPrice(detail);
      this.getWXACodeUnlimit();
      // qrcode.createQrCode(detail.goodsImgs[0], "ewmCode", 200, 200)
    } else {
      app.tip(`${res.msg}`)
    }
  },

  minPrice(det) {
    let detail = det ? det : this.data.detail;
    let spec = detail.goodsSpec;
    let price = 99999;
    let idx = 1;
    spec.map((item, index) => {
      if (price > item.price) {
        price = item.price;
        idx = index
      }
    })

    this.setData({
      spec: detail.goodsSpec[idx]
    })
  },

  async getWXACodeUnlimit() {
    let {
      login
    } = this.data;
    let scene = `id=${this.data.goodsId}`
    let params = {
      key: login.key,
      superMerchantCode: login.appId,
      appType: 4,
      page: 'pages/commodity/index',
      scene
    }
    let res = await getWXACodeUnlimitApi(params);
    console.log(res,'=================');
    if (res.code == '0') {
      this.setData({
        qrCodeList: res.data
      })
    }
  },

  extGoods() {
    // this.selectComponent('#promotions').togglePanel()
  },

  // 海报
  setHaibao() {
    let {
      qrCodeList
    } = this.data;
    // wx.canvasToTempFilePath({
    //   canvasId: 'ewmCode',
    //   width: 200,
    //   height: 200,
    //   fail: (error) => {
    //     console.log(error)
    //   },
    //   success: (res) => {
    //     console.log(res);
    this.extGoods();
    this.setData({
      post: post({
        ...this.data,
        tempImg: qrCodeList || ''
      })
    })
    wx.nextTick(() => {
      this.selectComponent('#sharePost').togglePost()
    })
    // }
    // }, this)
  },

  setUser() {
    let {
      detail,
      goodsId
    } = this.data;
    wx.qy.selectExternalContact({
       success: function(res) {
               console.log(res);
        }
});

    
  },

  // onShareAppMessage() {
    
  // }


})