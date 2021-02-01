// pages/orderDetail/orderDetail.js
import {orderDetail,} from '../../utils/order'
import {status,payAgain} from '../../utils/order'
Page({
  data: {

  },
  onLoad({id}){
    this.setData({
      ...getApp().globalData,
      id,
      status
    })
    id ? this.orderGet(id) : this.setData({error:true})
    wx.setNavigationBarTitle({
      title: '订单详情',
    })
  },

  // 订单查询
  async orderGet(orderNo) {
    const res = await orderDetail(orderNo)
    console.log(res)
    this.setData({
      ...res,
      detail:res
    })
  },

  async payOrder(){
    const {detail} = this.data
    payAgain(detail,()=>{
      
    })
  }
})