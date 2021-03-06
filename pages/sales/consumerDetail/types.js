export const type ={
	payType:{
		//支付方式
		WXPAY: "微信支付",
		ALIPAY:"支付宝支付",
		MPAY:"会员支付",
		CASH:"现金支付",
		BANK: "pos支付",
		UNIONPAY: "云闪付"
	},
	orderStatus:{
		// 交易状态 
		NOTPAY:"未支付",
		SUCCESS:"支付成功",
		REFUND:"转入退款",
		CLOSED:"已关闭",
		REVOKED:"已撤销"
	},
	// 订单类型0
		orderType: ["消费收银", "会员充值", "付费会员", "付费卡券", "线上商城","活动订单"],

	refundsStatus:[],
	// 0未退款 NOTREFUND 1已退款SUCCESS 2部分退款 3退款失败CLOSED 4退款中 REFUNDING
	orderSource :[
		// 0消费收银：
		//["支付码牌","收款插件 2APP 3接口 4银行卡 5小程序 6押金 8霸屏 0消费退款：0商户后台]
		//1收款插件 2APP 3接口 4商城 5小程序 1会员充值：0线上充值 1预存开卡 2手动充值 3营销赠送 
		//2付费会员：
		["付费卡","付费等级"] 
		// 3付费卡券：
		["优惠券","次卡","礼品卡" ],
		// 4线上商城：
		["商城","外卖","堂食","自提","拼团","秒杀"],
		// 5活动订单：
		["活动报名","拼团活动","秒杀活动","押金订单"]
	]
}