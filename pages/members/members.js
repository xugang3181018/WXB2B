const  app = getApp()
import { memberGet, pointList, memberList } from '../../api/index.js'

Page({
    data: {
        loading: true,
        page: 0,
        ispx: app.isPX,
        hasmore: true
    },
    onShow() {
        this.memberList()
    },
    clearSearch() {
        this.memberList()
    },
    searchConfim(e) {
        this.memberList({
            mobile:e.detail
        })
    },
    closePanel(){
        this.setData({
            member:null
        })
    },
    addMembers(){
        wx.navigateTo({
            url: `/pages/membersCardSend/membersCardSend`,
        })
    },
    memberEdit(e){
        wx.navigateTo({
            url: `/pages/membersModify/membersModify?id=${e.currentTarget.dataset.id}`,
        })
    },
    memberDetail(e){
        // wx.navigateTo({
        //     url: `/pages/membersDetail/membersDetail?id=${e.currentTarget.dataset.id}`,
        // })
        memberGet({ memberId: e.currentTarget.dataset.id }).then(res => {
            console.log(res)
            let member = res.member
            this.setData({
                member
            })

            let params = {
                // physicalCardUid: this.data.member.memberCardNo,
                mobile: member.mobile,
                memberId: member.memberId,
                memberCardNo: member.memberCardNo
            }
            pointList(params).then(res => {
                console.log(res)
            })
        })
    },
    memberList(arg) {
        console.log(arg instanceof Object)
        let params = {
            merchantCode: app.commonParams('merchantCode'),
            pageNumber: (arg instanceof Object) ? 1 : this.data.page + 1,
            ...arg
        }
        memberList(params).then(res => {
            console.log(res)
            let hasmore = res.pageNumber == res.totalPage ? false : true,
                page = res.pageNumber,
                list = res.items
            list = page > 1 ? this.data.list.concat(res.items) : list
            this.setData({
                list,
                page: res.pageNumber,
                hasmore,
                loading: false
            })
        })
    },
    tolower(e) {
        if (this.data.hasmore) {
            this.memberList()
        }
    }
})