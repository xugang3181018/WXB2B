const app = getApp()
import ppevent from '../../../../utils/ppevent'
import upload from '../../../../api/upload2'
import submitData from '../data/submitData'

Page({
  data: {
    rmk3Index: 0, // 结算人证件类型索引
    rmk3: 1, // 结算人证件类型
    rmk3List: ['身份证', '港澳台通行证'], // 结算人证件类型
    alipay: {list: [], rateIdList: [], detail: [], index: null}, // 支付宝通道配置
    category: null, // 经营类目的类型
    channel: {list: [], detail: [], index: null}, // 通道列表
    entryInfo: {}, // 进件所在商户或门店的信息
    hasData: false, // 是否有重提或缓存的数据
    CHTIndex: 0, // 法人证件类型的索引
    certificateHolderType: 1, // 法人证件类型
    CHTList: ['身份证', '港澳台通行证', '其他'], // 法人证件类型列表
    legalFlag: null, // 结算人类型
    legalList: ['非法人', '法人'], // 结算人类型列表
    accountType: null, // 账户类型
    accountTypeList: ['企业', '个人'],
    isSubmit: false, // 是否正在提交
    MTIndex: null, // 商户类型
    merchantTypeList: ['自然人', '个体工商户', '企业商户'], // 商户类型
    passType: '11', // 通道类型
    MCIndex: null, // 商户种类 1-政府机构 2-国营企业 3-私营企业 4-外资企业 5-个体工商户 7-事业单位
    merchantClassList: ['政府机构', '国营企业', '私营企业', '外资企业', '个体工商户', '事业单位'], // 商户种类
    progress: 33.33,
    obtain2: false, // 验证银行卡是否合格
    obtain3: false,
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
    this.initData(options)
    ppevent.on('getCategory', this, function (res) {this.setData({...res})})
    ppevent.on('bankName', this, function (res) {
      if (this.data.bankName !== res.bankName) {
        res.bankBranchName = null
        this.setData(res)
      }
    })
    ppevent.on('bankBranchName', this, function (res) {this.setData(res)})
  },

  onUnload() {
    // 移除重提的缓存
    wx.removeStorageSync('RCData')
  },

  // 初始化数据
  initData(options) {
    const entryInfo = wx.getStorageSync('entryInfo')
    const configureName = `${entryInfo.merchantFullName}汇付银行通道${app.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')}`
    let RCData = wx.getStorageSync('RCData')
    let storage = wx.getStorageSync('entry')
    let url = options.resubmit > 0 ? 'agent_app_huifu_reset_configure' : 'agent_app_huifu_add_configure'
    let step = 1
    if (options.change > 0) { // 变更
      step = Number(options.change)
      url = options.change > 1 ? 'agent_app_huifu_modify_settlement' : 'agent_app_huifu_modify_rate'
    }
    // 当为普通进件，读取缓存
    storage = storage ? storage[`11${options.type}${options.resubmit}${options.change}${entryInfo.merchantCode}${entryInfo.storeNo}`] : null
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
    }
    this.setData({configureName, url, step, ...options, ...entryInfo, ...RCData})
    this.channelQuery()
  },

  onReady() {
    wx.setNavigationBarTitle({title: `${this.data.pattern === 'business' ? '商户' : '门店'}进件-汇付通道`})
  },

  // 格式化数据
  formatData(data, options, entryInfo) {
    const info = {
      ...data,
      hasData: true,
      passType: '11',
      type: options.type,
      fullNameCn: data.fullNameCn ? data.fullNameCn : entryInfo.merchantFullName,
      nameCn: data.nameCn ? data.nameCn : entryInfo.merchantName,
      MCIndex: data.merchantClass !== undefined ? data.merchantClass - 1 : null,
      forever1: data.businessDeadline === '2099-12-30' ? true : false,
      forever2: data.companyCorporationDeadline === '2099-12-30' ? true : false,
      forever3: data.certificateDeadline === '2099-12-30' ? true : false,
      areaAry: data.province ? {province: data.province, city: data.city, area: data.area} : null,
      areaAry2: data.bankProvince ? {subbranchProvince: data.bankProvince, subbranchCity: data.bankCity} : null,
      businessStartDate: data.businessStartDate === "NaN-aN-aN" ? null : data.businessStartDate,
      businessDeadline: data.businessDeadline === "NaN-aN-aN" ? null : data.businessDeadline,
      certificateStartDate: data.certificateStartDate === "NaN-aN-aN" ? null : data.certificateStartDate,
      certificateDeadline: data.certificateDeadline === "NaN-aN-aN" ? null : data.certificateDeadline,
      companyCorporationStartDate: data.companyCorporationStartDate === "NaN-aN-aN" ? null : data.companyCorporationStartDate,
      companyCorporationDeadline: data.companyCorporationDeadline === "NaN-aN-aN" ? null : data.companyCorporationDeadline,
    }
    if (data.certificateHolderType !== undefined && data.certificateHolderType !== null) {
      info.CHTIndex = Number(data.certificateHolderType) === 1 ? 0 : (Number(data.certificateHolderType) === 3 ? 1 : 2)
    }
    if (data.rmk3 !== undefined && data.rmk3 !== null) {
      info.rmk3Index = Number(data.rmk3) === 1 ? 0 : 1
    }
    if (data.merchantType !== undefined && data.merchantType !== null) {
      info.merchantType = Number(data.merchantType)
      info.MTIndex = Number(data.merchantType) - 1
      info.accountType = data.accountType !== undefined && data.accountType !== null ? Number(data.accountType) : (info.merchantType === 1 ? 1 : 0)
      info.legalFlag = data.legalFlag === undefined || data.legalFlag === null || data.legalFlag === '' ? 1 : Number(data.legalFlag)
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
    const params = {agentNo: app.common('agentNo'), passType: '11'}
    app.api('agent_app_ceb_list_query', params).then(res => {
      if (res && !res.apiError) {
        const list = []
        channel.detail = res
        res.forEach(item => {
          if (![535, 1144].includes(item.id)) {
            list.push(item.passName)
          }
        })
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

  // 改变省市区
  changePickers(e) {
    const type = e.currentTarget.dataset.type
    let detail = e.detail
    const data = this.data
    if (type === 'area') {
      detail.areaAry = {province: detail.province, city: detail.city, area: detail.area}
      detail.provinceId = detail.provinceId
    }
    if (type === 'bankArea') {
      detail = {
        bankProvince: detail.subbranchProvince,
        bankCity: detail.subbranchCity,
        bankProvinceId: detail.subbranchProvinceId,
        bankCityId: detail.subbranchCityId,
        areaAry2: {subbranchProvince: detail.subbranchProvince, city: detail.subbranchCity}
      }
      if (data.bankProvinceId !== detail.subbranchProvinceId) detail.bankBranchName = null
    }
    this.setData(detail)
  },

  // 修改日期
  changeDate(e) {
    const type = e.currentTarget.dataset.type
    const value = e.detail.value
    this.setData({[type]: value})
  },

  // 改变数据
  changeData(e) {
    const type = e.currentTarget.dataset.type
    const value = Number(e.detail.value)
    const data = this.data
    const obtain = `obtain${data.step}`
    let info = {[type]: value}
    switch(type) {
      case 'channel': // 通道
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
        info = null
        break
      case 'MCIndex': // 商户种类
        info.merchantClass = value + 1
        break
      case 'CHTIndex': // 法人证件类型
        info.certificateHolderType = info.CHTIndex === 0 ? 1 : (info.CHTIndex === 1 ? 3 : 9)
        break
      case 'rmk3Index': // 结算人证件类型
        info.rmk3 = info.rmk3Index === 0 ? 1 : 3
        break
      case 'MTIndex': // 商户类型
        info.merchantType = value + 1
        if (data.MTIndex === null) { // 当商户类型第一次选择时，将结算人类型变为法人，账户类型，自然人变成个人，其他的变为企业
          info.legalFlag = 1
          info.accountType = value === 0 ? 1 : 0
        } else { // 当商户类型变化时
          if (data.MTIndex !== value) { // 如果值发生了变动
            if (data.MTIndex === 0 && value > 0) info.accountType = 0 // 商户类型由自然人变为其他，将账户类型变为企业
            if (data.MTIndex > 0 && value === 0) { // 商户类型由其他变为自然人，将账户类型变为个人，结算人类型变为法人
              info.accountType = 1
              info.legalFlag = 1
            }
            if ((data.MTIndex < 2 && value === 2) || (data.MTIndex === 2 && value < 2)) {
              info.businessCategory = null
              info.businessCategoryName = null
            }
          }
        }
        break
      case 'accountType': // 账户类型
        if (data.accountType !== value) {
          if (value === 0) {
            info.accountHolder = data.fullNameCn
            info.legalFlag = 1
          } else {
            info.accountHolder = null
          }
        }
        break
      case 'forever1': // 营业执照有效期
        info = {
          forever1: value,
          businessDeadline: value ? '2099-12-30' : null,
        }
        this.setData(info)
        break
      case 'forever2': // 身份证有效期
        info = {
          forever2: value,
          companyCorporationDeadline: value ? '2099-12-30' : null,
        }
        this.setData(info)
        break
      case 'forever3': // 结算人证件有效期
        info = {
          forever3: value,
          certificateDeadline: value ? '2099-12-30' : null,
        }
        this.setData(info)
        break
      case 'idCard': // 校验身份证
        const cardNo = e.detail.value
        const params = {cardNo}
        if (cardNo) {
          this.setData({[obtain]: false})
          app.api("agent_app_check_card_no", params).then(res => {
            if (res && !res.apiError) this.setData({certificateHolderNo: cardNo, [obtain]: true})
          })
        } else {
          this.setData({[obtain]: false, certificateHolderNo: null})
        }
        break
      default: null
    }
    this.setData(info)
  },

  // 跳转到银行列表
  toBankList() {
    wx.navigateTo({url: `../../bankList/bankList?passType=11`})
  },

  // 跳转到获取开户支行
  toBankBranchList() {
    const {bankName, bankProvinceId, bankCityId} = this.data
    if (!bankName) {
      app.showToast('请先选择开户银行')
      return
    }
    if (!bankProvinceId) {
      app.showToast('请先选择开户支行所属地区')
      return
    }
    wx.navigateTo({url: `../../bankBranchList/bankBranchList?bankName=${bankName}&subbranchProvince=${bankProvinceId}&subbranchCity=${bankCityId}&passType=11`})
  },

  // 跳转
  linkTo(e) {
    const {type, url} = e.currentTarget.dataset
    if (type === 'category' && this.data.MTIndex === null) {
      app.showToast('请选择商户类型')
      return
    }
    wx.navigateTo({url})
  },

   // 上传图片
   uploadImg(e) {
     console.log(e.currentTarget.dataset)
    const {name, othername, type, ocr} = e.currentTarget.dataset
    const {step, accountType, merchantType} = this.data
    const data = {
      service: 'front.channel.upload',
      passType: '11',
      type,
      ocr
    }
    upload(data, (res) => {
      let info = {}
      if (ocr && res.ocrData) {
        switch (ocr) {
          case 'BUSINESS_LICENSE':
            let start = res.ocrData.establish_date
            let end = res.ocrData.expiryDate
            end = end === '29991231' ? '20991230' : end
            info = {
              businessLicenseNo: res.ocrData.number,
              fullNameCn: res.ocrData.entName,
              businessStartDate: start ? `${start.slice(0, 4)}-${start.slice(4, 6)}-${start.slice(6, 8)}` : null,
              businessDeadline: end ? `${end.slice(0, 4)}-${end.slice(4, 6)}-${end.slice(6, 8)}` : null,
              forever1: end === '20991230' ? true : false,
            }
            if (accountType === 0) info.accountHolder = res.ocrData.entName
            break
          case 'IDCARD':
            const obtain = `obtain${step}`
            if (res.ocrData.number) {
              const params = {cardNo: res.ocrData.number}
              app.api("agent_app_check_card_no", params).then(res2 => {
                if (!res2.apiError) {
                  if (type === '06') {
                    info = {
                      companyCorporation: res.ocrData.name,
                      certificateHolderNo: res.ocrData.number,
                    }
                  } else if (type === '08') {
                    if (merchantType === 1) {
                      info = {certificateHolderNo: res.ocrData.number}
                    } else {
                      info = {legalFlagCardNo: res.ocrData.number}
                    }
                  }
                  this.setData({[obtain]: true, ...info})
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
      this.setData({[name]: res.liantuo_picture, [othername]: res.channel_picture, ...info})
    })
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
    let oldStorage = allStorage[`11${data.type}${data.resubmit}${data.change}${data.merchantCode}${data.storeNo}`] || {}
    const storage = Object.assign({}, oldStorage, entry, {obtain2: data.obtain2, obtain3: data.obtain3})
    storage.step = data.step
    storage[`step${data.step}`] = entry
    allStorage[`11${data.type}${data.resubmit}${data.change}${data.merchantCode}${data.storeNo}`] = storage
    wx.setStorageSync('entry', allStorage)
    // 提交
    const adopt = type === 'next' || type === 'submit' ? app.validate(obj) : false
    if (type === 'last') { // 上一步
      wx.pageScrollTo({scrollTop: 0, duration: 0})
      this.setData({step: --data.step, progress: (data.progress - 33.33), ...entry, ...info})
    } else if (type === 'save') {
      app.showToast('已保存当前填写内容')
    } else if (type === 'next' && adopt) { // 下一步
      if (data.step === 2) {
        if (data.accountType === 0) {
          info.accountHolder = input.fullNameCn
        }
      }
      wx.pageScrollTo({scrollTop: 0, duration: 0})
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
          allStorage[`11${data.type}${data.resubmit}${data.change}${data.merchantCode}${data.storeNo}`] = null
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