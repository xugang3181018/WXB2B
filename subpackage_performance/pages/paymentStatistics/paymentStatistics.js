const app = getApp()
import echarts from '../../componets/ec-canvas/echarts.min'
var Chart = null

Page({
  data: {
    ec: {},
    nowDate: null, // 当前时间
  },

  onLoad(options) {
    this.echartsComponnet = this.selectComponent('#mychart-dom-bar')
    this.setData(options)
    this.getData(options.nowDate)
  },

  onUnload() {
    Chart = null
  },

  // 改变日期
  onChange(e) {
    this.getData(e.detail)
  },

  // 获取数据
  getData(startdate) {
    let params = {
      agentNo: app.common('agentNo'),
      startDate: startdate !== undefined ? startdate : app.formatDate(new Date() - 24 * 60 * 60 * 1000, 'yyyy-MM-dd')
    }
    app.api('agent_app_trade_query', params).then(res => {
      if (res && !res.apiError) {
        const data = [
          {
            alipay: '支付宝-官方',
            wechat: '微信-官方',
            alipayPic: app.getImage('alipay.png'),
            wechatPic: app.getImage('weixin.png'),
            alipayTradeCount: res.alipayTradeCount,
            alipayTradeAmount: res.alipayTradeAmount,
            alipayIncomeAmount: res.alipayIncomeAmount,
            wechatTradeCount: res.wechatTradeCount,
            wechatTradeAmount: res.wechatTradeAmount,
            wechatIncomeAmount: res.wechatIncomeAmount
          },
        ]
        const type = ['ks', 'ws', 'ls', 'hf']
        const name = ['客商', '网商', '乐刷', '汇付']
        const pic = ['meizhou', 'wspay', 'ls', 'hf']
        type.forEach((item, index) => {
          const obj = {
            alipay: `支付宝-${name[index]}`,
            wechat: `微信-${name[index]}`,
            alipayPic: app.getImage(`${pic[index]}.png`),
            wechatPic: app.getImage(`${pic[index]}.png`),
            alipayTradeCount: res[`${item}AlipayTradeCount`],
            alipayTradeAmount: res[`${item}AlipayTradeAmount`],
            alipayIncomeAmount: res[`${item}AlipayIncomeAmount`],
            wechatTradeCount: res[`${item}WechatTradeCount`],
            wechatTradeAmount: res[`${item}WechatTradeAmount`],
            wechatIncomeAmount: res[`${item}WechatIncomeAmount`]
          }
          data.push(obj)
        })
        this.setData({trade: res, info: data, nowDate: startdate})
        if (!Chart) {
          this.init_echarts() //初始化图表
        } else {
          this.setOption(Chart) //更新数据
        }
      }
    })
  },

  //初始化图表
  init_echarts() {
    this.echartsComponnet.init((canvas, width, height) => {
      Chart = echarts.init(canvas, null, {width, height})
      this.setOption(Chart)
      return Chart
    })
  },

  // 重置图表
  setOption(Chart) {
    Chart.clear()  // 清除
    Chart.setOption(this.getOption())  //获取新数据
  },

  // 获取图表数据
  getOption() {
    // 指定图表的配置项和数据
    const {trade} = this.data
    const _that = this
    let mobile = wx.getSystemInfoSync()
    let rpx = mobile.windowWidth / 750
    const option = {
      legend: {
        orient: 'vertical',
        right: '14%',
        top: '3%',
        itemGap: 12 * rpx,
        itemWidth: 22 * rpx,
        itemHeight: 22 * rpx,
        textStyle: {
          color: '#323232',
          fontSize: 24 * rpx,
        }
      },
      series: [
        {
          type: 'pie',
          name: '',
          radius: [80 * rpx, 135 * rpx],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            fontSize: 12 * rpx,
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          center: [230 * rpx, 190 * rpx],
          color: ['#3F9FDF', '#52CA40', '#FAD34B', '#37D0DD', '#E25541', 'pink', 'red', '#B068DD', '#536325', '#124254'],
          data: [
            {value: trade.alipayTradeAmount, name: `${_that.getPercent(trade.alipayTradeAmount)}% 支付宝官方`},
            {value: trade.wechatTradeAmount, name: `${_that.getPercent(trade.wechatTradeAmount)}% 微信官方`},
            {value: trade.ksAlipayTradeAmount, name: `${_that.getPercent(trade.ksAlipayTradeAmount)}% 支付宝客商`},
            {value: trade.ksWechatTradeAmount, name: `${_that.getPercent(trade.ksWechatTradeAmount)}% 微信客商`},
            {value: trade.wsAlipayTradeAmount, name: `${_that.getPercent(trade.wsAlipayTradeAmount)}% 支付宝网商`},
            {value: trade.wsWechatTradeAmount, name: `${_that.getPercent(trade.wsWechatTradeAmount)}% 微信网商`},
            {value: trade.lsAlipayTradeAmount, name: `${_that.getPercent(trade.lsAlipayTradeAmount)}% 支付宝乐刷`},
            {value: trade.lsWechatTradeAmount, name: `${_that.getPercent(trade.lsWechatTradeAmount)}% 微信乐刷`},
            {value: trade.hfAlipayTradeAmount, name: `${_that.getPercent(trade.hfAlipayTradeAmount)}% 支付宝汇付`},
            {value: trade.hfWechatTradeAmount, name: `${_that.getPercent(trade.hfWechatTradeAmount)}% 微信汇付`},
          ]
        }
      ]
    }
    return option
  },

  getPercent(n) {
    const trade = this.data.trade
    const total = trade.alipayTradeAmount + trade.wechatTradeAmount + trade.ksAlipayTradeAmount + trade.ksWechatTradeAmount + trade.wsAlipayTradeAmount + trade.wsWechatTradeAmount + trade.lsAlipayTradeAmount + trade.lsWechatTradeAmount
    if (total === 0) return 0
    return app.toFixed(n / total * 100, 2)
  }
})
