var app = getApp();
Component({
  properties: {
    data:{
      type: Object,
      value: [],
    },
    deliveryDetail: {
      type: Object,
      value: [],
    },
    cartInfo:{
      type:Object,
      value:[],
    },
    orderId:{
      type:String,
      value:'',
    },
    merchantType:{
      type:Number,
      value:-1,
    },
    supplierName:{
      type:String,
      value:""
    },
    merchantName:{
      type:String,
      value:""
    },
    status:{
      type:Number,
      value:""
    }
  },
  data: {
  },
  methods: {
    //商品数量
    quantityInput: function (e) {
      console.log(e,e.detail.value)
      let data = {
        num: Number(e.detail.value),
        index: Number(e.target.id)
      }
      if (this.data.cartInfo[data.index].deliveryStock >= data.num){
        this.triggerEvent('quantitytNum', data);
      }else{
        wx.showToast({
          title: '数量不能大于配送数量',
          icon:'none'
        })
        this.triggerEvent('quantitytNum', {index: Number(e.target.id)});
      }
    },
    cut(e){
      let index = Number(e.target.id),{cartInfo} = this.data;
      console.log(cartInfo,index)
      if(cartInfo[index].deliveryStock<2)return
      this.triggerEvent('cut',index);
    },
    add(e){
      let index = Number(e.target.id),{cartInfo} = this.data;
      if(cartInfo[index].deliveryStock>cartInfo[index].stock-1){
        wx.showToast({
          title: '数量不能大于配送数量',
          icon:'none'
        })
        return 
      }
      this.triggerEvent('add',index);
    },
    //退货
    sales({currentTarget}){
      console.log(currentTarget)
      let item = currentTarget.dataset.item
      this.triggerEvent('sales',item)
    },
    // 商品售价
    sellingPriceInput:function (e) {
      console.log(e.detail.value)
      let data = {
        num: Number(e.detail.value),
        index: Number(e.target.id)
      }
      this.triggerEvent('sellingPricetNum', data);
    },
  }
})