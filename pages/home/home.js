import { pay, open, member, payAuthCode } from '../../servers/api'
const base = require('../../utils/util')
Page({
  data: {
    posid: 'idle_pos',                           // 海报位置id，目前固定传入idle_pos
    audible: true,                               // 海报（视频类）是否有声音
    default_poster: '../../images/home.gif',  // 本地兜底海报路径
    show_default_poster: true                    // 是否展示本地兜底海报
  },

  onLoad(options) {
    my.hideBackHome();
  },

  //监听键盘事件
  onShow() {
    let number = my.getStorageSync({ key: 'money' }).data
    // if (number) {
    //   this.defaultTap_jp(number.toString())
    // }
    my.ix.onKeyEventChange((r) => {
      console.log(r)
      if (r.keyCode == 131) {
        let money = r.amount
        if(number){
          this.defaultTap_jp(number.toString())
        }else if (money !== "0") {
          this.defaultTap_jp(money)
        } else {
          my.showToast({
            content: '金额不能为空',
            duration: 2000
          });
        }
      } else if (r.keyCode === 134) {
        my.showLoading({
          content: '加载中...',
          deration: '3000'
        });
        my.navigateTo({ url: '../setting/setting' })
        my.hideLoading();
      }
    });
  },

  //取消键盘监听
  onHide() {
    my.ix.offKeyEventChange();
  },

  //开启收银台获取付款码
  defaultTap_jp(money) {
    console.log(money)
    my.showLoading({
      content: '支付中...',
    });
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    console.log(loginInfo)
    let that = this
    my.ix.startApp({
      appName: 'cashier',
      bizNo: loginInfo.operatorId,
      totalAmount: money,
      // showScanPayResult: true,
      success: (r) => {
        // console.log(r)
        if (r.codeType === "F") {
          this.indent(r.barCode, money, r.codeType)
        } else {
          this.acquireOpenId(r.barCode, money, r.codeType)
        }
      },
      fail: (r) => {
        my.hideLoading()
      }
    });
  },
  //获取支付参数
  indent(authCode, money, codeType) {
    // my.showLoading({
    //   content: '支付中...',
    //   delay: '1000',
    // });
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    let params = {
      authCode: authCode,
      merchantCode: loginInfo.merchantCode,
      orderSource: '5',
      outTradeNo: JSON.stringify(new Date().getFullYear()) + JSON.stringify(new Date().getTime()),
      totalAmount: money,
      operatorId: loginInfo.operatorId
    }
    pay(params).then(res => {
      // console.log(res)
      if (res.code === "FAILED" && res.subCode === 'USER_PAYING') {
        let data = JSON.stringify(Object.assign(params, res))
        my.hideLoading();
        my.navigateTo({ url: "../payproceed/payproceed?data=" + data });
      } else if (res.code === "SUCCESS") {
        // my.hideLoading();
        console.log(res)
        if (codeType === 'F') {
          let arrList = [
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'ON', 'ON', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
            { 'cmd': 'addSetLineSpacing', 'args': ['30'] },
            { 'cmd': 'addText', 'args': ['支付宝刷脸支付'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },
            { 'cmd': 'addPrintAndFeedLines', 'args': ['3'] },
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'ON', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
            { 'cmd': 'addText', 'args': [`结算店员：${loginInfo.operatorName}`] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },
            { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': [`交易单号：${res.outTradeNo}`] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },
            { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': [`交易金额：${res.totalAmount}`] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },
            { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': [`优惠金额：${res.discountAmount}`] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },
            { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': [`实收金额：${res.receiptAmount}`] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },
            { 'cmd': 'addPrintAndFeedLines', 'args': ['2'] },
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
            { 'cmd': 'addText', 'args': [`打印日期：${base.formatTime(new Date()).dateTime}`] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },
            { 'cmd': 'addPrintAndFeedLines', 'args': ['1'] },
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
            { 'cmd': 'addText', 'args': ['生意兴隆'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },
            { 'cmd': 'addPrintAndFeedLines', 'args': ['4'] },
          ]
          my.ix.printer({
            cmds: arrList,
            success: (r) => {
              console.log(r, "success");
              // my.hideLoading();
            },
            fail: (r) => {
              console.log("fail, errorCode:" + r.error);
              // my.hideLoading();
              // my.showToast({
              //   type: 'none',
              //   content: "找不到指定打印机",
              //   duration: 2000,
              // });
              return
            }
          });
        }
        this.parameter(res, codeType)
      } else {
        this.payFail()
      }
    })
  },
  //获取微信openId函数
  acquireOpenId(authCode, money, codeType) {
    // my.showLoading({
    //   delay: '1000',
    // });
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    let params = {
      merchantCode: loginInfo.merchantCode,
      authCode
    }
    open(params).then(res => {
      if (res.code === 0) {
        this.setData({
          openId: res.result
        })
        this.members(authCode, money, codeType, res.result)
      } else {
        // my.hideLoading();
        this.indent(authCode, money, codeType)
      }
    })
  },

  //判断是否是会员
  members(authCode, money, codeType, openId) {
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    let params = {
      appId: loginInfo.appId,
      openId
    }
    member(params).then(res => {
      if (res.code === "SUCCESS") {
        let params = {
          authCode,
          openId,
          merchantCode: loginInfo.merchantCode,
          totalAmount: money
        }
        // console.log(res, '会员')
        if (res.member.totalBalance < money) {
          this.indent(authCode, money, codeType)
        } else {
          let data = {
            openId,
            authPayCode: authCode,
            shopNo: loginInfo.merchantCode
          }
          payAuthCode(data).then(res => {
            this.indent(res.payAuthCode, money, codeType)
          })
        }
        // let data = JSON.stringify(Object.assign(res.member, params))
        // my.hideLoading()
        // my.navigateTo({ url: "../membersPay/membersPay?data=" + data });
      } else {
        this.indent(authCode, money, codeType)
      }
    })
  },

  //支付成功页面
  parameter(data, codeType) {
    // console.log(data, codeType)
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    my.hideLoading();
    if (codeType === "C") {
      let date = JSON.stringify(data)
      // console.log(date)
      my.navigateTo({ url: "../paysuccess/paysuccess?data=" + date });
    }
  },

  //支付失败
  payFail() {
    my.hideLoading();
    my.showToast({
      type: 'fail',
      content: '支付失败',
      duration: 2000,
      success: () => {
      },
    });
  },

  // 展示成功回调 
  onDisplaySuccess() {
    // console.log('poster display success');
    // 投放的海报成功展示后，取消兜底海报的展示
    this.setData({ show_default_poster: false });
  },
  // 展示失败回调 
  onDisplayFail(e) {
    // console.log('poster display fail, error = ' + e.detail.error);
  },
  // 广告可用性变化回调
  onPosterChange(e) {
    // console.log('poster availability changed, now has poster = ' + e.detail.hasPoster);
  },

  // 设置静音
  mute() {
    this.setData({ audible: false });
  },

  // 取消静音
  unmute() {
    this.setData({ audible: true });
  },

  // 暂停海报播放（视频类）
  pause() {
    if (typeof (this.posterContext) === 'undefined') {
      this.posterContext = my.createPosterContext('my_poster_id');
    }
    this.posterContext.pause({});
  },

  // 恢复海报播放（视频类）
  resume() {
    if (typeof (this.posterContext) === 'undefined') {
      this.posterContext = my.createPosterContext('my_poster_id');
    }
    this.posterContext.resume({});
  },
});
