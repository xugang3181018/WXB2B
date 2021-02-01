import ppevent from '../../../../utils/ppevent'
const app = getApp()

Page({
  data: {
    type: null, // 商户类型 目前只在汇付通道使用
    passType: '', // 银行通道
    category: '', // business ls
    category1Change: false, // 一级类别是否发生变化
    category1: null, // 一级类别名称
    category1Id: null, // 一级类别id
    category2Change: false, // 二级类别是否发生变化
    category2: null, // 二级类别名称
    category2Id: null, // 二级类别id
    category3: null, // 三级类别名称
    category3Id: null, // 三级类别id
  },

  onLoad(options) {
    this.setData(options)
  },

  // 获取一级类别
  getcategory1(e) {
    let {category1Change, passType} = this.data
    let info = {}
    if (category1Change) {
      this.setData({category1: null, category1Id: null, category2: null, category2Id: null, category3: null, category3Id: null, category2Change: false})
    } else {
      category1Change = true
    }
    if (passType === '9') {
      switch(Number(e.detail.businessCategory)) {
        case 1:
          info = {category2: '餐饮、宾馆、娱乐、珠宝金饰、工艺美术品类', category2Id: '101', category2Change: true}
          break
        case 2:
          info = {category2: '百货、中介、培训、景区门票等', category2Id: '202', category2Change: true}
          break
        default:
          info = {category2: null, category2Id: null, category2Change: false, }
      }
    }
    this.setData({
      category1: e.detail.businessCategoryName,
      category1Id: e.detail.businessCategory,
      category1Change,
      ...info
    })
  },

  // 获取二级类别
  getcategory2(e) {
    if (!this.data.category2Change) {
      this.setData({category2Change: true})
    } else {
      this.setData({category2: null, category2Id: null, category3: null, category3oId: null})
    }
    this.setData({
      category2: e.detail.businessCategoryName,
      category2Id: e.detail.businessCategory,
    })
  },

  // 获取三级类别
  getcategory3(e) {
    this.setData({
      category3: e.detail.businessCategoryName,
      category3Id: e.detail.businessCategory,
      aliId: e.detail.aliId
    })
  },

  getTip(e) {
    app.showToast(e.currentTarget.dataset.tip)
  },

  // 完成
  finish() {
    const {category1, category1Id, category2, category2Id, category3, category3Id, aliId, passType} = this.data
    let tip = ''
    if (!category1) {
      tip = '请选择一级类别'
    } else if (!category2) {
      tip = '请选择二级类别'
    } else if (!category3) {
      tip = '请选择三级类别'
    }
    if (tip) {
      app.showToast(tip)
      return
    }
    let businessCategory = category3Id
    const businessCategoryName = `${category1},${category2},${category3}`
    if (passType === '11') {
      businessCategory = `${category1Id},${category2Id},${category3Id},${aliId}`
    }
    ppevent.emit('getCategory', {businessCategory, businessCategoryName})
    wx.navigateBack({delta: 1})
  }
})
