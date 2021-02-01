const app = getApp()

Page({
  data: {
    alipayTransitionId: null, // 支付宝配置 当从门店详情进入 认证完成改变门店配置时需要
    codeImg: null, // 认证二维码
    merchantCode: null, // 商户编号
    storeCode: null, // 门店编号
    transitionId: null // 微信配置编号
  },

  onLoad(options) {
    this.setData(options)
  },

  // 查看帮助
  toHelp() {
    wx.navigateTo({url: '../webView/webView?url=https://pay.weixin.qq.com/static/help_guide/business_registration.shtml'})
  },

  // 认证完成
  finish() {
    app.api('agent_app_certification_list_query', {transitionId: this.data.transitionId}).then(res => {
      if (res && !res.apiError) {
        if (res.wechatAuthorizeStatus) {
          this.data.storeCode ? this.changeConfigure() : wx.navigateBack()
        } else {
          app.showToast('认证失败，请重试')
        }
      }
    })
  },

  // 改变支付配置
  changeConfigure() {
    const {alipayTransitionId, transitionId, merchantCode, storeCode} = this.data
    const params = {
      agentNo: app.common('agentNo'),
      agreement_no: app.common('merchantInnerPartnerId'),
      merchantCode,
      storeCode,
      wechatTransitionNo: transitionId,
    }
    alipayTransitionId ? params.alipayTransactionNo = alipayTransitionId : null
    app.api('agent_app_store_pay_info', params).then((res) => {
      if (res && !res.apiError) {
        app.showToast('认证成功，变更支付配置成功')
        wx.navigateBack()
      }
    })
  },
})
