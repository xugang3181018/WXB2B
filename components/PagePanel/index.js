// components/PagePanel/index.js
const {
  isPX,
} = getApp()
Component({
  properties: {
    miniHeight: {
      type: String,
      value: 0,
    },
    showClose: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: 0,
    },
    type: {
      type: String,
      value: null,
    },
    bottom: {
      type: String,
      value: '',
    },
    zindex: {
      type: String,
      value: '',
    },
    hasBar: {
      type: Boolean,
      value: true,
      observers: function(newVal, oldVal) {
        if (!newVal) {
          this.setData({
            barHeight: 0
          })
        }
      }
    }
  },
  data: {
		isPX,
    oepn: false,
    barHeight: isPX ? 84 : 50,
  },
  lifetimes: {
    attached() {
      this.anmSlider = wx.createAnimation()
      this.anmMask = wx.createAnimation()
    },
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  methods: {
    togglePanel(e) {
      if (this.data.open) {
        this.anmSlider.translateY("100%").step()
        this.anmMask.opacity(0).step()
        this.setData({
          animationData: this.anmSlider.export(),
          animationMask: this.anmMask.export(),
        })
        setTimeout(() => {
          this.setData({
            open: false,
          })
        }, 400)
      } else {
        this.anmSlider.translateY("0").step()
        this.anmMask.opacity(1).step()
        this.setData({
          animationData: this.anmSlider.export(),
          animationMask: this.anmMask.export(),
          open: true,
        })
      }
    }
  }
})