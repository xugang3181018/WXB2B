import { orderPay, orderCancel, orderGet } from '../service/index'
const app = getApp()
const {merchantCode:appId,storeMerchantCode:merchantCode} = app.globalData

export const status = {
  status: ['未支付', '已完成', '已退款', '已关闭', '已支付', '已支付', '已支付'],
  deliveryType: ["商家自配送", "顾客自提", "同城配送"],
  orderStatus: ["订单未支付", "已完成", "已退款", "已退款", "待发货", "待收货", "待成团", "拼团失败"],
  payType: {
    WXPAY: '微信支付',
    ALIPAY: '支付宝支付',
    MPAY: '会员支付',
    CASH: '现金支付'
  },
  refundsStatus: ['未退款', '已退款', '部分退款', '退款失败', '售后中', '卖家拒绝退款']
}

// 取消订单
export const cancelOrder = async (item, success) => {
  const { orderNo } = item
  wx.showModal({
    title: '提示',
    content: '确定取消订单吗？',
    success: async (res) => {
      if (res.confirm) {
        const result = await orderCancel({
          orderNo
        })
        console.log(result)
        app.resSet(result, app.tip('订单取消成功'))
        success && success()
      }
    }
  })
}


// 刷新订单详情页详情
export const  refreshDetail = async (item, that) => {
  const res = await this.orderDetail(item)
  that.setData({
    detail: res
  })
}

// 刷新列表详情
export const resListDetail = async (item, index, that) => {
  const res = await this.detail(item)
  that.setData({
    [`orderList[${index}]`]: {
      ...that.data.orderList[index],
      ...res.result
    }
  })
}

// 订单查询
export const orderDetail = async (orderNo) => {
  try{
    const {result} = await orderGet( { orderNo, appId })
    return result
  } catch (error) {
    throw error
    return false
  }
}

// 微信支付
export const wxPayment = async (data) => {
  if (data) {
    const { nonceStr, payPackage, paySign, timeStamp, signType, orderNo } = data
    try{
      const res = await wx.requestPayment({ nonceStr, package: payPackage, paySign, signType, timeStamp })
      return res
    } catch (err) {
      wx.redirectTo({
        url:`/pages/orderDetail/orderDetail?id=${orderNo}`
      })
    }
  }
}

// 订单继续支付
export const payAgain = async (item, success) => {
  const { orderNo, orderType } = item
  const res = await orderPay({
    orderNo,
    channel: 'WXPAY',
    orderType
  })
  app.resSet(res, wxPayment(res.result, success))
}

// 订单支付检测
export const checkPayment = (orderNo, success) => {
  order.loadingNum = order.loadingNum ? order.loadingNum : 1
  order.timer = setTimeout(async () => {
    if (order.loadingNum == 5) {
      order.loadingNum = 1
      clearTimeout(order.timer)
      return
    }
    order.loadingNum = ++ order.loadingNum
    const res = await orderGet(orderNo)
    res.code == 'SUCCESS' ? success && success() : order.paymentTest(orderNo)
  }, 3000)
}

// 倒计时 时间转换 按天时分秒 type true 按天 false 按时 
export const continueDateTime = (timeStamp, type, callback) => {
  if (type) {
    var totalTime = timeStamp;
    var hours = parseInt((totalTime / (1000 * 60 * 60)));
    var minutes = parseInt((totalTime % (1000 * 60 * 60) / (1000 * 60)));
    var seconds = (totalTime % (1000 * 60)) / 1000;
  } else {
    var totalTime = timeStamp;
    var days = parseInt(totalTime / (1000 * 60 * 60 * 24));
    var hours = parseInt((totalTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((totalTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (totalTime % (1000 * 60)) / 1000;
  }
  var obj = {
    days: String(days).length == 1 ? 0 + String(days) : String(days),
    hours: String(hours).length == 1 ? 0 + String(hours) : String(hours),
    minutes: String(minutes).length == 1 ? 0 + String(minutes) : String(minutes),
    seconds: String(parseInt(seconds)).length == 1 ? 0 + String(parseInt(seconds)) : String(parseInt(seconds))
  };
  callback && callback(obj)
}

//时间转换时间戳   格式*-*-*  *：*：*
export const timeStamp = async (timeValue) => {
  var thisTime = timeValue.replace(/-/g, '/')
  console.log(timeValue)
  var time = new Date(thisTime)
  time = time.getTime()
  return time
}
