import util from './utils/util.js';

App({
  onLaunch: function (option) {
    // this.checkLogin()
 
    // 获取导航高度；
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 97;
      }, fail(err) {}
    });
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });

    updateManager.onUpdateFailed(function () {
      return that.Tips({title:'新版本下载失败'});
    })
    //实例化聊天服务
  },
  $chat:null,
  globalData: {
    navHeight: 0,
    routineStyle: '#ffffff',
    openPages: '',
    spid: 0,
    code:0,
    urlImages: '',
    token: '',
    isLog:false,
    expiresTime:0,
    userInfo:{},
    loginType:'routine',
    merchantType:"",
    merchantCode:"",
    orderStatus:-1
  },

  currPage(length) {
    let curPageArr = getCurrentPages()
    return curPageArr[curPageArr.length - (length || 1)]
  },
  // 全局参数
  commonParams(arg) {
    try {
      let login = wx.getStorageSync("login")
      if (arg.constructor == Array) {
        let params = {}
        arg.forEach(item => params[item] = login[item])
        return params
      } else if (arg.constructor == String) {
        return login[arg]
      }
    } catch (error) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },

  // 检测登录
  // checkLogin() {
  //   if (wx.getStorageSync("login")) {
  //     this.merchant = wx.getStorageSync("login")
  //   } else {
  //     wx.reLaunch({
  //       url: '/pages/login/login'
  //     })
  //   }
  // },

  //检测更新
  updateManager() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      // 请求完新版本信息的回调
      console.log("是否有更新??===", res.hasUpdate)
    })
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(() => {
      // 新版本下载失败
      wx.showToast({
        title: '新版本下载失败',
        icon: "none"
      })
    })
  },
  tip(title) {
    wx.showToast({
      title: title,
      icon: 'none'
    })
  },
  //购物车显示的数量
  cartCount(sumCount){
    if (!sumCount) {
      //如果还未添加商品时候，可使用这个wx.removeTabBarBadge来移除
      wx.removeTabBarBadge({//移除tabbar右上角的文本
        index: 1,//tabbar下标
      })
    } else {
      //添加商品后通过wx.setTabBarBadge来进行设置
      wx.setTabBarBadge({//tabbar右上角添加文本
        index: 1,//tabbar下标
        text: sumCount.toString() //显示的内容,必须为字符串可通过toString()将number转为字符串
      })
    }
  },
  
  /**
   * 聊天事件快捷注册
   * 
  */
  $on: function (name, action){
    this.$chat.$on(name,action);
  },
  /*
  * 信息提示 + 跳转
  * @param object opt {title:'提示语',icon:''} | url
  * @param object to_url 跳转url 有5种跳转方式 {tab:1-5,url:跳转地址}
  */
  Tips: function (opt, to_url) { 
    return util.Tips(opt, to_url);
  },
  /**
   * 快捷调取助手函数
  */
  help:function()
  {
    return util.$h;
  },
  /*
  * 合并数组
  * @param array list 请求返回数据
  * @param array sp 原始数组
  * @return array
  */
  SplitArray: function (list, sp) { return util.SplitArray(list, sp)},
})