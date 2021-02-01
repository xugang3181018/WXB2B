// components/Calendar/Calendar.js
const app = getApp()
Component({
  properties: {
    status: {
      type: Boolean,
      value: true
    },
  },
  data: {
    taday: app.base.startDate('', 'yyyy-MM-dd'),
    title: '',
    open: false
  },
  attached(){
    this.initCalendar()
    console.log(this.data)
    this.animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    this.animation.translateY('100%').translateY(0).step()
    this.setData({
      animation: this.animation.export(),
      taday: app.base.startDate('', 'yyyy-MM-dd')
    })
  },
  methods: {
    num(str) {
      return str < 10 ? `0${str}` : str
    },
    prevDate(e) {
      this.initCalendar(this.cal(-1))
    },
    nextDate(e) {
      this.initCalendar(this.cal(+1))
    },
    sliderOut() {
      wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 1000,
        timingFunction: "ease",
        delay: 0
      })
    },
    initCalendar(arg) {
      let time = arg ? new Date(arg) : new Date(),
        thisY = time.getFullYear(),
        thisM = time.getMonth(),
        thisD = time.getDate(),
        weeks = "一二三四五六日".split(''),
        monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        pastMleft = {
          0: 6,
          1: 7,
          2: 1,
          3: 2,
          4: 3,
          5: 4,
          6: 5
        },
        num = str => str < 10 ? `0${str}` : str
      monthDays[1] = (thisY % 400 == 0 || (thisY % 4 == 0 && thisY % 100 == 0)) ? 29 : 28
      console.log(thisM)
      let pastM = thisM - 1,
        realM = thisM + 1,
        taday = `${thisY}/${num(realM)}/${num(thisD)}`,
        firstDW = new Date(thisY, thisM, 1).getDay(),
        thisMD = monthDays[thisM],
        pastMD = pastMleft[firstDW],
        nextMD = 42 - thisMD - pastMD
      pastM = pastM < 0 ? 11 : pastM
      let lists = [],
        pastM_lastD = monthDays[pastM],
        week = [],
        days = [],
        title = `${thisY}-${num(realM)}`
      for (var i = 0, l = weeks.length; i < l; i++) {
        week.push(weeks[i])
      }
      for (var i = 0; i < pastMD; i++) {
        let mm = thisM - 1
        days.push(`${mm < 0 ? thisY - 1 : thisY}-${thisM == 0 ? "12" : num(mm + 1)}-${num(pastM_lastD - pastMD + i + 1)}`)
      }
      for (var i = 1; i <= thisMD; i++) {
        days.push(`${thisY}-${num(thisM + 1)}-${num(i)}`)
      }
      for (var i = 0; i < nextMD; i++) {
        let mm = thisM + 1
        days.push(`${mm > 11 ? thisY + 1 : thisY}-${mm > 11 ? num(1) : num(mm + 1)}-${num(i + 1)}`)
      }
      this.setData({
        week,
        days,
        title,
        taday: arg ? this.data.taday : taday
      })
    },
    cal(type) {
      let date = this.data.title.split('-'),
        y = Number(date[0]),
        m = Number(date[1]),
        mm = (m - 1) + (type)
      console.log(y, m, mm)
      if (mm > 11) {
        mm = 0
        y = y + 1
      } else if (mm < 0) {
        mm = 11
        y = y - 1
      }
      return `${y}/${mm+1}/01`
    },
    changeMonth(e) {
      console.log(e.detail.current)
    },
    hiddenCal(date) {
      this.animation = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease",
        delay: 0
      })
      this.animation.translateY(0).translateY('100%').step()
      this.setData({
        animation: this.animation.export()
      })
      this.triggerEvent('change', date)
    },
    selectDate(e) {
      let days = this.data.days
      const detail = {
        startDate: days[this.data.start],
        endDate: days[this.data.end]
      }
      this.hiddenCal(detail)
    },
    toggle(e) {
      this.setData({
        open: !this.data.open
      })
    },
    selectDay(e) {
      console.log(e)
      var current = e.target.dataset.index,
        s = this.data.start,
        e = this.data.end,
        start = current > e ? e : current,
        end = current < s ? s : current
      start = current > e && current > s ? s : current
      end = current < s && current < e ? e : current
      if ((end - start) > 6 && this.data.status) {
        wx.showToast({
          title: '选择时间不能大于7天',
          icon: 'none'
        })
      }
      this.setData({
        start,
        end
      })
    }
  }
})