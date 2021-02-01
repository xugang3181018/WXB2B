const app = getApp()
import {
	ksAccountList,
	payPlatFormInforKs,
	groupList,
	trade,
	newMemberCount
} from '../../api/index.js'
Page({
	data: {
		loading: true,
		hideBank: true,
		totalTradeAmt: 0,
		totalTradeCnt: 0,
		count:0,
	},
	onLoad() {
		try {
			const role = wx.getStorageSync("loginData").identity
			const headOfficeStaff = wx.getStorageSync("login").headOfficeStaff
			const operatorId = wx.getStorageSync("login").operatorId
			this.setData({
				ksRole: role,
				headOfficeStaff: wx.getStorageSync("login").headOfficeStaff,
				role: wx.getStorageSync("login").role,
				merchantName:wx.getStorageSync("login").merchantName,
				isPX:app.isPX,
				sysVersion:wx.getStorageSync("login").sysVersion
			})
			if (role == 1) {
				this.checkBag()
				this.ksAccountList()
			} else {
				this.setData({
					loading: false
				})
			}
			if (role == 0) {
				this.trade()
				this.newMemberCount()
			} else if (headOfficeStaff == 2) {
				this.groupList({
					employeeId: operatorId
				})
			} else {
				this.trade(wx.getStorageSync("login").merchantCode)
				this.newMemberCount(wx.getStorageSync("login").merchantCode)
			}
		} catch (error) {
			wx.clearStorage()
			wx.redirectTo({
				url: '/pages/login/login',
			})
		}
	},

	
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
		})
		this.onLoad()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000);
  },

 //暂无开通功能提示
 onClickEvent(){
	 wx.showToast({
		 title: '敬请期待',
		 icon:"none"
	 })
 },

	//请求参数
	getParameter(code){
		let {role} = this.data
		let params = {
			beginDate: app.base.startDate(0, 'yyyyMMdd'),
			endDate: app.base.startDate(0, 'yyyyMMdd'),
		}
		if (code && role !=0) {
			params.groupMerchantCodes = code
		}
		return params
	},

	//获取交易汇总
	trade(code) {
		let {headOfficeStaff, role} = this.data
		let params = this.getParameter(code)
		console.log(headOfficeStaff,'1',role)
		if(headOfficeStaff != 2 && role == 2){
			params.operatorId = wx.getStorageSync("login").operatorId
		}
		trade(params).then(res => {
			console.log(res)
			if (res.code == "SUCCESS") {
				let data = res.statistics
				this.setData({
					totalTradeAmt: data.totalTradeAmt,
					totalTradeCnt: data.totalTradeCnt
				})
			}
		})
	},

	//获取分组
	groupList(params) {
		groupList(params).then(res => {
			console.log(res)
			if (res.code == "SUCCESS") {
				this.trade(res.merchantGroupList[0].merchantCodes)
				this.newMemberCount(res.merchantGroupList[0].merchantCodes)
			}
		})
	},

	// 新增会员数
	newMemberCount(code) {
		let params = this.getParameter(code)
		newMemberCount(params).then(res => {
			console.log(res)
			this.setData({
				count:res.count
			})
		})
	},

	// 跳转小程序
	onSkip(){
		wx.navigateToMiniProgram({
			appId: 'wxab4bb63991e7a5b5',
			path: 'pages/index/index',
			extraData: {
				...wx.getStorageSync('login')
			},
			envVersion: 'develop',
			success(res) {
				console.log(res)
				// 打开成功
			}
		})
	},
	ksAccountList() {
		ksAccountList({
			merchantCode: app.commonParams('merchantCode')
		}).then(res => {
			// console.log(res)
			let list = res.accountList
			if (list.length > 0) {
				list = list.map(item => {
					item.acc = this.cutNum(item.balanceAccount)
					return item
				})
				this.initBag(list, 0)
			} else {
				this.setData({
					loading: false
				})
			}
		})
	},
	cutNum(str) {
		return str.substring(str.length - 4)
	},
	changeAccount(e) {
		this.initBag(this.data.bag, e.detail.value)
	},
	showBanks(e) {
		this.setData({
			hideBank: !this.data.hideBank,
		})
	},
	initBag(accountList, index) {
		this.setData({
			bag: accountList,
			selBag: accountList[index],
			currentBag: index,
			selNum: this.cutNum(accountList[index].balanceAccount),
			loading: false,
			hideBank: true
		})
	},
	toggleBag(e) {
		this.initBag(this.data.bag, e.target.dataset.index)
	},
	extract() {
		wx.setStorageSync("selBag", this.data.selBag)
		wx.navigateTo({
			url: `/pages/account/account?id=${this.data.selBag.transactionId}`,
		})
	},
	checkTimesCard(e) {
		wx.scanCode({
			success: (res) => {
				console.log(res)
				wx.navigateTo({
					url: `/pages/timesCardDetail/timesCardDetail?cardNo=${res.result}`,
				})
			}
		})
	},
	checkBag() {
		let parmas = {
			codeName: app.commonParams("merchantCode"),
			merchantNo: app.commonParams("appId"),
		}
		payPlatFormInforKs(parmas)
			.then(res => {
				// console.log(res)
				if (res.code == "001701") {
					wx.setStorageSync("bag", res.obj)
					let bagList = wx.getStorageSync("bag")
					for (let i in bagList) {
						bagList[i].endNum = bagList[i].balanceAccount.substr(bagList[i].balanceAccount.length - 4)
					}
					wx.setStorageSync("bag", bagList[0])
					// this.setData({
					//     bag: bagList,
					//     selBag: bagList[0],
					// })
					//this.getKsUrl()
				}
			})
	},
onShow(){
	wx.removeStorageSync('name')
	wx.removeStorageSync('screen')
}
})