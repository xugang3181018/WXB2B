const app = getApp()
import { memberGet, pointList, memberCouponList } from '../../api/index.js'

Page({
    data: {
        coupon: {
            items: []
        },
        toggle: 2,
        tab:{
            point:'积分',
            totalBalance:'余额',
            couponCount:'优惠券',
            lastConsumAmount:'消费额',
            timesCardCount:'次/月卡'
        }
    },
    onLoad(options) {
        if (options.id) {
            memberGet({
                memberId: options.id
            }).then(res => {
                console.log(res)
                let member = res.member
                this.setData({
                    member,
                    memberId: options.id,
                    loading: false,
                })
                this.couponList()
            })
        }
    },
    toggleList(e){
        console.log(e)
        this.setData({
            toggle: e.currentTarget.dataset.id
        })
    },
    pointList() {
        let member = this.data.member
        let params = {
            mobile: member.mobile,
            memberId: member.memberId,
            memberCardNo: member.memberCardNo
        }
        return pointList(params).then(res => {
            console.log(res)
        })
    },
    couponList() {
        let params = {
            memberId: this.data.memberId,
            pageNumber: this.data.coupon.pageNumber ? this.data.coupon.pageNumber + 1 : 1
        }
        return memberCouponList(params).then(coupon => {
            if (coupon.code == "SUCCESS") {
                let hasmore = coupon.totalPage == coupon.pageNumber ? false : true
                coupon.items = this.data.coupon.items.length > 0 ? this.data.coupon.items.concat(coupon.items) : coupon.items
                this.setData({
                    coupon,
                    hasmore,
                    tolower: false
                })
            }
        })
    },
    scrollToLower(e) {
        this.setData({
            tolower: true
        })
        if (this.data.hasmore) {
            switch (this.data.toggle) {
                case 0:
                    break
                case 1:
                    break
                case 2:
                    this.couponList()
                    break
            }
        }
    },
    pointList() {
			const { mobile, memberId } = this.data.member
        let params = {
            mobile,
            memberId
        }
        pointList(params).then(res => {
            console.log(res)
        })
    }
})