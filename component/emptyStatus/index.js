
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    type: {
      type: String,
      value: 'normal'
    },
    url: {
      type: String,
      value: null
    },
    text: {
      type: String,
      value: null
    }
  },
  lifetimes: {
    attached() {
      this.anm = wx.createAnimation({
        timingFunction: 'ease'
      })
      this.anm.translateY('40%').opacity(0).step()
      this.setData({
        imageAnm: this.anm.export(),
        textAnm: this.anm.export(),
      })
    },
		ready() {
			this.txtanm = wx.createAnimation({
				timingFunction: 'ease'
			})
			this.anm = wx.createAnimation({
				timingFunction: 'ease'
			})
			this.anm.translateY(0).opacity(1).step()
			this.txtanm.translateY(0).opacity(1).step({
				delay: 200
			})
			this.setData({
				imageAnm: this.anm.export(),
				textAnm: this.txtanm.export()
      })
		}
  },
  data: {
    imageAnm: {},
    textAnm: {},
  },
  methods: {
    btnTap({ currentTarget }) {
      let dataset = currentTarget.dataset
      console.log(currentTarget, dataset.url)
      if (dataset.url) {
        wx.redirectTo({
					url: '/pages/index/index',
				})
      }
    }
  }
})