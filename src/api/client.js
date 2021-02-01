import axios from '../config/axios-client';

//用户登录

export const login = params =>axios("post","/open/login",params) 

export const logins = params =>axios("post","/api/user/tuancai/login",params)


//机构详情

export const institutionDetail = params =>axios("post","/api/retail/merchantInfo/detail",params)

//机构列表  

export const merchantInfoList = params =>axios("post","/api/retail/merchantInfo/list",params)

//批发客户详情  

export const detailByCode = params =>axios("post","/api/retail/wholesale/merchant/detailByCode",params)

//商品列表 

// export const goodList = params =>axios("post","/api/retail/supplier/listSupplierGoods",params)
export const goodList = params =>axios("post","/api/retail/goods/new/tuancai/psList",params)

// 首页推荐商品列表  
// export const goodList = params =>axios("post","/api/retail/goods/new/tuancai/index/psList",params)

//商品分类  
export const categoryList = params =>axios("post","/api/category/queryGoodsCategory",params)
// export const categoryList = params =>axios("post","/api/category/list",params)   

// 批发单修改与保存 

export const orderSave = params =>axios("post","/api/retail/purchase/order/save",params)


//查询详情 
export const goodsDetails = params =>axios("post","/api/retail/goods/new/tuancai/get",params)

//添加采购单

export const addPurchaseOrder = params =>axios("post","/api/retail/procurement/orderStorage",params)

//采购单删除    

export const deletePurchaseOrder = params =>axios("post","/api/retail/purchase/order/cancel",params)

// 批发订单列表 

export const purchaseOrderList = params =>axios("post","/api/retail/wholesale/order/psList",params)

// 批发单详情 

export const purchaseOrderDetail = params =>axios("post","/api/retail/wholesale/order/getByOrderNo",params)

//获取配送单号

export const selectGoodsDeliver = params =>axios("post","/api/retail/delivery/selectGoodsDeliver",params)

//生成入库商品信息  

export const getWarehousingGoodsByDeliveryOrder = params =>axios("post","/api/retail/delivery/getWarehousingGoodsByDeliveryOrder",params)

//保存入库单 

export const savePurchaseWarehousing = params =>axios("post","/api/retail/stock/savePurchaseWarehousing",params)

// 获取入库单详情  
export const getPurchaseWarehousingDetail = params =>axios("post","/api/retail/stock/getPurchaseWarehousingDetail",params)

//审核

export const tuancaiAudit = params =>axios("post","/api/retail/purchase/order/tuancai/audit",params)

// 单据操作记录

export const record = params =>axios("post","/api/retail/operation/record/list",params)

// 获取批发客户收货地址列表

export const listArea = params =>axios("post","/api/retail/wholesale/tuancai/listArea",params)

// 新增批发客户收货地址
export const saveArea = params =>axios("post","/api/retail/wholesale/tuancai/saveArea",params)

// 删除批发客户收货地址
export const deleteArea = params =>axios("post","/api/retail/wholesale/tuancai/deleteArea",params)

// 修改密码
export const resetPassword = params =>axios("post","/api/user/resetPassword",params)






