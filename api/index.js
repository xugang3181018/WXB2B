import { ajax, siAjax, oldSiAjax, ksAjax, request, retailAjax, wxRequest, qyRequest, repastAjax, uploadFile } from './api.js'
//登录
export const login = params => ajax('open/login', params, true, "GET")
//总的毛利额
export const grossProfit = params => retailAjax('api/retail/goods/salesGrossProfit', params, true, "POST")
// 商品销售汇总
export const saleStatisticsForApp = params => retailAjax('api/retail/goods/saleStatisticsForApp', params, "POST")
//订单列表
export const orderList = params => repastAjax('api/order/list', params, "POST")
//根据条码查询商品   
export const getByBarcode = params => retailAjax('api/retail/goods/getByBarcode', params, "POST")
//新建商品    
export const newGoods = params => retailAjax('api/retail/goods/save', params, "POST")
//获取商品信息  
export const info = params => ajax('open/goods/info', params,"", "POST")
// 更新商品  
export const updateGoods = params => retailAjax('api/retail/goods/update', params, "POST")
// 查询商品详情  
export const getGoodsDetail = params => retailAjax('api/retail/goods/get', params, "POST")
//现金支付   
export const cashPay = params => ajax('open/cashPay', params, "", "POST")
//通用账单交易查询
export const billAll = params => ajax('open/billAll', params)
//通用交易汇总统计
export const trade = params => ajax('open/statistics/trade', params)
//商户分组交易汇总统计
export const tradeMerchant = params => ajax('open/statistics/trade/merchant', params)
//通用充值数据统计
export const recharge = params => ajax('open/statistics/recharge', params)
//会员新增数量
export const newMemberCount = params => ajax('open/statistics/newMemberCount', params)
//会员查询
export const memberGet = params => ajax('open/member/get', params)
//用户优惠券列表
export const memberCouponList = params => ajax('open/coupon/couponList', params)
//款台分组交易汇总统计
export const terminal = params => ajax('open/statistics/trade/terminal', params)

//商户分组交易汇总统计
export const merchant = params => ajax('open/statistics/trade/merchant', params)

//员工分组交易汇总统计
export const tradeOperator = params => ajax('open/statistics/trade/operator', params)
//商户分组交易概要统计
export const tradeSummaryMerchant = params => ajax('open/statistics/trade/summaryMerchant', params)
//分组列表
export const groupList = params => ajax('open/merchant/group/list', params)
// 查询分组  
export const groupGet = params => ajax('open/merchant/group/get', params)
//账单查询
export const bill = params => ajax('open/bill', params)

// 订单详情
export const billDetail = params => ajax('open/bill/detail', params)

//订单查询
export const payQuery = params => ajax('open/pay/query', params)
//门店查询
export const merchantList = params => ajax('open/merchant/list', params)
//订单退款
export const refund = params => ajax('open/refund', params)
//订单退款明细
export const refundOrderList = params => ajax('open/bill/refundOrderList', params)
//支付二维码生成
export const jspay = params => ajax('open/jspay', params)
export const pay = params => ajax('open/pay', params)
//云喇叭设备绑定
export const bindYunlaba = params => ajax('open/device/yunlaba/bind', params)

//新增接口
//[兑换券] - 核销兑换券
export const giftConsume = params => ajax('open/coupon/giftConsume', params)
//核销优惠券
export const couponConsume = params => ajax('open/coupon/consume', params)
//外卖自提核销 
export const updateStatusForApp = params => repastAjax('api/order/delivery/updateStatusForApp', params, "POST",true)


//支付码绑定
export const bindPayCode = params => ajax('open/bindPayCode', params)
//支付码解除绑定
export const unBindPayCode = params => ajax('open/unBindPayCode', params)
//APP获取收款二维码
export const getPayQrcode = params => ajax('open/getPayQrcode', params)
//终端签到统计
export const signIn = params => ajax('open/terminal/signIn', params)
//终端签出统计
export const signOut = params => ajax('open/terminal/signOut', params)
//款台列表
export const terminalList = params => ajax('open/terminal/list', params)

//支付码列表
export const payCodeList = params => ajax('open/payCode/list', params)
//[优惠券] - 核销优惠券记录明细
export const couponConsumeRecordList = params => ajax('open/coupon/couponConsumeRecordList', params)
//[优惠券] - 查询核销优惠券数量
export const couponConsumeCount = params => ajax('open/coupon/couponConsumeCount', params)
//[优惠券] - 核销优惠券记录
export const couponConsumeList = params => ajax('open/coupon/couponConsumeList', params)

//[支付优惠] - 订单营销优惠查询
export const discount = params => ajax('open/pay/discount', params)
//用户次卡详情
export const timesCardDetail = params => ajax('open/timescard/userTimesCardDetail', params)
//用户次卡核销
export const timesCardConsume = params => ajax('open/timescard/userTimesCardConsume', params)
//商户次卡列表
export const timesCardList = params => ajax('open/timescard/timesCardList', params)

//员工列表
export const employeeList = params => ajax('open/employee/list', params)
//测试修改员工
export const employeeModify = params => ajax('open/employee/modify', params)
//测试获取所有角色
export const employeeRoles = params => ajax('open/employee/roles', params)
//测试员工信息查询
export const employeeQuery = params => ajax('open/employee/query', params)
//新增员工
export const employeeAdd = params => ajax('open/employee/add', params)

//会员管理
//会员模板接口
export const memberCardTemplate = params => ajax('open/member/getMemberCardTemplate', params)
//对接会员修改
export const memberModify = params => ajax('open/member/modify', params)
export const levelList = params => ajax('open/merchant/levelList', params)

//对接会员列表接口
export const memberList = params => ajax('open/member/getClubMemberList', params)
//对接会员支付授权码
export const payAuthCode = params => ajax('open/member/payAuthCode', params)
//对接会员支付授权码
export const memberRegist = params => ajax('open/member/regist', params)
//对接会员查询（小程序用 免签）
export const memberMiniGet = params => ajax('open/member/miniGet', params)
//[会员积分] - 积分列表
export const pointList = params => ajax('open/member/pointList', params)

//到账
export const accountRecord = params => ajax('open/settle/accountRecord', params)
//查询到账记录2.0
export const accountLisTarrivalAmount = params => ajax('open/settlement/query', params, false, "POST")

export const accountList = params => ajax('open/settle/accountList', params)
//预授权 押金支付
export const preauthPay = params => ajax('open/preauth/pay', params)
//押金查询
export const preauthQuery = params => ajax('open/preauth/query', params)
//押金撤销
export const preauthReverse = params => ajax('open/preauth/reverse', params)
//押金完成
export const preauthComplete = params => ajax('open/preauth/complete', params)

// 拓客分销
//已发布分销规则查询（免签）	POST
export const salesmanRuleInfo = params => ajax('open/salesman/ruleInfo', params)
//已发布分账单列表	POST
export const profitSharingOrderList = params => ajax('open/salesman/profitSharingOrderList', params)
//已发布分销员数据统计	POST
export const salesmanStatistics = params => ajax('open/salesman/statistics', params)
//已发布分销员顾客列表	POST
export const salesmanCustomerList = params => ajax('open/salesman/customerList', params)
//已发布分销员查询	POST', params)
export const salesmanInfo = params => ajax('open/salesman/info', params)
//已发布查询是否是分销员	POST
export const findIsSalesman = params => ajax('open/salesman/findIsSalesman', params)
//已发布分销员绑定	POST
export const salesmanBind = params => ajax('open/salesman/bind', params)
// 优惠券列表
export const couponMall = params => ajax('open/salesman/couponMall', params)
// 分销员商品推广列表（免签）
export const goodsMallApi = params => ajax('open/salesman/goodsMall', params)
// 商城-查询商品详情
export const getByGoodsSceneApi = params => repastAjax('api/goods/getByGoodsScene', params)
//获取无限制小程序二维码
export const getWXACodeUnlimitApi = params => repastAjax('proxy/getWXACodeUnlimit', params)
// getWXACodeUnlimit(params) {
//   return baseAjax(`${extConfig.host}/admin/shop/getWXACodeUnlimit`, 'GET', params)
// },

// 获取扩展参数  /open/wechat/getAppInfo
export const getAppInfoApi = params => ajax('open/wechat/getAppInfo', params)


// 商户优惠券
export const merchantCouponList = params => ajax('open/merchant/couponList', params)
// 商户优惠券详情
export const merchantCouponInfo = params => ajax('open/merchant/couponInfo', params)
// 获取分享链接
export const getShareUrl = params => ajax('open/share/getShareUrl', params)
// export const uploadImage = params => uploadFiles('open/uploadFile', params)
export const getUser = params => request('user/get', params)

// 标签
export const operateMemberCrowd = params => ajax('open/operateMemberCrowd', params)
// 积分记录
export const getList = params => ajax('open/member/getList', params)
// 会员次卡列表
export const getMemberTimesCardInfo = params => ajax('open/timescard/getMemberTimesCardInfo', params)
// 消费记录
export const billMember = params => ajax('open/bill/member', params)
// 赠送卡券
export const sendPrize = params => ajax('open/market/sendPrize', params, false, 'POST')

//SI 客商提现获取transition_id列表接口

//open/settle/ksAccountList
export const ksAccountList = params => ajax('open/settle/ksAccountList', params)
export const payPlatFormInforKs = params => siAjax('withDrawal/payPlatFormInforKs.in', params)
export const loginSi = params => siAjax('android/login.in', params)
export const getKsWithdrawUrl = params => siAjax('withDrawal/getKsWithdrawUrl.in', params)

//转发的客商接口
export const ksApi = (params, key) => ksAjax(params, key)
export const si = params => oldSiAjax(params)

// 微信系统

// userId获取外部联系人用户信息
export const externalContact = params => wxRequest('/api/cp/externalcontact.do', params)
// 登录授权
export const accessToken = params => wxRequest('/api/cp/accessToken.do', params)

//
export const jscode2session = params => qyRequest('/cgi-bin/miniprogram/jscode2session', params)
//get token
export const getAppToken = params => qyRequest('/cgi-bin/gettoken', params)






// 盘点
// 实物盘点列表查询  
export const selectInventoryRecordList = params => retailAjax('api/retail/inventoryRecord/selectInventoryRecordList', params, "POST")
// 盘点任务列表查询  
export const selectInventoryCheckList = params => retailAjax('api/retail/check/getInventoryCheckIn', params, "POST")
//查询盘点任务单
export const getInventoryCheckOrder = params => retailAjax('api/retail/check/getInventoryCheckOrder', params, "POST")
// 根据条码按照盘点任务规则查询商品   
export const getInventoryDetailsGoodsList = params => retailAjax('api/retail/inventoryDetails/getInventoryDetailsGoodsList', params, "POST")
//实物盘点订单作废
export const inventoryRecordDetailsDel = params => retailAjax('api/retail/inventoryRecord/inventoryRecordDetailsDel', params, "POST")
// 生成实物盘点单  
export const saveInventoryRecord = params => retailAjax('api/retail/inventoryRecord/saveInventoryRecord', params, "POST")
//编辑实物盘点单  
export const updateInventoryRecord = params => retailAjax('api/retail/inventoryRecord/updateInventoryRecord', params, "POST")
// 实物盘点单详情
export const shopGoodsInventoryRecordDetail = params => retailAjax('api/retail/inventoryRecord/selectInventoryRecordDetails', params, "POST")
//查询门店下的分类信息
export const getQueryGoodsCategory = params => retailAjax('api/retail/check/getQueryGoodsCategory', params, "POST")


//快速盘点单列表查询 
//快速盘点单列表
export const selectFastRecordList = params => retailAjax('api/retail/inventoryRecord/selectFastRecordList', params, "POST")
//快速盘点单编辑、提交、审核  
export const updateFastRecord = params => retailAjax('api/retail/inventoryRecord/updateFastRecord', params, "POST")
//生成快速盘点单 
export const saveFastRecord = params => retailAjax('api/retail/inventoryRecord/saveFastRecord', params, "POST")
//快速盘点单详情 
export const selectFastRecordDetailsAll = params => retailAjax('api/retail/inventoryRecord/selectFastRecordDetailsAll', params, "POST")
//删除快速盘点单
export const delFastRecord = params => retailAjax('api/retail/inventoryRecord/delFastRecord', params, "POST")



// 自采入库
// 入库单列表  
export const stockInRecord = params => retailAjax('api/retail/stock/stockInRecord', params, "POST")
//入库单详情  
export const stockInRecordDetail = params => retailAjax('api/retail/stock/stockInRecordDetail', params, "POST")
//自采供应商列表
export const supplierList = params => retailAjax('api/retail/supplier/all', params, "POST")
//商品分类  
export const queryGoodsCategory = params => retailAjax('api/category/queryGoodsCategory', params, "POST")
//所有商品信息
export const goodsList = params => retailAjax('api/retail/shop/goodsInfo', params, "POST")
//新建自采入库单  
export const retailStock = params => retailAjax('api/retail/stock/in', params, "POST")
//审核入库  
export const auditStock = params => retailAjax('api/retail/stock/audit', params, "POST")
// 修改入库单  
export const updateStock = params => retailAjax('api/retail/stock/update', params, "POST")
// 删除入库单
export const deleteStock = params => retailAjax('api/retail/stock/del', params, "POST")


//库存调整单
//库存调整单
export const getRevisionStockOrder = params => retailAjax('api/retail/stock/getRevisionStockOrder', params, "POST")
//库存调整单(保存,提交,审核,删除)
export const saveRevisionStockOrder = params => retailAjax('api/retail/stock/saveRevisionStockOrder', params, "POST")
//库存调整单详情  
export const getRevisionStockOrderDetail = params => retailAjax('api/retail/stock/getRevisionStockOrderDetail', params, "POST")
//选择商品列表 
export const queryList = params => retailAjax('api/retail/goods/queryList', params, "POST")



//退货
//商品退货记录列表  
export const returnStockRecord = params => retailAjax('api/retail/stock/returnStockRecord', params, "POST")
//按商品退货（保存，提交，审核，删除）   
export const returnGoodsStock = params => retailAjax('api/retail/stock/returnGoodsStock', params, "POST")
//查询以商品退货单详情 
export const goodsByStockReturnRecord = params => retailAjax('api/retail/stock/goodsByStockReturnRecord', params, "POST")
//获取自采供应商信息 
export const pagList = params => retailAjax('api/retail/supplier/getSupplierByPage', params, "POST")
//查询退货商品信息数据 
export const merchantAndSupplierByQueryGoodsList = params => retailAjax('api/retail/goods/merchantAndSupplierByQueryGoodsList', params, "POST")
//查询选中得商品信息详情 
export const queryGoodsMessage = params => retailAjax('api/retail/goods/queryGoodsMessage', params, "POST")
//商品退货根据退货数量查询批次最高单价  
export const getGoodsCostPriceMax = params => retailAjax('api/retail/stock/getGoodsCostPriceMax', params, "POST")


//供应商 
//供应商分页列表
export const psList = params => retailAjax('api/retail/supplier/psList', params, "POST")
//获取供应商详情 
export const supplierDetail = params => retailAjax('api/retail/supplier/get', params, "POST")
//保存供应商 
export const supplierSave = params => retailAjax('api/retail/supplier/save', params, "POST")
//删除自采供应商 
export const deleteSupplier = params => retailAjax('api/retail/supplier/del', params, "POST")




//支付宝优惠商品列表 
export const alipayDiscountGoodsList = params => ajax('open/market/alipayDiscountGoodsList', params,)

// 扫码点餐类
// 商品销售报表统计
export const statisticsApi = params => ajax('open/statistics/goods', params)

// http://clubmall.liantuobank.com/api/category/list  分类列表  传核心和门店编号
// http://clubmall.liantuobank.com/api/category/update   分类编辑  传核心门店编号分类id和分类名称
// http://clubmall.liantuobank.com/api/category/del   分类删除   传核心门店编号和分类id
// http://clubmall.liantuobank.com/api/category/create 分类创建   传核心门店编号和分类name
// http://clubmall.liantuobank.com/api/category/sort   分类排序    传核心门店编号和分类id（多个逗号隔开）

// http://clubmall.liantuobank.com/api/goods/list   商品列表  传核心、门店编号和分类id
// http://api.liantuofu.com/open/uploadImage   上传商品图片  

// 获取商户列表  api/shopConfig/list
export const shopConfigListApi = params => repastAjax('api/shopConfig/list', params);

// 分类列表
export const categoryListApi = params => repastAjax('api/category/list', params);

// 分类编辑
export const categoryUpdateApi = params => repastAjax('api/category/update', params);

// 分类删除
export const categoryDelApi = params => repastAjax('api/category/del', params);

// 分类创建
export const categoryCreateApi = params => repastAjax('api/category/create', params);

// 分类排序
export const categorySortApi = params => repastAjax('api/category/sort', params);

// 商品列表
export const goodsListApi = params => repastAjax('api/goods/list', params, "POST");

// 上传图片
export const uploadImageApi = params => uploadFile('open/media/upImg', params);


// http://clubmall.liantuobank.com/api/material/list   加料列表  传核心门店编号（添加商品页面要用到）
// http://clubmall.liantuobank.com/api/goods/create   商品添加  这个传的比较多看着接口文档传吧
// http://clubmall.liantuobank.com/api/goods/del   商品删除  传核心门店编号和商品id（还有一个operatorid操作员 id要传这个可以跟侯建鹏确认下）
// http://clubmall.liantuobank.com/api/goods/update  商品编辑 基本跟添加商品传的一样
// http://clubmall.liantuobank.com/api/goods/sort   商品排序   传核心门店编号和goodsids（多个逗号隔开）
// http://clubmall.liantuobank.com/api/goods/batchOffShelf    商品下架  传核心门店编号和goodsids（操作员id传 不传跟产品确认吧）
// http://clubmall.liantuobank.com/api/goods/batchOnShelf   商品上架   传核心门店编号和goodsids（操作员id传不 传跟产品确认吧）
// http://clubmall.liantuobank.com/api/goods/get   查询商品


// 加料列表
export const materialListApi = params => repastAjax('api/material/list', params);

// 商品添加
export const goodsCreateApi = params => repastAjax('api/goods/create', params);

// 商品删除
export const goodsDelApi = params => repastAjax('api/goods/del', params);

// 商品编辑
export const goodsUpdatetApi = params => repastAjax('api/goods/update', params);

// 商品排序
export const goodsSortApi = params => repastAjax('api/goods/sort', params);

// 商品下架
export const goodsBatchOffShelfApi = params => repastAjax('api/goods/batchOffShelf', params);

// 商品上架
export const goodsBatchOnShelfApi = params => repastAjax('api/goods/batchOnShelf', params);

// 查询商品
export const goodsGetApi = params => repastAjax('api/goods/get', params);
