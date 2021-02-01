

import {ajax,wxAjax} from './ajax'

// 小程序授权会话
export const wechatSession = params => ajax('/api/wechat/session',params)
// 小程序用户信息
export const userInfo = params => ajax('/api/user/userInfo',params)
// 保存用户信息 初始化用户
export const initUser = params => ajax('/api/user/getUser',params)
// 条码商品查询
export const getGoods = params => ajax('/api/goods/get',params)
// 订单创建接口
export const orderCreate = params => ajax('/api/order/create',params)
// 订单查询接口
export const orderGet = params => ajax('/api/order/get',params)
// 订单列表接口
export const orderList = params => ajax('/api/order/list ',params)
// 微信用户信息解密
export const wechatUserInfo = params => ajax('/api/wechat/userInfo',params)
// 根据条形码获取商品
export const getGoodsByBarcode = params => ajax('/api/retail/goods/getByBarcode',params)
// 条形码查询
export const getByGoodsScene = params => ajax('/api/goods/getByGoodsScene',params)
// 继续支付
export const orderPay = params => ajax('/api/order/pay', params)
// 微信接口
export const wxSession = params => wxAjax('/api/wechatAppSession.do',params)


// 零售
export const goodsByBarCode = params => wxAjax('/api/retail/goods/getByBarcode',params)
// 订单详情
export const billDetail = params => wxAjax('/open/bill/detail',params)
//订单查询
export const bill = params => wxAjax('/open/miniBill',params)
// 刷卡支付
export const pay = params => wxAjax('/open/miniPay',params)
