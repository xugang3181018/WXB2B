const app = getApp()

Page({
  data: {
    list: [], // 文档列表
    dataempty: app.getImage('dataempty.png'),
    ider: app.getImage('ider.png'),
  },

  onLoad(options) {
    this.setData(options)
    this.getFileList(options.namespace)
  },

  // 获取企业文件列表列表
  getFileList(namespace) {
    app.api5(`/repos/${namespace}/docs`).then(res => {
      if (res && !res.apiError) {
        this.setData({list: res})
      }
    })
  },

  // 跳转到文档列表
  toFileDetail(e) {
    const {slug} = e.currentTarget.dataset
    const query = `namespace=${this.data.namespace}&slug=${slug}`
    wx.navigateTo({url: `../fileDetail/fileDetail?${query}`})
  }
})
