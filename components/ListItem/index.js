// components/storeCard/index.js
const app = getApp()
Component({
    options: {
        addGlobalClass: true
    },
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {
        index: {
            type: String,
            value: '',
        }
    },
    data: {
        anmData: {},
    },
    lifetimes: {
        attached() {
            this.anm = wx.createAnimation()
            this.anm.translateY('100%').opacity(0).step()
            this.setData({
                anmData: this.anm.export(),
            })
        },
        ready() {
            this.anm.translateY(0).opacity(1).step({
                delay: this.data.index * 100,
                duration: 600,
                timingFunction: 'ease'
            })
            this.setData({
                anmData: this.anm.export()
            })
        }
    },
    methods: {
    }
})
