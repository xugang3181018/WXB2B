import { employeeList } from '../../api/index.js'
const app = getApp()
Page({
    data: {
        loading: true,
        sex:{
            1:'男',
            2:'女'
        },
        status: ["删除","启用","禁用"]
    },
    onLoad(options) {
        this.setData({
            isPX: app.systemInfo.isPX
        })
    },
    onShow(){
        this.employeeList()
    },
    employeeList() {
        return employeeList({
            merchantCode: app.commonParams('merchantCode')
        }).then(res => {
            console.log(res)
            this.setData({
                list: res.employeeList,
                loading: false
            })
        })
    },
    addStaff(){
        wx.navigateTo({
            url: '/pages/staffModify/staffModify',
        })
    },
    staffDetail(e) {
        this.setData({
            detail: this.data.list[e.currentTarget.dataset.index],
        })
    },
    hidePanel(){
        this.setData({
            detail:null
        })
    },
    editStaff(e){
        wx.navigateTo({
            url: `/pages/staffModify/staffModify?id=${e.currentTarget.id}`,
        })
    }
})