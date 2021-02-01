import { open, member, authCode } from "../../servers/api"
Page({
  // data: {
  //   merchantId: '',
  //   merchantCode: "",
  //   appId: ""
  // },
  // onLoad(options) {
  //   let data = JSON.parse(options.data)
  //   console.log(data,'联动收银')
  //   this.setData({
  //     merchantCode: data.merchantCode,
  //     appId: data.appId
  //   })
  // },

  // onShow() {
  //   this.onKeyEvent()
  // },

  // //监听键盘事件
  // onKeyEvent() {
  //   my.ix.onKeyEventChange((r) => {
  //     if (r.keyCode == 131) {
  //       this.onPayment()
  //     }
  //   });
  // },

  onShow() {
    let that = this
    let loginInfo = my.getStorageSync({
      key: 'loginInfo', // 缓存数据的key
    }).data;
    my.ix.startApp({
      appName: 'cashier',
      bizNo: loginInfo.operatorId,
      // showScanPayResult: true,
      posTimeout:'-1',
      success: (r) => {
        this.cashier(r.barCode)
        // let { merchantCode} = this.data
        // if (r.codeType === "F") {
        //   this.cashier(r.barCode)
        // } else {
        //   //获取openId
        //   let data = {
        //     merchantCode,
        //     authCode: r.barCode
        //   }
        //   open(data).then(res => {
        //     if (res.code === 0) {
        //       this.member(res.result, r.barCode)
        //     } else {
        //       this.cashier(r.barCode)
        //     }
        //   })
        // }
      }
    });
  },
  //判断是否是会员
  //   member(openId,authPayCode) {
  //     let {appId,merchantCode} = this.data
  //     let data = {
  //       appId,
  //       openId
  //     }
  //     member(data).then(res => {
  //       if(res.code === "SUCCESS"){
  //         let data = {
  //           authPayCode,
  //           shopNo:merchantCode,
  //           openId
  //         }
  //         this.payAuthCode(data)
  //       }else{
  //         this.cashier(authPayCode)
  //       }
  //     })
  //   },

  // //获取会员支付授权码
  // payAuthCode(data){
  //   authCode(data).then(res=>{
  //     this.cashier(res.payAuthCode)
  //   })
  // },

  //发送付款码
  cashier(barCode) {
    let that = this
    my.ix.writeHID({
      protocol: 'barcode',
      value: barCode,
      success: (r) => {
        that.paySuccess()
      },
      fail: (r) => {
        my.showToast('fail: ' + JSON.stringify(r));
      }
    });
  },

  //付款成功
  paySuccess() {
    let loginInfo = my.getStorageSync({
      key: 'loginInfo', // 缓存数据的key
    }).data;
    my.ix.startApp({
      appName: 'scanPayResult',
      bizNo: loginInfo.operatorId,
      showScanPayResult: true,
      success: (r) => {
        // my.showToast({ content: JSON.stringify(r) });
      }
    });
  }
});
