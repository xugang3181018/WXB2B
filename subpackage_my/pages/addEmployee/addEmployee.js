const app = getApp()
import {host} from '../../../api/file/host'
const roleEnv = host.getHost('role')

Page({
  data: {
    role: null, // 员工角色
    employeeName: null, // 员工姓名
    mobile: null, // 员工手机号
    email: null, // 员工邮箱
    type: '0', // 区域类型
    loginName: null, // 员工登录名
    passWord: null, // 员工密码
    again: null, // 再次输入密码
    employeeId: null, // 员工ID
    salesmanGroupId: null, // 所属区域组ID
    permissionGroupIds: null, // 员工角色ID
    createCn: null, // 创建人名称
    merchantId: null, // 所属商户ID
    areaList: [], // 区域总列表
    area: null, // 当前选中的区域index
    employeeRole: [], // 员工角色
    employee: null, // 选中的员工角色
    roleList: ['区域管理员', '普通业务员'], // 0 系统管理员（默认创建，不能删除） 1 区域管理员 2 其他
    role: null, // 区域角色
  },

  onLoad(options) {
    this.setData(options)
    this.getAreaList()
    this.getEmployeeRole()
  },

  // 获取分配区域列表
  getAreaList() {
    const params = {employeeId: app.common("employeeId")}
    app.api("agent_app_area_query", params).then(res => {
      if(res && !res.apiError) this.setData({areaList: res})
    })
  },

  pickerChange(e) {
    const type = e.currentTarget.dataset.type
    const value = Number(e.detail.value)
    let info = null
    if (type === 'employee' && value === 0 && this.data.type === '0') {
      info = {area: 0, role: 0}
    }
    this.setData({[type]: value, ...info})
  },

  // 获取角色列表
  getEmployeeRole() {
    const params = {
      merchantId: app.common("agentId"),
      productId: roleEnv,
      pageSize: 500,
      pageNo: 1,
    }
    app.api('cc_role_list_query', params).then(res => {
      if(res && !res.apiError) {
        const roleList = this.data.roleList
        this.data.type === '1' ? res.shift() : null
        this.setData({employeeRole: res, roleList})
      }
    })
  },

  // 添加员工
  addEmployee(e) {
    const {areaList, area, role, employee, employeeRole} = this.data
    const input = e.detail.value
    const info = {
      permissionGroupIds: {value: employee !== null ? employeeRole[employee].permissionGroupId : null, type: null, tip: ['请选择员工角色']},
      employeeName: {value: input.employeeName, type: ['word'], tip: ['请输入员工姓名', '员工姓名只支持汉字、字母、数字和中英文括号，不支持特殊字符']},
      mobile: {value: input.mobile, type: ['phone', 'phone2'], tip: ['请输入员工手机号', '员工手机号格式不正确', '不支持此员工手机号段']},
      email: {value: input.email, type: ['email'], tip: ['', '员工邮箱格式不正确']},
      type: {value: role !== null ? `${role + 1}` : null, type: null, tip: ['请选择区域角色']},
      salesmanGroupId: {value: area !== null ? areaList[area].id : null, type: null, tip: ['请选择分配区域']},
      loginName: {value: input.loginName ? input.loginName : input.mobile, type: ['chinese2'], tip: ['请输入员工登录名', '员工登录名不含中文']},
      passWord: {value: input.passWord, type: ['chinese2'], tip: ['', '密码只能输入数字、字母以及特殊字符']},
      merchantId: {value: app.common('agentId'), type: null, tip: null},
      createCn: {value: app.common('employeeName'), type: null, tip: null},
    }
    const params = {}
    if (input.passWord !== '') {
      if (input.again === '') {
        app.showToast('请输入确认密码')
        return
      }
      if (input.passWord !== input.again) {
        app.showToast('两次输入的密码不一致')
        return
      }
    }
    if (input.again !== '' && input.passWord === '') {
      app.showToast('请输入密码')
      return
    }
    for (let attr in info) {
      if (info[attr]) {
        info[attr].value ? params[attr] = info[attr].value : null
      }
    }
    const adopt = app.validate(info)
    if (adopt) {
      app.api('cc_valid_login_name', {loginName: info.loginName.value}).then(res => {
        if (res && !res.apiError) {
          app.api('agent_app_employee_add', params).then(res2 => {
            if (!res2.apiError) {
              app.showToast('添加员工成功')
              wx.navigateBack()
            }
          })
        }
      })
    }
  }
})
