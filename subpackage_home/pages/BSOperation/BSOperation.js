const app = getApp()
import ppevent from '../../../utils/ppevent'

Page({
  data: {
    step: 1, // 当前进度
    progress: 50, // 当前进度条进度
    themeColor: '#5177BE',
    info: {}, // 第一步的内容
    merchantCode: '', // 创建门店的商户编号
    goOn: false, // 是否继续下一步
    businessHours: [], // 营业时间
    businessHoursShow: [], // 显示营业时间的列表
    employee: null, // 被选中员工的索引
    employeeList: [], // 去重后的员工列表
    businessSn: null, // 商户激活码
    storeSn: null, // 门店激活码
    activationCode: null, // 编辑时激活码
    BActiveFail: false, // 创建单店是，商户是否激活失败
    popShow: false,
    latitude: '', // 编辑时的纬度坐标
    longitude: '', // 编辑时的经度坐标
    tradeType: null,
  },

  onLoad(options) {
    this.initData(options)
    ppevent.on('businessHours', this, function (res) {
      const businessHoursShow = this.getBusinessHoursShow(res)
      this.setData({businessHours: res, businessHoursShow})
    })
  },

  // 初始化数据
  initData(options) {
    const BSType = options.pattern === 'store' ? '门店' : '商户'
    const themeColor = '#5177BE'
    const _that = this
    let isReturn = {}
    let bsInfo = {}
    let editInfo = {}
    let employeeId = null
    let title = ''
    let url = ''
    let businessHoursShow = []
    let areaAry = null
    let tradeAry = null
    let canChangeProduct = wx.getStorageSync('canChangeProduct')
    let productName = null
    let productId = null
    if (options.operation === 'create') { // 获取创建需要的数据
      isReturn = wx.getStorageSync('return')
      bsInfo = wx.getStorageSync('bsInfo')
      if (options.pattern === 'store') {
        title = '添加门店'
        url = 'agent_app_add_store'
      } else {
        title = options.pattern === 'chain' ? '添加商户-连锁模式' : '添加商户-单店模式'
        url = options.pattern === 'chain' ? 'agent_app_add_merchant' : 'agent_app_add_merchant_single'
      }
      if (!canChangeProduct) { // 如果没有创建编辑商户门店版本的权限
        const productList = wx.getStorageSync('product')
        productName = '联拓富基础版'
        productList.forEach(item => {
          if (item.productName === productName) productId = item.productId
        })
      } else {
        if (options.pattern === 'store') {
          this.getBusinessDetail(bsInfo.merchantCode)
        }
      }
    } else { // 获取编辑需要的数据
      editInfo = wx.getStorageSync('edit')
      employeeId = options.pattern === 'store' ? editInfo.salesmanNo : editInfo.salesmanId
      if (options.pattern === 'business') {
        title = '编辑商户'
        url = 'agent_app_modify_merchant'
      } else {
        title = '编辑门店'
        url = 'agent_app_modify_store'
      }
      areaAry = {province: editInfo.province, city: editInfo.city, area: editInfo.area}
      if (editInfo.tradeTypeName) {
        const tradeTypeName = editInfo.tradeTypeName.split(',')
        tradeAry = {trade: tradeTypeName[0], category: tradeTypeName[1]}
      }
      // 当版本属于高级版且激活码有效期已经到期
      if (['联拓富高级版', '联拓富一卡通版', '餐饮营销版'].includes(editInfo.productName) && editInfo.merchantEndTime <= new Date().getTime()) {
        // 激活码时间较长，到期逻辑未定
      } else { // 版本非高级版或激活码在有效期内
        editInfo.merchantEndTime = app.formatDate(editInfo.merchantEndTime, 'yyyy-MM-dd hh:mm:ss')
      }
      // 获取显示的营业时间
      if (editInfo.businessHours) {
        editInfo.businessHours = JSON.parse(editInfo.businessHours)
        businessHoursShow = this.getBusinessHoursShow(editInfo.businessHours)
      }
    }
    wx.getStorage({
      key: 'employee',
      success(res) {
        let employee = null
        if (options.operation === 'edit') {
          res.data.forEach((item, index) => {
            if (item.salesmanLoginName === employeeId) employee = index
          })
        }
        _that.setData({employeeList: res.data, employee})
      }
    })
    const initData = {themeColor, businessHoursShow, isReturn, BSType, url, editInfo, areaAry, tradeAry, productId, productName, canChangeProduct, ...editInfo, ...options}
    options.pattern === 'store' ? Object.assign(initData, bsInfo) : null
    this.setData(initData)
    wx.setNavigationBarTitle({title})
  },

  onUnload() {
    if (this.data.isReturn === 'true' && !this.data.goOn && this.data.operation === 'create') {
      wx.setStorageSync('return', "false")
      wx.reLaunch({url: '/pages/homePage/homePage'})
    }
  },

  // 获取详情
  getBusinessDetail(merchantCode) {
    const params = {
      merchantCode,
      agentNo: app.common('agentNo')
    }
    app.api('agent_app_merchant_details', params).then(res => {
      if (res && !res.apiError) {
        if (['联拓富高级版', '联拓富一卡通版', '餐饮营销版'].includes(res.productName)) {
          this.getSn(res.productId)
        }
        this.setData({productName: res.productName, productId: res.productId})
      }
    })
  },

  // 获取未使用的sn码 version为获取sn的产品编号 type为获取sn码的主题性质，商户或门店
  getSn(version) {
    const params = {
      agent_no: app.common('agentNo'),
      version,
      count: 100,
      type: 2
    }
    app.api3('devicesn.query', params).then(res => {
      if (res && !res.apiError) {
        let code = res.device_sns.length === 0 ? '' : res.device_sns[0]
        code === '' ? app.showToast('未获取到门店激活码，请手动填写') : null
        this.setData({storeSn: code})
      }
    })
  },

  // 获取坐标
  getMap() {
    const {merchantLongitude, merchantLatitude} = this.data
    if (merchantLatitude === '') {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          app.getPermission(this, res.latitude, res.longitude)
        }
      })
    } else {
      app.getPermission(this, merchantLatitude, merchantLongitude)
    }
  },

  // 选择营业时间
  seleceTime() {
    const {businessHours} = this.data
    wx.setStorageSync('businessHours', businessHours)
    wx.navigateTo({url: `../business_hours/business_hours`})
  },

  // 获取营业时间选择列表
  getBusinessHoursShow (businessHours) {
    const weekList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    const businessHoursShow = []
    businessHours.forEach(item => {
      let date = ''
      switch(item.weekFlag) {
        case 0:
          date = '周一至周五'
          break
        case 1:
          date = '每天'
          break
        case 2:
          date = '自定义 '
          break
        default: date = ''
      }
      if (item.weekFlag === 2) {
        item.weeks.forEach(item2 => {
          weekList.forEach((item3, index) => {
            if (item2 === (index + 1)) {
              date += `${item3}，`
            }
          })
        })
        date = date.slice(0, date.length - 1)
      }
      businessHoursShow.push(`${date} ${item.times[0].startTime}-${item.times[0].endTime}`)
    })
    return businessHoursShow
  },

  // 改版本
  changePop(e) {
    if (this.data.operation === 'create' && this.data.pattern === 'store') return
    if (e.currentTarget.dataset.type === 'product') {
      if (!this.data.canChangeProduct) {
        app.showToast("您没有权限修改版本")
        return
      }
      this.setData({popShow: true})
    } else {
      this.setData(e.detail)
    }
  },

  // 改变版本信息
  getProductInfo(e) {
    const editInfo = this.data.editInfo
    Object.assign(editInfo, e.detail)
    this.setData({editInfo, ...e.detail})
  },

  // 改变封装好的picker组件
  changePickers(e) {
    const info = e.detail
    if (e.detail.tradeId) {
      info.tradeType = `${e.detail.tradeId},${e.detail.categoryId}`
      info.tradeTypeName = `${e.detail.trade},${e.detail.category}`
    }
    this.setData(info)
  },

  chooseEmployee(e) {
    this.setData({employee: e.detail.value})
  },

  // 查询激活码是否可用
  checkSn(activationCode) {
    return app.api4('api/activationCodeQuery', {activationCode})
  },

  // 跳转到成功页面
  toOperationSuccess() {
    wx.redirectTo({url: `../operationSuccess/operationSuccess?pattern=${this.data.pattern}`})
  },

  // 创建时绑定激活码 nature 1 商户(连锁、单店) 2 门店
  createSetSn(info, nature = 0) {
    let {BActiveName, productList, productName, businessSn, storeSn, pattern, merchantCode, BActiveFail} = this.data
    const statusList = ['联拓富基础版', '联拓富高级版', '联拓富一卡通版', '餐饮基础版', '餐饮营销版']
    let isAdvance = ['联拓富高级版', '联拓富一卡通版', '餐饮营销版'].includes(productName) // 当前切换的版本是否属于高级的版本
    const params = {
      status: statusList.indexOf(productName),
      superMerchantCode: pattern === 'store' ? merchantCode : info.merchantCode,
      merchantCode: nature === 1 ? info.merchantCode : info.storeCode,
    }
    if (BActiveFail) { // 单店模式创建商户失败，改为基础版，版本选择为相应基础版
      isAdvance = false
      params.status = statusList.indexOf(BActiveName)
    }
    if (isAdvance) params.activationCode = nature === 1 ? businessSn : storeSn
    app.api4('api/openVersion', params).then(res => {
      if (res && !res.apiError) {
        if (nature === 1) { // 创建的是商户
          if (pattern === 'single') {
            this.createSetSn(info, 2)
          } else {
            this.toOperationSuccess()
          }
        } else if (nature === 2) { // 创建的是门店
          if (BActiveFail) { // 单店模式创建商户失败，改变cc的版本
            this.changeProduct(info.storeCode, 2).then(() => {
              app.showToast('商户激活失败，门店激活码未使用，产品版本改为基础版')
              let timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
                this.toOperationSuccess()
              }, 2000)
            })
          } else {
            this.toOperationSuccess()
          }
        }
      } else {
        // 商户高版本激活失败，切换为基础版
        this.changeProduct(info.merchantCode, 1).then(() => {
          if (pattern === 'single') { // 创建单店，商户激活失败时，门店改为基础版
            let BActiveName = null
            productList.forEach(item => {
              if (['联拓富高级版', '联拓富一卡通版'].includes(productName) && item.productName === '联拓富基础版') BActiveName = '联拓富基础版'
              if (productName === '餐饮营销版' && item.productName === '餐饮基础版') BActiveName = '餐饮基础版'
            })
            this.setData({BActiveName, BActiveFail: true})
            this.createSetSn(info, 2)
          } else {
            app.showToast(nature === 1 ? '商户激活失败，产品版本改为基础版' : '，门店激活失败，产品版本改为基础版')
            let timer = setTimeout(() => {
              clearTimeout(timer)
              timer = null
              this.toOperationSuccess()
            }, 2000)
          }
        })
      }
    })
  },

  // 变更商户/门店产品版本 nature 1 商户 2 门店
  changeProduct(code, nature = 0) {
    const {productList, productName, productId} = this.data
    const params = {currentProductId: productId}
    // 当创建失败时，联拓富高级版和一卡通版变为联拓富基础版，餐饮营销版变为餐饮基础版
    productList.forEach(item => {
      if (['联拓富高级版', '联拓富一卡通版'].includes(productName) && item.productName === '联拓富基础版') params.productId = item.productId
      if (productName === '餐饮营销版' && item.productName === '餐饮基础版') params.productId = item.productId
    })
    nature === 1 ? params.merchantCode = code : params.storeCode = code
    return app.api('agent_app_mod_product_open', params)
  },

  // step1
  operation1(e) {
    const data = this.data
    const input = e.detail.value
    const isStore = data.pattern === 'store' ? true : false
    let businessSn = null
    let storeSn = null
    if (data.operation === 'create') {
      businessSn = input.businessSn
      storeSn = input.storeSn
      if (businessSn === '' || businessSn === null) {
        app.showToast('请输入商户激活码')
        return
      }
      if (storeSn === '' || storeSn === null) {
        app.showToast('请输入门店激活码')
        return
      }
    } else {
      if (data.activationCode && (input.activationCode === '' || input.activationCode === null)) {
        app.showToast(`请填写${data.BSType}激活码`)
        return
      }
    }
    console.log(input.contactPhone,"输入的手机号")
    const info = {
      merchantFullName: {value: isStore ? data.merchantFullName : input.merchantFullName, type: isStore ? null : ['word', 'number'], tip: isStore ? null : ['请输入商户全称', '商户全称只支持汉字、字母、数字和中英文括号，不支持特殊字符', '商户全称不能全为数字']},
      merchantName: {value: isStore ? data.merchantName : input.merchantName, type: isStore ? null : ['word', 'number'], tip: isStore ? null : ['请输入商户简称', '商户简称只支持汉字、字母、数字和中英文括号，不支持特殊字符', '商户简称不能全为数字']},
      storeFullName: isStore ? {value: input.merchantFullName, type: ['word', 'number'], tip: ['请输入门店全称', '门店全称只支持汉字、字母、数字和中英文括号，不支持特殊字符', '门店全称不能全为数字']} : null,
      storeName: isStore ? {value: input.merchantName, type: ['word', 'number'], tip: ['请输入门店简称', '门店简称只支持汉字、字母、数字和中英文括号，不支持特殊字符', '门店简称不能全为数字']} : null,
      province: {value: data.province, type: null, tip: [`请选择${data.BSType}所在地区`]},
      provinceNo: {value: `${data.provinceId}`.replace('0000', ''), type: null, tip: null},
      city: {value: data.city, type: null, tip: null},
      cityNo: {value: data.cityId, type: null, tip: null},
      area: {value: data.area, type: null, tip: null},
      areaNo: {value: data.areaId, type: null, tip: null},
      address: {value: input.address, type: ['address'], tip: [`请输入${data.BSType}详细地址`, `${data.BSType}详细地址只支持汉字、字母、数字和中英文括号、逗号、顿号和横竖线，不支持特殊字符`]},
      merchantLongitude: {value: data.merchantLongitude, type: null, tip: null},
      merchantLatitude: {value: data.merchantLatitude, type: null, tip: null},
      businessHours: {value: Number(data.businessHours) === 0 ? null : JSON.stringify(data.businessHours), type: null, tip: ['请选择营业时间']},
      contactName: {value: input.contactName, type: ['chinese'], tip: ['请输入联系人姓名', '联系人只支持中文']},
      contactPhone: {value: input.contactPhone, type: ['phone', 'phone2'], tip: ['请输入联系人手机号', '联系人手机号格式不正确', '不支持该联系人手机号的号段，请重新填写']},
      contactEmail: {value: input.contactEmail, type: ['email'], tip: ['', '联系人邮箱格式不正确']},
      salesmanName: {value: data.employee !== null ? data.employeeList[data.employee].salesmanName : null, type: null, tip: ['请选择业务员']},
      salesmanNo: {value: data.employee !== null ? data.employeeList[data.employee].salesmanLoginName : null, type: null, tip: null},
      productNo: {value: data.productId, type: null, tip: ['请选择商户产品版本']},
      merchantCode: {value: isStore || data.operation === 'edit' ? data.merchantCode : null, type: null, tip: null},
      agentNo: {value: app.common('agentNo'), type: null, tip: null}
    }
    console.log('1111')
    if (data.pattern !== 'store') {
      info.tradeType = {value: data.tradeType, type: null, tip: [`请选择${data.BSType}所属行业`]}
      info.tradeTypeName = {value: data.tradeTypeName, type: null, tip: null}
    }
    let otherInfo = {}
    if (data.operation === 'edit') {
      otherInfo = {
        agentMerchantRelationId: {value: isStore ? null : data.agentMerchantRelationId, type: null, tip: null},
        agentMerchantRelationNo: {value: isStore ? null : data.agentMerchantRelationId, type: null, tip: null},
        storeCode: {value: isStore ? data.storeCode : null, type: null, tip: null},
        loginName: {value: data.loginName, type: null, tip: null},
      }
    }
    Object.assign(info, otherInfo)
    const adopt = app.validate(info)
    if (adopt) {
      let info1 = {}
      for (let attr in info) {
        if (info[attr]) {
          info[attr].value ? info1[attr] = info[attr].value : null
        }
      }
      if (data.operation === 'create') {
        let bsInfo
        if (data.pattern !== 'store') {
          bsInfo = {
            merchantFullName: info1.merchantFullName,
            merchantName: info1.merchantName,
            salesmanNo: info1.salesmanNo,
            salesmanName: info1.salesmanName,
          }
        } else {
          bsInfo = {...wx.getStorageSync('bsInfo'), storeFullName: info1.storeFullName, storeName: info1.storeName}
        }
        wx.setStorageSync('bsInfo', bsInfo)
        if (businessSn || storeSn) {
          const checkSnList = []
          if (['chain', 'single'].includes(data.pattern)) checkSnList.push(this.checkSn(businessSn))
          if (['store', 'single'].includes(data.pattern)) checkSnList.push(this.checkSn(storeSn))
          Promise.all(checkSnList).then(res => {
            let pass = true
            let tip = ''
            res.forEach((item, index) => {
              if (item.code === 'F' || item.activationCodeStatus === 1) {
                switch(data.pattern) {
                  case 'chain':
                    tip = '商户'
                    break
                  case 'store':
                    tip = '门店'
                    break
                  case 'single':
                    tip = index === 0 ? '商户' : tip === '' ? '门店' : `${tip}、门店`
                    break
                  default: tip = ''
                }
                pass = false
              }
            })
            if (pass) {
              businessSn = businessSn === undefined ? null : businessSn
              storeSn = storeSn === undefined ? null : storeSn
              this.setData({step: ++data.step, info: info1, businessSn, storeSn,  progress: 100})
            } else {
              tip = `${tip}激活码无法使用`
              app.showToast(tip)
            }
          })
        } else {
          this.setData({step: ++data.step, info: info1,  progress: 100})
        }
      } else {
        app.api(data.url, info1).then((res) => {
          if (res && !res.apiError) {
            wx.navigateBack({delta: 1})
            app.showToast(`${data.BSType}信息变更成功`)
          }
        })
      }
    }
  },

  // 创建
  operation2(e) {
    const data = this.data
    const params = data.info
    const login = e.detail.value
    this.setData({goOn: true})
    if (login.loginName) {
      if (!/^[0-9a-zA-Z]{6,30}$/.test(login.loginName)) {
        app.showToast('登录名由6-30位大小写英文字母和数字组成')
        return
      }
      params.loginName = login.loginName
    }
    // 校验密码
    if (!login.loginPwd && login.repeat) {
      app.showToast('请输入密码')
      return
    }
    // 是否填写有密码
    if (login.loginPwd) {
      if (!/^[0-9a-zA-Z]{6,12}$/.test(login.loginPwd)) {
        app.showToast('请输入6-12位数字、字母，支持大小写')
        return
      }
      if (!login.repeat) {
        app.showToast('请输入确认密码')
        return
      } else if (login.repeat && login.loginPwd !== login.repeat) {
        app.showToast('两次输入的密码不一致')
        return
      }
      params.loginPwd = login.loginPwd
      params.loginConfirmPwd = login.repeat
    }
    // 验证账号是否已使用
    app.api('cc_valid_login_name', {loginName: params.loginName ? params.loginName : params.contactPhone}).then(res => {
      if (res && !res.apiError) {
        // 添加商户或门店
        app.api(data.url, params).then(res2 => {
          if (!res2.apiError) {
            wx.setStorageSync('successInfo', res2)
            let nature = data.pattern === 'store' ? 2 : 1
            this.createSetSn(res2, nature)
          }
        })
      }
    })
  }
})