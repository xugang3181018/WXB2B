import { authCode, pay, query } from "../../servers/api"

function payMarch(params, that) {
  // console.log(params)
  let memberSecond = that.data.memberSecond
  let memberPayment = that.data.memberPayment
  if (memberSecond === 0) {
    // console.log(0)
    that.payFail()
    clearTimeout(that.time)
    that.time = null
    return
  } else if (memberPayment === true) {
    // console.log('true')
    clearTimeout(that.time)
    that.time = null
    return
  }
  let time = setTimeout(function() {
    that.setData({
      memberSecond: memberSecond - 1
    }, () => {
      query(params).then(res => {
        // console.log(res)
        if (res.code === "SUCCESS") {
          that.setData({
            memberPayment: true
          }, () => {
            let date = JSON.stringify(res)
            my.hideLoading();
            my.redirectTo({ url: "../paysuccess/paysuccess?data=" + date })
            // console.log('true', 111)
            return
          });
        } else if (res.subCode === "PARAMETER_ERROR") {
          that.setData({
            memberPayment: true
          }, () => {
            that.payFail()
            // console.log('失败', 222)
            return
          });

        }
      })
      payMarch(params, that);
    });
  }, 1000)
}
Page({
  data: {
    nickName: "",
    headImgUrl: '',
    authPayCode: '',
    openId: "",
    shopNo: '',
    totalAmount: '',
    levelName: '',
    totalBalance: '',
    point: '',
    couponCount: '',
    fangdou: true,
    memberSecond: 30,
    memberPayment: ''
  },
  onLoad(options) {
    let data = JSON.parse(options.data)
    this.setData({
      authPayCode: data.authCode,
      openId: data.openId,
      headImgUrl: data.headImgUrl,
      nickName: data.nickName,
      shopNo: data.merchantCode,
      totalAmount: data.totalAmount,
      levelName: data.levelName,
      totalBalance: data.totalBalance,
      point: data.point,
      couponCount: data.couponCount
    })
    let money = JSON.stringify(data.totalAmount)
    my.ix.voicePlay({
      eventId: 'e4',
      number: money,
      success: (r) => {
      }
    });
  },

  //换取会员授权支付码
  balance() {
    my.showLoading({
      content: '支付中...',
      delay: '1000',
    });
    let { fangdou, openId, authPayCode, shopNo, totalBalance, totalAmount } = this.data
    if (fangdou === true) {

      this.setData({
        fangdou: false
      })
      let params = {
        openId,
        authPayCode,
        shopNo
      }

      //会员余额小于支付余额
      if (JSON.parse(totalBalance) < JSON.parse(totalAmount)) {
        // console.log(111)
        let loginInfo = my.getStorageSync({
          key: 'loginInfo', // 缓存数据的key
        }).data;
        let data = {
          authCode: authPayCode,
          merchantCode: shopNo,
          orderSource: '5',
          outTradeNo: JSON.stringify(new Date().getFullYear()) + JSON.stringify(new Date().getTime()),
          totalAmount: totalAmount,
          operatorId: loginInfo.operatorId
        }
        pay(data).then(res => {
          // console.log(res, 111)
          let date = JSON.stringify(res)
          if (res.code === "FAILED" && res.subCode === "USER_PAYING") {
            // console.log(data, '支付中')
            params = {
              merchantCode: data.merchantCode,
              operatorId: data.operatorId,
              outTradeNo: data.outTradeNo
            }
            payMarch(params, this)
          } else if (res.code === "SUCCESS") {
            my.redirectTo({ url: "../paysuccess/paysuccess?data=" + date })
          } else {
            this.payFail()
          }
        })
      } else {
        authCode(params).then(res => {
          this.payAuthCode(res.payAuthCode)
        })
      }
    }
  },
  payAuthCode(payAuthCode) {
    let { shopNo, totalAmount, authPayCode } = this.data
    let loginInfo = my.getStorageSync({
      key: 'loginInfo', // 缓存数据的key
    }).data;
    let params = {
      authCode: payAuthCode,
      merchantCode: shopNo,
      orderSource: '5',
      outTradeNo: JSON.stringify(new Date().getFullYear()) + JSON.stringify(new Date().getTime()),
      totalAmount: totalAmount,
      operatorId: loginInfo.operatorId
    }
    pay(params).then(res => {
      // console.log(res)
      let data = JSON.stringify(res)
      if (res.code === "SUCCESS") {
        my.redirectTo({ url: "../paysuccess/paysuccess?data=" + data })
      } else {
        this.payFail()
      }
      this.setData({
        fangdou: true
      })
    })
  },


  //支付失败
  payFail() {
    my.hideLoading();
    my.showToast({
      type: 'fail',
      content: '支付失败',
      duration: 2000,
      success: () => {
        my.redirectTo({ url: '../home/home' })
      },
    });
  }
});
