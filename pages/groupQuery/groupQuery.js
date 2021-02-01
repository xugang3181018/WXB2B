const base = require('../../utils/util')
Page({
  data: {
    startTime: base.strDateFormat(base.formatTime(new Date()).fullYear + '000000'),
    finishTime: "",
    calendarStatus: false,
  },
  onLoad() {
    this.setData({
      finishTime: base.formatTime(new Date()).dateTime
    })
    my.removeStorageSync({
      key: 'time'
    });
  },
  groupDetails() {
    my.navigateTo({ url: '../groupDetails/groupDetails' })
  },

  onTimeSelrctor(value) {
    this.setData({
      startTime: base.strDateFormat(value[0]),
      finishTime: base.strDateFormat(value[1])
    })
     my.setStorageSync({
      key: 'time',
      data: {
        startTimeString:base.formatYearMonthDate(value[0]),
        finishTimeString:base.formatYearMonthDate(value[1]),
        time:"235959"
      }
    })
  }
});
