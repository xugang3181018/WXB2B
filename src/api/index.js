import { get, post, uploadFile } from './ajax'

export const uploadImg = params => post(`/api/uploadImg.htm`, params)
export const clubMarketApp = params => post(`/api/clubMarketApp.htm?json=${JSON.stringify(params)}`, {})
export const clubMarketAppUpdate = params => post(`/api/clubMarketAppUpdate.htm`, params)
export const wechatAppMerchantCode = () => post(`/wechatAppMerchantCode.htm`, {})
// 等级权益信息
export const memberLevelInfo = params => post(`/ShopCashier/shopMemberOperation/getMemberLevelInfo.in`, params)
// 会员降级信息
export const memberDelineLevelInfo = params => post(`/ShopCashier/shopMemberOperation/getMemberDelineLevelInfo.in`, params)

// "merchantId":"10115614",
// "merchantCode": "EW_N0017769728",
// "storeMerchantCode": "EW_N4964677636",
// "host": "https://testmall.liantuobank.com",
// "domain": "https://testclubmall.liantuobank.com",
// "clubHost":"https://open.liantuobank.cn",
// "openHost":"https://testclubshop.liantuobank.com/",
// "appId": "wxa859ed19295c01b0",
// "key": "0fd6488a9e221c3f2d5430bace7dd1b1"

// 图片上传
export const uploadImage = params => post('/open/uploadImage', params)
// 获取小程序二维码
export const getMiniCode = params => post('/open/wechat/getMiniCode', params)
// 商品分类
export const categoryList = params => get('/open/decorate/categoryList', params)
// 商品列表
// export const goodsList = params => get('/open/decorate/goodsList', params)
// 微页面
export const featureList = params => get('/open/decorate/list', params)
// 图片列表
export const mediaList = params => get('/open/media/list', params)
// 装修保存
export const designSave = params => post('/open/decorate/save', params)

// 保存模板
export const themeSave = params => post('/open/decorate/saveTemp', params)
// 模板列表
export const themeList = params => get('/open/decorate/listByTemp', params)
// 模板库分类
export const themeCategory = params => get('/open/decorate/listByTempCategory', params)
// 模板库分类保存
export const themeCategorySave = params => get('/open/decorate/saveTempCategory', params)
// 模板库模板详情
export const themeDetail = params => get('/open/decorate/getTempById', params)
//模板删除
export const deleteTheme = params => post('/open/decorate/delTemp', params)

// 单商品 api/goods/list        open/goods/list
// 单分类   api/goods/list open/category/list
// 微页面   api/goods/list /open/decorate/list

// 装修详情
export const designDetail = params => get('/open/decorate/getById', params)
// 图片分类列表
export const mediaCategoryList = params => get('/open/mediaCategory/list', params)
// 媒体分类-删除
export const mediaCategoryDelete = params => get('/open/mediaCategory/del', params)
// 图片上传
export const mediaUpload = (params, config) => post('/open/media/upImg', params, config)
// 上传视频
export const videoUpload = (params, config) => post('/open/media/upVideo', params, config)
// 媒体分类-保存
export const mediaCategorySave = params => post('/open/mediaCategory/save', params)
// 媒体保存
export const mediaSave = params => post('/open/media/save', params)

// *** 悦喵 ***
// 登录
export const login = params => post('/api/ym/login', params)
// 会员列表POST
export const memberList = params => post('/api/ym/member/list', params)
// 商品库查询
export const goodsQuery = params => post('/api/ym/goods/goodsQuery', params)
// 根据条形码获取商品POST
export const getByBarcode = params => post('/api/ym/good/getByBarcode', params)
// 商品更新
export const goodsUpdate = params => post('/api/ym/goods/update', params)
// 悦喵商品列表POST
export const goodsList = params => post('/api/ym/goods/goodsList', params)
// 修改门店  POST
export const updateShop = params => post('/api/ym/shop/updateShop', params)
// 设备列表POST
export const deviceList = params => post('/api/ym/device/deviceList', params)
// 筛选框门店下拉框 POST
export const shopSelect = params => post('/api/ym/shop/shopSelect', params)
// 获取门店详情 POST
export const shopDetails = params => post('/api/ym/shop/shopDetails', params)
// 门锁操作POST
export const doorLockOperation = params => post('/api/ym/device/doorLockOperation', params)
// 悦喵小程序获取openidPOST
export const getOpenId = params => post('/api/ym/wechat/getOpenId', params)
// 访客记录列表POST
export const getVisitors = params => post('/api/ym/visitor/getVisitors', params)
// 门店列表 POST
export const shopList = params => post('/api/ym/shop/shopList', params)
// 注册用户POST
export const memberUser = params => post('/api/ym/member/user', params)
// 会员详情
export const memberDetail = params => post('/api/ym/member/detail', params)
// 会员标签
export const memberTags = params => post('/api/ym/tag/memberTags', params)
// 会员表列表
export const tagList = params => post('/api/ym/tag/tagList', params)
// 开门接口POST
export const doorOpen = params => post('/api/ym/door/open', params)
// 获取神木门店列表
export const getDeepcamShop = params => post('/api/ym/shop/getDeepcamShop', params)
//出入记录
export const inOutList = params => post('/api/ym/inOutRecord/list', params)
// 客服列表
export const ymCustomerList = params => post('/api/ym/ymCustomer/list', params)
// 获取客服详情
export const getCustomerDetails = params => post('/api/ym/ymCustomer/ymCustomerDetails', params)
// 客服类型
export const getCustomerType = params => post('/api/ym/ymCustomerEmpType/ymCustomerEmpTypeSelect', params)
// 客服等级下拉框
export const getCustomerLevel = params => post('/api/ym/ymCustomerEmpLevel/ymCustomerEmpLevelSelect', params)
// 新增客服接口
export const createCustomer = params => post('/api/ym/ymCustomer/insertYmCustomer', params)
// 修改客服信息
export const updateYmCustomer = params => post('/api/ym/ymCustomer/updateYmCustomer', params)
// 上传图片
export const upImg = params => post('/api/ym/media/upImg', params)
// 历史任务列表
export const historyTask = params => post('/api/ym/message/history', params)
// 视频列表
export const videoList = params => post('/api/ym/video/list', params)
// 在线状态变更
export const customerStatus = params => post('/api/ym/ymCustomer/customerStatusUpdate', params)

// 门锁
export const doorLock = params => post('/api/ym/device/doorLockOperation', params)
// 开门关门
export const door = params => post('/api/ym/door/open', params)
//门锁状态
export const doorState = params => post('/api/ym/device/getDoorLockStatus', params)
// 核查出入记录
export const checkInOutRecord = params => post('/api/ym/inOutRecord/checkInOutRecord', params)
// 获取订单详情
export const memberOrderDetail = params => post('/api/ym/member/orderDetail', params)
// qq地图
export const qqMap = params => get('/ws/place/v1/suggestion?key=PYHBZ-DYXLR-4T4WX-WQGEE-MRX6J-B5BM3&policy=1', params)
// qq地图
export const qqMapList = params => get('/ws/district/v1/list?key=PYHBZ-DYXLR-4T4WX-WQGEE-MRX6J-B5BM3', params)
// qq地图
export const qqMapChildren = params => get('/ws/district/v1/getchildren?key=PYHBZ-DYXLR-4T4WX-WQGEE-MRX6J-B5BM3', params)
//出入记录详情
export const getInOutRecordDetails = params => post('/api/ym/inOutRecord/getInOutRecordDetails', params)
// 出入记录结束任务
export const endInOutRecord = params => post('/api/ym/inOutRecord/endInOutRecord', params)
// 绑定门店
export const insertShop = params => post('/api/ym/shop/insertShop', params)
// 地址模糊查询
export const suggestion = params => post('/api/ym/tencent/suggestion', params)
// 绑定客服
export const insertShopCustomerEmpRelation = params => post('/api/ym/shopCustomerEmpRelation/insertShopCustomerEmpRelation', params)
// mqtt推送警告
export const warningMessage = params => post('/api/ym/message/warningMessage', params)
// 托管
export const distribute = params => post('/api/ym/distribute/distribute', params)
// 商品保存
export const goodsSave = params => post('/api/ym/goods/save', params)
// 订单查询
export const billAll = params => post('/api/ym/data/billAll', params)
// 统计
export const tradeStatistics = params => post('/api/ym/data/tradeStatistics', params)
// 客流量
export const passengerFlow = params => post('/api/ym/data/passengerFlow', params)
// 商品销售统计
export const goodsSaleStatistics = params => post('/api/ym/data/goodsSaleStatistics', params)
// 门店销量排行
export const merchantSaleRank = params => post('/api/ym/data/merchantSaleRank', params)
// 订单详情
export const billDetail = params => post('/api/ym/data/bill/detail', params)
//dashBoardStatistics
export const dashBoardStatistics = params => post('/api/ym/data/dashBoardStatistics', params)
