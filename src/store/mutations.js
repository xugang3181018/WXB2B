import * as types from './mutation-types';
import { setLocalItem, setSessionItem } from '../util/util';

const mutations = {
	//客户
	[types.SET_CLIENT_ID]: (state, clientId) => {
		state.clientId = clientId;
		setLocalItem('clientId', clientId);
	},
	[types.SET_GOODS_CODE]: (state, code) => {
		state.clientCode = code;
		setLocalItem('goodsCode', code);
	},
	[types.SET_CLIENT_CODE]: (state, code) => {
		state.clientCode = code;
		setLocalItem('clientCode', code);
	},
	[types.SET_SUPPLIER_CODE]: (state, code) => {
		state.supplierCode = code;
		setLocalItem('supplierCode', JSON.stringify(code));
	},
	[types.SET_CLIENT_NAME]: (state, name) => {
		// console.log(data)
		state.clientName = name;
		setLocalItem('clientName', name);
	},
	[types.SET_MERCHANT_ID]: (state, id) => {
		state.merchantId = id;
		setLocalItem('merchantId', id);
	},
	[types.SET_PHONE]: (state, phone) => {
		// console.log(data)
		state.phone = phone;
		setLocalItem('phone', phone);
	},
	[types.SET_OPERATOR_ID]: (state, id) => {
		// console.log(data)
		state.operatorId = id;
		setLocalItem('operatorId', id);
	},
	[types.SET_MERCHANTYPE]: (state,type) => {
		// console.log(data)
		state.merchantType = type;
		setLocalItem('merchantType', type);
	},
	[types.SET_OPERATOR_TYPE]: (state,type) => {
		// console.log(data)
		state.operatorType = type;
		setLocalItem('operatorType', type);
	},
	[types.SET_NUM]: (state, number) => {
		console.log(number)
		state.num = number;
		setLocalItem('num', number);
	},
	[types.CLEAR_CURINDEX]: (state, index) => {
		// console.log(data)
		state.curIndex = index;
		setLocalItem('curIndex', index);
	},

	//删除购物车商品
	[types.DELETE_GOODS]: (state, index) => {
		if (index >= 0) {
			console.log()
			state.addCart.splice(index, 1)
			setLocalItem('cartList', JSON.stringify(state.addCart));
		} else {
			console.log("没有下标")
			state.addCart.splice(0)
			setLocalItem('cartList', JSON.stringify(state.addCart));
		}
	},
	[types.CLIENT_LOGOUT]: (state) => {
		state.clientId = null;
		state.clientCode = '';
		state.second = '';
		state.classify = '';
		localStorage.removeItem('clientId', 'clientCode', 'second', 'classify', 'clientName', 'cartList');
	},
	//分类路径1
	[types.SET_SECOND]: (state, data) => {
		state.second = data;
		setLocalItem('second', data);
	},
	//分类路径2
	[types.SET_SECOND_TWO]: (state, data) => {
		// console.log(data, "路径2")
		state.secondTwo = data;
		setLocalItem('secondTwo', data);
	},
	//分类路径3
	[types.SET_SECOND_THREE]: (state, data) => {
		// console.log(data, "路径3")
		state.secondThree = data;
		setLocalItem('secondThree', data);
	},
	//分类路径4
	[types.SET_SECOND_FOUR]: (state, data) => {
		// console.log(data, "路径4")
		state.secondFour = data;
		setLocalItem('secondFour', data);
	},
	//一级分类
	[types.SET_CLASSIFY]: (state, data) => {
		console.log(data)
		// console.log("一级分类")
		localStorage.removeItem('classify');
		state.classify = data;
		setLocalItem('classify', JSON.stringify(data));
	},
	//二级分类
	[types.SET_RECLASSIFY]: (state, data) => {
		console.log(data)
		// console.log("二级分类")
		localStorage.removeItem('reclassify');
		state.reclassify = data;
		setLocalItem('reclassify', JSON.stringify(data));
	},
	//三级分类
	[types.SET_THREE_CLASSIFY]: (state, data) => {
		console.log(data)
		// console.log("三级分类")
		localStorage.removeItem('threeClassify');
		state.threeClassify = data;
		setLocalItem('threeClassify', JSON.stringify(data));
	},
	//四级分类
	[types.SET_FOUR_CLASSIFY]: (state, data) => {
		console.log(data)
		// console.log("四级分类")
		localStorage.removeItem('fourClassify');
		state.fourClassify = data;
		setLocalItem('fourClassify', JSON.stringify(data));
	},
	//规格
	[types.SET_SEPCIFICATIONS]: (state, index) => {
		console.log(index)
		state.specifications = index;
		setLocalItem('specifications', index);
	},
	[types.SET_ISACTIVE]: (state, id) => {
		// console.log(data)
		state.isActive = id;
		setSessionItem('isActive', id);
	},
	[types.CLEAR_ISACTIVE]: (state) => {
		// console.log(data)
		state.isActive = "";
		localStorage.removeItem('isActive');
	},
	[types.NUMBER_CHANGE]: (state, id) => {
		state.addCart.map((item) => {
			if (id === item.goodsId) {
				item.goodsTotal = Number((item.goodsAmount * item.wholesalePrice).toFixed(2));
			}
		})
		setLocalItem('cartList', JSON.stringify(state.addCart));
	},
	//缓存列表数据
	[types.SET_LIST]: (state, data) => {
		// console.log(data)
		console.log("列表")
		state.goodsList = data;
		setLocalItem('listData', JSON.stringify(data));
	},
	//添加购物车
	[types.ADD_CART_LIST]: (state, data) => {
		console.log(data)
		console.log(state.addCart,state.supplierCode,data,"添加购物车商品")
		if (!data.goodsTotal) {
			data.goodsTotal = Number((data.goodsAmount * data.wholesalePrice || 0).toFixed(2))
		}
		if (!state.addCart) {
			let list = []
			data.goodsTotal = Number((data.goodsAmount * data.wholesalePrice || 0).toFixed(2))
			list.push(data)
			setLocalItem('cartList', JSON.stringify(list));
		} else {
			let flag = false
			// state.supplierCode.map(item=>{
			// 	console.log(item)
			// 	if()
			// })
			state.addCart.map(item => {
				console.log(item)
				if ((item.goodsId == data.goodsId) && (item.goodsUnitId == data.goodsUnitId)) {
					item.goodsAmount += data.goodsAmount
					item.goodsTotal = Number((item.goodsAmount * item.wholesalePrice || 0).toFixed(2))
					flag = true
					return true
				}
				// else if((item[0].goodsId == data[0].goodsId) && (!item.supplierGoodsPackageId && !data.supplierGoodsPackageId)){
				// 	item.goodsAmount += data.goodsAmount
				// 	item.goodsTotal = item.goodsAmount * item.deliveryPrice
				// 	flag = true
				// 	return true
				// }
			})
			if (!flag) {
				state.addCart.push(data)
				setLocalItem('cartList', JSON.stringify(state.addCart));
			}else{
				setLocalItem('cartList', JSON.stringify(state.addCart));
			}
		}
		console.log(state.addCart)
	}
}

export default mutations;