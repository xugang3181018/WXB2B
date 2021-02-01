// components/Scrolls/Scrolls.js
Component({
    properties: {
        listloading: {
            type: Boolean,
            value: true
        },
        istolower: {
            type: Boolean,
            value: false
        },
        istoupper: {
            type: Boolean,
            value: false
        },
        hasmore: {
            type: Boolean,
            value: true
        },
        top: {
            type: String,
            value: '0',
        },
        bottom: {
            type: String,
            value:0,
        },
        scrollevent: {
            type: String,
            value: '0',
        },
        load:{
            type: Boolean,
            value: true
        }
    },
    data: {

    },
    methods: {
        scrolltolower(e) {
            this.triggerEvent('scrolltolower', e)
        },

        scrolltoupper(e) {
            this.setData({
                istolower:true
            })
            this.triggerEvent('scrolltoupper', e)
        },
        scroll(e) {
            this.triggerEvent('scroll', e)
        },
        bindrefresherrefresh(e){
            console.log(e)
            this.triggerEvent('bindrefresherrefresh',e)
        },
        bindrefresherpulling(){
            console.log(e)
        }
    }
})