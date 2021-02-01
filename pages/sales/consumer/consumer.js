// pages/sales/consumer/consumer.js
import {
  salesmanCustomerList,
  memberList,
  getUser
} from '../../../api/index.js'
const app = getApp()
Page({
  data: {
    loading: true,
    status: ['删除', '启用', '禁用'],
    sex: ['未知', '男', '女'],
    items: [],
    params: {},
    current: 0,
    listLoading: false,
    hasMore: true,
    searchDate: null,
    type: 0,
    page: 1,
  },
  
  onLoad(options) {
    console.log(wx.getStorageSync("login"), options)
    let loginInfo = wx.getStorageSync("login")
    if (loginInfo.role !== 0){
      this.setData({
        ['params.merchantId']: loginInfo.merchantId,
        ['params.merchantCode']: loginInfo.merchantCode,
      })
    }
    if(options.id){
      this.setData({
        ['params.employeeId']: options.id,
        ...options,
        qy:wx.qy ? true :false
      })
    }
    wx.nextTick(()=>{
      if(options.current == 0){
        this.selectComponent('#dataTab').clickTab({
          currentTarget:{
            dataset:{
              index:0
            }
          }
        })
      }else{
        this.memberList(options)
      }
    })
  },

  onShow() {
    this.dateFilter()
  },

  dateFilter(date) {
    if (date || this.data.searchDate) {
      this.setData({
        page: 1,
        items: [],
        pageLoading: true,
        params: {
          ...this.data.params,
          ...this.data.searchDate
        }
      })
      this.memberList({
        ...this.data.searchDate,
      })
    }
  },

  userList() {
    const params = {
      merchatCode: app.commonParams('merchantCode')
    }
    console.log(params)
    return getUser(params)
      .then(res => {
        console.log(res)
      })
  },

  memberList(arg = {}) {
    return memberList({
        pageNumber: this.data.page++,
        ...this.data.params,
        ...arg,
      })
      .then(res => {
        const items = res.items.length > 0 ? this.data.items.concat(res.items) : this.data.items
        this.setData({
          items,
          hasMore: res.totalPage > res.pageNumber,
          loading: false,
          listLoading: false,
        })
        return res
      })
  },

  searchMember({ detail }) {
    this.setData({
      page: 1,
      items: [],
      listLoading: true,
      params: {
        mobile: detail
      }
    })
    this.memberList({
      mobile: detail
    })
  },

  toggleMember({ target }) {
    console.log(target)
    this.setData({
      type: target.dataset.type
    })
  },

  toDate() {
    wx.navigateTo({
      url: '/pages/reportDate/reportDate',
    })
  },

  clearSearch(e) {
    this.setData({
      params: {},
      page: 1
    })

    this.memberList()
  },

  salesmanCustomerList() {
    let salesmanId = wx.getStorageSync('salesmanId')
    return salesmanCustomerList({
        salesmanId
      })
      .then(res => {
        console.log(res)
        this.setData({
          list: res.list,
          loading:false
        })
      })
  },

  detail({ currentTarget }) {
    const { id,index } = currentTarget.dataset
    wx.setStorageSync('consumerInfo', this.data.items[index])
    wx.navigateTo({
      url: this.data.id ? `/pages/sales/consumerInfo/consumerInfo?id=${id}` : `/pages/sales/consumerDetail/consumerDetail?id=${id}`
    })
  },

  chooseContact(e) {
    wx.qy.selectExternalContact({
      success: (res) => {
        console.log('企业联系人信息:========>', res.userIds)
        if(res.userIds.length >1){
          wx.qy.openEnterpriseChat({
            externalUserIds: res.userIds.join(';')
          })
        }else{
          wx.qy.openEnterpriseChat({
            externalUserIds:res.userIds[0]
          })
        }
      }
    })
  },

  listMore() {
    if (this.data.hasMore) {
      this.memberList()
    }
  },

  dateChange({ detail }) {
    if(detail.startTime){
      const {startTime:startDate,endTime:endDate} = detail
      this.setData({
        params: {
          ...this.data.params,
          startDate,
          endDate
        }
      })
    }else{
      let params = this.data.params
      delete params.startDate
      delete params.endDate
      this.setData({
        params
      })
    }
    wx.nextTick(() => {
      this.dateFilter(true)
    })
  }
})