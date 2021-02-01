import { getMemberTimesCardInfo } from '../../../../api/index.js'
Component({
	properties: {

	},

	data: {
		loading:true
	},
	lifetimes: {
		attached() {
			this.getList()
		}
	},
	options: {
		addGlobalClass: true,
	},
	methods: {
		getList(){
			return getMemberTimesCardInfo({
				memberId:wx.getStorageSync("member").memberId
			})
			.then(res=>{
				this.setData({
					...res,
					loading: false
				})
			})
		},
	}
})
