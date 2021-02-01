const app = getApp()

// 备注：passName不属于需要上传的字段，为方便缓存功能，特意假如obj中，没有其他影响

const submitData = (data, input, type) => {
  let obj = null
  let params = null
  switch (Number(data.passType)) {
    case 7:
      switch (data.step) {
        case 1:
          obj = {
            accountType: {value: data.accountType, type: null, tip: null},
            configureName: {value: input.configureName, type: null, tip: ['请输入配置名称']},
            passName: {value: data.channel.list[data.channel.index] ? data.channel.list[data.channel.index] : null, type: null, tip: ['请选择通道']},
            coreMerchantCode: {value: data.merchantCode, type: null, tip: null},
            agentNo: {value: app.common('agentNo'), type: null, tip: null},
            configureRemark: {value: input.configureRemark, type: input.configureRemark ? ['word'] : null, tip: input.configureRemark ? ['', '配置备注只支持汉字、字母、数字和中英文括号，不支持特殊字符'] : null},
            wechatRateId: {value: data.wechat.detail[data.wechat.index] ? data.wechat.detail[data.wechat.index].rateId : null, type: null, tip: null},
            alipayRateId: {value: data.alipay.detail[data.alipay.index] ? data.alipay.detail[data.alipay.index].rateId : null, type: null, tip: null},
            storeNo: {value: data.pattern === 'store' && data.storeNo ? data.storeNo : null, type: null, tip: null},
            merchantType: {value: data.merchantType, type: null, tip: ['请选择商户类型']},
            businessCategoryName: {value: data.businessCategoryName, type: null, tip: ['请选择经营类目']},
            businessCategory: {value: data.businessCategory, type: null, tip: null},
            configureCommonAuditId: {value: data.resubmit > 0 || data.change > 0 ? data.configureCommonAuditId : null, type: null, tip: null}, // 变更或重提时的编号
          }
          if (!obj.alipayRateId.value && type !== 'save') {
            app.showToast('请选择费率')
            return
          }
          break
        case 2:
          obj = {
            businessLicenseUrl: data.merchantType > 1 ? {value: data.businessLicenseUrl, type: null, tip: ['营业执照照片未选择']} : null,
            businessLicenseWsUrl: data.merchantType > 1 ? {value: data.businessLicenseWsUrl, type: null, tip: null} : null,
            fullNameCn: {
              value: input.fullNameCn,
              type: data.merchantType > 0 && data.merchantType !== '03' ? [data.merchantType === '01' ? 'word2' : 'word', 'number', 'componey'] : ['word', 'number'],
              tip: [
                '请输入商户全称',
                data.merchantType === '01' ? '商户全称只支持汉字、字母、数字、下划线和中英文括号，不支持特殊字符' : '商户全称只支持汉字、字母、数字和中英文括号，不支持特殊字符',
                '商户全称不能全为数字',
                data.merchantType > 0 && data.merchantType !== '03' ? '非企业类型的商户，商户名称不能含有“公司”，请修改商户名称或者修改商户类型后再提交！' : null
              ]
            },
            nameCn: {value: input.nameCn, type: ['word', 'number'], tip: ['请输入商户简称', '商户简称只支持汉字、字母、数字和中英文括号，不支持特殊字符', '商户简称不能全为数字']},
            businessLicenseNo: {value: input.businessLicenseNo, type: data.merchantType > 1 ? ['businessLicenseNo'] : null, tip: data.merchantType > 1 ? ['请输入营业执照编号', '营业执照编号只支持15位或18位的字母和数字，不支持其他字符'] : null},
            contactName: {value: input.contactName, type: ['chinese'], tip: ['请输入负责人姓名', '负责人姓名只支持中文']},
            customerPhone: {value: input.customerPhone, type: ['phone', 'phone2'], tip: ['请输入负责人电话', '负责人手机号格式不正确', '不支持此负责人手机号段']},
            authCode: {value: '111111', type: ['code'], tip: ['请输入短信验证码', '验证码为六位数字']},
            province: {value: data.province ? data.province : null, type: null, tip: ['请选择商户所属地区']},
            provinceId: {value: data.provinceId, type: null, tip: null},
            city: {value: data.city, type: null, tip: null},
            cityId: {value: data.cityId, type: null, tip: null},
            area: {value: data.area, type: null, tip: null},
            areaId: {value: data.areaId, type: null, tip: null},
            address: {value: input.address, type: ['address'], tip: ['请输入商户详细地址', '商户详细地址只支持汉字、字母、数字和中英文括号、逗号、顿号和横竖线，不支持特殊字符']},
            doorUrl: {value: data.doorUrl, type: null, tip: ['门头照未选择']},
            doorWsUrl: {value: data.doorWsUrl, type: null, tip: null},
            storeEnvironmentPhotoUrl: {value: data.storeEnvironmentPhotoUrl, type: null, tip: ['店内环境照未选择']},
            storeEnvironmentPhotoWsUrl: {value: data.storeEnvironmentPhotoWsUrl, type: null, tip: null},
          }
          break
        case 3:
          const cardName = Number(data.accountType) === 2 ? "对公账户" : "银行卡号"
          const person = Number(data.accountType) === 2 ? "法人" : "结算人"
          obj = {
            cardNo: {value: input.cardNo, type: ["number2"], tip: [`请输入${cardName}`, `${cardName}只支持数字，不支持其他字符`]},
            bankName: {value: data.bankName, type: null, tip: ["请选择开户银行"]},
            bank: {value: data.bank, type: null, tip: null},
            openingPermitUrl: Number(data.accountType) === 2 ? {value: data.openingPermitUrl, type: null, tip: ["开户许可证照片未选择"]} : null,
            openingPermitWsUrl: Number(data.accountType) === 2 ? {value: data.openingPermitWsUrl, type: null, tip: null} : null,
            identificationOppositeUrl: {value: data.identificationOppositeUrl, type: null, tip: [`${person}身份证（人像面）未选择`]},
            identificationOppositeWsUrl: {value: data.identificationOppositeWsUrl, type: null, tip: null},
            identificationFrontUrl: {value: data.identificationFrontUrl, type: null, tip: [`${person}身份证（国徽面）未选择`]},
            identificationFrontWsUrl: {value: data.identificationFrontWsUrl, type: null, tip: null},
            accountHolder: {value: input.accountHolder, type: null, tip: null},
            certificateNo: {value: data.certificateNo ? data.certificateNo.toUpperCase() : null, type: null, tip: [`请输入${person}身份证号`]},
            certificateHolderNo: {value: data.certificateNo ? data.certificateNo.toUpperCase() : null, type: null, tip: null},
            companyCorporation: Number(data.accountType) === 2 ? {value: input.companyCorporation, type: ["chinese"], tip: ["请输入企业法人", `企业法人只支持中文`]} : null,
            cardholderAddress: data.merchantType !== "03" ? {value: input.cardholderAddress, type: ["address"], tip: [`请输入${person}身份证地址`, `${person}身份证地址只支持汉字、字母、数字和中英文括号、逗号、顿号和横竖线，不支持特殊字符`]} : null
          }
          if (!data.obtain && type === 'next') {
            app.showToast(`${person}身份证号不正确，请重新输入`)
            return
          }
          break
        default: null
      }
      break
    case 8:
      switch(data.step) {
        case 1:
          obj = {
            configureName: {value: input.configureName, type: null, tip: ['请输入配置名称']},
            passName: {value: data.channel.list[data.channel.index] ? data.channel.list[data.channel.index] : null, type: null, tip: ['请选择通道']},
            coreMerchantCode: {value: data.merchantCode, type: null, tip: null},
            agentNo: {value: app.common('agentNo'), type: null, tip: null},
            configureRemark: {value: input.configureRemark, type: input.configureRemark ? ['word'] : null, tip: input.configureRemark ? ['', '配置备注只支持汉字、字母、数字和中英文括号，不支持特殊字符'] : null},
            wechatRateId: {value: data.wechat.detail[data.wechat.index] ? data.wechat.detail[data.wechat.index].rateId : null, type: null, tip: null},
            alipayRateId: {value: data.alipay.detail[data.alipay.index] ? data.alipay.detail[data.alipay.index].rateId : null, type: null, tip: null},
            storeNo: {value: data.pattern === 'store' && data.storeNo ? data.storeNo : null, type: null, tip: null},
            businessCategoryName: {value: data.businessCategoryName, type: null, tip: ['请选择经营类目']},
            businessCategory: {value: data.businessCategory, type: null, tip: null},
            configureCommonAuditId: {value: data.resubmit > 0 || data.change > 0 ? data.configureCommonAuditId : null, type: null, tip: null},
          }
          // 至少选择一种费率
          if (!obj.wechatRateId.value && !obj.alipayRateId.value) {
            app.showToast('请至少选择一种费率')
            return
          }
          break
        case 2:
          obj = {
            nameCn: {value: input.nameCn, type: ['word', 'number'], tip: ['请输入商户简称', '商户简称只支持汉字、字母、数字和中英文括号，不支持特殊字符', '商户简称不能全为数字']},
            province: {value: data.province ? data.province : null, type: null, tip: ['请选择商户所属地区']},
            provinceId: {value: data.provinceId, type: null, tip: null},
            city: {value: data.city, type: null, tip: null},
            cityId: {value: data.cityId, type: null, tip: null},
            area: {value: data.area, type: null, tip: null},
            areaId: {value: data.areaId, type: null, tip: null},
            address: {value: input.address, type: ['address'], tip: ['请输入商户详细地址', '商户详细地址只支持汉字、字母、数字和中英文括号、逗号、顿号和横竖线，不支持特殊字符']},
            customerPhone: {value: input.customerPhone, type: ['custom'], tip: ['请输入客服电话', '客服电话只支持数字及-，不支持其他字符']},
            contactMobile: {value: input.contactMobile, type: ['phone', 'phone2'], tip: ['', '联系人手机号格式不正确', '不支持此联系人手机号段']},
            contactPhone: {value: input.contactMobile, type: null, tip: null},
            contactEmail: {value: input.contactEmail, type: ['email'], tip: ['', '联系人邮箱格式不正确']},
          }
          if (data.type === '1') {
            params = {
              businessLicenseUrl: {value: data.businessLicenseUrl, type: null, tip: ['营业执照照片未选择']},
              businessLicenseKsUrl: {value: data.businessLicenseKsUrl, type: null, tip: null},
              fullNameCn: {value: input.fullNameCn, type: ['word', 'number'], tip: ['请输入营业执照名称', '营业执照名称只支持汉字、字母、数字和中英文括号，不支持特殊字符', '营业执照名称不能全为数字']},
              businessLicenseType: {value: data.businessLicenseType, type: null, tip: ['请选择营业执照类型']},
              businessLicenseNo: {value: input.businessLicenseNo ? input.businessLicenseNo.toUpperCase() : null, type: ['businessLicenseNo'], tip: ['请输入营业执照编号', '营业执照编号只支持15位或18位的字母和数字，不支持其他字符']},
            }
          }
          Object.assign(obj, params)
          break
        case 3:
          const cardName = data.accountType === 2 ? "对公账户" : "银行卡号"
          const person = data.type === '0' ? '持卡人' : (data.accountType === 2 ? "法人" : "结算人")
          const contactTypeList = ["AGENT", "LEGAL_PERSON"] // 联系人类型
          const specialAptitudeUrlList = [data.specialAptitudeUrl1, data.specialAptitudeUrl2, data.specialAptitudeUrl3]
          const specialAptitudeKsUrlList = [data.specialAptitudeKsUrl1, data.specialAptitudeKsUrl2, data.specialAptitudeKsUrl3]
          let specialAptitudeUrl = ''
          let specialAptitudeKsUrl = ''
          specialAptitudeUrlList.forEach(item => {
            if (item) specialAptitudeUrl += `${item},`
          })
          specialAptitudeKsUrlList.forEach(item => {
            if (item) specialAptitudeKsUrl += `${item},`
          })
          specialAptitudeUrl = specialAptitudeUrl.substring(0, specialAptitudeUrl.length - 1)
          specialAptitudeKsUrl = specialAptitudeKsUrl.substring(0, specialAptitudeKsUrl.length - 1)
          obj = {
            cardNo: {value: input.cardNo, type: ["number2"], tip: [`请输入${cardName}`, `${cardName}只支持数字，不支持其他字符`]},
            bankName: {value: data.bankName, type: null, tip: ["请选择开户银行"]},
            bank: {value: data.bank, type: null, tip: null},
            accountHolder: {value: input.accountHolder, type: null, tip: [data.accountType === 1 ? '请输入开户人名称' : '请输入企业名称']},
            identificationOppositeUrl: {value: data.identificationOppositeUrl, type: null, tip: [`${person}身份证（人像面）未选择`]},
            identificationFrontUrl: {value: data.identificationFrontUrl, type: null, tip: [`${person}身份证（国徽面）未选择`]},
            identificationOppositeKsUrl: {value: data.identificationOppositeKsUrl, type: null, tip: null},
            identificationFrontKsUrl: {value: data.identificationFrontKsUrl, type: null, tip: null},
            accountType: {value: data.accountType, type: null, tip: null},
            contactType: {value: data.type === '0' ? 'CONTROLLER' : contactTypeList[data.account], type: null, tip: null},
            certificateNo: {value: data.certificateNo ? data.certificateNo.toUpperCase() : data.certNo ? data.certNo.toUpperCase() : null, type: null, tip: [`请输入结算人身份证号`]},
            certNo: {value: data.certNo ? data.certNo.toUpperCase() : data.certificateNo ? data.certificateNo.toUpperCase() : null, type: null, tip: [`请输入法人身份证号`]},
            certType: {value: '0', type: null, tip: null},
            supplementaryMaterialUrl: {value: data.supplementaryMaterialUrl, type: null, tip: null},
            supplementaryMaterialKsUrl: {value: data.supplementaryMaterialKsUrl, type: null, tip: null},
            specialAptitudeUrl: {value: specialAptitudeUrl, type: null, tip: null},
            specialAptitudeKsUrl: {value: specialAptitudeKsUrl, type: null, tip: null}
          }
          if (data.accountType === 1) {
            params = {
              merchantCorporation: {value: input.accountHolder, type: null, tip: null},
              mobile: {value: input.mobile, type: ["phone", "phone2"], tip: ["请输入银行预留手机号", "银行预留手机号格式不正确", "不支持此银行预留手机号段"]},
            }
          } else if (data.accountType === 2) {
            params = {
              subbranchProvince: {value: data.subbranchProvince, type: null, tip: ["请选择开户支行所在地区"]},
              subbranchProvinceId: {value: data.subbranchProvinceId, type: null, tip: null},
              subbranchCity: {value: data.subbranchCity, type: null, tip: null},
              subbranchCityId: {value: data.subbranchCityId, type: null, tip: null},
              subbranchName: {value: input.subbranchName, type: null, tip: ["请输入开户支行名称"]},
              openingPermitUrl: {value: data.openingPermitUrl, type: null, tip: ["开户许可证照片未选择"]},
              openingPermitKsUrl: {value: data.openingPermitKsUrl, type: null, tip: null},
              legalPersonName: {value: input.legalPersonName, type: ["chinese"], tip: ["请输入法人姓名", "法人姓名只支持中文"]},
              merchantCorporation: {value: input.legalPersonName, type: null, tip: null},
            }
          }
          if (data.type === '0') {
            params = {
              ...params,
              fullNameCn: {value: `商户_${data.accountHolder}`, type: null, tip: null},
              businessLicenseUrl: {value: data.identificationOppositeUrl, type: null, tip: null},
              businessLicenseKsUrl: {value: data.identificationOppositeKsUrl, type: null, tip: null},
            }
          }
          Object.assign(obj, params)
          if (!data.obtain && type === 'next') {
            app.showToast(`${person}身份证号不正确，请重新输入`)
            return
          }
          break
        default: null
      }
      break
    case 9:
      switch(data.step) {
        case 1:
          obj = {
            configureName: {value: input.configureName, type: null, tip: ['请输入配置名称']},
            passName: {value: data.channel.list[data.channel.index] ? data.channel.list[data.channel.index] : null, type: null, tip: ['请选择通道']},
            coreMerchantCode: {value: data.merchantCode, type: null, tip: null},
            agentNo: {value: app.common('agentNo'), type: null, tip: null},
            configureRemark: {value: input.configureRemark, type: input.configureRemark ? ['word'] : null, tip: input.configureRemark ? ['', '配置备注只支持汉字、字母、数字和中英文括号，不支持特殊字符'] : null},
            wechatRateId: {value: data.wechat.detail[data.wechat.index] ? data.wechat.detail[data.wechat.index].rateId : null, type: null, tip: null},
            alipayRateId: {value: data.alipay.detail[data.alipay.index] ? data.alipay.detail[data.alipay.index].rateId : null, type: null, tip: null},
            storeNo: {value: data.pattern === 'store' && data.storeNo ? data.storeNo : null, type: null, tip: null},
            merchantType: {value: data.merchantType, type: null, tip: ['请选择商户类型']},
            businessCategoryName: {value: data.businessCategoryName, type: null, tip: ['请选择经营类目']},
            businessCategory: {value: data.businessCategory, type: null, tip: null},
            type: {value: data.type, type: null, tip: null},
            configureCommonAuditId: {value: data.resubmit > 0 || data.change > 0 ? data.configureCommonAuditId : null, type: null, tip: null}, // 变更或重提时的编号
          }
          if (data.change === '1') {
            obj = {
              agentNo: {value: app.common('agentNo'), type: null, tip: null},
              coreMerchantCode: {value: data.merchantCode, type: null, tip: null},
              storeNo: {value: data.pattern === 'store' && data.storeNo ? data.storeNo : null, type: null, tip: null},
              configureCommonAuditId: {value: data.configureCommonAuditId, type: null, tip: null}, // 变更或重提时的编号
              configureName: {value: input.configureName, type: null, tip: ['请输入配置名称']},
              alipayRateId: {value: data.alipay.detail[data.alipay.index] ? data.alipay.detail[data.alipay.index].rateId : null, type: null, tip: null},
              wechatRateId: {value: data.wechat.detail[data.wechat.index] ? data.wechat.detail[data.wechat.index].rateId : null, type: null, tip: null},
              configureRemark: {value: input.configureRemark, type: input.configureRemark ? ['word'] : null, tip: input.configureRemark ? ['', '配置备注只支持汉字、字母、数字和中英文括号，不支持特殊字符'] : null},
            }
          }
          // 至少选择一种费率
          if (!obj.wechatRateId.value && !obj.alipayRateId.value) {
            app.showToast('请至少选择一种费率')
            return
          }
          break
        case 2:
          let certificateHolderType = null
          if (data.certificateHolderType !== null) {
            certificateHolderType = Number(data.certificateHolderType) === 0 ? 1 : (Number(data.certificateHolderType) === 1 ? 2 : 9)
          }
          if (type === 'next') {
            if (input.address.length < 5) {
              app.showToast('商户详细地址为5-50字')
              return
            }
            if (input.nameCn.length < 5) {
              app.showToast('商户简称不得小于5个字')
              return
            }
            if (data.merchantType > 1 && (input.businessLicenseAddress.length > 40 || input.businessLicenseAddress.length < 5)) {
              app.showToast('营业执照注册地址的长度为5到40个字')
              return
            }
            if (input.customerPhone.length > 20) {
              app.showToast('客服电话不大于20位')
              return
            }
            const obtain = data.merchantType > 1 ? data.obtain2 : true
            if (!obtain) {
              app.showToast('请输入正确的证件号码')
              return
            }
          }
          if (data.province === '澳门') data.provinceId = '1'
          obj = {
            nameCn: {value: input.nameCn, type: ['word', 'number'], tip: ['请输入商户简称', '商户简称只支持汉字、字母、数字和中英文括号，不支持特殊字符', '商户简称不能全为数字']},
            province: {value: data.province ? data.province : null, type: null, tip: ['请选择商户所属地区']},
            provinceId: {value: data.provinceId, type: null, tip: null},
            city: {value: data.city, type: null, tip: null},
            cityId: {value: data.cityId, type: null, tip: null},
            area: {value: data.area, type: null, tip: null},
            areaId: {value: data.areaId, type: null, tip: null},
            address: {value: input.address, type: ['english', 'address'], tip: ['请输入商户详细地址', '商户详细地址不能由纯英文字母组成', '商户详细地址只支持汉字、字母、数字和中英文括号、逗号、顿号和横竖线，不支持特殊字符']},
            mobile: {value: input.mobile, type: ["phone"], tip: ["请输入联系人手机号", "联系人手机号格式不正确"]},
            customerPhone: {value: input.customerPhone, type: ['number2'], tip: ['请输入客服电话', '客服电话只支持数字']},
            doorUrl: {value: data.doorUrl, type: null, tip: ['门头照未选择']},
            stroeEnvironmentPhotoUrl: {value: data.stroeEnvironmentPhotoUrl, type: null, tip: ['店内环境照未选择']},
            cashierPhotoUrl: {value: data.cashierPhotoUrl, type: null, tip: ['收银台照未选择']},
            yeahkaDoorUrl: {value: data.yeahkaDoorUrl, type: null, tip: null},
            yeahkaStroeEnvironmentPhotoUrl: {value: data.yeahkaStroeEnvironmentPhotoUrl, type: null, tip: null},
            yeahkaCashierPhotoUrl: {value: data.yeahkaCashierPhotoUrl, type: null, tip: null},
          }
          if (data.merchantType > 1) {
            params = {
              businessLicenseUrl: {value: data.businessLicenseUrl, type: null, tip: ['营业执照照片未选择']},
              yeahkaBusinessLicenseUrl: {value: data.yeahkaBusinessLicenseUrl, type: null, tip: null},
              businessLicenseNo: {value: input.businessLicenseNo ? input.businessLicenseNo.toUpperCase() : null, type: ['businessLicenseNo'], tip: ['请输入营业执照编号', '营业执照编号只支持15位或18位的字母和数字，不支持其他字符']},
              businessLicenseFullName: {value: input.businessLicenseFullName, type: null, tip: ['请输入营业执照注册名称']},
              businessLicenseAddress: {value: input.businessLicenseAddress, type: null, tip: ['请输入营业执照注册地址']},
              businessStartDate: {value: data.businessStartDate, type: ['date'], tip: ['请选择营业执照注册日期', '营业执照注册日期格式不正确，请重新选择']},
              businessDeadline: {value: data.businessStartDate === data.businessDeadline ? null : data.businessDeadline, type: ['date'], tip: ['请选择正确的营业执照截止日期', '营业执照截止日期格式不正确，请重新选择']},
              certificateHolderType: {value: certificateHolderType, type: null, tip: ['请选择法人证件类型']},
              identificationOppositeUrl: {value: data.identificationOppositeUrl, type: null, tip: ['法人身份证国徽面未选择']},
              yeahkaIdentificationOppositeUrl: {value: data.yeahkaIdentificationOppositeUrl, type: null, tip: null},
              identificationFrontUrl: {value: data.identificationFrontUrl, type: null, tip: ['法人身份证人像面未选择']},
              yeahkaIdentificationFrontUrl: {value: data.yeahkaIdentificationFrontUrl, type: null, tip: null},
              companyCorporation: {value: input.companyCorporation, type: null, tip: ["请输入法人姓名"]},
              certificateHolderNo: {value: input.certificateHolderNo ? input.certificateHolderNo.toUpperCase() : null, type: null, tip: ['请输入法人证件号码']},
              idCardStart: {value: data.idCardStart, type: ['date'], tip: ['请选择法人身份证开始日期', '法人身份证开始日期格式不正确，请重新选择']},
              idCardEnd: {value: data.idCardEnd, type: ['date'], tip: ['请选择法人身份证到期日期', '法人身份证到期日期格式不正确，请重新选择']}
            }
          } else {
            params = {
              businessLicenseUrl: {value: data.doorUrl, type: null, tip: null},
              yeahkaBusinessLicenseUrl: {value: data.yeahkaDoorUrl, type: null, tip: null},
              certificateHolderType: {value: 1, type: null, tip: null},
              businessLicenseFullName: {value: input.nameCn, type: null, tip: null}
            }
          }
          Object.assign(obj, params)
          break
        case 3:
          const cardName = data.accountType === 2 ? "对公账户" : "银行卡号"
          const obtain = data.merchantType > 1 && data.legalFlag === 1 ? true : data.obtain3
          if (type === 'submit' && !obtain) {
            app.showToast('请输入正确的证件号码')
            return
          }
          if (data.change === '3') { // 变更
            obj = {
              agentNo: {value: app.common('agentNo'), type: null, tip: null},
              coreMerchantCode: {value: data.merchantCode, type: null, tip: null},
              storeNo: {value: data.pattern === 'store' && data.storeNo ? data.storeNo : null, type: null, tip: null},
              configureCommonAuditId: {value: data.configureCommonAuditId, type: null, tip: null}, // 变更或重提时的编号
              bankName: {value: data.bankName, type: null, tip: ["请选择开户银行"]},
              bankProvince: {value: data.subbranchProvince ? data.subbranchProvince : data.bankProvince, type: null, tip: ["请选择开户银行所在省市"]},
              bankProvinceId: {value: data.subbranchProvinceId ? data.subbranchProvinceId : data.bankProvinceId, type: null, tip: null},
              bankCity: {value: data.subbranchCity ? data.subbranchCity : data.bankCity, type: null, tip: null},
              bankCityId: {value: data.subbranchCityId ? data.subbranchCityId : data.bankCityId, type: null, tip: null},
              bankBranchName: {value: data.bankBranchName, type: null, tip: ["请输入开户支行名称"]},
              bankBranch: {value: data.bankBranch, type: null, tip: ["开户支行信息有误"]},
              cardNo: {value: input.cardNo, type: ["number2"], tip: [`请输入${cardName}`, `${cardName}只支持数字，不支持其他字符`]},
              accountHolderMobile: {value: input.accountHolderMobile, type: ["phone"], tip: ["请输入银行预留手机号", "银行预留手机号格式不正确"]},
              cardFrontUrl: {value: data.accountType !== 2 ? data.cardFrontUrl : null, type: null, tip: data.accountType !== 2 ? ["银行卡正面照片未选择"] : null},
              yeahkaCardFrontUrl: {value: data.accountType !== 2 ? data.yeahkaCardFrontUrl : null, type: null, tip: null},
            }
          } else {
            const name = data.accountType === 2 ? '企业名称' : '开户人'
            if (data.legalFlag === 0) {
              params = {
                nonLegIdentificationFrontUrl: {value: data.nonLegIdentificationFrontUrl, type: null, tip: ['结算人身份证（人像面）未选择']},
                yeahkaNonLegIdentificationFrontUrl: {value: data.yeahkaNonLegIdentificationFrontUrl, type: null, tip: null},
                nonLegIdentificationOppositeUrl: {value: data.nonLegIdentificationOppositeUrl, type: null, tip: ['结算人身份证（国徽面）未选择']},
                yeahkaNonLegIdentificationOppositeUrl: {value: data.yeahkaNonLegIdentificationOppositeUrl, type: null, tip: null},
                legalFlagCardNo: {value: input.legalFlagCardNo ? input.legalFlagCardNo.toUpperCase() : null, type: null, tip: ['请输入结算人身份证号']},
                nonLegSettleAuthUrl: {value: data.nonLegSettleAuthUrl, type: null, tip: ['非法人结算授权书未选择']},
                yeahkaNonLegSettleAuthUrl: {value: data.yeahkaNonLegSettleAuthUrl, type: null, tip: null},
              }
            }
            if (data.merchantType === 1) {
              params = {
                nonLegIdentificationFrontUrl: {value: data.nonLegIdentificationFrontUrl, type: null, tip: ['结算人身份证（人像面）未选择']},
                yeahkaNonLegIdentificationFrontUrl: {value: data.yeahkaNonLegIdentificationFrontUrl, type: null, tip: null},
                nonLegIdentificationOppositeUrl: {value: data.nonLegIdentificationOppositeUrl, type: null, tip: ['结算人身份证（国徽面）未选择']},
                yeahkaNonLegIdentificationOppositeUrl: {value: data.yeahkaNonLegIdentificationOppositeUrl, type: null, tip: null},
                identificationFrontUrl: {value: data.nonLegIdentificationFrontUrl, type: null, tip: null},
                yeahkaIdentificationFrontUrl: {value: data.yeahkaNonLegIdentificationFrontUrl, type: null, tip: null},
                identificationOppositeUrl: {value: data.nonLegIdentificationOppositeUrl, type: null, tip: null},
                yeahkaIdentificationOppositeUrl: {value: data.yeahkaNonLegIdentificationOppositeUrl, type: null, tip: null},
                companyCorporation: {value: input.accountHolder, type: null, tip: null},
                certificateHolderNo: {value: input.certificateHolderNo ? input.certificateHolderNo.toUpperCase() : null, type: null, tip: ['请输入结算人身份证号']},
                idCardStart: {value: data.idCardStart, type: ['date'], tip: ['请选择结算人身份证开始日期', '结算人身份证开始日期格式不正确，请重新选择']},
                idCardEnd: {value: data.idCardEnd, type: ['date'], tip: ['请选择结算人身份证到期日期', '结算人身份证到期日期格式不正确，请重新选择']}
              }
            }
            obj = {
              accountType: {value: data.accountType, type: null, tip: ['请选择账户类型']},
              legalFlag: {value: data.legalFlag, type: null, tip: null},
              cardFrontUrl: {value: data.accountType !== 2 ? data.cardFrontUrl : null, type: null, tip: data.accountType !== 2 ? ["银行卡正面照片未选择"] : null},
              yeahkaCardFrontUrl: {value: data.accountType !== 2 ? data.yeahkaCardFrontUrl : null, type: null, tip: null},
              openingPermitUrl: {value: data.accountType === 2 ? data.openingPermitUrl : null, type: null, tip: data.accountType === 2 ? ['开户许可证照片未选择'] : null},
              yeahkaOpeningPermitUrl: {value: data.accountType === 2 ? data.yeahkaOpeningPermitUrl : null, type: null, tip: null},
              cardNo: {value: input.cardNo, type: ["number2"], tip: [`请输入${cardName}`, `${cardName}只支持数字，不支持其他字符`]},
              bankName: {value: data.bankName, type: null, tip: ["请选择开户银行"]},
              bankProvince: {value: data.subbranchProvince ? data.subbranchProvince : data.bankProvince, type: null, tip: ["请选择开户银行所在省市"]},
              bankProvinceId: {value: data.subbranchProvinceId ? data.subbranchProvinceId : data.bankProvinceId, type: null, tip: null},
              bankCity: {value: data.subbranchCity ? data.subbranchCity : data.bankCity, type: null, tip: null},
              bankCityId: {value: data.subbranchCityId ? data.subbranchCityId : data.bankCityId, type: null, tip: null},
              bankBranchName: {value: data.bankBranchName, type: null, tip: ["请输入开户支行名称"]},
              bankBranch: {value: data.bankBranch, type: null, tip: ["开户支行信息有误"]},
              accountHolder: {value: input.accountHolder, type: null, tip: [`请输入${name}`]},
              accountHolderMobile: {value: input.accountHolderMobile, type: ["phone"], tip: ["请输入银行预留手机号", "银行预留手机号格式不正确"]},
              yeahkaAgainFlag: {value: data.yeahkaAgainFlag, type: null, tip: null},
              configureVersion: {value: data.configureVersion, type: null, tip: null},
              platformMerchantNo: data.platformMerchantNo ? {value: data.platformMerchantNo, type: null, tip: null} : null,
            }
          }
          Object.assign(obj, params)
          break
        default: null
      }
      break
    case 11:
      switch(data.step) {
        case 1:
          obj = {
            configureName: {value: input.configureName, type: null, tip: ['请输入配置名称']},
            passName: {value: data.channel.list[data.channel.index] ? data.channel.list[data.channel.index] : null, type: null, tip: ['请选择通道']},
            coreMerchantCode: {value: data.merchantCode, type: null, tip: null},
            agentNo: {value: app.common('agentNo'), type: null, tip: null},
            configureRemark: {value: input.configureRemark, type: input.configureRemark ? ['word'] : null, tip: input.configureRemark ? ['', '配置备注只支持汉字、字母、数字和中英文括号，不支持特殊字符'] : null},
            wechatRateId: {value: data.wechat.detail[data.wechat.index] ? data.wechat.detail[data.wechat.index].rateId : null, type: null, tip: null},
            alipayRateId: {value: data.alipay.detail[data.alipay.index] ? data.alipay.detail[data.alipay.index].rateId : null, type: null, tip: null},
            storeNo: {value: data.pattern === 'store' && data.storeNo ? data.storeNo : null, type: null, tip: null},
            merchantType: {value: data.merchantType, type: null, tip: ['请选择商户类型']},
            merchantClass: {value: data.merchantClass, type: null, tip: ['请选择商户种类']},
            businessCategory: {value: data.businessCategory, type: null, tip: ['请选择经营类目']},
            businessCategoryName: {value: data.businessCategoryName, type: null, tip: null},
            configureCommonAuditId: {value: data.resubmit > 0 || data.change > 0 ? data.configureCommonAuditId : null, type: null, tip: null}, // 变更或重提时的编号
          }
          if (data.change === '1') {
            obj = {
              agentNo: {value: app.common('agentNo'), type: null, tip: null},
              coreMerchantCode: {value: data.merchantCode, type: null, tip: null},
              storeNo: {value: data.pattern === 'store' && data.storeNo ? data.storeNo : null, type: null, tip: null},
              configureCommonAuditId: {value: data.configureCommonAuditId, type: null, tip: null}, // 变更或重提时的编号
              configureName: {value: input.configureName, type: null, tip: ['请输入配置名称']},
              alipayRateId: {value: data.alipay.detail[data.alipay.index] ? data.alipay.detail[data.alipay.index].rateId : null, type: null, tip: null},
              wechatRateId: {value: data.wechat.detail[data.wechat.index] ? data.wechat.detail[data.wechat.index].rateId : null, type: null, tip: null},
              configureRemark: {value: input.configureRemark, type: input.configureRemark ? ['word'] : null, tip: input.configureRemark ? ['', '配置备注只支持汉字、字母、数字和中英文括号，不支持特殊字符'] : null},
            }
          }
          // 至少选择一种费率
          if (!obj.wechatRateId.value && !obj.alipayRateId.value) {
            app.showToast('请至少选择一种费率')
            return
          }
          break
        case 2:
          if (type === 'next') {
            if (input.address.length < 5) {
              app.showToast('商户详细地址为5-50字')
              return
            }
            const obtain = data.merchantType > 1 ? data.obtain2 : true
            if (!obtain) {
              app.showToast('请输入正确的证件号码')
              return
            }
          }
          obj = {
            nameCn: {value: input.nameCn, type: ['word', 'number'], tip: ['请输入商户简称', '商户简称只支持汉字、字母、数字和中英文括号，不支持特殊字符', '商户简称不能全为数字']},
            fullNameCn: {value: data.merchantType > 1 ? null : data.nameCn, type: null, tip: null},
            provinceId: {value: data.provinceId, type: null, tip: ['请选择商户所属地区']},
            province: {value: data.province ? data.province : null, type: null, tip: null},
            city: {value: data.city, type: null, tip: null},
            cityId: {value: data.cityId, type: null, tip: null},
            area: {value: data.area, type: null, tip: null},
            areaId: {value: data.areaId, type: null, tip: null},
            address: {value: input.address, type: ['english', 'address'], tip: ['请输入商户详细地址', '商户详细地址不能由纯英文字母组成', '商户详细地址只支持汉字、字母、数字和中英文括号、逗号、顿号和横竖线，不支持特殊字符']},
            mobile: {value: input.mobile, type: ["phone"], tip: ["请输入联系人手机号", "联系人手机号格式不正确"]},
            customerPhone: {value: input.customerPhone, type: ['number2'], tip: [null, '客服电话只支持数字']},
            contactEmail: {value: input.contactEmail, type: ['email'], tip: ['请输入联系人邮箱', '联系人邮箱格式不正确']},
            doorUrl: {value: data.doorUrl, type: null, tip: ['门头照未选择']},
            hfDoorUrl: {value: data.hfDoorUrl, type: null, tip: null},
            stroeEnvironmentPhotoUrl: {value: data.stroeEnvironmentPhotoUrl, type: null, tip: ['店内环境照未选择']},
            hfStroeEnvironmentPhotoUrl: {value: data.hfStroeEnvironmentPhotoUrl, type: null, tip: null},
            cashierPhotoUrl: {value: data.cashierPhotoUrl, type: null, tip: ['收银台照未选择']},
            hfCashierPhotoUrl: {value: data.hfCashierPhotoUrl, type: null, tip: null},
          }
          if (data.merchantType > 1) {
            params = {
              businessLicenseUrl: {value: data.businessLicenseUrl, type: null, tip: ['营业执照照片未选择']},
              hfBusinessLicenseUrl: {value: data.hfBusinessLicenseUrl, type: null, tip: null},
              businessLicenseNo: {value: input.businessLicenseNo ? input.businessLicenseNo.toUpperCase() : null, type: ['businessLicenseNo'], tip: ['请输入营业执照编号', '营业执照编号只支持15位或18位的字母和数字，不支持其他字符']},
              fullNameCn: {value: input.fullNameCn, type: null, tip: ['请输入营业执照注册名称']},
              businessStartDate: {value: data.businessStartDate, type: ['date'], tip: ['请选择营业执照注册日期', '营业执照注册日期格式不正确，请重新选择']},
              businessDeadline: {value: data.businessStartDate === data.businessDeadline ? null : data.businessDeadline, type: ['date'], tip: ['请选择正确的营业执照截止日期', '营业执照截止日期格式不正确，请重新选择']},
              certificateHolderType: {value: data.certificateHolderType, type: null, tip: ['请选择法人证件类型']},
              identificationFrontUrl: {value: data.identificationFrontUrl, type: null, tip: ['法人身份证国徽面未选择']},
              hfIdentificationFrontUrl : {value: data.hfIdentificationFrontUrl , type: null, tip: null},
              identificationOppositeUrl: {value: data.identificationOppositeUrl, type: null, tip: ['法人身份证人像面未选择']},
              hfIdentificationOppositeUrl: {value: data.hfIdentificationOppositeUrl, type: null, tip: null},
              companyCorporation: {value: input.companyCorporation, type: null, tip: ["请输入法人姓名"]},
              certificateHolderNo: {value: input.certificateHolderNo ? input.certificateHolderNo.toUpperCase() : null, type: null, tip: ['请输入法人证件号码']},
              companyCorporationStartDate: {value: data.companyCorporationStartDate, type: ['date'], tip: ['请选择法人身份证开始日期', '法人身份证开始日期格式不正确，请重新选择']},
              companyCorporationDeadline: {value: data.companyCorporationDeadline, type: ['date'], tip: ['请选择法人身份证到期日期', '法人身份证到期日期格式不正确，请重新选择']}
            }
          }
          Object.assign(obj, params)
          break
        case 3:
          const cardName = data.accountType === 0 ? "对公账户" : "银行卡号"
          const name = data.accountType === 0 ? '企业名称' : '开户人'
          const obtain = data.merchantType > 1 && data.legalFlag === 1 ? true : data.obtain3
          if (type === 'submit' && !obtain) {
            app.showToast('请输入正确的证件号码')
            return
          }
          if (data.change === '3') { // 变更
            obj = {
              agentNo: {value: app.common('agentNo'), type: null, tip: null},
              coreMerchantCode: {value: data.merchantCode, type: null, tip: null},
              storeNo: {value: data.pattern === 'store' && data.storeNo ? data.storeNo : null, type: null, tip: null},
              configureCommonAuditId: {value: data.configureCommonAuditId, type: null, tip: null}, // 变更或重提时的编号
              bankName: {value: data.bankName, type: null, tip: ["请选择开户银行"]},
              bankProvince: {value: data.subbranchProvince ? data.subbranchProvince : data.bankProvince, type: null, tip: ["请选择开户银行所在省市"]},
              bankProvinceId: {value: data.subbranchProvinceId ? data.subbranchProvinceId : data.bankProvinceId, type: null, tip: null},
              bankCity: {value: data.subbranchCity ? data.subbranchCity : data.bankCity, type: null, tip: null},
              bankCityId: {value: data.subbranchCityId ? data.subbranchCityId : data.bankCityId, type: null, tip: null},
              bankBranchName: {value: data.bankBranchName, type: null, tip: ["请输入开户支行名称"]},
              bankBranch: {value: data.bankBranch, type: null, tip: ["开户支行信息有误"]},
              openingPermitUrl: data.accountType === 0 ? {value: data.openingPermitUrl, type: null, tip: ['开户许可证照片未选择']} : null,
              hfOpeningPermitUrl: data.accountType === 0 ? {value: data.hfOpeningPermitUrl, type: null, tip: null} : null,
              bankCardFrontUrl: data.accountType !== 0 ? {value: data.bankCardFrontUrl, type: null, tip: ['银行卡正面照片未选择']} : null,
              hfBankCardFrontUrl: data.accountType !== 0 ? {value: data.hfBankCardFrontUrl, type: null, tip: null} : null,
              bankCardOppositeUrl: data.accountType !== 0 ? {value: data.bankCardOppositeUrl, type: null, tip: ["银行卡反面照片未选择"]} : null,
              hfBankCardOppositeUrl: data.accountType !== 0 ? {value: data.hfBankCardOppositeUrl, type: null, tip: null} : null,
              cardNo: {value: input.cardNo, type: ["number2"], tip: [`请输入${cardName}`, `${cardName}只支持数字，不支持其他字符`]},
            }
          } else {
            obj = {
              accountType: {value: data.accountType, type: null, tip: ['请选择账户类型']},
              legalFlag: {value: data.legalFlag, type: null, tip: null},
              accountHolder: {value: input.accountHolder, type: null, tip: [`请输入${name}`]},
              openingPermitUrl: data.accountType === 0 ? {value: data.openingPermitUrl, type: null, tip: ['开户许可证照片未选择']} : null,
              hfOpeningPermitUrl: data.accountType === 0 ? {value: data.hfOpeningPermitUrl, type: null, tip: null} : null,
              bankCardFrontUrl: data.accountType !== 0 ? {value: data.bankCardFrontUrl, type: null, tip: ['银行卡正面照片未选择']} : null,
              hfBankCardFrontUrl: data.accountType !== 0 ? {value: data.hfBankCardFrontUrl, type: null, tip: null} : null,
              bankCardOppositeUrl: data.accountType !== 0 ? {value: data.bankCardOppositeUrl, type: null, tip: ["银行卡反面照片未选择"]} : null,
              hfBankCardOppositeUrl: data.accountType !== 0 ? {value: data.hfBankCardOppositeUrl, type: null, tip: null} : null,
              cardNo: {value: input.cardNo, type: ["number2"], tip: [`请输入${cardName}`, `${cardName}只支持数字，不支持其他字符`]},
              bankName: {value: data.bankName, type: null, tip: ["请选择开户银行"]},
              bankBranch: {value: data.bankBranch, type: null, tip: null},
              bankProvinceId: {value: data.bankProvinceId, type: null, tip: ["请选择开户银行所在省市"]},
              bankProvince: {value: data.bankProvince, type: null, tip: null},
              bankCityId: {value: data.bankCityId, type: null, tip: null},
              bankCity: {value: data.bankCity, type: null, tip: null},
              bankBranchName: {value: data.bankBranchName, type: null, tip: ["请输入开户支行名称"]},
            }
            if (data.merchantType === 1 || data.legalFlag === 0) { // 自然人非法人结算公用部分
              params = {
                nonLegIdentificationFrontUrl: {value: data.nonLegIdentificationFrontUrl, type: null, tip: ['结算人证件（人像面）未选择']},
                hfNonLegIdentificationFrontUrl: {value: data.hfNonLegIdentificationFrontUrl, type: null, tip: null},
                nonLegIdentificationOppositeUrl: {value: data.nonLegIdentificationOppositeUrl, type: null, tip: ['结算人证件（国徽面）未选择']},
                hfNonLegIdentificationOppositeUrl: {value: data.hfNonLegIdentificationOppositeUrl, type: null, tip: null},
                certificateStartDate: {value: data.certificateStartDate, type: ['date'], tip: ['请选择结算人证件开始日期', '结算人证件开始日期格式不正确，请重新选择']},
                certificateDeadline: {value: data.certificateDeadline, type: ['date'], tip: ['请选择结算人证件到期日期', '结算人证件到期日期格式不正确，请重新选择']},
                rmk3: {value: data.rmk3, type: null, tip: ['请选择结算人证件类型']},
              }
            }
            if (data.merchantType === 1) { // 自然人
              params = {
                ...params,
                certificateHolderNo: {value: input.certificateHolderNo ? input.certificateHolderNo.toUpperCase() : null, type: null, tip: ['请输入结算人证件号']},
              }
            }
            if (data.legalFlag === 0) { // 非法人
              params = {
                ...params,
                legalFlagCardNo: {value: input.legalFlagCardNo ? input.legalFlagCardNo.toUpperCase() : null, type: null, tip: ['请输入结算人证件号']},
                nonLegSettleAuthUrl: {value: data.nonLegSettleAuthUrl, type: null, tip: ['非法人结算授权书照片未选择']},
                hfNonLegSettleAuthUrl: {value: data.hfNonLegSettleAuthUrl, type: null, tip: null},
              }
            }
            if (data.merchantType !== 1 && data.legalFlag === 1) {
              params = {
                nonLegIdentificationFrontUrl: {value: data.identificationOppositeUrl, type: null, tip: null},
                hfNonLegIdentificationFrontUrl: {value: data.hfIdentificationOppositeUrl, type: null, tip: null},
                nonLegIdentificationOppositeUrl: {value: data.identificationFrontUrl, type: null, tip: null},
                hfNonLegIdentificationOppositeUrl: {value: data.hfIdentificationFrontUrl, type: null, tip: null},
              }
            }
          }
          Object.assign(obj, params)
          break
        default: null
      }
    default: null
  }
  return obj
}

export default submitData