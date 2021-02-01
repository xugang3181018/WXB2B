import {login,wechatInfo,getPhoneNumber,wxUserInfo} from '../../utils/wechat'
import {getGoods,orderCreate,orderQuery,orderList,getGoodsByBarcode,getByGoodsScene} from '../././../service/index'
import { wxPayment } from '../../utils/order'
const app = getApp()

Page({
  data: {
    open:false,
    phone:false,
    stepTitle:['第一步','第二部','第三步'],
    step:['点击扫一扫扫描商品条码','点击去支付完成支付','点击开门离开店铺'],
    openLoading:false,
    cart:[],
  },

  onShow(){
    this.setData({
      open:wx.getStorageSync('open') || null,
      phone:wx.getStorageSync('phone') || null,
      session:wx.getStorageSync('session') || null,
    })
  },
  
  onLoad(){
    this.setData({
      wxUserInfo,
      ...getApp().globalData
    })
    wx.setNavigationBarTitle({
      title: '悦喵',
    })
  },
    
  // onReady
  onReady (e) {
    this.audioCtx = wx.createAudioContext('backgroundAudio')
  },

  backgroundAudioPlay(src){
    const audioSrc= `../../assets/mp3/${src}.mp3`
    // const audioSrc = `http://s.aigei.com/pvaud/aud/mp3/aa/aa43ae7e6afd4b98be99dd62b2019b37.mp3`
    this.audioCtx.setSrc(audioSrc)
    this.audioCtx.play()
  },

  toggleDoor(){
    this.setData({
      openLoading:true
    })
    setTimeout(()=>{
      this.setData({
        open:!this.data.open,
        openLoading:false,
      })
      wx.setStorageSync('open', true)
      this.backgroundAudioPlay('doorOpen')
    },1000)
  },

  // 获取手机号
  async getPhone({detail}){
    const {phoneNumber} =  await getPhoneNumber(detail)
    this.setData({
      phone:phoneNumber
    })
  },


  openDoor(){
    wx.showLoading()
    this.setData({
      open:false,
    })
    wx.hideLoading()
    wx.removeStorageSync('open')
  },

  toggleOrder(){
    this.selectComponent("#orderPanel").togglePanel()
  },

  // 扫码获取商品
  async scanGoods(){
    try{
      const {result} = await wx.scanCode()
      this.goodsDetail(result)
    } catch (err) {
      console.warn(err)
    }
  },
  
  // 查询商品
  async goodsDetail(goodsBarcode){
    const {merchantCode:appId,storeMerchantCode:merchantCode} = this.data
    const {result} = await getGoods({ appId, merchantCode, goodsScene: 2, goodsBarcode })
    if(result.length) {
      let {cart} = this.data
      const hasGoods = cart.length && cart.some(item=>item.goodsId === result[0].goodsId) ? cart.findIndex(item => item.goodsId === result[0].goodsId) : null 
      let newGoods = []
      if(hasGoods === null ){
        newGoods = result.map(item => {
          item.count = 1
          return item
        })
      }else{
        cart[hasGoods].count = cart[hasGoods].count+1
      }
      cart.push(...newGoods)
      this.setData({
        cart
      })
      this.totalAmount()
    } else {
      app.tip('未找到该商品')
    }
  },
  
  // 购物车变更
  toggleAmount({target}){
    const {index,id} = target.dataset
    let {cart} = this.data
    let item = cart[index]
    if(id === 'min' && item.count === 1){
      wx.showModal({
        title:'确定删除该商品吗？',
        success:(e) => {
          cart.splice(index,1)
          this.setData({
            cart
          })
        }
      })
      return
    } 
    id === 'add' ? item.count ++ : item.count -- 
    this.setData({
      cart
    })
    this.totalAmount()
  },

  // 数量总价
  totalAmount(){
    const {cart} = this.data
    const totalQuantity = cart.reduce( (total, item ) => total + item.count, 0)
    const totalAmount = cart.reduce( (total, item ) => total + item.count * item.goodsPrice, 0)
    this.setData({
      totalQuantity,
      totalAmount
    })
  },

  // 订单
  getRandomNumber(max) {
    let timer = new Date().Format('YMMddhhmmss')
    let random = ""
    for (let i = 0; i <= max; i++) random += Math.round(Math.random() * 10)
    return timer + random
  },

  // 订单参数
  goodsDetailParams(){
    const {cart} = this.data
    return cart.map( item => {
      return {
        goodsId: item.goodsId,
        skuId: item.goodsSpec[0].skuId,
        quantity: item.count,
        price: item.goodsSpec[0].price,
        discountAmount: '0.00',
        total: Number(item.count * item.goodsSpec[0].price).toFixed(2),
        goodsSpecType: item.goodsSpecType,
        goodsName: item.goodsName,
        specInfo:"",
        packageGoods:"",
        barcode:item.goodsSpec[0].code,
        goodsImgUrl: item.goodsSpec[0].img ? item.goodsSpec[0].img : item.goodsImgs[0],
      }
    })
  },

  // 创建订单参数
  params( arg = {} ){
    const {appId:minAppid,merchantCode,storeMerchantCode,session,totalAmount} = this.data
    const {unionid:unionId,openid:openId,session_key:loginToken} = session
    return {
      channel: 'WXPAY',
      tradeType: 'MINIAPP',
      discountAmount: 0,
      orderType: 2,
      orderSource: 1,
      appId: merchantCode,
      merchantCode: storeMerchantCode,
      openId,
      minAppid,
      subAppId: minAppid,
      unionId,
      uid: 711,
      loginToken,
      goodsDetail:JSON.stringify(this.goodsDetailParams()),
      orderNo: `${this.getRandomNumber(6)}`,
      totalAmount: totalAmount,
      payAmount: totalAmount,
      unDiscountAmount: '0.00',
      // addressId: '934',
      // deliveryFeeAmount: '0.00',
      selfMerchantCode:storeMerchantCode,
      ...arg
    }
  },

  toggleButtonLoading() {
    this.setData({
      btnLoading: !this.data.btnLoading
    })
  },

  //创建订单并支付
  async createOrder() {
    this.toggleButtonLoading()
    const res = await orderCreate(this.params())
    this.setData({
      cart:[]
    })
    app.resSet(res, () => this.createOrderSuccess(res), () => this.createOrderFail())
  },

  //订单创建失败
  createOrderFail() {
    this.toggleButtonLoading()
    throw 'OrderCreate Fail!'
  },

  //订单创建后处理
  createOrderSuccess(res) {
    const { result: detail } = res
    const {orderNo} = detail
    wxPayment(detail, () => {
      this.paymentTest(orderNo, this.paySuccess)
    })
  },

  // 微信支付
  async wxPayment(data, success) {
    // let app = getApp()
    if (data) {
      const { nonceStr, payPackage, paySign, timeStamp,  signType, orderNo } = data
      try{
        const payRes = await wx.requestPayment({nonceStr,package:payPackage, paySign, signType, timeStamp})
        console.log(payRes)
        this.toggleSuccessPanel()
        success && success()
      }catch (err) {
        this.toggleButtonLoading()
        wx.navigateTo({
          url: `/pages/orderDetail/orderDetail?id=${orderNo}`,
        })
      }
    }
  },

  toggleSuccessPanel(){
    this.selectComponent('#successPanel').togglePanel()
  },

  goOut(){
    this.toggleSuccessPanel()
    setTimeout(() => {
      this.openDoor()
    }, 300);
  }
})
