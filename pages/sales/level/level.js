const app = getApp()
import { salesmanRuleInfo  } from '../../../api/index.js'

Page({
	data: {

	},
	onLoad (options) {
		const merchantCode = app.commonParams('merchantCode')
		const salesInfo = wx.getStorageSync('salesInfo')
		salesmanRuleInfo({ merchantCode })
			.then(level => {
			this.setData({
				level,
				salesInfo
			})
		})
	},

	onShareAppMessage: function () {

	}
})