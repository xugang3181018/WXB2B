const app = getApp()

Page({
  data: {
    dialogShow: false, // 是否显示详情
    list: [], // 员工列表
    detail: {}, // 员工详细信息
    currentPage: 1, // 当前页码
    searchContent: "", // 搜索的内容
    type: null, // 当前登录账号的角色类型
    height: wx.getSystemInfoSync().windowHeight - 60,
    normalcardimg: app.getImage('normalcardimg.png'),
    tel: app.getImage('tel.png'),
    avatar: app.getImage('avatar.png'),
  },

  onLoad() {
    this.getRole()
  },

  onShow() {
    this.getList(1)
  },

  // 获取员工列表
  getList(currentPage, searchContent = '') {
    const params = {currentPage, column: 20}
    if (searchContent !== '') params.salesmanName = searchContent
    app.api("agent_app_employee_list_query", params).then(res => {
      if (res && !res.apiError) {
        const info = {currentPage, searchContent}
        if (res.webMessage) {
          if (currentPage === 1) info.list = []
        } else {
          info.list = currentPage === 1 ? res : this.data.list.concat(res)
        }
        this.setData(info)
      }
    })
  },

  pullDownRefresh() {
    this.getList(1, this.data.searchContent)
  },

  reachBottom() {
    let {currentPage, searchContent} = this.data
    this.getList(++currentPage, searchContent)
  },

  // 打开员工详情
  openDialog(e) {
    const operationLoginName = e.currentTarget.dataset.salesmanloginname
    app.api("agent_app_employee_details", {}, operationLoginName).then(res => {
      if (res && !res.apiError) {
        res.employee.gmtCreated = app.formatDate(res.employee.gmtCreated, 'yyyy-MM-dd hh:mm:ss')
        this.setData({dialogShow: true, detail: res})
      }
    })
  },

  // 关闭员工详情
  closeDialog() {
    this.setData({dialogShow: false, detail: {}, employeeRole: {}})
  },

  // 获取搜索内容
  search(e) {
    this.getList(1, e.detail)
  },

  // 当清空搜索框时
  clearSearch() {
    if (this.data.searchContent) this.getList(1)
  },

  // 查询登录员工角色
  getRole() {
    const operationLoginName = app.common('loginName')
    app.api("agent_app_employee_details", {}, operationLoginName).then(res => {
      if (res && !res.apiError) this.setData({type: res.salesman.type})
    })
  },

  // 拨打电话
  phone(e) {
    const phoneNumber = e.currentTarget.dataset.phonenumber
    wx.makePhoneCall({phoneNumber})
  },

  // 添加员工
  addItem() {
    wx.navigateTo({url: `../addEmployee/addEmployee?type=${this.data.type}`})
  }
})
