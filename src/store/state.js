import { getLocalItem, getSessionItem } from '../util/util';
const state = {
  //后台管理
  // adminToken:getLocalItem('adminToken')?getLocalItem('adminToken'):null,
  // adminName:getLocalItem('adminName')?getLocalItem('adminName'):'',

  //客户商城
  clientCode: getLocalItem('clientCode') ? getLocalItem('clientCode') : '',
  supplierCode: getLocalItem('supplierCode') ? JSON.parse(getLocalItem('supplierCode')) : '',
  clientId: getLocalItem('clientId') ? getLocalItem('clientId') : null,
  clientName: getLocalItem('clientName') ? getLocalItem('clientName') : "",
  merchantId: getLocalItem('merchantId') ? getLocalItem('merchantId') : "",
  phone: getLocalItem('phone') ? getLocalItem('phone') : "",
  operatorId: getLocalItem('operatorId') ? getLocalItem('operatorId') : "",
  merchantType: getLocalItem('merchantType') ? getLocalItem('merchantType') : "",
  operatorType: getLocalItem('operatorType') ? getLocalItem('operatorType') : "",
  //分类路径1
  second: getLocalItem('second') ? getLocalItem('second') : "",
  //分类路径2
  secondTwo: getLocalItem('secondTwo') ? getLocalItem('secondTwo') : "",
  //分类路径3
  secondThree: getLocalItem('secondThree') ? getLocalItem('secondThree') : "",
  //分类路径4
  secondFour: getLocalItem('secondFour') ? getLocalItem('secondFour') : "",
  //一级分类
  classify: getLocalItem('classify') ? JSON.parse(getLocalItem('classify')) : [],
  //二级分类
  reclassify: getLocalItem('reclassify') ? JSON.parse(getLocalItem('reclassify')) :false,
  //三级分类
  threeClassify: getLocalItem('threeClassify') ? JSON.parse(getLocalItem('threeClassify')) :false,
  //四级分类
  fourClassify: getLocalItem('fourClassify') ? JSON.parse(getLocalItem('fourClassify')) :false,
  //规格
  specifications: getLocalItem('specifications') ?getLocalItem('specifications') :"",
  isActive: getSessionItem('isActive') ? getSessionItem('isActive') : "",
  curIndex: getSessionItem('curIndex') ? getSessionItem('curIndex') : 0,
  addCart: getLocalItem('cartList') ? JSON.parse(getLocalItem('cartList')) :[],
  // addCart:[],
  num: getLocalItem('num') ? getLocalItem('num') : 1,
  //缓存列表数  listData
  goodsList: getLocalItem('listData') ? JSON.parse(getLocalItem('listData')) :[],
}

export default state;