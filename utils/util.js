const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('') + '' + [hour, minute, second].map(formatNumber).join('')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒 //季度
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
  return fmt
}
// 格式化开始时间
const startDate = (num = 0, format) => new Date(new Date().getTime() - num * 86400000).Format(format)
// 时间格式化 201912110900000 ==> 2019-12-11 09:00:00
const strDateFormat = str =>{
  let time = ''
  if(str){
    time = str.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3 $4:$5:$6")
  }
  return time
}

function batFormatDate(list, attr, type) {
  for (let i in list) {
    if (list[i][attr]) {
      let date = list[i][attr],
        newDate = date.replace(/-/g, "/")
      list[i][attr] = new Date(newDate).Format(type || 'yyyy-MM-dd')
    }
  }
}

function formatDate(dates, types) {
  return new Date(dates || '').Format(types)
}
//随机获取五位数
function randomNum(num) {
  let rand = [];
  for (let i = 0; i <= num; i++) {
    rand.push(Math.floor(Math.random() * 10))
  }
  return rand.join('')
}
var xmlToJSON = require('../libs/xmlToJSON/xmlToJSON.js')
//XML转JSON /(ㄒoㄒ)/
function XMLtoJSON(xml) {
  var myOptions = {
    normalize: false,
    mergeCDATA: false,
    xmlns: true,
    grokText: false,
    textKey: false,
    grokAttr: false,
    childrenAsArray: false,
    stripAttrPrefix: false,
    stripElemPrefix: false,
    normalize: false,
    attrsAsObject: false
  }
  return xmlToJSON.xmlToJSON.parseString(xml, myOptions);
}
const reg = {
  mobile: phone => /^1[34578]\d{9}$/.test(phone),
  password: word => /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(word)
}

function formatYearMonthDate(str) {
  return str.substr(0, 10)
}

function formattingString(str) {
  return str.replace(/^(\d{4})\d+(\d{4})$/, "$1 **** **** $2")
}

function amendDateFormat(str) {
  return str.replace(/-/g, ".")
}

function formattingFormat(str) {
  return str.replace(/-/g, "")
}

//获取当周周一的时间

function getMondayDate(types) {
  const nowTemp = new Date();//当前时间
  const oneDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
  const c_time = nowTemp.getTime();//当前时间的毫秒时间
  const c_day = nowTemp.getDay() || 7;//当前时间的星期几
  const m_time = c_time - (c_day - 1) * oneDayLong;//当前周一的毫秒时间
  return new Date(m_time || '').Format(types)

}

// 获取上周得日期

function getTime(n, types) {
  let now = new Date();
  let year = now.getFullYear();
  //因为月份是从0开始的,所以获取这个月的月份数要加1才行
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let day = now.getDay();
  console.log(date);
  //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
  if (day !== 0) {
    n = n + (day - 1);
  }
  else {
    n = n + day;
  }
  if (day) {
    //这个判断是为了解决跨年的问题
    if (month > 1) {
      month = month;
    }
    //这个判断是为了解决跨年的问题,月份是从0开始的
    else {
      year = year - 1;
      month = 12;
    }
  }
  now.setDate(now.getDate() - n);
  return formatDate(now.getTime(), types);
}

//获得某月的天数
function getMonthDays(myMonth) {
  const now = new Date(); //当前日期
  let nowYear = now.getYear(); //当前年
  nowYear += (nowYear < 2000) ? 1900 : 0;
  const monthStartDate = new Date(nowYear, myMonth, 1);
  const monthEndDate = new Date(nowYear, myMonth + 1, 1);
  const days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}

//获得上月开始时间和结时间
function getLastMonthStartDate(types) {
  let now = new Date(); //当前日期
  let nowYear = now.getYear(); //当前年
  nowYear += (nowYear < 2000) ? 1900 : 0;
  let lastMonthDate = now; //上月日期
  lastMonthDate.setDate(1);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  let lastMonth = lastMonthDate.getMonth();
  let lastMonthStartDate = new Date(nowYear, lastMonth, 1).getTime();
  let lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth)).getTime();
  return [formatDate(lastMonthStartDate, types), formatDate(lastMonthEndDate, types)];
}

//降序
function fallCompare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value2 - value1;
  }
}

//升序
function litreCompare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}

// 根据指定日期往后追加一个月

function deadline(time){
  // 获取自然月
  let date = new Date(time),
   mo = date.getMonth() + 1,
  day = 30
  console.log(mo)
  //小月
  if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
    if (day > 30) {
      day = 30
    }
  }
  //2月
  else if (mo == 2) {
    if (isLeapYear(date.getFullYear())) {
      if (day > 29) {
        day = 29
      } else {
        day = 28
      }
    }
    if (day > 28) {
      day = 28
    }
  }
  //大月
  else {
    if (day > 31) {
      day = 31
    }
  }
  console.log(day)
  // formatDate(time.setDate(new Date().getDate() + day)
  return formatDate(date.setDate(date.getDate() + day), 'yyyy-MM-dd hh:mm:ss')
}

//JS判断闰年代码
function isLeapYear(Year) {
  if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
    return (true);
  } else { return (false); }
}

//拼接字符串
function jointString(list,status){
  console.log(list)
  let strArr=[]
  for(var i=0;i<list.length;i++){
    let data = list[i]
    let obj={
      stock: data.stock,
      inventoryStock: data.inventoryStock,
      profitStock: data.profitStock,
      goodsId:data.goodsId,
      goodsName:data.goodsName,
      goodsCode: data.goodsCode,
      goodsBarcode:data.goodsBarcode,
      goodsCategoryId: data.goodsCategoryId,
      goodsCategoryName:data.goodsCategoryName,
      goodsBrandId: data.goodsBrandId,
      goodsBrandName:data.goodsBrandName,
      goodsUnitId: data.goodsUnitId,
      goodsUnitName: data.goodsUnitName,
      goodsImgs:data.goodsImgs || "",
      goodsCostPrice:data.goodsCostPrice,
      remark: data.remark || "",
      status:status,
    }
    strArr.push(obj)
  }
  console.log(strArr,JSON.stringify(strArr))
  return JSON.stringify(strArr)
}

// 拼接自采入库商品信息
function joninStockStr(list,status){
  let strArr = []
  for(var i=0;i<list.length;i++){
    let data = list[i]
    let obj={
      goodsId:data.goodsId,
      goodsPackageId:data.selectPacege?data.selectPacege.goodsPackageId:data.goodsPackageId?data.goodsPackageId:'',
      stock:data.stockSum || data.stock,
      goodsCostPrice:data.goodsCostPrice,
      amount:data.amount	
    }
    if(status){
      obj.stockInId = data.stockInId || ''
    }
    strArr.push(obj)
  }
  return JSON.stringify(strArr)
}

// 拼接出库商品信息
function joinComeStockStr(list){
  let strArr = []
  for(var i=0;i<list.length;i++){
    let data = list[i]
    // console.log(data)
    let obj={
      amount:data.amount || data.purchaseAmt,
      goodsId:data.goodsId,
      goodsName:data.goodsName,
      goodsPackageId:data.selectPacege?data.selectPacege.goodsPackageId:data.goodsPackageId?data.goodsPackageId:'',
      goodsCategoryId:data.categoryId || data.goodsCategoryId,
      goodsBrandId:data.goodsBrandId,
      goodsCode:data.goodsCode,
      goodsBarcode:data.goodsBarcode,
      goodsUnitId:data.selectPacege?data.selectPacege.goodsUnitId:data.packageResponseList?data.packageResponseList[0].goodsUnitId:data.goodsUnitId,
      packageFactor:data.selectPacege?data.selectPacege.packageFactor: data.packageResponseList?data.packageResponseList[0].packageFactor:data.packageFactor, 
      stock:data.stockSum || data.stock || data.purchaseCnt,
      // goodsCostPrice:data.goodsCostPrice || data.packageResponseList?data.packageResponseList[0].wholesalePrice.toString():"",	
      goodsCostPrice:data.packageResponseList?data.packageResponseList[0].wholesalePrice:data.goodsCostPrice,		
    }
    strArr.push(obj)
  }
  // console.log(strArr)
  return JSON.stringify(strArr)
}

//拼接退货商品信息
function refundGoodsDetail(list,supplierId){
  let strArr = []
  for(var i=0;i<list.length;i++){
    let data = list[i]
    // console.log(data)
    let obj={
      merchantCode:data.merchantCode,
      goodsCode:data.goodsCode,
      supplierId,
      goodsBarcode:data.goodsBarcode,
    }
    strArr.push(obj)
  }
  // console.log(strArr)
  return JSON.stringify(strArr)
}

//拼接快速盘点单商品信息
function fastCheckGoods(list,status){
  let strArr = []
  for(var i=0;i<list.length;i++){
    let data = list[i]
    console.log(data)
    let obj={
      batchNumber:data.batchNumber || "",
      profitType:data.profitType,
      goodsId:data.goodsId,
      goodsName:data.goodsName,
      goodsCode:data.goodsCode,
      goodsBarcode:data.goodsBarcode,
      goodsPackageId:data.goodsPackageId || "",
      packageFactor:data.packageFactor,
      goodsCategoryId:data.goodsCategoryId || "",
      goodsCategoryName:data.goodsCategoryName || "",
      goodsBrandId:data.goodsBrandId,
      goodsBrandName:data.goodsBrandName,
      goodsUnitId:data.goodsUnitId,
      goodsUnitName:data.goodsUnitName || data.goodsUnit,
      goodsCostPrice:data.goodsCostPrice,
      stock:data.stock,
      inventoryStock:data.inventoryStock,
      profitStock:data.profitStock,
      remark:data.remark || "",
      status:status,
    }
    strArr.push(obj)
  }
  // console.log(strArr)
  return JSON.stringify(strArr)
}

module.exports = {
  formatTime,
  formatDate,
  dayValue: 24 * 60 * 60 * 1000,
  startDate,
  strDateFormat,
  randomNum,
  batFormatDate,
  formatYearMonthDate,
  formattingString,
  amendDateFormat,
  getMondayDate,
  formattingFormat,
  getTime,
  getLastMonthStartDate,
  fallCompare,
  litreCompare,
  deadline,
  reg,
  XMLtoJSON,
  jointString,
  joninStockStr,
  joinComeStockStr,
  refundGoodsDetail,
  fastCheckGoods
}
