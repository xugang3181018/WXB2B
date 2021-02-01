const app = getApp()
import { memberGet, memberModify, levelList } from '../../api/index.js'

Page({
    data: {
        sex: ["男", '女'],
        operatorId: app.commonParams('operatorId')
    },
    onLoad(options) {
      this.setData({
        permission: options.permission
      })
        memberGet({
            memberId: options.id
        }).then(res => {
            let detail = res.member
            this.setData({
                detail,
                loading: false,
            })
            levelList({}).then(res => {
                console.log(res)
                this.setData({
                    levelList: res.items
                })
            })
        })
    },
    memberModify(e) {
        let params = {},
        list = e.detail.value
        for(let i in list){
            if(list[i]){
                params[i] = list[i]
            }
        }
        memberModify(params).then(res => {
            app.tip(res.msg)
            if(res.code=='SUCCESS'){
                wx.navigateBack()
            }
        })
    },

    changeLeve(e) {
      let { permission} = this.data
      if (permission == 1){
        wx.showToast({
        title: '您没有等级调整权限',
        icon: "none"
      })
      return
      }
        this.setData({
            level: e.detail.value
        })
    },
    changeSex(e) {
        this.setData({
            sexId: Number(e.detail.value)
        })
    },
    changeDate(e) {
        console.log(e)
        this.setData({
            brithday: e.detail.value
        })
    },
    changeCity(e) {
        this.setData({
            city: e.detail.value
        })
    }
})