const app = getApp()

Page({
  data: {
    picList: [],
  },

  onLoad(options) {
    if (options.count === '1') {
      this.setData({picList: [app.getImage(`detail${options.index}.png`)]})
    } else {
      const picList = []
      for (let i = 0; i < Number(options.count); i++) {
        picList.push(app.getImage(`detail${options.index}-${i+1}.png`))
      }
      this.setData({picList})
    }
  }
})