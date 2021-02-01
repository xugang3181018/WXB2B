//app.js
import {host} from './api/file/host'
import sa from './utils/sensorsdata.min'
const shence = host.getHost('shence')

App({
  onLaunch() {
    this.api = require("./api/api") // 老前置
    this.api2 = require("./api/api2") // 辛前置
    this.api3 = require("./api/api3") // EPS
    this.api4 = require("./api/api4") // 营销中心
    this.api5 = require("./api/api5") // 语雀
    this.loginTimer = null
    this.sa = sa
  },

  onShow() {
    const loginInfo = wx.getStorageSync('loginInfo')
    // 更新提示
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: "更新提示",
            content: "新版本已经准备好，请重启应用",
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
      } else {
        if (!loginInfo) return
        loginInfo.isLogin ? this.checkLogin() : null
      }
    })
    if (shence) {
      // 神策数据埋点
      sa.setPara({
        name: 'lianfutong-miniprogram',
        server_url: 'https://sensors.liantuofu.com/sa?project=production', // default
        // 全埋点控制开关
        autoTrack: false,
        // 自定义渠道追踪参数，如source_channel: ["custom_param"]
        source_channel: [],
        // 是否允许控制台打印查看埋点数据(建议开启查看)
        show_log: true,
        // 是否允许修改onShareAppMessage里return的path，用来增加(用户id，分享层级，当前的path)，在app onShow中自动获取这些参数来查看具体分享来源，层级等
        allow_amend_share_path: true
      })
      sa.registerApp({view_user_name: '联拓数科服务商助手'})
      sa.init()
      sa.setPara({
        autoTrack:{ 
          appLaunch:true, // true 则开启 $MPLaunch 事件采集，
          appShow:true, // true 则开启 $MPShow 事件采集
          appHide:true, // true 则开启 $MPHide 事件采集
          pageShow:true, // true 则开启 $MPViewScreen 事件采集
          pageShare:true, // true 则开启 $MPShare 事件采集
        }
      })
    }
    if (loginInfo.isLogin) sa.login(loginInfo.loginName)
  },

  // 页面不存在
  onPageNotFound() {
    wx.switchTab({url: 'pages/homePage/homePage'})
  },

  // 小程序切换到前台检测登录
  checkLogin() {
    const loginInfo = wx.getStorageSync('loginInfo')
    const overtime = wx.getStorageSync('overtime')
    const nowtime = new Date().getTime()
    if (!loginInfo.isLogin) return
    if (nowtime >= overtime) {
      wx.setStorageSync('overtime', (nowtime + 300000))
      const params = {loginName: loginInfo.loginName, loginPwd: loginInfo.loginPwd}
      params.operationDatetime = this.nowDate()
      params.partner_id = '10000002048131212'
      const _that = this
      this.api('agent_app_login', params).then(res => {
        if (res && !res.apiError) {
          clearTimeout(_that.loginTimer)
          _that.loginTimer = setTimeout(() => {
            _that.checkLogin()
          }, 300000)
        } else {
          const loginInfo = {loginName: params.loginName, isChecked: false, isLogin: false}
          wx.clearStorageSync()
          wx.setStorageSync('loginInfo', loginInfo)
          wx.showModal({
            title: '登录失效',
            content: res.msg,
            showCancel: false,
            success (res) {
              if (res.confirm) {
                clearTimeout(_that.loginTimer)
                _that.loginTimer = null
                wx.reLaunch({url: '/pages/login/login'})
              }
            }
          })
        }
      })
    } else {
      const second = overtime - nowtime
      clearTimeout(this.loginTimer)
      this.loginTimer = setTimeout(() => {
        this.checkLogin()
      }, second)
    }
  },

  common(value) {
    let member = wx.getStorageSync("member")
    return member[value]
  },

  // 当前时间
  nowDate() {
    return this.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
  },

  // 随机数
  random() {
    return `${this.formatDate(new Date(), "yyyyMMddhhmmss")}${Math.floor(Math.random() * 100)}`
  },

  // 获取图片
  getImage(name) {
    const HOST = host.getHost('image')
    return `${HOST}${name}`
  },
  
  // 弹窗
  showToast(title) {
    wx.showToast({
      title,
      icon: 'none',
      duration: 1500,
      mask: true
    })
  },

  // 删除对象里的空值
  dealElement(obj) {
    const param = {}
    if (obj === null || obj === undefined || obj === '') return param
    /* eslint-disable */
    for (let key in obj) {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        param[key] = obj[key]
      }
    }
    return param
  },

  // 深拷贝
  deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') return obj
    const result = Array.isArray(obj) ? [] : {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object') {
          result[key] = this.deepCopy(obj[key])   //递归复制
        } else {
          result[key] = obj[key]
        }
      }
    }
    return result
  },

  // 精确取整
  toFixed(num, s) {
    var times = Math.pow(10, s)
    var des = num * times + 0.5
    des = parseInt(des, 10) / times
    return des + ''
  },

  // 格式化时间
  formatDate(date, fmt) {
    date = new Date(date)
    var o = {
      "M+" : date.getMonth()+1,     //月份 
      "d+" : date.getDate(),     //日 
      "h+" : date.getHours(),     //小时 
      "m+" : date.getMinutes(),     //分 
      "s+" : date.getSeconds(),     //秒 
      "q+" : Math.floor((date.getMonth()+3)/3), //季度 
      "S" : date.getMilliseconds()    //毫秒 
    }
    if(/(y+)/.test(fmt)) fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length))
    for(var k in o) {
      if (new RegExp("("+ k +")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)))
    }
    return fmt
  },

  // 验证
  validate(list) {
    var reg = {
      word: /^[\u4e00-\u9fa5a-zA-Z\d\(\)\（\）]+$/, // 验证中文，大小写英文，中英文括号
      word2: /^[\u4e00-\u9fa5a-zA-Z\d\(\)\（\）\_]+$/, // 验证中文，大小写英文，中英文括号，下划线
      date: /^\d{4}-\d{2}-\d{2}$/, // 日期格式校验
      address: /^[\u4e00-\u9fa5a-zA-Z\d\(\)\（\）\,\，\、\n\-\|]+$/, // 验证地址
      custom: /^[\d\-]+$/, // 验证座机电话
      number: /^\d+$/, // 验证不为纯数字
      number2: /^\d+$/, // 验证是纯数字
      english: /^[a-zA-Z]+$/, // 不为纯英文
      phone: /^1\d{10}$/, // 验证手机号
      // phone2: /^(13\d|14[3-5, 7-9]|15[0-3, 5-9]|17[0, 1, 3, 5-8]|18\d|19[1, 8, 9])\d{8}$/, // 验证支持的手机
      phone2: /^1\d{10}$/, // 验证支持的手机
      email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/, // 验证邮箱
      legal: /^[\u4e00-\u9fa5\·]+$/, // 验证法人姓名
      chinese: /^[\u4e00-\u9fa5]+$/, // 只有中文
      chinese2: /[\u4e00-\u9fa5]/, // 不含中文
      componey: /公司/, // 含有公司
      businessLicenseNo: /^([a-zA-Z0-9]{15}|[a-zA-Z0-9]{18})$/, // 验证营业执照编号
      code: /^\d{6}$/ // 验证码
    }
    for (var attr in list) {
      const item = list[attr]
      if (item) {
        if ((item.value === null || item.value === undefined || item.value === '') && item.tip && item.tip[0] !== "") {
          this.showToast(item.tip[0])
          return false
        }
        if (item.value !== null && item.value !== undefined && item.value !== '' && item.type !== null) {
          let condition
          for (let i = 0; i < item.type.length; i++) {
            if (['number', 'chinese2', 'componey', 'english'].includes(item.type[i])) {
              condition = !reg[item.type[i]].test(item.value)
            } else {
              condition = reg[item.type[i]].test(item.value)
            }
            if (!condition) {
              this.showToast(item.tip[i + 1])
              return false
            }
          }
        }
      }
    }
    return true
  },

  // 获取地图信息
  getPermission(obj, latitude, longitude) {
    const _that = this
    wx.chooseLocation({
      latitude,
      longitude,
      success(res) {
        obj.setData({merchantLatitude: res.latitude, merchantLongitude: res.longitude, address: res.address})
      },
      fail() {
        wx.getSetting({
          success(res) {
            const status = res.authSetting
            if (!status['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success(tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success(data) {
                        if (data.authSetting['scope.userLocation'] === true) {
                          _that.showToast('授权成功')
                          wx.chooseLocation({
                            success(res) {
                              obj.setData({merchantLatitude: res.latitude, merchantLongitude: res.longitude, address: res.address})
                            }
                          })
                        } else {
                          _that.showToast('授权失败')
                        }
                      }
                    })
                  }
                },
                fail() {
                  _that.showToast('调用授权窗口失败')
                }
              })
            }
          }
        })
      }
    })
  },

  // 封装Promise.allSettled
  promiseAllSettled(promiseList) {
    return Promise.all(this.handlePromise(promiseList))
  },

  handlePromise(promiseList) {
    return promiseList.map(promise => 
      promise.then(res => ({status: 'ok', res}), err => ({status: 'fail', err}))  
    )
  }
})