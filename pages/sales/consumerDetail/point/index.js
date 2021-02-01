import { getList } from '../../../../api/index.js'
Component({
	properties: {

	},
	lifetimes: {
		attached() {
      console.log("生命周期")
      this.setData({
        ...wx.getStorageSync('canModify')
      })
      this.getList()
		}
	},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      console.log("页面生命周期")
      this.setData({
        page: 0,
        points: [],
      })
      this.getList()
    },
  },
	
  options: {
		addGlobalClass: true,
	},
	
  data: {
		type: ["充值送", "消费送","", "开卡赠送", "关注", "充值退款", "消费退款", "人工修改", "积分兑换", "退卡", "会员群发", "推荐有礼", "直接赠送","","", "营销礼包", "生日关怀", "升级有礼", "积分过期", "定时营销", "签到奖励","抽奖兑换"],
    loading:true,
    page:1,
    points:[],
	},
	
  methods: {
		getList(){
			getList({
				memberId: wx.getStorageSync("member").memberId,
        pageNumber:this.data.page++
			})
			.then(res=>{
        console.log(res)
        let points = res.points.length > 0 ? this.data.points.concat(res.points) : this.data.points
				this.setData({
          points,
          hasMore: res.totalCount > this.data.points.length,
          loading:false
				})
			})
		},
    listMore(){
      if(this.data.hasMore){
        this.getList()
      }
    },
    pointModify({ currentTarget }) {
      const { id, type } = currentTarget.dataset
      wx.navigateTo({
        url: `/pages/sales/pointModify/pointModify?id=${id}&type=${type}`,
      })
    }
	}
})
