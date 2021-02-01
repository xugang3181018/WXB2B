const app = getApp()

Page({
  data: {
    isSubmit: false,
    liveCode: app.getImage('live-code.png'),
  },

  onLoad() {
    // const isSubmit = wx.getStorageSync('clue').isSubmit
    // this.setData({isSubmit})
  },

  // 改变封装好的picker组件
  changePickers(e) {
    const type = e.currentTarget.dataset.type
    const detail = e.detail
    this.setData(detail)
  },

  submit(e) {
    const inputContent = e.detail.value
    const data = this.data
    const reuqireData = {
      contact_name: {value: inputContent.contact_name, type: null, tip: ['请输入联系人名称']},
      contact_phone: {value: inputContent.contact_phone, type: ['phone'], tip: ['请输入联系人手机号', '手机号格式不正确']},
      corporate_name: {value: inputContent.corporate_name, type: null, tip: ['请输入公司名称']},
      province: {value: data.province, type: null, tip: ['请选择所在地区']},
      province_id: {value: data.provinceId, type: null, tip: null},
      city: {value: data.city, type: null, tip: null},
      city_id: {value: data.cityId, type: null, tip: null},
      area: {value: data.area, type: null, tip: null},
      area_id: {value: data.areaId, type: null, tip: null},
      trade_type_name: {value: inputContent.trade_type_name, type: null, tip: null},
      independent_brand: {value: inputContent.independent_brand, type: null, tip: null},
      current_volume: {value: inputContent.current_volumel, type: null, tip: null},
      introducer_name: {value: inputContent.introducer_name, type: null, tip: null},
    }
    const submitObj = {}
    for (let attr in reuqireData) {
      if (reuqireData[attr]) {
        const value = reuqireData[attr].value
        value !== '' && value !== null && value !== undefined ? submitObj[attr] = value : null
      }
    }
    const adopt = app.validate(reuqireData)
    if (adopt) {
      app.api2('front.agentclue', submitObj, 'POST', false).then(res => {
        if (res && !res.apiError) {
          app.showToast('提交成功！销售经理会第一时间和您取得联系！')
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
          // wx.setStorageSync('clue', {isSubmit: true})
          // this.setData({isSubmit: true})
        }
      })
    }
  },
})