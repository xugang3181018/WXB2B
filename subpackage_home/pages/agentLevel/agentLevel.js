const app = getApp()
Page({
  data: {
    levelImgList: [
      null,
      'tongpai2.png',
      'yinpai2.png',
      'jiangpai2.png',
      'baijin2.png',
      'zuanshi2.png',
      'huangguan2.png',
    ],
    levelList: ['C', 'B', 'A', 'VIP', 'SVIP'],
    agentLevel: app.getImage('agentLevel.png'),
    nowLevel: app.getImage('nowLevel.png'),
    nextLevel: app.getImage('nextLevel.png'),
    levelImg: null,
    level: null,
    rules: [
      {
        level: 'SVIP',
        count: '50000笔以上',
      },
      {
        level: 'VIP',
        count: '20000-49999笔',
      },
      {
        level: 'A',
        count: '5000-19999笔',
      },
      {
        level: 'B',
        count: '1000-4999笔',
      },
      {
        level: 'C',
        count: '1000笔以下',
      },
    ]
  },

  onLoad() {
    this.getAgentInfo()
    this.getAgentLevel()
  },

  // 获取钱包信息
  getAgentInfo() {
    const {levelImgList} = this.data
    const params = {
      agent_no: app.common('agentNo'),
      out_request_no: app.random(),
      login_name: app.common('loginName')
    }
    app.api2('front.lft.agent.info', params).then(res => {
      if (res && !res.apiError) {
        let levelImg = null
        if (levelImgList[res.level_list[0].level] !== null) {
          levelImg = app.getImage(levelImgList[res.level_list[0].level])
        }
        this.setData({levelImg})
      }
    })
  },

  // 获取代理商等级
  getAgentLevel() {
    const {levelList} = this.data
    const params = {
      agent_no: app.common('agentNo'),
    }
    app.api2('front.agentlevel.query', params).then(res => {
      if (res && !res.apiError) {
        const now = new Date()
        const monthEnd = app.formatDate(new Date(now.getFullYear(), now.getMonth()+1, 0), "yyyy-MM-dd")
        let count = {}
        if (res.transaction_num < 1000) {
          count = {
            upgrade: '1000',
            percent: `${res.transaction_num / 1000 * 100}`,
            level: 0,
            nowLevel: 'C',
            nextLevel: 'B'
          }
        } else if (res.transaction_num >= 1000 && res.transaction_num < 5000) {
          count = {
            upgrade: '5000',
            percent: `${(res.transaction_num - 1000) / 4000 * 100}`,
            level: 1,
            nowLevel: 'B',
            nextLevel: 'A'
          }
        } else if (res.transaction_num >= 5000 && res.transaction_num < 20000) {
          count = {
            upgrade: '20000',
            percent: `${(res.transaction_num - 5000) / 15000 * 100}`,
            level: 2,
            nowLevel: 'A',
            nextLevel: 'VIP'
          }
        } else if (res.transaction_num >= 20000 && res.transaction_num < 50000) {
          count = {
            upgrade: '50000',
            percent:`${(res.transaction_num - 20000) / 30000 * 100}`,
            level: 3,
            nowLevel: 'VIP',
            nextLevel: 'SVIP'
          }
        } else if (res.transaction_num >= 50000) {
          count = {
            upgrade: '50000',
            percent: 100,
            level: 4,
            nowLevel: 'VIP',
            nextLevel: 'SVIP'
          }
        }
        count.count = res.transaction_num
        this.setData({level: levelList[res.agent_level - 1], count, monthEnd})
      }
    })
  },
})
