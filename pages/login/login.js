
import { login, shiftlogSave } from '../../servers/api'
const base = require('../../utils/util.js')
Page({
  data: {
    userName: "",
    passWord: "",
    value: '',
    fangdou: true,
    rememb: true
  },
  onLoad() {
    my.ix.offKeyEventChange();
    let nameWord = my.getStorageSync({
      key: 'usnpas', // 缓存数据的key
    }).data;
    if (nameWord) {
      this.setData({
        userName: nameWord.userName,
        passWord: nameWord.passWord,
        rememb: nameWord.rememb
      })
    }
  },

  showLoading() {
    my.showLoading({
      content: '登录中...',
      delay: '1000',
    });
    setTimeout(() => {
      my.hideLoading();
    }, 5000);
  },

  onSubmit(e) {
    let { userName, passWord } = e.detail.value
    let dataTime = my.getStorageSync({ key: "timeRecord" }).data
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    let judge = my.getStorageSync({ key: "judge" }).data
    let date = base.formatTime(new Date()).time
    console.log(dataTime, "dataTime")
    this.showLoading()
    if (this.data.fangdou === true) {
      this.setData({
        fangdou: false
      })
      login({
        userName,
        passWord
      }).then(res => {
        console.log(res, res.operatorId, '登录成功后')
        //账号不一样时
        let judge = my.getStorageSync({ key: "judge" }).data
        if (loginInfo) {
          if (res.operatorId !== loginInfo.operatorId) {
            if (dataTime) {
              let params = {
                merchantCode: loginInfo.merchantCode,
                operatorId: loginInfo.operatorId,
                signInTime: dataTime.signOutTime,
                signOutTime: date
              }
              shiftlogSave(params).then(res => {
                console.log(res)
                if (res.code === 'SUCCESS') {
                  my.setStorage({
                    key: 'timeRecord',
                    data: {
                      signInTime: dataTime.signOutTime,
                      signOutTime: date
                    },
                  });
                }
              })
            } else {
              let params = {
                merchantCode: loginInfo.merchantCode,
                operatorId: loginInfo.operatorId,
                signInTime: loginInfo.loginTime,
                signOutTime: date
              }
              shiftlogSave(params).then(res => {
                console.log(res)
                if (res.code === 'SUCCESS') {
                  my.setStorage({
                    key: 'timeRecord',
                    data: {
                      signInTime: loginInfo.loginTime,
                      signOutTime: date
                    },
                  });
                }
              })
            }
          } else {
            if (dataTime) {
              my.removeStorage({ key: 'judge' })
            } else {
              if (!judge) {
                my.setStorageSync({ key: "judge", data: loginInfo })
              }
            }
          }
        }
        if (!this.data.rememb) {
          my.setStorage({
            key: 'usnpas',
            data: {
              userName: userName,
              passWord: passWord,
              rememb: false
            },
          });
        } else {
          this.onReset()
        }
        if (res.code === "SUCCESS") {
          my.setStorage({
            key: 'refund',
            data: {
              userName: userName,
              passWord: passWord
            },
          });
          this.navigateTo()
          my.setStorage({
            key: 'loginInfo',
            data: res // 要缓存的数据
          });
        } else {
          this.defeated()
        }
      })
    }
  },

  onReset() {
    this.setData({
      userName: "",
      passWord: "",
      rememb: true
    })
    my.removeStorage({
      key: 'usnpas',
      success: function () {
      }
    });
  },

  defeated() {
    my.hideLoading();
    my.showToast({ content: '账户或密码错误', redation: '2000' })
    this.setData({
      fangdou: true
    })
  },
  navigateTo() {
    let { value } = this.data
    if (value === "独立收银") {
      my.hideLoading();
      my.reLaunch({ url: '../home/home' })
    } else if (value === "联动收银") {
      my.hideLoading();
      my.reLaunch({ url: "../linkagemoney/linkagemoney" })
    } else {
      my.hideLoading();
      my.alert({
        title: '请选择独立收银或联动收银'
      });
    }
    this.setData({
      fangdou: true
    })
  },
  onRemember(e) {
    this.setData({
      rememb: !this.data.rememb
    })
  },
  radioChange(e) {
    my.setStorage({
      key: 'cashierPattern',
      data: e.detail.value
    })
    this.setData({
      value: e.detail.value
    })
  }
});
