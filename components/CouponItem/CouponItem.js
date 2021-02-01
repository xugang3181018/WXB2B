// components/CouponItem/CouponItem.js
const app = getApp()
Component({
    properties: {
			all:{
				type:Boolean,
				value:false
			},
        coupon: {
            type: Array,
            value: [],
            observer: function(old, news) {
                console.log(news)
                this.coupon = news
            }
        }
    },
    data: {
			couponType: app.types.couponType
    },
    options: {
        addGlobalClass: true,
    },
    methods: {
        detail(e) {
            this.triggerEvent('detail', e)
        }
    }
})