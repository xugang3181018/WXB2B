const	app = getApp()
const	qrcode = require('../../libs/qrcode/qrcode.js')
import { timesCardDetail, timesCardList } from '../../api/index.js'

Page({
	data: {
		loading: true,
		status: false,
		hasmore:false,
	},
	onLoad(options) {

	},
	onShow() {
		this.cardList()
	},
	shareCard(e = {}) {
		console.log(e)
		let index = e.code || e.currentTarget.dataset.index,
			selItem = this.data.card.items[index]
		if (selItem.logo.indexOf('http://') != -1) {
			selItem.logo = selItem.logo.replace(/http:/, 'https:')
		}
		this.setData({
			status: true,
			selItem,
			index,
			disable:true
		})
		qrcode.qrApi.drawCard(selItem, `getCode`, 600, 800);
	},
	closePanel() {
		this.setData({
			selItem: null,
			status: false,
			disable:false
		})
	},
	cardDetail(cardNo) {
		timesCardDetail({
			cardNo
		}).then(res => {
			console.log(res)
		})
	},
	saveFile(e) {
		wx.canvasToTempFilePath({
			x: 0,
			y: 0,
			width: 600,
			height: 700,
			destWidth: 600,
			destHeight: 700,
			canvasId: `getCode`,
			success: (res) => {
				console.log(res)
				wx.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success: (img) => {
						app.tip('已保存到相册')
					}
				})
			}
		})
	},
	cardList() {
		timesCardList({}).then(card => {
			console.log(card)
			this.setData({
				card,
				loading: false,
			})
		})
	},
	tolowerEvent(e){

	}
})