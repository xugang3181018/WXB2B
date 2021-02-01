import { ajax, retailAjax, orderAjax} from './api.js'
//登录
export const loginAccount = params => ajax('open/login', params, true, "GET")
//机构详情
export const institutionDetail = params => retailAjax("api/retail/merchantInfo/detail", params, "POST")
//商品分类 
export const categoryList = params => retailAjax('api/category/queryGoodsCategoryV2', params, "POST")
// export const categoryList = params => retailAjax('api/category/queryGoodsCategory', params, "POST")
//供应商商品列表
// export const goodsList = params => retailAjax('api/retail/supplier/listSupplierGoods', params, "POST")
export const goodsList = params => retailAjax('api/retail/supplier/listSupplierGoodsV2', params, "POST")  
//商品列表
export const goodsList2 = params => retailAjax('api/retail/goods/list', params, "POST")
//供应商商品详情
export const goodsDetails = params => retailAjax('api/retail/supplier/getSupplierGoodsDetail', params, "POST")
// 商品详情
export const goodsDetails2 = params => retailAjax('api/retail/goods/get', params, "POST")

// 商品详情
// export const goodsDetail = params => retailAjax('api/retail/procurement/goodsCodeByMessageList', params, "POST")
export const goodsDetail = params => retailAjax('api/retail/goods/new/detailIncludeSupplierGoods', params, "POST")

//添加采购单

export const addPurchaseOrder = params => retailAjax("api/retail/procurement/orderStorage", params, "POST")

//采购单删除    

export const deletePurchaseOrder = params => retailAjax("api/retail/procurement/orderDelete", params, "POST")

//采购列表查询

export const purchaseOrderList = params => retailAjax("api/retail/procurement/getOrderList", params, "POST")

//采购单详情  

export const purchaseOrderDetail = params => retailAjax("api/retail/procurement/getProcurementOrderByGoodsMessage", params, "POST")

//获取配送单号

export const selectGoodsDeliver = params => retailAjax("api/retail/delivery/selectGoodsDeliver", params, "POST")

//生成入库商品信息  

export const getWarehousingGoodsByDeliveryOrder = params => retailAjax("api/retail/delivery/getWarehousingGoodsByDeliveryOrder", params, "POST")

//保存入库单 

export const savePurchaseWarehousing = params => retailAjax( "api/retail/stock/savePurchaseWarehousing", params, "POST")

//审核入库单

export const auditPurchaseWarehousing = params => retailAjax("api/retail/stock/auditPurchaseWarehousing", params, "POST")

// 入库单列表   
export const purchaseWarehousingRecord = params => retailAjax("api/retail/stock/purchaseWarehousingRecord", params, "POST")

//查询入库单详情
export const getPurchaseWarehousingDetail = params => retailAjax("api/retail/stock/getPurchaseWarehousingDetail", params, "POST")

//批发客户详情  

export const detailByCode = params =>retailAjax("api/retail/wholesale/merchant/detailByCode",params,"post")

// 批发单修改与保存 

export const orderSave = params =>retailAjax("api/retail/purchase/order/save",params,"POST")

// 批发订单列表 

export const wholesaleOrderList = params =>retailAjax("api/retail/wholesale/order/psList",params,"post")

//批发单审核

export const tuancaiAudit = params =>retailAjax("api/retail/purchase/order/tuancai/audit",params,"post")

// 批发单详情 

export const wholesaleOrderDetail = params =>retailAjax("api/retail/wholesale/order/getByOrderNo",params,"post")

// 多商品提供商批量保存订单

export const orderStorageByBatch = params =>retailAjax("api/retail/procurement/orderStorageByBatch",params,"post")

// 修改密码

export const resetPassword = params =>retailAjax("api/user/resetPassword",params,"post")

// 批发订单取消   

export const wholesaleCancel = params =>retailAjax("api/retail/purchase/order/cancel",params,"post")

// 新建退货单  /api/retail/stock/returnStockRecord

export const refundSave = params =>retailAjax("api/retail/wholesale/refund/save",params,"post")

