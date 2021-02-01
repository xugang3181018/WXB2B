import { memberCouponList } from '../../../../api/index.js'
const app = getApp()
Component({
	properties: {
	},
	lifetimes: {
		attached() {
			this.getList()
      this.setData({
        ...wx.getStorageSync('canModify')
      })
		}
	},
	options: {
		addGlobalClass: true,
	},
	data: {
		items:[],
		list:null,
		loading:false,
		hasMore:false,
		page: 1,
		list:null,
	},
	methods: {
		getList(toggle) {
      if (toggle){
        this.setData({
          page:0,
          items:[],
        })
			}
			wx.showLoading()
			this.list().then(res => {
				let items = res.items.length > 0 ? this.data.items.concat(res.items) :this.data.items
				this.setData({
					items,
				})
			})
			wx.hideLoading()
		},
		listMore(){
			if(this.data.hasMore){
				this.getList()
			}
		},
		list(){
			let params ={
				merchantCode: app.commonParams('merchantCode'),
				memberId: wx.getStorageSync('member').memberId,
        status:'1',
				pageNumber:1,
				pageSize:1000,
			}
			let role = wx.getStorageSync("login").role
			console.log(role,"门店类别")
			if(role != 0){
				params.suitMerchantId = app.commonParams('merchantId')
			}
			console.log(params,"卡卷请求参数")
			return memberCouponList(params) 
		},

		toggleTab({ detail }) {
			wx.showLoading()
			this.setData({
				items:[],
			})
			this.list().then(res=>{
				let types = null
				switch (detail) {
					case 0:
						// types = ()=>{}
						break
					case 1:
						types = item => item.couponStatus == 1 && item.cardTemplate.type == 2
						break
					case 2:
						types = item => item.couponStatus == 1 && item.cardTemplate.type == 5 || item.cardTemplate.type == 7 || item.cardTemplate.type == 8 || item.cardTemplate.type == -1
						break
					case 3:
						types = item => item.couponStatus == 1 && item.cardTemplate.type == 0 || item.cardTemplate.type == 9 || item.cardTemplate.type == 1 || item.cardTemplate.type == -2
						break
				}
				const items = detail == 0 ? res.items : res.items.filter(types)
				this.setData({
					// ...res,
					items,
          // hasMore: this.data.page < res.totalPage,
					// loading:false
				},()=>{
					wx.hideLoading()
				})
			})
		},

		refresh(e){
			console.log(e)
		}
	}
})
