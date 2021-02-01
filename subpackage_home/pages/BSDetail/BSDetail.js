const app = getApp()

Page({
  data: {
    pattern: '', // business或store
    merchantCode: '', // 商户编号
    storeCode: '', // 门店编号
    BSInfo: {}, // 商户或门店信息
    wechatConfigures: [], // 微信配置列表
    wechat: 0, // 微信当前配置项的索引
    alipayConfigures: [], // 支付宝配置列表
    alipay: 0, // 支付宝当前配置的索引
    activationCode: null, // 激活码
    advancedStatusList: ['联拓富高级版', '联拓富一卡通版', '餐饮营销版'], // 高级状态列表
    alipayImg: app.getImage('alipay.png'),
    weixin: app.getImage('weixin.png'),
    hf: app.getImage('hf.png'),
    meizhou: app.getImage('meizhou.png'),
    wspay: app.getImage('wspay.png'),
    ls: app.getImage('ls.png'),
  },

  onLoad(options) {
    const url = options.pattern === 'business' ? 'agent_app_merchant_details' : 'agent_app_store_details'
    this.setData({url, ...options})
  },

  onReady() {
    wx.setNavigationBarTitle({title: this.data.pattern === 'business' ? '商户详情' : '门店详情'})
    wx.setNavigationBarColor({frontColor: '#ffffff',  backgroundColor: '#5177BE'})
  },

  onShow() {
    this.getItemDetail()
  },

  // 获取详情
  getItemDetail() {
    const {advancedStatusList, url, storeCode, merchantCode, pattern} = this.data
    let params = {}
    if (pattern === 'business') {
      params.merchantCode = merchantCode
      params.agentNo = app.common('agentNo')
    } else {
      params.storeCode = storeCode
    }
    app.api(url, params).then(res => {
      if (res && !res.apiError) {
        let alipayConfigures = [], wechatConfigures = [], alipay = null, wechat = null
        if (pattern === 'store') {
          res.alipayConfigures.forEach(($0, $1) => {
            alipayConfigures.push($0.configureName)
            if (res.alipayTransitionId && res.alipayTransitionId === $0.transitionId) alipay = $1
            if (alipay === null) alipay = res.alipayConfigures.length
          })
          res.wechatConfigures.forEach(($0, $1) => {
            wechatConfigures.push($0.configureName)
            if (res.wechatConfigures && res.wechatTransitionId === $0.transitionId) wechat = $1
            if (wechat === null) wechat = res.wechatConfigures.length
          })
          alipayConfigures.push('无')
          wechatConfigures.push('无')
        }
        // 激活码规则：商户中心存储支付营销版，专业营销版和连锁营销版，第一个对应两个基础版，第二个对应联拓富高级版和餐饮营销版，最后一哥对应联拓富一卡通版
        res.codeList = res.sysVersionResponse.codeList
        if (advancedStatusList.includes(res.productName)) {
          res.codeList.forEach(item => {
            if (['联拓富高级版', '餐饮营销版'].includes(res.productName) && item.merchantVer === '专业营销版') res.activationCode = item.activationCode
            if (res.productName === '联拓富一卡通版' && item.merchantVer === '连锁营销版') res.activationCode = item.activationCode
            res.merchantEndTime = item.merchantEndTime
          })
        }
        this.setData({BSInfo: res, alipayConfigures, wechatConfigures, alipay, wechat})
      }
    })
  },

  // 改变配置
  changeRate(e) {
    const type = e.currentTarget.dataset.type
    const index = Number(e.detail.value)
    const BSInfo = this.data.BSInfo
    let number = 0, status = {}
    if (type === 'alipay') {
      this.data.BSInfo.alipayConfigures[index] ? number = BSInfo.alipayConfigures[index].transitionId : null
      status = {alipay: index}
      this.changeConfigure(number, this.data.BSInfo.wechatTransitionId, status)
    } else {
      BSInfo.wechatConfigures[index] ? number = BSInfo.wechatConfigures[index].transitionId : null
      status = {wechat: index}
      // if (number > 0) {
      //   this.wechatAuthentication(BSInfo.alipayTransitionId, number, status)
      // } else {
      //   this.changeConfigure(BSInfo.alipayTransitionId, number, status)
      // }
      this.changeConfigure(BSInfo.alipayTransitionId, number, status)
    }
  },

  // 改变支付配置
  changeConfigure(alipayTransitionId, wechatTransitionId, status) {
    const BSInfo = this.data.BSInfo
    const params = {
      agentNo: app.common('agentNo'),
      agreement_no: app.common('merchantInnerPartnerId'),
      merchantCode: this.data.merchantCode,
      storeCode: this.data.storeCode,
    }
    alipayTransitionId ? params.alipayTransactionNo = alipayTransitionId : null
    wechatTransitionId ? params.wechatTransitionNo = wechatTransitionId : null
    app.api('agent_app_store_pay_info', params).then((res) => {
      if (res && !res.apiError) {
        app.showToast('修改成功')
        if (status.hasOwnProperty('alipay')) BSInfo.alipayTransitionId = alipayTransitionId
        if (status.hasOwnProperty('wechat')) BSInfo.wechatTransitionId = wechatTransitionId
        this.setData(status)
      }
    })
  },

  // 微信认证
  wechatAuthentication(alipayTransitionId, transitionId, status) {
    app.api('agent_app_certification_list_query', {transitionId}).then(res => {
      if (res && !res.apiError) {
        if (res.wechatAuthorizeStatus) {
          this.changeConfigure(alipayTransitionId, transitionId, status)
        } else {
          const {merchantCode, storeCode} = this.data
          wx.navigateTo({url: `../authentication/authentication?codeImg=${res.wechantAuthorizeQRCodeForChannelNo}&alipayTransitionId=${alipayTransitionId}&transitionId=${transitionId}&merchantCode=${merchantCode}&storeCode=${storeCode}`})
        }
      }
    })
  },

  // 跳转到银行通道
  toBankPassage(e) {
    let query = `pattern=${this.data.pattern}&passType=${e.currentTarget.dataset.passtype}&merchantCode=${this.data.BSInfo.merchantCode}`
    const store = `storeNo=${this.data.BSInfo.storeCode}`
    query = this.data.pattern === 'store' ? `${query}&${store}` : query
    wx.navigateTo({url: `../bankAccess/bankAccess?${query}`})
  },

  // 编辑
  toEdit() {
    const data = this.data.BSInfo
    wx.setStorageSync('edit', data)
    wx.navigateTo({url: `../BSOperation/BSOperation?pattern=${this.data.pattern}&operation=edit`})
  },
  
  // 复制到剪切板
  clipBoard(e) {
    wx.setClipboardData({
      data: e.target.dataset.clip,
      success() {app.showToast('复制成功')},
    })
  },

  // 重置密码
  changePassword() {
    const _that = this
    wx.showModal({
      content: '确定重置密码吗？',
      confirmColor: '#5177BE',
      cancelColor: '#5177BE',
      success(res) {
        if (res.confirm) {
          wx.showLoading({mask: true})
          const params = {
            agentNo: app.common('agentNo'),
          }
          _that.data.pattern === 'business' ? params.merchantCode = _that.data.merchantCode : params.storeCode = _that.data.storeCode
          app.api('agent_app_reset_mchstore_pwd', params).then(res => {
            wx.hideLoading()
            wx.showModal({
              title: '重置密码成功',
              content: `登录名: ${res.loginName}\r\n登录密码：${res.loginPwd}`,
              showCancel: false,
              confirmColor: '#5177BE',
            })
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
})
