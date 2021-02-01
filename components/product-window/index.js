var app = getApp();
Component({
  properties: {
    iSplus: {
      type: Boolean,
      value: true
    },
    iSbnt: {
      type: Number,
      value: 0
    },
    limitNum: {
      type: Number,
      value: 0
    },
    attribute: {
      type: Object,
      value: {}
    },
    attrList: {
      type: Object,
      value: [],
    },
    productAttr: {
      type: Object,
      value: [],
    },
    productSelect: {
      type: Object,
      value: {
        image: '',
        store_name: '',
        price: 0,
        unique: '',
        stock: 0,
      }
    },
  },
  data: {
    list:[{},{},{}],
    attrValue: [],
    attrIndex: 0,
    isShow: false,
    indexn:0
  },
  attached: function () {
    let pages = getCurrentPages();
    let currPage = null;
    if (pages.length) {
      currPage = pages[pages.length - 1];
    }
    let route = currPage.route
    this.setData({ isShow: route.indexOf("goods_details") !== -1 });
  },
  methods: {
    /**
    * 购物车手动输入数量
    * 
    */
    bindCode: function (e) {
      this.triggerEvent('iptCartNum', e.detail.value);
    },
    close: function () {
      this.triggerEvent('myevent', { 'window': false });
    },
    goCat: function () {
      this.triggerEvent('goCat');
    },
    CartNumDes: function () {
      this.triggerEvent('ChangeCartNum', false);
    },
    CartNumInt: function () {
      this.triggerEvent('ChangeCartNum', true);
    },
    tapAttr: function (e) {
      console.log(e)
      // 选中属性的下标
      let indexn = e.currentTarget.dataset.indexn,
        value = e.currentTarget.dataset.item
      this.setData({
        indexn,
        money:value.wholesalePrice || "",
        goodsUnitName:value.goodsUnitName
      })
      console.log(value)
      // //每次点击获得的属性
      // var attr = this.data.productAttr[indexw].attr_value[indexn];
      // //设置当前点击属性
      // this.data.productAttr[indexw].checked = attr['attr'];
      // this.setData({
      //   productAttr: this.data.productAttr,
      // });
      // var value = this.getCheckedValue().sort().join(',');
      this.triggerEvent('ChangeAttr', value);
    },
    addCart:function(){
      this.triggerEvent('addCart')
    },
    getCheckedValue: function () {
      return this.data.productAttr.map(function (attr) {
        return attr.checked;
      });
    },
    ResetAttr: function () {
      for (var k in this.data.productAttr) this.data.productAttr[k].checked = '';
      this.setData({ productAttr: this.data.productAttr });
    },
  }
})