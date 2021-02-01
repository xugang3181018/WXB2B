const qrcode = require('../../../libs/qrcode/code.js')
const app = getApp()
import {
	uploadImage
} from '../../../api/index.js'
import {
	post
} from './post.js'
// pages/sales/serviceCode/serviceCode.js
Page({
	data: {
		postList: [
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/1d66f1cc-c387-4529-b8c0-e0a5dabcf5ed.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/be524631-7f34-4a09-8378-5b49778784c0.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/abe59636-3659-45f2-9e24-cbc3d121ef7a.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/7a9a943d-3a95-496e-b14c-bff6485bc1ee.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/39f0d687-a272-42e9-9474-a143f4ef5e56.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/fee5378a-27e1-423b-b393-66430f0e2b24.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/ccb175d5-6135-4eed-a916-cf6b96fb0107.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/2089dbdb-50d9-4f20-91e8-3493f8082360.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/0a60e7c1-b03b-4bf2-864f-858c7df4a68b.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/5f1e7a76-137b-4f20-ad4c-8e4fc3fb0d0f.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/4a286937-88b3-41cd-be25-cb50f48887d0.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/9ba70a99-9fa5-447a-aa68-d376d5efbbec.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/51ab820d-074e-4223-9abb-63fec1956717.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/0fd3df70-9b8f-401b-9279-91c161ac5e9b.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/0cf7d905-23ed-480d-a5ca-a967cf1c045a.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/e8dcc95b-3c9b-446c-9c83-e1fc7fb736ad.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/d7e4b8da-5ed2-4e32-8c10-620ab4a9e43d.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/6befbb73-1669-4e1c-ba5c-6436a387ee9b.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/1ed1ea8b-833d-4377-8182-fc5f03aab49d.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/5ee2f5e4-3f72-4e0c-8bc9-a811079c90ed.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/bcc7e0d1-5d7a-47f9-8eea-dbc80d4ea8c4.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/943fc1ca-f111-4a69-995e-85ff2627ed4b.png",
			"https://oss.liantuofu.com/club-shop/clubShopImage/EW_N4964677636/2020-07-18/44f79b18-e848-4732-895b-6d2058f4d58b.png"
		],
		postImg: "",
	},

	onLoad(options) {
		const info = wx.getStorageSync("salesInfo")
		this.setData({
			info
		})
		// this.getUserInfo();
		this.getWidthHeight();
	},

	getWidthHeight() {
		const {
			screenWidth
		} = wx.getSystemInfoSync();
		let screenHeight = 2016 * screenWidth / 1280;
		let bannerWidth = screenWidth - 20
		screenHeight = parseInt(screenHeight);
		this.setData({
			screenHeight,
			screenWidth,
			bannerWidth
		})
	},

	onReady() {
		if (wx.qy) {
			wx.qy.getQrCode({
				success: (res) => {
					var qrCode = res.qrCode
					this.setData({
						qrCode
					})
					console.log('qrCode::', qrCode)
					wx.nextTick(() => {
						qrcode.createQrCode(qrCode, "cardId", 150, 150)
					})
				}
			})
		}

	},

	uploadImage(e) {
		uploadImage().then(res => {
			console.log(res)
		})
	},

	onShareAppMessage: function () {

	},

	toPost({
		currentTarget
	}) {
		let {
			index
		} = currentTarget.dataset;
		let {
			postImg,
			postList
		} = this.data;
		postImg = postList[index];
		this.setData({
			postImg
		})
	},

	closePanel() {
		this.setData({
			postImg: ''
		})
	},

	setPost() {
		console.log("123123123")
		this.setData({
			post: post({
				...this.data,
			})
		})

		wx.nextTick(() => {
			this.closePanel()
			this.selectComponent('#sharePost').togglePost()
		})
	},

	// 获取二维码
	getUserInfo() {
		let {
			info
		} = this.data;
		if (!info.headImgUrl) {

			wx.getUserInfo({
				success: res => {
					info.headImgUrl = res.userInfo.avatarUrl
					console.log(res);
					this.setData({
						info
					})
				},
				fail: err => {
					console.log(err, '--------------')
				}
			})

			// wx.getUserInfo({
			// 	success: function (res) {
			// 		info.headImgUrl = res.userInfo.avatarUrl
			// 		that.setData({
			// 			info
			// 		})
			// 		console.log("2332")
			// 	}
			// })
		}
		console.log(!info.headImgUrl)

	}
})