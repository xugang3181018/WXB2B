const app = getApp()

Component({
  properties: { // 传输进来的属性
    show: { // 是否显示radio窗口
      type: Boolean,
      value: false
    },
    pattern: { // 商户或门店
      type: String,
      value: 'business'
    },
    operation: { // 创建还是编辑
      type: String,
      value: null
    },
    editInfo: {
      type: Object,
      value: {}
    },
    merchantCode: {
      type: String,
      value: null
    },
  },

  // 组件的内部数据
  data: {
    productNameList1: ['联拓富基础版', '联拓富高级版', '联拓富一卡通版', '餐饮基础版', '餐饮营销版'], // 全部产品名称列表
    productNameList2: ['联拓富基础版', '联拓富高级版', '餐饮基础版', '餐饮营销版'], // 除一卡通的产品列表
    productNameList3: ['联拓富高级版', '联拓富一卡通版', '餐饮营销版'], // 高级产品名称列表
    productNameList4: ['联拓富高级版', '餐饮营销版'], // 高级版
    productNameList5: ['联拓富基础版', '餐饮基础版'], // 基础版
    marketingList:['支付营销版', '专业营销版', '连锁营销版'], // 营销列表
    productList: [], // 可开通的产品版本列表
    productNameList: [], // 可开通的产品名列表
    activated: [], // 编辑时已激活列表
    productId: null, // 产品版本id
    currentProductId: null, // 改版前的产品版本id
    product: null, // 当前选中产品版本的索引
    popShow: false, // 是否显示radio窗口
    modalShow: false, // 显示有侧边栏
  },

  // 监听器
  observers: {
    show(value) {
      if (value) {
        const {pattern} = this.data
        const BSType = this.data.pattern === 'business' ? '商户' : '门店'
        this.setData({BSType, ...this.data.editInfo})
        if (this.data.editInfo.productName === '联拓富一卡通版' && pattern === 'business') {
          app.showToast("当前版本激活码到期前，商户无法切换到低级版本")
          this.triggerEvent('changePop', {popShow: false})
        } else {
          const _that = this
          wx.getStorage({
            key: 'product',
            success(res) {_that.getProductList(res.data)}
          })
        }
      }
    }
  },

  methods: {
    // 获取可开通产品版本列表，通过当前代理商能开通的产品版本列表和小程序最多能开通的五个产品版本的列表筛选出来
    getProductList(allProductList) {
      let {
        productNameList1, productNameList2, productNameList4, productNameList5, merchantCode, pattern, product
      } = this.data
      const productList = []
      const productNameList = []
      if (pattern !== 'store') { // chain single business
        allProductList.forEach(item => {
          if (productNameList1.includes(item.productName)) {
            productList.push(item)
          }
        })
        this.productOperation(productList, productNameList, product)
      } else { // 当为门店时，查询门店所在商户使用的版本，确定门店可选版本的范围
        const params = {merchantCode, agentNo: app.common('agentNo')}
        app.api('agent_app_merchant_details', params).then(res => {
          if (res && !res.apiError) {
            if (res.productName === '联拓富一卡通版') { // 当商户为一卡通版，门店可选择所有可开通的版本
              allProductList.forEach(item => {
                if (productNameList1.includes(item.productName)) {
                  productList.push(item)
                }
              })
            } else if (productNameList4.includes(res.productName)) { // 当为两个高级版时，门店可选择除一卡通以外的可选版本
              allProductList.forEach(item => {
                if (productNameList2.includes(item.productName)) {
                  productList.push(item)
                }
              })
            } else { // 当为两个基础版时，门店只可以选择两个基础版
              allProductList.forEach(item => {
                if (productNameList5.includes(item.productName)) {
                  productList.push(item)
                }
              })
            }
            this.productOperation(productList, productNameList, product)
          }
        })
      }
    },

    // 根据不同操作获取产品版本列表
    productOperation(productList, productNameList, product) {
      const {operation, productId} = this.data
      // 获取当前版本的索引、可开通版本名称列表
      productList.forEach((item, index) => {
        if (item.productId === productId) product = index
        productNameList.push(item.productName)
      })
      if (operation === 'edit') {
        this.editProduct(productList, productNameList, product)
      } else {
        this.triggerEvent('onChange', {productList})
        this.setData({productList, productNameList, popShow: true})
      }
    },

     // 当编辑时产品列表发生变化
    editProduct(productList, productNameList, product) {
      let {
        productName, productNameList3, productNameList4, productNameList5, codeList, merchantEndTime
      } = this.data
      const activated = []
      // 获取已开通版本
      productNameList.forEach(item => { // 获取已开通的基础版
        if (productNameList5.includes(item)) activated.push(item)
      })
      // 根据返回的激活码列表，判断是否开通过高级版和一卡通版
      codeList.forEach(item => {
        if (item.merchantVer === '专业营销版') { // 获取已开通的高级版
          productNameList.forEach(item => {
            if (productNameList4.includes(item)) activated.push(item)
          })
        }
        if (item.merchantVer === '连锁营销版') activated.push('联拓富一卡通版') // 获取一卡通版
      })
      // 非基础版激活码过期，将版本降低为基础版
      if (productNameList3.includes(productName) && merchantEndTime <= new Date().getTime()) {
        if (['联拓富高级版', '联拓富一卡通版'].includes(productName)) productName = '联拓富基础版'
        if (productName === '餐饮营销版') productName = '餐饮基础版'
        productNameList.forEach((item, index) => {
          if (item.productName === productName) product = index
        })
        currentProductId = productList[index].productId
        this.setData({productName, currentProductId, product})
        this.editSetSn(false)
      }
      this.setData({productList, productNameList, activated, product, popShow: true})
    },

    // 切换业务员或版本
    radioChange(e) {
      let {
        productList, productNameList3, productNameList4, productNameList5, codeList, activated, productName, productId, product, pattern, operation
      } = this.data
      const value = Number(e.currentTarget.dataset.product)
      const newProductName = productList[value].productName
      const newProductId = productList[value].productId
      let notGetSn = true // 是否直接调用改变版本接口
      let info = {
        product: value,
        productName: newProductName,
        productId: newProductId,
        popShow: false
      }
      this.triggerEvent('popShow', {popShow: false})
      if (operation === 'create') { // 创建
        if (productNameList3.includes(newProductName)) { // 如果选择的是三个高级版本
          switch(pattern) {
            case 'chain':
              this.getSn(info, 1)
              break
            case 'single':
              this.getSn(info, 1)
              this.getSn(info, 2)
              break
            case 'store':
              this.getSn(info, 2)
              break
            default: null
          }
        } else {
          info['businessSn'] = null
          info['storeSn'] = null
          this.triggerEvent('onChange', info)
          this.setData(info)
        }
      } else { // 编辑
        if (pattern === 'business') { // 商户一旦开通更高级的版本不能切换到低级版本
          if (productNameList4.includes(productName)) {
            if (newProductName === '联拓富一卡通版') { // 高级切一卡通
              notGetSn = false
            } else if (productNameList5.includes(newProductName)) { // 高级切基础
              app.showToast("当前版本激活码到期前，商户无法切换到低级版本")
              this.setData({product})
              return
            }
          } else {
            if (productNameList3.includes(newProductName)) { // 基础切相比高级的版本
              notGetSn = false
            }
          }
        } else { // 门店版本可以自由切换
          if (productName === '联拓富一卡通版') {
            if (productNameList4.includes(newProductName)) { // 一卡通切高级
              if (activated.includes(newProductName)) {
                codeList.forEach(item => {
                  if (item.merchantVer === '专业营销版') info.activationCode = item.activationCode
                })
              } else {
                notGetSn = false
              }
            } else { // 一卡通切基础
              info.activationCode = null
            }
          } else if (productNameList4.includes(productName)) {
            if (newProductName === '联拓富一卡通版') { // 高级切一卡通
              if (activated.includes(newProductName)) {
                codeList.forEach(item => {
                  if (item.merchantVer === '连锁营销版') info.activationCode = item.activationCode
                })
              } else {
                notGetSn = false
              }
            } else if (productNameList4.includes(newProductName)) { // 高级和营销版互相切换
              codeList.forEach(item => {
                if (item.merchantVer === '专业营销版') info.activationCode = item.activationCode
              })
            } else { // 高级切基础
              info.activationCode = null
            }
          } else {
            if (newProductName === '联拓富一卡通版') { // 基础切一卡通
              if (activated.includes(newProductName)) {
                codeList.forEach(item => {
                  if (item.merchantVer === '连锁营销版') info.activationCode = item.activationCode
                })
              } else {
                notGetSn = false
              }
            } else if (productNameList4.includes(newProductName)) { // 基础切高级
              if (activated.includes(newProductName)) {
                codeList.forEach(item => {
                  if (item.merchantVer === '专业营销版') info.activationCode = item.activationCode
                })
              } else {
                notGetSn = false
              }
            }
          }
        }
        const otherInfo = {
          currentProductId: productId,
          product: value,
        }
        Object.assign(info, otherInfo)
        if (notGetSn) {
          this.setData(info)
          this.editSetSn(false)
        } else {
          const type = pattern === 'business' ? 1 : 2
          this.getSn(info, type)
        }
      }
    },

    // 获取未使用的sn码 version为获取sn的产品编号 type为获取sn码的主题性质，商户或门店
    getSn(info, type) {
      const {
        operation, BSType, productNameList5
      } = this.data
      const params = {
        agent_no: app.common('agentNo'),
        version: info.productId,
        count: 100,
        type
      }
      app.api3('devicesn.query', params).then(res => {
        if (res && !res.apiError) {
          let code = res.device_sns.length === 0 ? '' : res.device_sns[0]
          if (productNameList5.includes(info.productName)) code = null
          code === '' ? app.showToast(`未获取到${BSType}激活码，请手动填写`) : null
          if (operation === 'edit') {
            info.modalShow = true
            info.activationCode = code
            this.setData(info)
          } else {
            const snType = type === 1 ? 'businessSn' : 'storeSn'
            info[snType] = code
            this.triggerEvent("onChange", info)
            this.setData(info)
          }
        }
      })
    },

    // 关闭弹窗
    close(e) {
      const type = e ? e.currentTarget.dataset.type : null
      const {activationCode, BSType} = this.data
      switch (type) {
        case 'edit':
          this.checkSn(activationCode).then(res => {
            if (res && !res.apiError || res.activationCodeStatus === 1) {
              this.editSetSn(true)
            } else {
              app.showToast(`${BSType}激活码无法使用`)
            }
          })
          break
        case 'modal':
          app.showToast('已取消')
          this.triggerEvent('changePop', {popShow: false})
          this.setData({modalShow: false, popShow: false})
          break
        case 'popup':
          this.triggerEvent('changePop', {popShow: false})
          this.setData({popShow: false})
          break
        default:
          break
      }
    },

    // 查询激活码是否可用
    checkSn(activationCode) {
      return app.api4('api/activationCodeQuery', {activationCode})
    },

    // 编辑时绑定sn码 activeSn 是否填写激活码 false 不填 true 填写
    editSetSn(activeSn) {
      let {
        pattern, productNameList, productNameList1, productNameList4, merchantCode, storeCode, BSType, codeList, activated, productId, productName, activationCode, currentProductId
      } = this.data
      if (productId === currentProductId) {
        app.showToast('当前版本已激活，请选择其他版本')
        return
      }
      const params = {
        status: productNameList1.indexOf(productName),
        superMerchantCode: merchantCode,
        merchantCode: pattern === 'business' ? merchantCode : storeCode
      }
      activeSn ? params.activationCode = activationCode : null
      app.api4('api/openVersion', params).then(res => {
        if (res && !res.apiError) {
          const params2 = {
            productId,
            currentProductId,
          }
          pattern === 'store' ? params2.storeCode = storeCode : params2.merchantCode = merchantCode
          app.api('agent_app_mod_product_open', params2).then(res2 => {
            // if (!res2.apiError) {
              let merchantVer = ''
              if (activeSn) {
                if (productNameList4.includes(productName)) {
                  merchantVer = '专业营销版'
                  productNameList.forEach(item => {
                    if (item === '联拓富高级版' || item === '餐饮营销版') activated.push(item)
                  })
                } else {
                  merchantVer = '连锁营销版'
                  activated.push(productName)
                }
                const newProduct = {
                  merchantEndTime: res.merchantEndTime,
                  merchantVer,
                  activationCode
                }
                codeList.push(newProduct)
              }
              this.triggerEvent('onChange', {merchantEndTime: res.merchantEndTime, productName, productId, activationCode, codeList, popShow: false})
              this.setData({modalShow: false, popShow: false})
              app.showToast(`${BSType}版本变更成功`)
            // }
          })
        }
      })
    },
  },
 })