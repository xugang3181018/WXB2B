const app = getApp()
const myPluginInterface = requirePlugin('myPlugin')
import {host} from '../../api/file/host'
const productEnv = host.getHost('role')

Page({
  data: {
    isAdmin: true,
    imgUrls: [
      {url: '../../subpackage_home/pages/bannerDetail/bannerDetail?index=4&count=1', img: app.getImage('banner4.png')},
      {url: '../../subpackage_home/pages/bannerDetail/bannerDetail?index=3&count=1', img: app.getImage('banner3.png')},
      {url: '../../subpackage_home/pages/bannerDetail/bannerDetail?index=1&count=1', img: app.getImage('banner1.png')},
      {url: '../../subpackage_home/pages/bannerDetail/bannerDetail?index=2&count=1', img: app.getImage('banner2.png')}
    ],
    message: 0,
    info: [
      {name: '钱包', data: '-', url: '/'},
      {name: '月日均交易笔数', data: '-', url: '/'},
      {name: '等级', data: '-', img: null, url: '../../subpackage_home/pages/agentLevel/agentLevel'}
    ],
    operation1: [
      {title: '快速进件', icon: app.getImage('ksjj.png'), url: '../../subpackage_home/pages/BSList/BSList?pattern=entry'},
      // {title: '客户服务', icon: app.getImage('khfw.png'), url: 'plugin://myPlugin/chat'},
      {title: 'VIP服务', icon: app.getImage('vip.png'), url: '../../subpackage_home/pages/vipServices/vipServices'},
      {title: '敬请期待', icon: app.getImage('khfw.png'), url: ''},
    ],
    operation2: [
      {title: '商户管理', icon: app.getImage('shanghu.png'), url: '../../subpackage_home/pages/BSList/BSList?pattern=business'},
      {title: '门店管理', icon: app.getImage('mendian.png'), url: '../../subpackage_home/pages/BSList/BSList?pattern=store'},
      {title: '查看进件', icon: app.getImage('jinjian.png'), url: '../../subpackage_home/pages/entryList/entryList'},
      {title: '进件催审', icon: app.getImage('expediting.png'), url: '../../subpackage_home/pages/entry_expediting/entry_expediting'},
    ],
    operation3: [
      {title: '提交工单', icon: app.getImage('gongdan.png'), url: '/', appId: '', path: ''},
      {title: '商城下单', icon: app.getImage('xiadan.png'), url: '/toOther', appId: 'wx6658cb1dca3de104', path: ''},
      {title: '在线课堂', icon: app.getImage('ketang.png'), url: '/toOther', appId: 'wx3cb58bd267904ad1', path: '/pages/show_open/show_open?liveId=4b8323eea56011ea8aac0a58ac13540e&company_from=34b84558292e11ea9d335254002f1020'},
      {title: '案例精选', icon: app.getImage('aljx.png'), url: '../../subpackage_yuque/pages/yuque/yuque', appId: '', path: ''},
    ],
    levelImgList: [
      null,
      'tongpai.png',
      'yinpai.png',
      'jiangpai.png',
      'baijin.png',
      'zuanshi.png',
      'huangguan.png',
    ],
    levelList: ['C', 'B', 'A', 'VIP', 'SVIP'],
    seceNumber:10,
    shade:false,
  },

  onLoad() {
    this.qiyu()
    //商户产品版本查询接口
    console.log(Promise.all)
    Promise.all([this.getProductList(), this.getEmployeeList(), this.getAgentInfo(), this.getTradeInfo(), this.getPermission(), this.getAgentLevel()])
  },
  onShow(){
    this.getAgentFlow()
  },
  onUnload() {
    const timer = this.data.timer
    clearInterval(timer)
    this.setData({timer: null})
  },
  
  //隐藏显示TabBar
  showHideTabBar(){
    wx.hideTabBar();
    this.setData({
      seceNumber:10,
    })
    let that = this,{seceNumber} = this.data;
    let  timeId = setInterval(function () {
      if(seceNumber<1){
        that.setData({
          seceNumber:0,
          shade:false,
        })
        wx.showTabBar()
        clearInterval(timeId)
        return
      }
      that.setData({
        seceNumber:--seceNumber
      })
    }, 1000)
  },

  // 配置七鱼
  qiyu() {
    myPluginInterface.__configAppId('gLydX92R1mW')
    myPluginInterface._$configAppKey('fa28a1264086fd9fd352aec13952f682')
    myPluginInterface.__configDomain("https://qiyukf.com")
    const userInfo = {
      userId: `${app.common('employeeCodeName')}`,
      data: [
        {"key": "real_name", "value": app.common('agentFullName')},
        {"index": 0, "key": "EWCode", "label": "EW编码", "value": `${app.common('employeeCodeName')}`},
      ],
    }
    myPluginInterface._$setUserInfoSync(userInfo)
    myPluginInterface._$setHistoryLimit(200)
    myPluginInterface._$onFileOpenAction((fileObj) => {
      const name = fileObj.name || ''
      const nameArr = name.split('.')
      const ext = (nameArr[nameArr.length - 1] || '').toLocaleLowerCase()
      // 针对文档类型，直接调用微信api进行打开
      if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip', 'rar', 'mp4', 'avi', 'wmv', 'mpg'].includes(ext)) {
        wx.openDocument({
          filePath: fileObj.tempFilePath,
          success: function (res) {}
        })
      } else {
        app.showToast({
          title: '暂不支持该文件类型预览'
        })
      }
    })
    const timer = setInterval(() => {
      let message = myPluginInterface._$getAllUnreadCount()
      message = message === undefined ? 0 : message
      this.setData({message})
    }, 1000)
    this.setData({timer, isAdmin: app.common('isAdmin')})
  },

  // 获取员工列表
  getEmployeeList() {
    app.api('agent_app_employee_list_query', {column: 500}).then(res => {
      if (res && !res.apiError) wx.setStorageSync("employee", res)
    })
  },

  // 获取产品列表
  getProductList() {
    const params = {agentNo: app.common('agentNo')}
    app.api('agent_app_merchant_product_list_query', params).then(res => {
      if (res && !res.apiError) wx.setStorageSync("product", res)
    })
  },

  // 获取钱包信息
  getAgentInfo() {
    const {info, levelImgList, isAdmin} = this.data
    if (!isAdmin) return
    const params = {
      agent_no: app.common('agentNo'),
      out_request_no: app.random(),
      login_name: app.common('loginName')
    }
    app.api2('front.lft.agent.info', params).then(res => {
      if (res && !res.apiError) {
        info[0].data = app.toFixed(Number(res.profit_account_balance) + Number(res.recharge_account_balance), 2)
        let levelImg = null
        if (levelImgList[res.level_list[0].level] !== null) {
          levelImg = app.getImage(levelImgList[res.level_list[0].level])
        }
        info[2].img = levelImg
        this.setData({agentInfo: res, info})
      }
    })
  },

  // 获取交易笔数
  getTradeInfo() {
    const {info, isAdmin} = this.data
    const day = new Date().getDay() + 1
    if (!isAdmin || day === 1) return // 当不是代理商或者每个月1号的时候，无法获取交易笔数
    const yesterday = app.formatDate((new Date().getTime() - 86400000), 'yyyy-MM-dd')
    let month = new Date().getMonth() + 1
    month = month < 10 ? `0${month}` : month
    const startDate = `${new Date().getFullYear()}-${month}-01`
    const params = {
      agent_no: app.common('agentNo'),
      out_request_no: app.random(),
      end_date: yesterday,
      start_date: startDate
    }
    app.api2('front.lft.agent.tradesummary', params).then(res => {
      if (res && !res.apiError) {
        const days = Math.floor((((new Date(yesterday).getTime() - new Date(startDate).getTime()) / 86400000) + 1))
        info[1].data = Math.round(res.trade_count / days)
        this.setData({info})
      }
    })
  },

  // 获取代理商等级
  getAgentLevel() {
    const {info, isAdmin, levelList, operation1} = this.data
    if (!isAdmin) return
    app.api2('front.agentlevel.query', {agent_no: app.common('agentNo')}).then(res => {
      if (res && !res.apiError) {
        const level = levelList[res.agent_level - 1]
        info[2].data = level
        operation1[2].url = `../../home/pages/vipServices/vipServices?level=${level}`
        this.setData({info, operation1})
      }
    })
  },

  // 代理商查流量
  getAgentFlow(){
    let {shade} = this.data
    app.api2('front.afa.agent.flow',{agent_no: app.common('agentNo')}).then(res=>{
      console.log(res,"代理商流量")
      if(res.is_success == "S"){
        console.log(JSON.parse(res.result).data,"获取代理商流量")
        let data = JSON.parse(res.result).data
        let number = !data?"":data.balance
        this.setData({
          shade:number<0?true:false,
          money:Math.abs(number)
        })
        if(number>0)return  
        this.showHideTabBar()
      }
    })
  },

  // 获取权限（代理商是否能够变更版本）
  getPermission() {
    const params = {
      out_request_no: app.random(),
      agent_no: app.common('agentNo'),
      product_id: productEnv,
      employee_id: app.common('employeeId'),
      menu_type: 2,
    }
    app.api2('front.agent.permission.list', params).then(res => {
      if (res && !res.apiError) {
        let canChangeProduct = false
        res.menuList.forEach(item => {
          if (item.operationName === '商户/门店版本编辑') canChangeProduct = true
        })
        wx.setStorageSync('canChangeProduct', canChangeProduct)
      }
    })
  },

  linkTo({currentTarget}) {
    const {url, appid, path} = currentTarget.dataset
    if (url === '/') {
      app.showToast('敬请期待')
      return
    } else if (url === '/toOther') {
      wx.navigateToMiniProgram({appId: appid, path})
    } else {
      wx.navigateTo({url})
    }
  },
})