import { profitSharingOrderList, salesmanStatistics } from  '../../../api/index.js'
Page({
  data: {
    loading:true,
    tabCurrent:0,
    list:[],
    hasMore:true,
    isToggle:true,
    date:[],
		dateValue:null,
		searchDate:null
  },

  onLoad (options) {
    this.setData({
        ...options
    })
		if(options.current){
		
		}else{
			this.orderList()
		}
  },
	onShow(){
		if(this.data.searchDate){
			this.orderList({ ...this.data.searchDate})
		}
		if(this.data.current){
			this.selectComponent('#dateTab').clickTab({
				currentTarget: {
					dataset: {
						index: this.data.current
					}
				}
			})
		}
	},
  orderList(params= {}){
    const salesmanId = wx.getStorageSync('salesmanId')
    const { list, hasMore, isToggle} = this.data
    return Promise.all([salesmanStatistics({ salesmanId, ...params }), profitSharingOrderList({ status: 1, salesmanId, ...params })])
    .then(res =>{
      if(res[0].code == 'SUCCESS' && res[1].code == "SUCCESS"){
        const result = res[1].result
        this.setData({
          loading: false,
          isToggle: false,
          isToggle: true,
          detail:res[0],
          list: isToggle ? result : list.concat(result)
        })
      }
    })
  },
  toDetail({ currentTarget }) {
    wx.navigateTo({
      url: currentTarget.dataset.url
    })
  },
  tabClick({detail}){
    this.setData({
      date:detail,
			dateValue:'',
			searchDate:{}
    })
    this.orderList(detail)
  }
})