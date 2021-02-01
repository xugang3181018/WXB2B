import { billMember } from '../../../../api/index.js'
var util = require('../../../../utils/util.js');
const app = getApp()

Component({
	properties: {

	},
	options: {
		addGlobalClass: true,
	},
	data: {
		params:{
			refundType:0,
      orderType:0,
      shopOrderType:'MEMBERCONSUME',
      pageNumber:1,
      pageSize:20
		},
		id:0,
		loading:true,
		orderDetails:[]
	},
	lifetimes: {
		attached() {
			this.getList()
      this.setData({
        ...wx.getStorageSync('canModify')
      })
		}
	},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.getList()
      this.setData({
        ['params.pageNumber']:1,
        orderDetails: []
      })
    },
  },

	methods: {
    getList(refresh) {
			return billMember({
				memberId:wx.getStorageSync("member").memberId,
				orderStatus:"SUCCESS",
				...this.data.params,
			})
			.then(res => {
        console.log(res)
        let orderDetails = res.orderDetails.length > 0 ? this.data.orderDetails.concat(res.orderDetails) : this.data.orderDetails
        orderDetails.map(item=>{
          item.rechargeMoney = (item.memberAmount + item.memberGiveAmount).toFixed(2)
          item.payTime = util.strDateFormat(item.payTime)
        })
        this.setData({
          orderDetails,
          hasMore: orderDetails.length < res.totalCount,
          loading: false,
        })
				// this.setData({
				// 	...res,
				// 	loading: false,
				// })
			})
		},
		toggleTab({detail}){
			let { orderType, refundType, payType } = this.data.params
			if (detail == 2){
				refundType == 1
        this.setData({
          params: {
            refundType:1,
            pageNumber:1,
            shopOrderType:'MEMBERALL',
            // payType:'MPAY'
          },
          orderDetails:[]
        })
			} else if(detail == 1){
        this.setData({
          params: {
            orderType: detail,
            // payType: detail === '1' ? 'MPAY' : '',
            pageNumber: 1,
            shopOrderType:'MEMBERALL'
          },
          orderDetails: []
        })
			}else{
        this.setData({
          params: {
            orderType: detail,
            refundType: detail === '1' ? '' : 0,
            // payType: detail === '1' ? 'MPAY' : '',
            pageNumber: 1,
            shopOrderType:'MEMBERCONSUME',
          },
          orderDetails: []
        })
      }
			this.getList()
		},
    toDetail({ currentTarget }) {
      wx.navigateTo({
        url: currentTarget.dataset.url
      })
    },
    listMore(){
      if (!this.data.hasMore)return
      this.setData({
        ['params.pageNumber']: this.data.params.pageNumber+1
      })
      this.getList()
    },
	}
})
