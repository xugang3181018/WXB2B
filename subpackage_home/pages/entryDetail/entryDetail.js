const app = getApp()

Page({
  data: {
    accountType: 1, // 账户类型 1为个人 2为企业
    agentAuditNo: '', // 进件审核id
    auditorStatusText: '', // 进件状态文字
    businessLicenseType: '', // 营业执照类型 营业执照：NATIONAL_LEGAL： 营业执照(多证合一)：NATIONAL_LEGAL_MERGE 事业单位法人证书：INST_RGST_CTF
    businessType: '', // 商户类型 由merchantType字段决定 00为自然人 01为个体工商户 02为企业商户
    detail: {}, // 详情
    entryType: '1', // 进件类型 1商户 2门店
    id: 0, // 签约id
    imageAry: [], // 下方图片集合
    passType: '', // 通道类型 7位网商 8为客商
    tabIndex: '0', // 1 为已签约 2为未签约 3为详情
    title: '', // 标题
    index: null, // 当前进件在之前进件列表的索引
    url: 'agent_app_ksh_audit_details',
    resubmit: false, // 是否重提
    change: false, // 是否变更
    status: app.getImage('status.png'),
    waring: app.getImage('waring.png'),
    riskStatus: 0, // 风控状态
    auditorStatusList: ['未提交', '待审核', '处理中', '未通过', '已重提', '审核通过', '支付开通中', '支付开通失败', '银行审核中', '变更中', '变更失败', '变更成功', '待确认', '待报名', '升级银行审核中', '待打款验证', '入住-待签约', ' 升级-待签约', '审核通过', '待补齐资料', '银行审核中', '银行审核中']
  },

  onLoad(options) {
    const urlPart = options.tabIndex === '1' ? 'config' : 'audit'
    let url = '', title = options.tabIndex === '1' ? '已签约详情' : '进件详情'
    switch (options.passType) {
      case '7':
        url = `agent_app_mybank_${urlPart}_details`
        title = `网商-${title}`
        break
      case '8':
        url = `agent_app_ksh_${urlPart}_details`
        title = `客商-${title}`
        break
      case '9':
        url = `agent_app_leshua_${urlPart}_details`
        title = `乐刷-${title}`
        break
      case '11':
        url = `agent_app_huifu_${urlPart}_details`
        title = `汇付-${title}`
        break
      default: url = ''
    }
    const riskStatus = Number(wx.getStorageSync('member').inputStatus)
    this.setData({url, title, riskStatus, ...options})
  },

  onReady() {
    wx.setNavigationBarTitle({title: this.data.title})
  },

  onShow() {
    this.getEntryDetail()
  },

  // 预览图片
  previewImage(e) {
    const current = Number(e.currentTarget.dataset.index)
    wx.previewImage({current, urls: this.data.imageAry})
  },

  // 跳转到二次认证
  toAuthentication() {
    wx.navigateTo({url: `../authentication/authentication?codeImg=${this.data.detail.wechantAuthorizeUrl}&transitionId=${this.data.detail.transitionId}`})
  },

  // 重提或变更
  tapRC(e) {
    const {detail, index, passType, type, riskStatus} = this.data
    if (riskStatus) {
      app.showToast('服务商已被风控，请联系客服处理')
      return
    }
    let resubmit = e.currentTarget.dataset.resubmit ? 1 : 0
    let change = e.currentTarget.dataset.change ? 1 : 0
    this.setEntryInfo()
    if (detail.configureType === 2 && passType === '7') change = 1
    let linkUrl = `../entry/entry${passType}/entry${passType}?resubmit=${resubmit}&change=${change}&index=${index}`
    // 网商变更重提失败，查询变更失败的详情
    if (passType === '7' && this.data.detail.auditorStatus === 4 && this.data.detail.configureType === 2) {
      app.api('agent_app_mybank_modify_reset_details', {id: detail.configureCommonAuditId}).then(res => {
        if (res && !res.apiError) {
          res.configureCommonAuditId = detail.configureCommonAuditId
          wx.setStorageSync('RCData', res)
          wx.navigateTo({url: linkUrl})
        }
      })
      return
    } else {
      // 乐刷重提或变更是若为蓝海绿洲，则拼接字段
      if (passType === '9') {
        const yeahkaAgainFlag = type === 1 && (detail.rblueStatus !== '' || detail.oasisStatus !== '') ? 1 : 0 // 蓝海绿洲是否为局部重提
        linkUrl = `${linkUrl}&yeahkaAgainFlag=${yeahkaAgainFlag}&type=${type}`
      }
      if (['9', '11'].includes(passType) && change === 1) {
        this.setData({showChoice: true})
      } else {
        if (passType === '8') linkUrl = detail.businessLicenseNo ? `${linkUrl}&type=1` : `${linkUrl}&type=0`
        wx.navigateTo({url: linkUrl})
      }
    }
  },

  // 局部变更
  change(e) {
    const {index, passType, riskStatus} = this.data
    if (riskStatus) {
      app.showToast('服务商已被风控，请联系客服处理')
      return
    }
    const change = e.currentTarget.dataset.change
    this.setEntryInfo()
    let linkUrl = `../entry/entry${passType}/entry${passType}?resubmit=0&change=${change}&type=0&yeahkaAgainFlag=0&index=${index}`
    this.setData({showChoice: false})
    wx.navigateTo({url: linkUrl})
  },

  // 设置进件信息
  setEntryInfo() {
    const {detail, entryType} = this.data
    const entryInfo = {
      merchantCode: detail.coreMerchantCode,
      merchantFullName: detail.coreMerchantName,
      merchantName: detail.nameCn,
      storeFullName: detail.storeName,
      storeName: detail.nameCn,
      storeNo: detail.storeNo,
      fullNameCn: detail.fullNameCn,
      pattern: entryType === '1' ? 'business' : 'store'
    }
    wx.setStorageSync('RCData', detail)
    wx.setStorageSync('entryInfo', entryInfo)
  },

  // 关闭乐刷变更选项框
  close() {
    this.setData({showChoice: false})
  },

  // 获取进件详情
  getEntryDetail() {
    let params = {}
    const {tabIndex, passType, id, agentAuditNo, auditorStatusList, url} = this.data
    if (['7', '8'].includes(passType)) tabIndex === '1' ? params.id = id : params.agentAuditNo = agentAuditNo
    if (['9', '11'].includes(passType)) params.configureCommonAuditId = tabIndex === '1' ? id : agentAuditNo
    app.api(url, params).then(res => {
      console.log(url, params,"请求的数据")
      if (res && !res.apiError) {
        res.formatDate = app.formatDate(res.gmtAudited, "yyyy-MM-dd hh:mm:ss")
        let person = Number(res.accountType) === 1 ? '结算人' : '法人'
        let front = null, opposite = null, type = null
        if (['9', '11'].includes(passType)) {
          res.merchantType > 1 ? person = '法人' : null
          front = `${person}身份证（人像面）`
          opposite = `${person}身份证（国徽面）`
        } else {
          front = `${person}身份证（国徽面）`
          opposite = `${person}身份证（人像面）`
        }
        let imageAry = []
        let nameList = []
        let auditorStatusText = ''
        // 处理图片
        let other = []
        let imageName = [
          {img: 'openingPermitUrl', name: '开户许可证'},
          {img: 'doorUrl', name: '门头照'},
          {img: 'stroeEnvironmentPhotoUrl', name: passType === '11' ? '经营场所内设照片' : '店内环境照'},
          {img: 'storeEnvironmentPhotoUrl', name: passType === '11' ? '经营场所内设照片' : '店内环境照'},
          {img: 'cashierPhotoUrl', name: '收银台照'},
          {img: 'cardFrontUrl', name: '银行卡正面照'},
          {img: 'bankCardFrontUrl', name: '银行卡正面照'},
          {img: 'bankCardOppositeUrl', name: '银行卡背面照'},
          {img: 'supplementaryMaterialUrl1', name: '其他资质照'},
          {img: 'supplementaryMaterialUrl2', name: '其他资质照'},
          {img: 'supplementaryMaterialUrl', name: '授权函'},
        ]
        if (passType === '8' && res.specialAptitudeUrl) {
          const specialAptitudeUrlList = res.specialAptitudeUrl.split(',')
          specialAptitudeUrlList.forEach((item, index) => {
            imageName.push({img: `specialAptitudeUrl${index}`, name: `特殊资质${index + 1}`})
            res[`specialAptitudeUrl${index}`] = item
          })
        }
        if (!((['9', '11'].includes(passType)) && res.merchantType === '1')) {
          if (!(passType === '8' && !res.businessLicenseNo)) { // 自然人
            imageName.unshift({img: 'businessLicenseUrl', name: '营业执照'})
          }
        }
        if (['9', '11'].includes(passType)) {
          if (res.merchantType !== '1') {
            other = [
              {img: 'identificationFrontUrl', name: front},
              {img: 'identificationOppositeUrl', name: opposite},
            ]
          }
          if (res.legalFlag === '0' || res.merchantType === '1') {
            other = [
              ...other,
              {img: 'nonLegIdentificationFrontUrl', name: '结算人身份证（人像面）'},
              {img: 'nonLegIdentificationOppositeUrl', name: '结算人身份证（国徽面）'},
            ]
          }
          res.legalFlag === '0' ? other.push({img: 'nonLegSettleAuthUrl', name: '非法人结算授权书'}) : null
        } else {
          other = [
            {img: 'identificationFrontUrl', name: passType === '8' && !res.businessLicenseNo ? '持卡人身份证（人像面）' : front},
            {img: 'identificationOppositeUrl', name: passType === '8' && !res.businessLicenseNo ? '持卡人身份证（国徽面）' : opposite},
          ]
        }
        imageName = imageName.concat(other)
        imageName.forEach($0 => {
          if (res[$0.img]) {
            imageAry.push(res[$0.img])
            nameList.push($0.name)
          }
        })
        // 处理进件状态
        auditorStatusList.forEach((item, index) => {
          res.auditorStatus === index + 1 ? auditorStatusText = item : null
        })
        for (let attr in res) {
          res[attr] === null ? res[attr] = '' : null
        }
        // 处理商户类型
        let businessType = null, certificateHolderType = null
        if (['7', '9', '11'].includes(passType)) {
          businessType = res.merchantType && Number(res.merchantType) === 1 ? '自然人' : (Number(res.merchantType) === 2 ? '个体工商户' : '企业商户')
        }
        // 处理时间和证件类型
        if (['9', '11'].includes(passType)) {
          res.businessStartDate = app.formatDate(res.businessStartDate, "yyyy-MM-dd")
          res.businessDeadline = app.formatDate(res.businessDeadline, "yyyy-MM-dd")
          res.certificateStartDate = app.formatDate(res.certificateStartDate, "yyyy-MM-dd")
          res.certificateDeadline = app.formatDate(res.certificateDeadline, "yyyy-MM-dd")
          if (passType === '11') {
            res.companyCorporationStartDate = app.formatDate(res.companyCorporationStartDate, "yyyy-MM-dd")
            res.companyCorporationDeadline = app.formatDate(res.companyCorporationDeadline, "yyyy-MM-dd")
            switch (Number(res.rmk3)) {
              case 1:
                res.accountIdType = '身份证'
                break
              case 3:
                res.accountIdType = '港澳台通行证'
                break
              default: null
            }
          }
          if (res.certificateHolderType) {
            switch (res.certificateHolderType) {
              case 1:
                certificateHolderType = '身份证'
                break
              case 2:
                if (passType === '9') certificateHolderType = '港澳台通行证'
                if (passType === '11') certificateHolderType = '港澳台通行证'
                break
              case 9:
                certificateHolderType = '其他法定文件'
                break
              default: null
            }
          }
          type = [7, 8, 9, 11].includes(Number(res.configureVersion)) ?  1 : 0 // 进件时用来判断乐刷是否是蓝海绿洲的字段
        }
        console.log(res,"进件详情")
        this.setData({
          detail: res,
          type,
          imageAry,
          auditorStatusText,
          certificateHolderType,
          nameList,
          businessType,
          accountType: Number(res.accountType),
          businessLicenseType: res.businessLicenseType && res.businessLicenseType === 'NATIONAL_LEGAL' ? '营业执照' : (res.businessLicenseType === 'NATIONAL_LEGAL_MERGE' ? '营业执照（多证合一）' : '事业单位法人证书'),
        })
      }
    })
  },
})
