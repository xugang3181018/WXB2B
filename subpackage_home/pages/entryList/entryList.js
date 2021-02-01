const app = getApp()
import ppevent from '../../../utils/ppevent'

Page({
  data: {
    tabs: [
      {auditorStatus: 0, title: '全部'},
      {auditorStatus: 2, title: '待审核'},
      {auditorStatus: 3, title: '处理中'},
      {auditorStatus: 4, title: '不通过'},
      {auditorStatus: 6, title: '审核通过'},
      {auditorStatus: 9, title: '银行审核中'},
      {auditorStatus: 10, title: '变更中'},
      {auditorStatus: 11, title: '变更失败'},
      {auditorStatus: 12, title: '变更成功'},
      {auditorStatus: 20, title: '待补齐资料'},
    ], // 选项卡
    height: wx.getSystemInfoSync().windowHeight - 104,
    activeTab: 0,
    searchContent: '', // 搜索内容
    list: null, // 进件信息
    type: '全部', // 当前选择的类型 全部 商户 门店
    typeDialog: false, // 选择类型窗口显示隐藏
    typeList: ['全部', '商户', '门店'], // 选择的类型列表
    merchangFlag: 0, // 商户标识 0：全部, 1:商户，2：门店
    auditorStatus: 0, //审核状态:0-全部，1-未提交 2-待审核 3-处理中 4-不通过 6-通过 8-支付开通失败9-银行审核中
    passType: 0, // 通道类型 1 支付宝 2 微信 3 银行（光大） 4 支付宝二清 5 微信二清 6-浦发银行 7 网商银行 8 客商银行
    pageNo: 1, // 页码
    scrollTop: 0,
    wspay: app.getImage('wspay.png'),
    meizhou: app.getImage('meizhou.png'),
    ls: app.getImage('ls.png'),
    hf: app.getImage('hf.png'),
    auditorStatusList: ['未提交', '待审核', '处理中', '未通过', '已重提', '审核通过', '支付开通中', '支付开通失败', '银行审核中', '变更中', '变更失败', '变更成功', '待确认', '待报名', '升级银行审核中', '待打款验证', '入住-待签约', ' 升级-待签约', '审核通过', '待补齐资料', '银行审核中', '银行审核中'],
  },

  onLoad() {
    ppevent.on('resubmit', this, function (res) {
      const list = this.data.list
      list[res].hidden = true
      console.log(list)
      this.setData({list})
    })
    this.getList(1)
  },

  // 获取商户列表
  getList(pageNo, searchContent = '') {
    const {merchangFlag, auditorStatus, wspay, meizhou, ls, hf, auditorStatusList, list} = this.data
    const params = {agentNo: app.common('agentNo'), merchangFlag, auditorStatus, passType: '78911', pageNo}
    if (searchContent !== '') params.merchangName = searchContent
    app.api('agent_app_ceb_audit_cfg_list_query', params).then(res => {
      console.log(res,"商户列表")
      if (res && !res.apiError) {
        const info = {searchContent, pageNo}
        if (res.webMessage) {
          if (pageNo === 1) info.list = []
        } else {
          const count = res.length
          if (count > 0) {
            res.forEach((item) => {
              item.formatDate = app.formatDate(item.gmtCreated, 'yyyy-MM-dd hh:mm:ss')
              switch (item.passType) {
                case 7:
                  item.src = wspay
                  break
                case 8:
                  item.src = meizhou
                  break
                case 9:
                  item.src = ls
                  break
                case 11:
                  item.src = hf
                  break
                default: item.src = null
              }
              item.status = null
              if ([6, 12, 19, 20].includes(item.auditorStatus)) item.status = 'success'
              if ([4, 11].includes(item.auditorStatus)) item.status = 'fail'
              item.auditorStatusText = auditorStatusList[item.auditorStatus - 1]
            })
          }
          if (pageNo === 1) {
            info.scrollTop = 0
            info.list = res
          } else {
            info.list = list.concat(res)
          }
        }
        this.setData(info)
      }
    })
  },

  pullDownRefresh() {
    this.getList(1, this.data.searchContent)
  },

  reachBottom() {
    let {pageNo, searchContent} = this.data
    this.getList(++pageNo, searchContent)
  },

  changeTabs(e) {
    const {activeTab} = e.detail
    const {tabs, searchContent} = this.data
    if (activeTab === this.data.activeTab) return
    this.setData({activeTab, auditorStatus: tabs[activeTab].auditorStatus})
    this.getList(1, searchContent)
  },

  // 获取搜索内容
  search(e) {
    this.getList(1, e.detail)
  },

  // 当清空搜索框时
  clearSearch() {
    if (this.data.searchContent) this.getList(1, '')
  },

  // 改变筛选类型的窗口
  changeType() {
    this.setData({typeDialog: !this.data.typeDialog})
  },

  // 改变筛选的类型
  changeListType(e) {
    const type = e.currentTarget.dataset.type
    const merchangFlag = type ? (type === '全部' ? 0 : (type && type === '商户' ? 1 : 2)) : 0
    this.setData({typeDialog: false})
    if (merchangFlag !== this.data.merchangFlag) {
      this.setData({merchangFlag, type})
      this.getList(1, this.data.searchContent)
    }
  },

  // 跳转到进件详情
  toEntryDetail({currentTarget}) {
    const {index, agentauditno, passtype, entrytype} = currentTarget.dataset
    wx.navigateTo({url: `../entryDetail/entryDetail?agentAuditNo=${agentauditno}&index=${index}&passType=${passtype}&entryType=${entrytype}&tabIndex=0`})
  }
})
