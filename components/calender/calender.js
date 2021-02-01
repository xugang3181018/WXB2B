let base = require("../../utils/util")
Component({
  mixins: [],
  data: {
    calendarStatus: false,
    type: 0
  },
  props: {},
  didMount() { },
  didUpdate() { },
  didUnmount() { },
  methods: {
    handleSelect(e) {
      let date = new Date();
      let dateTime = ""
      console.log(new Date().toLocaleTimeString().substring(0,2))
      if (base.formatTime(e[1]).fullYear == date.toLocaleDateString().replace(new RegExp('/', 'g'), "")) {
       dateTime = base.formatTime(date).time.substring(8)
      }else{
        dateTime = '235959'
      }
      console.log(dateTime,base.formatTime(e[1]).fullYear + dateTime)
      let time = []
      time.push(base.formatTime(e[0]).fullYear + '000000', base.formatTime(e[1]).fullYear + dateTime)
      my.setStorageSync({
        key: 'calender',
        data: time
      });
    },

    onShowTost() {
      if (this.data.type === 0) {
        this.setData({
          calendarStatus: true
        })
      } else {
        this.setData({
          type: 0
        })
      }
    },

    onCancel() {
      this.setData({
        type: 1,
        calendarStatus: !this.data.calendarStatus
      })
    },

    onAffirm() {
      this.props.onTimeSelrctor(my.getStorageSync({ key: "calender" }).data)
      this.setData({
        type: 1,
        calendarStatus: !this.data.calendarStatus,
      })
    }
  },
});
