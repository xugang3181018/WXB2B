const app = getApp()
import ppevent from '../../../../utils/ppevent'
import upload from '../../../../api/upload'
import submitData from '../data/submitData'

Page({
  data: {
    account: null, // accountTypeList当前的索引
    accountHolder: null, // 开户人
    accountType: null, // 账户类型 1个人 2企业
    accountTypeList: ["企业", "个人"], // 账户类型选择
    alipay: {list: [], rateIdList: [], detail: [], index: null}, // 支付宝通道配置
    bankIndex: null, // 选中银行的索引
    businessLicenseUrl: null,
    category: null, // 经营类目的类型
    certificateHolderType: null, // 法人证件类型
    channel: {list: [], detail: [], index: null}, // 通道列表
    credentialTypeList: ['身份证', '港澳通行证', '其他法定文件'], // 法人证件类型列表
    entryInfo: {}, // 进件所在商户或门店的信息
    hasData: false, // 是否有重提或缓存的数据
    isSubmit: false, // 是否正在提交
    legalFlag: 1, // 结算人类型
    legalList: ['非法人', '法人'], // 结算人类型列表
    merchantIndex: null, // 商户类型
    modalShow: false, // 遮罩层显示隐藏
    obtain2: false, // 验证银行卡是否合格
    obtain3: false,
    passType: '9', // 通道类型
    progress: 33.33,
    step: 1, // 当前进度
    step1: {}, // 第一步的数据
    step2: {}, // 第二步的数据
    step3: {}, // 第三步的数据
    wechat: {list: [], rateIdList: [], detail: [], index: null}, // 微信通道配置
    yeahkaBusinessLicenseUrl: null,
    download: app.getImage('download.png'),
    moreinfo: app.getImage('moreinfo.png'),
    defaultPic: app.getImage('defaultPic.png'),
    x: 0,
    y: 50,
  },

  onLoad(options) {
    this.initData(options)
    ppevent.on('getCategory', this, function (res) {this.setData({...res})})
    ppevent.on('bankName', this, function (res) {
      if (this.data.bankName !== res.bankName) {
        res.bankBranchName = null
        this.setData(res)
      }
    })
    ppevent.on('bankBranchName', this, function (res) {this.setData({modalShow: false, ...res})})
  },

  onUnload() {
    // 移除重提的缓存
    wx.removeStorageSync('RCData')
  },

  // 初始化数据
  initData(options) {
    const entryInfo = wx.getStorageSync('entryInfo')
    const configureName = `${entryInfo.merchantFullName}乐刷银行通道${app.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')}`
    const nameCn = entryInfo.pattern === 'business' ? entryInfo.merchantName : entryInfo.storeName
    let fullNameCn = entryInfo.pattern === 'business' ? entryInfo.merchantFullName : entryInfo.storeFullName
    let businessCategory = null
    let businessCategoryName = null
    let merchantTypeList = ['自然人', '个体工商户', '企业商户']
    let RCData = wx.getStorageSync('RCData')
    let storage = wx.getStorageSync('entry')
    let url = options.resubmit > 0 ? 'agent_app_leshua_reset_configure' : 'agent_app_leshua_add_configure'
    let step = 1
    if (options.change > 0) { // 变更
      step = Number(options.change)
      url = options.change > 1 ? 'agent_app_leshua_modify_settlement' : 'agent_app_leshua_modify_rate'
    }
    // 当为普通进件，读取缓存
    storage = storage ? storage[`9${options.type}${options.resubmit}${options.change}${entryInfo.merchantCode}${entryInfo.storeNo}`] : null
    if (options.resubmit === '0' && options.change === '0' && storage) {
      wx.showModal({
        title: '是否读取已保存的内容',
        success: (res) => {
          if (res.confirm) {
            storage = this.formatData(storage, options, entryInfo)
            storage.progress = 33.33 * storage.step
            this.setData(storage)
            this.channelQuery()
          }
        }
      })
    }
    // 当为重提的时候
    if (options.resubmit === '1' || options.change > 0) {
      RCData = this.formatData(RCData, options, entryInfo)
      RCData.obtain2 = true
      RCData.obtain3 = true
      fullNameCn = entryInfo.fullNameCn
    }
    this.setData({fullNameCn, nameCn, merchantTypeList, businessCategoryName, businessCategory, configureName, url, step, ...options, ...entryInfo, ...RCData})
    this.channelQuery()
  },

  onReady() {
    wx.setNavigationBarTitle({title: `${this.data.pattern === 'business' ? '商户' : '门店'}进件-乐刷通道`})
  },

  // 格式化数据
  formatData(data, options, entryInfo) {
    const info = {
      ...data,
      hasData: true,
      passType: '9',
      type: options.type,
      subbranchCity: data.bankCity ? data.bankCity : null,
      legalFlag: data.legalFlag === undefined || data.legalFlag === '' ? 1 : Number(data.legalFlag),
      accountType: data.accountType !== undefined ? Number(data.accountType) : null,
      forever1: data.businessDeadline === '2099-12-30' ? true : false,
      forever2: data.certificateDeadline === '2099-12-30' ? true : false,
      idCardStart: data.certificateStartDate ? data.certificateStartDate : null,
      idCardEnd: data.certificateDeadline ? data.certificateDeadline : null,
      subbranchProvince: data.bankProvince ? data.bankProvince : null,
      account: data.accountType !== undefined ? Number(data.accountType) === 2 ? 0 : 1 : null,
      merchantCode: data.coreMerchantCode ? data.coreMerchantCode : entryInfo.merchantCode,
      merchantType: data.merchantType !== undefined ? Number(data.merchantType) : null,
      certificateHolderType: data.certificateHolderType && Number(data.certificateHolderType) === 9 ? 2 : data.certificateHolderType - 1,
      areaAry: data.province ? {province: data.province, city: data.city, area: data.area} : null,
      areaAry2: data.bankProvince ? {subbranchProvince: data.bankProvince, subbranchCity: data.bankCity} : null
    }
    data.businessStartDate === 'NaN-NaN-NaN' ? info.businessStartDate = null : null
    data.businessDeadline === 'NaN-NaN-NaN' ? info.businessDeadline = null : null
    data.idCardEnd === 'NaN-NaN-NaN' ? info.idCardEnd = null : null
    data.idCardStart === 'NaN-NaN-NaN' ? info.idCardStart = null : null
    if (data.merchantType !== undefined) {
      info.accountType = Number(data.merchantType) === 1 ? 1 : Number(data.accountType)
      info.merchantIndex = data.merchantType - 1
    }
    return info
  },

  // 请选择通道
  chooseChannel() {
    this.data.channel.index === null ? app.showToast('请选择通道') : null
  },

  // 通道查询
  channelQuery() {
    if (this.data.change === '3') return
    const {hasData, channel, passName} = this.data
    const params = {agentNo: app.common('agentNo'), passType: '9'}
    app.api('agent_app_ceb_list_query', params).then(res => {
      if (res && !res.apiError) {
        const list = []
        channel.detail = res
        res.forEach(item => {list.push(item.passName)})
        channel.list = list
        // 重提或变更
        if (hasData) {
          channel.index = channel.list.indexOf(passName)
          if (channel.index !== -1) {
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
    const {hasData, alipayRateId, wechatRateId, change} = this.data
    let {alipay, wechat} = this.data
    const params = {agentNo: app.common('agentNo'), passNo}
    app.api('agent_app_ceb_rate_list_query', params).then(res => {
      if (res && !res.apiError) {
        const lsptAlipay = app.deepCopy(alipay)
        const lsptWechat = app.deepCopy(wechat)
        res.forEach(item => {
          item.payType === 1 ? this.rateFunc(alipay, item) : null
          item.payType === 2 ? this.rateFunc(wechat, item) : null
        })
        alipay.detail.forEach(item => {item.rate !== 2 ? this.rateFunc(lsptAlipay, item) : null})
        wechat.detail.forEach(item => {item.rate !== 2 ? this.rateFunc(lsptWechat, item) : null})
        alipay = lsptAlipay
        wechat = lsptWechat
        if (hasData) {
          alipay.index = alipay.rateIdList.includes(alipayRateId) ? alipay.rateIdList.indexOf(alipayRateId) : null
          wechat.index = wechat.rateIdList.includes(wechatRateId) ? wechat.rateIdList.indexOf(wechatRateId) : null
          if (alipay.index === null && wechat.index === null) {
            app.showToast('查询不到费率，请重新选择')
          }
        }
        if (change === '0') {
          alipay.list.push('无')
          wechat.list.push('无')
        }
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
        alipay.index = rateIndex
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

  // 改变商户类型
  changeBusinessType(e) {
    const merchantIndex = Number(e.detail.value)
    const {merchantType} = this.data
    let {businessLicenseUrl, yeahkaBusinessLicenseUrl, certificateHolderType, account, accountType, legalFlag, accountHolder} = this.data
    let mType = merchantIndex + 1
    if (mType === 1) {
      accountType = 1
      legalFlag = 1
    }
    if (merchantType === 1 && mType > 1) {
      legalFlag = 1
      account = null
      accountType = null
      businessLicenseUrl = null
      yeahkaBusinessLicenseUrl = null
      certificateHolderType = null
    }
    this.setData({
      merchantIndex, merchantType: mType, accountType, accountHolder, businessLicenseUrl, yeahkaBusinessLicenseUrl, certificateHolderType, account, legalFlag
    })
  },

  // 跳转
  linkTo(e) {
    wx.navigateTo({url: e.currentTarget.dataset.url})
  },

  // 跳转到银行列表
  toBankList() {
    wx.navigateTo({url: `../../bankList/bankList?passType=9`})
  },

  // 跳转到获取开户支行
  toBankBranchList() {
    const {bankName, subbranchProvince, subbranchCity} = this.data
    if (!bankName) {
      app.showToast('请先选择开户银行')
      return
    }
    if (!subbranchProvince) {
      app.showToast('请先选择开户支行所属地区')
      return
    }
    wx.navigateTo({url: `../../bankBranchList/bankBranchList?bankName=${bankName}&subbranchProvince=${subbranchProvince}&subbranchCity=${subbranchCity}&passType=9`})
  },

  // 改变封装好的picker组件
  changePickers(e) {
    const type = e.currentTarget.dataset.type
    const detail = e.detail
    if (type === 'area') detail.areaAry = {province: detail.province, city: detail.city, area: detail.area}
    if (type === 'bankArea') detail.areaAry2 = {subbranchProvince: detail.subbranchProvince, subbranchCity: detail.subbranchCity}
    this.setData(detail)
  },

  // 改变数据
  changeData(e) {
    const type = e.currentTarget.dataset.type
    const data = this.data
    const detail = e.detail
    let value = detail.value
    const obtain = `obtain${data.step}`
    let info = {}
    switch (type) {
      case 'channel':
        let channel = this.data.channel
        value = Number(value)
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
      case 'category':
        info = {
          businessCategory: detail.categoryId,
          businessCategoryName: detail.category
        }
        this.setData(info)
        break
      case 'forever1':
        info = {
          forever1: value,
          businessDeadline: value ? '2099-12-30' : null
        }
        this.setData(info)
        break
      case 'forever2':
        info = {
          forever2: value,
          idCardEnd: value ? '2099-12-30' : null
        }
        this.setData(info)
        break
      case 'account':
        value = Number(value)
        info = {
          account: value,
          accountType: value === 0 ? 2 : 1
        }
        if (value !== data.account) {
          info.legalFlag = 1
          value === 1 ? info.accountHolder = data.companyCorporation : null
          value === 0 ? info.accountHolder = data.businessLicenseFullName : null
        }
        this.setData(info)
        break
      case 'legalFlag':
        value = Number(value)
        if (data.legalFlag !== value) {
          info = {
            legalFlag: value,
            accountHolder: value === 0 ? '' : data.companyCorporation
          }
          if (data.resubmit > 0 && value === 0) {
            const RCData = wx.getStorageSync("RCData")
            value === 0 ? info.accountHolder = RCData.accountHolder : null
          }
        }
        this.setData(info)
        break
      case 'certificateHolderType':
        this.setData({certificateHolderType: value})
        break
      case 'idCard':
        const params = {cardNo: value}
        if (value) {
          this.setData({[obtain]: false})
          app.api("agent_app_check_card_no", params).then(res => {
            if (res && !res.apiError) this.setData({certificateHolderNo: value, [obtain]: true})
          })
        } else {
          this.setData({[obtain]: false, certificateHolderNo: null})
        }
        break
      default: 
        this.setData({[type]: value})
    }
  },

  // 关闭弹窗
  close() {
    this.setData({modalShow: false})
  },

  // 图片预览
  prevImg(e) {
    const current = e.currentTarget.dataset.url
    wx.previewImage({current, urls: [current]})
  },

   // 上传图片
   uploadImg(e) {
    const {name, othername, type, ocr} = e.currentTarget.dataset
    const {step} = this.data
    upload('9', (res) => {
      let info = {}
      if (ocr && res.ocrData) {
        switch (ocr) {
          case 'BUSINESS_LICENSE':
            let start = res.ocrData.establish_date
            let end = res.ocrData.expiryDate
            end = end === '29991231' ? '20991230' : end
            // 乐刷局部重提不能变更
            if (this.data.yeahkaAgainFlag !== '1') {
              info.businessLicenseNo = res.ocrData.number
              info.businessLicenseFullName = res.ocrData.entName
            }
            info = {
              ...info,
              businessLicenseAddress: res.ocrData.address,
              businessStartDate: start ? `${start.slice(0, 4)}-${start.slice(4, 6)}-${start.slice(6, 8)}` : null,
              businessDeadline: end ? `${end.slice(0, 4)}-${end.slice(4, 6)}-${end.slice(6, 8)}` : null,
              forever1: end === '20991230' ? true : false
            }
            break
          case 'IDCARD':
            const obtain = `obtain${step}`
            if (res.ocrData.number) {
              const params = {cardNo: res.ocrData.number}
              app.api("agent_app_check_card_no", params).then(res2 => {
                if (!res2.apiError) {
                  if (this.data.yeahkaAgainFlag !== '1' && step === 2) {
                    info = {
                      certificateHolderNo: res.ocrData.number,
                      companyCorporation: res.ocrData.name
                    }
                  }
                  if (step === 3) {
                    info = {
                      legalFlagCardNo: res.ocrData.number,
                      certificateHolderNo: res.ocrData.number
                    }
                    if (this.data.yeahkaAgainFlag !== '1') info.accountHolder = res.ocrData.name
                  }
                  this.setData({...info, [obtain]: true})
                }
              })
            }
            break
          case 'BANK_CARD':
            info = {cardNo: res.ocrData.bank_card_num}
            break
          default: null
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
    let oldStorage = allStorage[`9${data.type}${data.resubmit}${data.change}${data.merchantCode}${data.storeNo}`] || {}
    const storage = Object.assign({}, oldStorage, entry, {obtain2: data.obtain2, obtain3: data.obtain3})
    storage.step = data.step
    storage[`step${data.step}`] = entry
    allStorage[`9${data.type}${data.resubmit}${data.change}${data.merchantCode}${data.storeNo}`] = storage
    wx.setStorageSync('entry', allStorage)
    // 提交
    const adopt = type === 'next' || type === 'submit' ? app.validate(obj) : false
    if (type === 'last') { // 上一步
      wx.pageScrollTo({scrollTop: 0, duration: 0})
      if (data.step === 3) info.certificateHolderType = Number(data.certificateHolderType) === 9 ? 2 : data.certificateHolderType - 1
      this.setData({step: --data.step, progress: (data.progress - 33.33), ...entry, ...info})
    } else if (type === 'save') {
      app.showToast('已保存当前填写内容')
    } else if (type === 'next' && adopt) { // 下一步
      wx.pageScrollTo({scrollTop: 0, duration: 0})
      switch (data.step) {
        case 1:
          if (data.certificateHolderType) {
            info.certificateHolderType = Number(data.certificateHolderType) === 9 ? 2 : data.certificateHolderType - 1
          }
          break
        case 2:
          info.accountHolder = data.accountType === 2 ? data.businessLicenseFullName : (data.legalFlag === 1 && data.merchantType > 1) ? data.companyCorporation : data.accountHolder
          break
        default:
          break
      }
      const step = `step${data.step}`
      this.setData({step: ++data.step, progress: (data.progress + 33.33), [step]: entry, ...entry, ...info})
    } else if (type === 'submit' && adopt) { // 提交
      let entryData = Object.assign({}, data.step1, data.step2, entry)
      if (data.change !== '0') entryData = entry
      let params = {}
      for (let attr in entryData) {
        if (entryData[attr] !== '') params[attr] = entryData[attr]
      }
      this.setData({isSubmit: true})
      app.api(data.url, params).then(res => {
        if (res && !res.apiError) {
          // 删除缓存
          const allStorage = wx.getStorageSync('entry')
          allStorage[`9${data.type}${data.resubmit}${data.change}${data.merchantCode}${data.storeNo}`] = null
          wx.setStorageSync('entry', allStorage)
          if (data.resubmit > 0) {
            app.showToast("重提成功")
            wx.navigateBack({delta: 2})
            ppevent.emit("resubmit", this.data.index)
          } else if (data.change > 0) {
            if (data.change === '1') {
              app.showToast("费率变更中,次日生效")
            } else {
              app.showToast("变更成功")
            }
            if (data.change === '3') {
              wx.navigateBack()
            } else {
              wx.redirectTo({url: `../../operationSuccess/operationSuccess?pattern=${data.pattern}&type=change`})
            }
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