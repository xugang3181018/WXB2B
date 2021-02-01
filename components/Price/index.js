// components/Price/index.js
Component({
  properties: {
    num:{
      type:Number,
      observer(newVal, oldVal, change) {
        // console.log(newVal)
        let nums = 0;
        if(newVal != 0) {
          nums = parseFloat(newVal).toFixed(2)
        }
        this.setData({
          nums
        })
      }
    },
    size:{
      type:String,
      value: '',
    },
    other:{
      type: Number,
      value: null
    }
  },
  data: {
    nums: ""
  },

  methods: {

  }
})
