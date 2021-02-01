const app = getApp()
const	qrcode = require('../../../libs/qrcode/code.js')
import { memberCardTemplate } from '../../../api/index.js'

Page({

	data: {
		loading:true
	},
	onLoad(options) {
		this.memberCardTemplate()
	},
	onReady() {
		this.qrcode()
	},
	qrcode() {
		let code = `http://club.liantuobank.com/m/${app.commonParams('merchantId')}/memberCard.htm?employeeId=${app.commonParams('employeeId')}`
		qrcode.createQrCode(code, "cardId", 150, 150);
	},
	memberCardTemplate() {
		memberCardTemplate({}).then(res => {
			console.log(res);
			this.setData({
				...res,
				loading: false
			})
		})
	},

})