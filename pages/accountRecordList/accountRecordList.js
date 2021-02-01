let app = getApp()
import { accountRecord } from '../../api/index.js'
Page({
    data: {
        accountStatus: app.types.accountStatus,
        loading:true
    },
    onLoad(options) {
        this.setData({
            account: wx.getStorageSync("account"),
            date:{
                startDate: app.base.startDate(7, 'yyyy-MM-dd'),
                endDate: app.base.startDate(0, 'yyyy-MM-dd'),
            }
        })
    },
    onShow() {
        this.accountRecord()
    },
	otherDate(event){
		console.log(event)
		this.setData({
			showCal:true
		})
	},
	changeCalendar(e){
		console.log(e)
		this.setData({
			showCal:false
		})
		if (e.detail.startDate){
			this.setData({
				date:e.detail
			})
			this.accountRecord(e.detail)
		}
	},
	closeCal(e){
		console.log(e)
		this.setData({
			showCal: false
		})
	},
    accountRecord(arg = {}) {
        let account = this.data.account
        let params = {
            transactionId: account.transactionId,
            bankType: account.bankType,
            ...this.data.date,
            ...arg
        }
        return accountRecord(params).then(res => {
            if (res.code == 'SUCCESS') {
                this.setData({
                    recordList: res.recordList,
                    loading: false
                })
            } else if (res.code == "FAILED") {
                app.tip(res.msg)
            }
        })
    },
})