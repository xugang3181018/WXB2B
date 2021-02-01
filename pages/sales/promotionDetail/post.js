const wxml = item => {
	const originPrice = item.originalPrice > item.payPrice ? `<text class="origin">原价:${item.originalPrice}元</text>` : ''
	item.bgImg = item.bgImg.indexOf('http:') != -1 ? item.bgImg.replace(/http:/, 'https:') : item.bgImg
  return `<view class="container">
			<image class="img" src="${item.bgImg}"></image>
			<view class="title-warp">
				<view><text class="title">${item.title}</text></view>
				<view><text class="rules">${item.rules}</text></view>
			</view>
			<view class="info-block">
				<view class="price-box">
					<view class="price"><text class="un">¥</text><text class="amt">${item.payPrice}</text></view>
					<view>${originPrice}</view>
				</view>
				<view class="ewm-block">
					<image src="${item.tempImg}" class="ewm"></image>
				 	<view><text class="ewm-text">扫一扫 领取优惠券</text></view>
				</view>
			</view>
		</view>
  `
}
const style = item => {
	return {
		container:{
			width: 300,
			height: 182 + 130 + 50 + 40,
			backgroundColor:'#fff',
		},
		img:{
			width: 300,
			height: 182,
		},
		titleWarp: {
			width: 270,
			height:90,
			marginLeft: 15,
			marginRight: 15,
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'flex-start',
		},
		title: {
			width: 270,
			height: 50,
			fontSize: 18,
			verticalAlign: 'bottom',
		},
		infoBlock:{
			width:270,
			height:130,
			paddingLeft:15,
			paddingRight:15,
			flexDirection:'row',
			justifyContent:'space-between',
			alignItems: 'center',
		},
		priceBox: {
			width: 180,
		},
		price: {
			width: 180,
			height:33,
			flexDirection: 'row',
			alignItems: 'flex-start',
			justifyContent: 'flex-start',
		},
		un: {
			height: 28,
			width: 11,
			fontSize: 12,
			verticalAlign: 'bottom',
			color: '#ff6655',
		},
		amt: {
			width: 170,
			height: 33,
			fontSize: 22,
			verticalAlign: 'bottom',
			color: '#ff6655',
		},
		origin: {
			height:16,
			width: 180,
			fontSize: 10,
			textAlign:'left',
			verticalAlign: 'bottom',
			color:'#999999'
		},
		ewmBlock:{
			width:90,
			height:130,
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
		},
		ewm: {
			width:90,
			height:90,
		},
		ewmText: {
			width: 120,
			height: 18,
			fontSize: 9,
			textAlign:'center',
			verticalAlign: 'middle',
			color: '#999'
		},
		rules:{
			width: 270,
			height:40,
			fontSize:10,
			marginTop:10,
			verticalAlign: 'top',
			color:'#999'
		}
	}
}
export const post = arg => {
  return {
    wxml: wxml(arg),
    style: style(arg),
		width: 300,
		height: 182 + 130 + 50 + 40,
  }
}