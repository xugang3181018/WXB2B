import { shiftlogQuery } from '../../servers/api'
const base = require('../../utils/util')
Page({
  data: {
    list: [],
    status: true,
    signInTime: base.formatTime(new Date()).date + " " + "00:00:00",
    signOutTime: "",
    calendarStatus: false,
    signInTimeString: '',
    signOutTimeString: ''
  },
  onLoad() {
    this.setData({
      signOutTime:base.formatTime(new Date()).dateTime
    })
    this.getRecoreList()
  },

  getRecoreList() {
    let loginInfo = my.getStorageSync({ key: 'loginInfo' }).data
    let { signInTimeString, signOutTimeString } = this.data
    console.log(signInTimeString, signOutTimeString)
    let params = {
      merchantCode: loginInfo.merchantCode,
      operatorId: loginInfo.operatorId,
      signInTime: signInTimeString || base.formatTime(new Date()).fullYear + '000000',
      signOutTime: signOutTimeString || base.formatTime(new Date()).time
    }
    shiftlogQuery(params).then(res => {
      console.log(res, 'res')
      if (res.code === "SUCCESS" && res.shiftLogs.length !== 0) {
        this.setData({
          list: res.shiftLogs,
          status: true
        })
      } else {
        if (signInTimeString) {
          this.setData({
            signInTime: base.strDateFormat(signInTimeString),
            signOutTime: base.strDateFormat(signOutTimeString),
            status: false
          })
        } else {
          this.setData({
            status: false
          })
        }
      }
    })
  },

  onTimeSelrctor(value) {
    this.setData({
      signInTimeString:value[0],
      signOutTimeString:value[1]
    })
    this.getRecoreList()
  },

  onAccountDetails(data) {
    let details = my.setStorageSync({
      key: 'details',
      data: data.target.dataset.item
    })
    my.navigateTo({
      url: "/pages/accountDetails/accountDetails"
    })
  },
});
