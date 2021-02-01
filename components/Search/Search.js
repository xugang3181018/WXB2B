// components/Search/Search.js
Component({
    properties: {
        placeholder:{
            type:String,
            value:'输入搜索内容'
        },
        confimtext:{
            type:String,
            value:'搜索'
        },
        maxlength:{
            type:String,
            value:-1
        },
        types:{
            type: String,
            value: 'text'
        }
    },

    data: {
        value:''
    },
    options: {
        addGlobalClass: true,
    },
    methods: {
        search(e){
            this.triggerEvent('search', e)
        },
        clearSearch(e){
            this.setData({
                value:''
            })
            this.triggerEvent('clear', e)
        },
        input(e){
            this.setData({
                value: e.detail.value
            })
            this.triggerEvent('input', e.detail.value)
        },

        blur(e){
            this.triggerEvent('blur', e.detail.value)
        },

        confim(e){
            console.log(e)
            this.triggerEvent('confim', e.detail.value)
        }
    }
})
