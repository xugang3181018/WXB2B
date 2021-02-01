const app = getApp()
const WxParse = require('../../components/wxParse/wxParse')

Page({
  data: {},

  onLoad(options) {
    this.getFileDetail(options.namespace, options.slug)
  },

  // 获得详情
  getFileDetail(namespace, slug) {
    const that = this
    app.api5(`/repos/${namespace}/docs/${slug}`).then(res => {
      if (res && !res.apiError) {
        let article = res.body_html
        article = article.replace(/<!doctype html>/, '')
        wx.setNavigationBarTitle({title: res.title})
        WxParse.wxParse('article', 'html', article, that, 0)
      }
    })
  },

  wxParseTagATap(e) {
    const url = e.currentTarget.dataset.src
    wx.showLoading({mask: true})
    // https://www.yuque.com/attachments/yuque/0/2019/pdf/328210/1575878472481-d49bea3f-4af3-4af6-a163-8f56437a48c8.pdf
    let fileType = ''
    const typeAry = ['doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf']
    typeAry.forEach(item => {
      if (url.indexOf(item) !== -1) fileType = item
    })
    wx.downloadFile({
      url,
      success(res) {
        const tempFilePath = res.tempFilePath
        wx.saveFile({
          tempFilePath,
          success(res) {
            wx.hideLoading()
          },
          fail(err) {
            console.log(err)
          }
        })
      },
      fail(err) {
        console.log('下载失败：', err)
      },
    })
  }
})
