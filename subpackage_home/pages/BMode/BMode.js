const app = getApp()

Page({
  data: {
    link: [
      {url: '../BSOperation/BSOperation?pattern=chain&operation=create', name: '连锁模式', img: app.getImage('channel.jpg')},
      {url: '../BSOperation/BSOperation?pattern=single&operation=create', name: '单店模式', img: app.getImage('single.jpg')},
    ],
  },
})
