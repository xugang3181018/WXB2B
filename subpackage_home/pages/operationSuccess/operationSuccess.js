const app = getApp()

Page({
  data: {
    pattern: '', // 分类 chain single store business
    successInfo: {}, // 创建成功后返回的数据
    entryInfo: {}, // 进件成功后获取的数据
    bsInfo: {}, // 创建门店或商户的数据
    slogan: '', // 标语的内容
    buttonList: [], // 按钮列表
    linkState: false, // 跳转的状态，有addStore entry两种，当为他们时，不重定向回首页
    salesmanName: '', // 创建门店业务员姓名
    salesmanNo: '', // 创建门店的业务员编号
    storeNo: '', // 门店编号
    storeName: '', //  门店全称
    merchantFullName: '', // 商户全称
    merchantCode: '', // 商户编号
    merchantName: '', // 商户简称
    type: '', // entry 进件 change 变更
    canExpediting: false, // 是否能够催审
    succespic: app.getImage('succespic.png'),
    succesMerchant: app.getImage('succesMerchant.png')
  },

  onLoad(options) {
    const successInfo = wx.getStorageSync('successInfo')
    const expeditingCount = successInfo.incomingExpeditingCount > 0 ? successInfo.incomingExpeditingCount : 0
    const entryInfo = wx.getStorageSync('entryInfo')
    const bsInfo = wx.getStorageSync('bsInfo')
    const typeName = options.pattern === 'store' ? '门店' : '商户'
    let canExpediting = false
    let data = {}
    if (options.type === 'entry') {
      data = {slogan: `${typeName}进件成功`, buttonList: [`催审（${expeditingCount}/2）`, '添加门店', `${typeName}进件`]}
      canExpediting = expeditingCount > 0 ? true : false
    } else if (options.type === 'change') {
      data = {slogan: `${typeName}进件变更成功`, buttonList: ['返回首页']}
    } else {
      if (options.pattern === 'single' || options.pattern === 'chain') {
        data = {slogan: '商户添加成功', buttonList: ['添加门店', '商户进件']}
        data.clipContent = options.pattern === 'single' ? `商户登录名: ${successInfo.merchantLoginName}/门店登录名: ${successInfo.storeLoginName}/商户及门店登录密码: ${successInfo.loginPassword}` : `商户登录名: ${successInfo.merchantLoginName}/商户登录密码: ${successInfo.loginPassword}`
        bsInfo.merchantCode = successInfo.merchantCode
      } else if (options.pattern === 'store') {
        data = {slogan: '门店添加成功', buttonList: ['继续添加门店', '门店进件']}
        data.clipContent = `门店登录名: ${successInfo.loginName}/门店登录密码: ${successInfo.loginPassword}`
        bsInfo.storeNo = successInfo.storeCode
      }
      wx.setStorageSync('bsInfo', bsInfo)
    }
    this.setData({successInfo, expeditingCount, canExpediting, entryInfo, bsInfo, typeName, ...options, ...data})
  },

  onUnload() {
    wx.removeStorageSync('successInfo')
    if (!this.data.linkState) wx.reLaunch({url: '/pages/homePage/homePage'})
  },

  // 点击第一个按钮
  tapButton(e) {
    const index = e.currentTarget.dataset.index
    const {type} = this.data
    if (type === 'entry') {
      switch(index) {
        case 0:
          this.expediting()
          break
        case 1:
          this.addStore()
          break
        case 2:
          this.toEntry()
          break
        default: null
      }
    } else if (type === 'change') {
      wx.reLaunch({url: '/pages/homePage/homePage'})
    } else {
      switch(index) {
        case 0:
          this.addStore()
          break
        case 1:
          this.toEntry()
          break
        default: null
      }
    }
  },

  // 复制到剪切板
  clipBoard() {
    const clipContent = this.data.clipContent
    wx.setClipboardData({
      data: clipContent,
      success() {app.showToast('已复制登录信息')},
    })
  },

  // 添加门店
  addStore() {
    const {type, entryInfo} = this.data
    this.setData({linkState: true})
    wx.setStorageSync('return', "true")
    if (type === 'entry') wx.setStorageSync('bsInfo', {...entryInfo, pattern: 'store'})
    const url = '../BSOperation/BSOperation?pattern=store&operation=create'
    wx.redirectTo({url})
  },

  // 进件
  toEntry() {
    const {type, bsInfo, pattern} = this.data
    this.setData({linkState: true})
    if (type !== 'entry') {// 当创建完商户或门店想进件，使用添加商户或门店的数据，如商户全称/简称/编号，门店全称/编号
      const entryInfo = bsInfo
      entryInfo.pattern = pattern !== 'store' ? 'business' : 'store'
      wx.setStorageSync('entryInfo', entryInfo)
    }
    const newPattern = pattern === 'store' ? 'store' : 'business'
    wx.setStorageSync('return', "true")
    wx.redirectTo({url: `../entryChannel/entryChannel?pattern=${newPattern}`})
  },

  // 催审
  expediting() {
    const {expeditingCount, buttonList, canExpediting, successInfo} = this.data
    if (!canExpediting) return
    app.api('agent_app_incoming_expediting_a', {configureCommonAuditId: successInfo.configureCommonAuditId}).then(res => {
      if (res && !res.apiError) {
        app.showToast('催审成功')
        buttonList[0] = `催审（${expeditingCount - 1}/2）`
        this.setData({expeditingCount: (expeditingCount - 1), buttonList, canExpediting: false})
      }
    })
  }
})
