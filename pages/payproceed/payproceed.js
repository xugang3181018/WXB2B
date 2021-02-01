import { query } from '../../servers/api'

function payMarch(params, that) {
  // console.log(params)
  let homeSecond = that.data.homeSecond
  let homePayment = that.data.homePayment
  // console.log(homeSecond)
  that.setData({
    homeSecond: homeSecond - 1
  })
  if (homeSecond === 0) {
    that.setData({
      fail: false
    }, () => {
      setTimeout(function() {
        that.payFail()
      }, 100)
    })
    clearTimeout(that.time)
    that.time = null
    return
  } else if (homePayment === true) {
    // console.log('true')
    that.setData({
      fail: false
    })
    clearTimeout(that.time)
    that.time = null
    return
  }
  let time = setTimeout(function() {
    // console.log(111)
    that.setData({
      homeSecond: homeSecond - 1
    }, () => {
      query(params).then(res => {
        // console.log(res)
        if (res.code === "SUCCESS") {
          that.setData({
            homePayment: true
          }, () => {
            let date = JSON.stringify(res)
            my.redirectTo({ url: "../paysuccess/paysuccess?data=" + date })
            return
          });
        } else if (res.subCode === "PARAMETER_ERROR") {
          that.setData({
            homePayment: true,
            fail: false
          }, () => {
            setTimeout(function() {
              that.payFail()
            }, 100)
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
    totalAmount: '',
    homeSecond: 30,
    homePayment: '',
    wxpay: '',
    alipay: '',
    fail: true
  },
  onLoad(options) {
    let data = JSON.parse(options.data)
    // console.log(data.totalAmount)
    let money = JSON.stringify(data.totalAmount)
    my.ix.voicePlay({
      eventId: 'e4',
      number: money,
      success: (r) => {
      }
    });
    if (data.payType === 'WXPAY') {
      this.setData({
        wxpay: true,
        totalAmount: data.totalAmount
      })
    } else if (data.payType === 'ALIPAY') {
      this.setData({
        alipay: true,
        totalAmount: data.totalAmount
      })
    } else {
      this.setData({
        totalAmount: data.totalAmount
      })
    }
    let params = {
      merchantCode: data.merchantCode,
      operatorId: data.operatorId,
      outTradeNo: data.outTradeNo,
    }
    payMarch(params, this)
  },
  onShow() {
    my.ix.onKeyEventChange((r) => {
      // console.log(r)
      if (r.keyCode == 133) {
        // console.log('取消')
        my.reLaunch({
          url: '../home/home',
        });
      }
    });
  },

  onHide() {
    my.ix.offKeyEventChange();
  },
  payFail() {
    my.hideLoading();
    my.showToast({
      type: 'fail',
      content: '支付失败',
      duration: 2000,
      success: () => {
        my.reLaunch({
          url: '../home/home',
        });
      },
    });
  }
});
