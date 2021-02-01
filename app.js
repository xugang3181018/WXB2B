

import api from './servers/api'
App({
  globalData:{

  },
  onLaunch(options) {
  //   // 第一次打开
  //   // options.query == {number:1}
  //   this.api =  api
  //   let loginInfo = my.getStorageSync({key:'loginInfo'}).data
  //   let cashierPattern = my.getStorageSync({key:'cashierPattern'}).data
  //   console.log(loginInfo,cashierPattern)
  //   if (loginInfo.appId) {
  //         if (cashierPattern === "独立收银") {
  //     my.reLaunch({ url: '../home/home' })
  //   } else if (cashierPattern === "联动收银") {
  //     my.reLaunch({ url: "../linkagemoney/linkagemoney" })
  //   } else {
  //      my.reLaunch({ url: "../login/login" })
  //   }
  //   } 
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
