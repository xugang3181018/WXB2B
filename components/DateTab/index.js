// components/dateTabBar/index.js
const base = require('../../utils/util.js')
const now = new Date()
const taday = now.Format('yyyy-MM-dd')
const tadayNow = now.Format('yyyy-MM-dd hh:mm:ss')
Component({
  properties: {
    current: {
      type: String,
      value: 0
    },
		dateValue: {
			type: String,
			value: ''
		},
		searchDate: {
			type: Object,
			value: 0
		},
    data: {
      type: Array,
      dateValue:taday,
      value: [{
          value: '今天',
          date: [`${taday} 00:00:00`, tadayNow]
        },
        {
          value: '昨天',
          date: [`${base.startDate(1, 'yyyy-MM-dd')} 00:00:00`, `${base.startDate(1, 'yyyy-MM-dd')} 23:59:59`]
        },
        {
          value: '近7天',
          date: [`${base.startDate(7, 'yyyy-MM-dd hh:mm:ss')}`, tadayNow]
        },
        {
          value: '全部',
          date: null,
        },
      ]
    }
  },
  options: {
    addGlobalClass: true,
  },
  data: {
    date: ['今天', '昨天', '近7天', '其他']
  },
  methods: {
    clickTab({ currentTarget }) {
      const current = currentTarget.dataset.index
      const date = this.data.data[current].date
      let params = {}
      this.setData({
        current
      })
      if (this.data.data[current].date instanceof Array) {
        params.startTime = date[0]
        params.endTime = date[1]
      }
      this.triggerEvent('click', params)
    },
    dateChange(e){
      console.log(e)
    },
		otherDate(e) {
			wx.navigateTo({
        url: '/pages/dateRange/dateRange',
			})
		}
  }
})