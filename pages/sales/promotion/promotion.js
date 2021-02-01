import {
  couponMall,
  goodsMallApi
} from '../../../api/index.js'
const app = getApp()
Page({

  data: {
    current: null,
    loading: true,
    tab: ['商品', '卡券', '销量', '佣金', '价格'],
    titleTab: ['优惠券', '商品分销'],
    changeTitleList: [0],
    currentPage: 1,
    listGoods: [],
    ending: false
  },

  onLoad(options) {
    let salesmanId = options.id || wx.getStorageSync('salesmanId');
    let login = wx.getStorageSync('login')
    this.setData({
      salesmanId,
      login
    })
    this.couponList(options.id || wx.getStorageSync('salesmanId'))
    this.getGoods();
  },

  couponList(salesmanId) {
    // 优惠券列表
    const params = {
      salesmanId,
    }
    return couponMall(params).then(coupon => {
      this.setData({
        ...coupon,
        loading: false
      })
    })
  },

  listSort({
    currentTarget
  }) {
    // receiveCnt
    // commission
    // payPrice
    const sorts = ['receiveCnt', 'commission', 'payPrice']
    const goodsSort = ['goodsSalesVolume','commission','goodsMinPrice']
    let {
      list,
      changeTitleList,
      listGoods
    } = this.data
    const {
      index
    } = currentTarget.dataset
    if (index == 0) {
      changeTitleList = [0]
    } else if (index == 1) {
      changeTitleList = [1]
    } else {
      if (changeTitleList.indexOf(0) != -1) {
        changeTitleList = [0, index]
      } else {
        changeTitleList = [1, index]
      }
    }
    this.setData({
      changeTitleList
    })
    if(changeTitleList.length >= 2 && changeTitleList.indexOf(1) != -1) {
      list.sort((a, b) => b[sorts[index-2]] - a[sorts[index-2]])
      this.setData({
        list
      })
    } else if(changeTitleList.length >= 2 && changeTitleList.indexOf(0) != -1) {
      // listGoods.sort((a, b) => b[goodsSort[index-2]] - a[goodsSort[index-2]])
      listGoods.sort((a, b) => {
        return b[goodsSort[index-2]] - a[goodsSort[index-2]]
      })
      this.setData({
        listGoods
      })
    }
  },

  // 切换状态
  changeStatus({
    currentTarget
  }) {
    let {
      index
    } = currentTarget.dataset;
    let {
      tab,
      tab1,
      tab2
    } = this.data;
    tab = index == 1 ? tab2 : tab1;
    this.setData({
      changeTitle: index,
      tab
    })
    if (index == 1) {
      this.getGoods();
    }
  },

  async getGoods() {
    let {
      salesmanId,
      currentPage,
      login,
      listGoods
    } = this.data;
    const params = {
      salesmanId,
      pageSize: 10,
      currentPage,
      merchantCode: login.merchantCode
    }
    let res = await goodsMallApi(params)
    if (res.code == 'SUCCESS') {
      if (currentPage == 1) {
        listGoods = res.goodsList
      } else {
        listGoods = [...listGoods, ...res.goodsList];
      }
      if(!res.goodsList || res.goodsList.length <= 0) {
        this.setData({
          ending: true
        })
      }
      this.setData({
        listGoods,
        currentPage: currentPage + 1,
        loading: false
      })
    }
  },

  getPagePanel() {
    this.selectComponent('#promotions').togglePanel()
  },

  toProGoodsDetail({currentTarget}) {
    let {goodsId,commission} = currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/sales/promotionGoodsDetail/promotionGoodsDetail?goodsId=${goodsId}&commission=${commission}`,
    })
  },

  onReachBottom() {
    if(!this.data.ending) {
      this.getGoods();
    }
    
  },

})