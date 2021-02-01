const app = getApp()
import ppevent from '../../../../utils/ppevent'
import upload from '../../../../api/upload'
import submitData from '../data/submitData'

Page({
  data: {
    account: null, // accountTypeList当前的索引
    accountTypeList: ["个人", "企业"], // 账户类型选择
    alipay: {list: [], rateIdList: [], detail: [], index: null}, // 支付宝通道配置
    bankIndex: null, // 选中银行的索引
    businessLicense: null, // 营业执照选项
    businessLicenseTypeList: ['营业执照', '营业执照（多证合一）', '事业单位法人证书'], // 营业执照类型列表
    businessLicenseTypeList2: ['NATIONAL_LEGAL', 'NATIONAL_LEGAL_MERGE', 'INST_RGST_CTF'],
    category: null, // 经营类目的索引
    channel: {list: [], detail: [], index: null}, // 通道列表
    entryInfo: {}, // 进件所在商户或门店的信息
    hasData: false, // 是否有重提或缓存的数据
    isSubmit: false, // 是否正在提交
    obtain: false, // 身份证是否正确
    passType: '8', // 通道类型
    progress: 33.33,
    step: 1, // 当前进度
    step1: {}, // 第一步的数据
    step2: {}, // 第二步的数据
    step3: {}, // 第三步的数据
    wechat: {list: [], rateIdList: [], detail: [], index: null}, // 微信通道配置
    defaultPic: app.getImage('defaultPic.png'),
    moreinfo: app.getImage('moreinfo.png'),
    x: 0,
    y: 50,
  },

  onLoad(options) {
    const entryInfo = wx.getStorageSync('entryInfo')
    const nameCn = entryInfo.pattern === 'business' ? entryInfo.merchantName : entryInfo.storeName
    const fullNameCn = entryInfo.pattern === 'business' ? entryInfo.merchantFullName : entryInfo.storeFullName
    const configureName = `${entryInfo.merchantFullName}客商银行通道${app.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')}`
    let accountType = options.type === '0' ? 1 : null
    let account = options.type === '0' ? 0 : null
    let storage = wx.getStorageSync('entry')
    let RCData = wx.getStorageSync('RCData')
    let url = options.resubmit > 0 ? 'agent_app_ksh_reset_configure' : 'agent_app_ksh_add_configure'
    // 当为普通进件，读取缓存
    storage = storage ? storage[`8${options.type}${options.resubmit}${entryInfo.merchantCode}${entryInfo.storeNo}`] : null
    if (options.resubmit === '0' && storage) {
      wx.showModal({
        title: '是否读取已保存的内容',
        success: (res) => {
          if (res.confirm) {
            storage = this.formatData(storage, entryInfo)
            storage.progress = 33.33 * storage.step
            this.setData(storage)
            this.channelQuery()
          }
        }
      })
    }
    // 当为重提的时候
    if (options.resubmit === '1') {
      RCData = this.formatData(RCData, entryInfo)
      RCData.obtain = true
    }
    this.setData({fullNameCn, nameCn, configureName, accountType, account, url, ...options, ...entryInfo, ...RCData})
    this.channelQuery()
    ppevent.on('getCategory', this, function (res) {this.setData({...res})})
    ppevent.on('bankName', this, function (res) {this.setData(res)})
  },

  onReady() {
    wx.setNavigationBarTitle({title: `${this.data.pattern === 'business' ? '商户' : '门店'}进件-客商通道`})
  },

  onUnload() {
    // 移除重提的缓存
    wx.removeStorageSync('RCData')
  },

  // 格式化数据
  formatData(data, entryInfo) {
    const info = {
      ...data,
      hasData: true,
      passType: '8',
      account: data.accountType !== undefined ? data.accountType - 1: null,
      merchantCode: data.coreMerchantCode ? data.coreMerchantCode : entryInfo.merchantCode,
      businessLicense: data.businessLicenseType ? this.data.businessLicenseTypeList2.indexOf(data.businessLicenseType) : null,
      areaAry: data.province ? {province: data.province, city: data.city, area: data.area} : null,
      areaAry2: data.subbranchProvince ? {subbranchProvince: data.subbranchProvince, subbranchCity: data.subbranchCity} : null,
    }
    let other = {}
    if (data.specialAptitudeUrl) {
      const specialAptitudeUrlList = data.specialAptitudeUrl.split(',')
      const specialAptitudeKsUrlList = data.specialAptitudeKsUrl.split(',')
      other = {
        specialAptitudeUrl1: specialAptitudeUrlList[0] ? specialAptitudeUrlList[0] : null,
        specialAptitudeKsUrl1: specialAptitudeKsUrlList[0] ? specialAptitudeKsUrlList[0] : null,
        specialAptitudeUrl2: specialAptitudeUrlList[1] ? specialAptitudeUrlList[1] : null,
        specialAptitudeKsUrl2: specialAptitudeKsUrlList[1] ? specialAptitudeKsUrlList[1] : null,
        specialAptitudeUrl3: specialAptitudeUrlList[2] ? specialAptitudeUrlList[2] : null,
        specialAptitudeKsUrl3: specialAptitudeKsUrlList[2] ? specialAptitudeKsUrlList[2] : null,
      }
    }
    Object.assign(info, other)
    return info
  },

  // 请选择通道
  chooseChannel() {
    this.data.channel.index === null ? app.showToast('请选择通道') : null
  },

  // 通道查询
  channelQuery() {
    const {hasData, channel, passName} = this.data
    const params = {agentNo: app.common('agentNo'), passType: '8'}
    app.api('agent_app_ceb_list_query', params).then(res => {
      if (res && !res.apiError) {
        const list = []
        channel.detail = res
        res.forEach(item => {list.push(item.passName)})
        channel.list = list
        // 重提或变更
        if (hasData) {
          channel.index = channel.list.indexOf(passName)
          if (channel.index !== -1) { // 判断重提或变更的银行通道是否存在
            this.getRate(res[channel.index].id)
          } else {
            channel.index = null
            app.showToast('银行费率不存在，请重新选择')
          }
        }
        this.setData({channel})
      }
    })
  },

  // 获取费率
  getRate(passNo) {
    const {hasData, alipayRateId, wechatRateId} = this.data
    let {alipay, wechat} = this.data
    app.api('agent_app_ceb_rate_list_query', {agentNo: app.common('agentNo'), passNo}).then(res => {
      if (res && !res.apiError) {
        res.forEach(item => {
          item.payType === 1 ? this.rateFunc(alipay, item) : null
          item.payType === 2 ? this.rateFunc(wechat, item) : null
        })
        if (hasData) {
          alipay.index = alipay.rateIdList.includes(alipayRateId) ? alipay.rateIdList.indexOf(alipayRateId) : null
          wechat.index = wechat.rateIdList.includes(wechatRateId) ? wechat.rateIdList.indexOf(wechatRateId) : null
          if (alipay.index === null && wechat.index === null) app.showToast('查询不到费率，请重新选择')
        }
        alipay.list.push('无')
        wechat.list.push('无')
        this.setData({alipay, wechat})
      }
    })
  },

  // 通道获取费率
  rateFunc(pass, item) {
    pass.list.push(`${item.passName}${item.rateName}-${item.rate}‰`)
    pass.rateIdList.push(item.rateId)
    pass.detail.push(item)
  },

  // 改变费率
  rateChange(e) {
    let {alipay, wechat, alipayRateId, wechatRateId} = this.data
    const rateIndex = Number(e.detail.value)
    const type = e.currentTarget.dataset.type
    if (type === 'alipay') {
      if (alipay.list[rateIndex] === '无') {
        alipayRateId = null
      }
      alipay.index = rateIndex
    } else {
      if (wechat.list[rateIndex] === '无') {
        wechatRateId = null
      }
      wechat.index = rateIndex
    }
    this.setData({alipay, wechat, alipayRateId, wechatRateId})
  },

  // 跳转
  linkTo(e) {
    wx.navigateTo({url: e.currentTarget.dataset.url})
  },

  // 改变封装好的picker组件
  changePickers(e) {
    const type = e.currentTarget.dataset.type
    const detail = e.detail
    if (type === 'area') detail.areaAry = {province: detail.province, city: detail.city, area: detail.area}
    if (type === 'bankArea') detail.areaAry2 = {subbranchProvince: detail.subbranchProvince, subbranchCity: detail.subbranchCity}
    this.setData(detail)
  },

  // 获取数据
  changeData(e) {
    const type = e.currentTarget.dataset.type
    const data = this.data
    const detail = e.detail
    let value = detail.value
    let info = {}
    switch (type) {
      case 'businessLicense':
        info = {
          businessLicense: value,
          businessLicenseType: data.businessLicenseTypeList2[value]
        }
        this.setData(info)
        break
      case 'account':
        value = Number(value)
        info = {
          account: value,
          accountType: value + 1
        }
        this.setData(info)
        break
      case 'channel':
        value = Number(value)
        let channel = this.data.channel
        if (channel.index !== value) {
          channel.index = value
          info = {
            channel,
            alipay: {list: [], rateIdList: [], detail: [], index: null},
            wechat: {list: [], rateIdList: [], detail: [], index: null},
            alipayRateId: null,
            wechatRateId: null,
            hasData: false
          }
          this.setData(info)
          this.getRate(channel.detail[channel.index].id)
        }
        break
      case 'idCard':
        let obtain = false
        const params = {cardNo: value}
        if (value) {
          app.api("agent_app_check_card_no", params).then(res => {
            if (res.webMessage) {
              obtain = true
              this.setData({[e.currentTarget.dataset.name]: value, obtain})
            } else {
              this.setData({obtain})
            }
          })
        } else {
          this.setData({[e.currentTarget.dataset.name]: null, obtain})
        }
        break
      default: null
    }
  },

  // 上传图片
  uploadImg(e) {
    const {name, othername, type, ocr} = e.currentTarget.dataset
    const {accountType} = this.data
    upload('8', (res) => {
      let info = {}
      if (ocr && res.ocrData) {
        if (ocr === 'BUSINESS_LICENSE') {
          info = {businessLicenseNo: res.ocrData.number}
        } else if (ocr === 'IDCARD') {
          app.api("agent_app_check_card_no", {cardNo: res.ocrData.number}).then(res2 => {
            if (!res2.apiError) {
              info = {certificateNo: res.ocrData.number, certNo: res.ocrData.number, obtain: true}
              accountType === 2 ? info.legalPersonName = res.ocrData.name : info.accountHolder = res.ocrData.name
              this.setData(info)
            }
          })
        }
      }
      this.setData({[name]: res.lt_picture_url, [othername]: res.other_picture_url, ...info})
    }, type, ocr)
  },

  // 上传银行卡图片
  uploadImg2(e) {
    const {ocr, name} = e.currentTarget.dataset
    upload("card", res => {
      const info = {[name]: res.file_url}
      if (res.ocrData) info.cardNo = res.ocrData.bank_card_num
      this.setData(info)
    }, null, ocr)
  },

  // 跳转到银行列表
  toBankList() {
    wx.navigateTo({url: `../../bankList/bankList?passType=8`})
  },

  // 下一步
  nextStep(e) {
    const data = this.data
    const input = e.detail.value
    const type = e.detail.target.dataset.type
    const obj = submitData(data, input, type)
    const info = {}
    let entry = {}
    if (data.isSubmit || !obj) return
    for (let attr in obj) {
      if (obj[attr]) {
        obj[attr].value !== null && obj[attr].value !== undefined ? entry[attr] = obj[attr].value : null
      }
    }
    // 缓存
    const allStorage = wx.getStorageSync('entry') || {}
    let oldStorage = allStorage[`8${data.type}${data.resubmit}${data.merchantCode}${data.storeNo}`] || {}
    const storage = Object.assign({}, oldStorage, entry)
    storage.step = data.step
    storage[`step${data.step}`] = entry
    allStorage[`8${data.type}${data.resubmit}${data.merchantCode}${data.storeNo}`] = storage
    wx.setStorageSync('entry', allStorage)
    // 提交
    const adopt = type === 'next' || type === 'submit' ? app.validate(obj) : false
    if (type === 'last') { // 上一步
      this.setData({step: --data.step, progress: (data.progress - 33.33), ...entry, ...info})
    } else if (type === 'save') {
      app.showToast('已保存当前填写内容')
    } else if (type === 'next' && adopt) { // 下一步
      wx.pageScrollTo({scrollTop: 0, duration: 0})
      const step = `step${data.step}`
      this.setData({step: ++data.step, progress: (data.progress + 33.33), [step]: entry, ...entry, ...info})
    } else if (type === 'submit' && adopt) { // 提交
      wx.pageScrollTo({scrollTop: 0, duration: 0})
      let entryData = Object.assign({}, data.step1, data.step2, entry)
      let params = {}
      for (let attr in entryData) {
        if (entryData[attr] !== '') params[attr] = entryData[attr]
      }
      this.setData({isSubmit: true})
      app.api(data.url, params).then(res => {
        // 删除缓存
        const allStorage = wx.getStorageSync('entry')
        allStorage[`8${data.type}${data.resubmit}${data.merchantCode}${data.storeNo}`] = null
        wx.setStorageSync('entry', allStorage)
        if (res && !res.apiError) {
          if (data.resubmit > 0) {
            app.showToast("重提成功")
            wx.navigateBack({delta: 2})
            ppevent.emit("resubmit", this.data.index)
          } else {
            wx.setStorageSync('successInfo', res)
            wx.redirectTo({url: `../../operationSuccess/operationSuccess?pattern=${data.pattern}&type=entry`})
          }
        } else {
          this.setData({isSubmit: false})
        }
      })
    }
  },
})