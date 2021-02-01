const app = getApp()
import { salesmanRuleInfo, findIsSalesman, salesmanStatistics, salesmanInfo } from '../../../api/index.js'
const operatorId = app.commonParams('operatorId')
Page({
  data: {
    loading: true,
    app: {
			scan: ['服务码', '/pages/sales/serviceCode/serviceCode'],
			scoupon: ['会员卡', '/pages/sales/vipCard/vipCard'],
      users: ['客户中心', `/pages/sales/consumer/consumer?id=${operatorId}&current=3`],
			money: ['分销', '/pages/sales/promotion/promotion']
    }
  },

  onLoad(options) {
    this.init()
  },

	toOrder({ currentTarget }){
		wx.navigateTo({
			url: `/pages/sales/order/order?current=${currentTarget.dataset.id}`,
		})
	},

  toConsumer({ currentTarget }){
    wx.navigateTo({
      url: `/pages/sales/consumer/consumer?current=${currentTarget.dataset.id}&id=${operatorId}`,
    })
  },

  init() {
		const {
			merchantCode,
			operatorId: employeeId
		} = app.commonParams(['merchantCode', 'operatorId'])
    let endTime = new Date().Format('yyyy-MM-dd hh:mm:ss')
    let startTime = new Date().Format('yyyy-MM-dd') + ' 00:00:00'
    return findIsSalesman({
        merchantCode,
        employeeId,
				type:1,
      })
      .then(res => {
        if (res.flag) {
          const { salesmanId } = res
          wx.setStorageSync("salesmanId", salesmanId)
          Promise.all([salesmanRuleInfo({
              merchantCode
            }), salesmanInfo({
              merchantCode,
              salesmanId
            }), salesmanStatistics({
              salesmanId,
              startTime,
              endTime
            }), salesmanStatistics({
              salesmanId
            })])
            .then(data => {
              wx.setStorageSync('salesInfo', data[1])
              this.setData({
                rule: data[0],
                info: data[1],
                taday: data[2],
                all: data[3],
                loading: false,
                salesmanId
              })
            })
        }else{
					this.setData({
            error:true,
            loading: false,
						msg:'您还不是分销员'
					})
				}
      })
  },

  toLevel(e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/sales/level/level?id=${this.data.salesmanId}`
    })
  },

	goPage({currentTarget}){
		console.log(currentTarget)
		wx.navigateTo({
			url:currentTarget.dataset.page
		})
	},
  onShareAppMessage() {

  }
})