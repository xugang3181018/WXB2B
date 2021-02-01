var app = getApp();
Component({
  properties: {
    imgUrls:{
      type:Object,
      value: ['../../images/default.png']
    },
    videoline: 
      {
        type:String,
        value:""
      }
  },
  data: {
    indicatorDots: true,
    circular: true,
    autoplay: false,
    interval: 3000,
    duration: 500,
    currents: "1",
    parameter: {
      'navbar': '1',
      'return': '0',
      'title': "商品详情"
    },
  },
  attached:function(){
  },
  methods: {
    change: function (e) {
      this.setData({
        currents: e.detail.current + 1
      })
    }
  }
})