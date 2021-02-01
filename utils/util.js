import {
  TOKENNAME
} from './../config.js';
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const $h = {
  //除法函数，用来得到精确的除法结果
  //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
  //调用：$h.Div(arg1,arg2)
  //返回值：arg1除以arg2的精确结果
  Div: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    var t1 = 0,
      t2 = 0,
      r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length;
    } catch (e) {}
    try {
      t2 = arg2.toString().split(".")[1].length;
    } catch (e) {}
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return this.Mul(r1 / r2, Math.pow(10, t2 - t1));
  },
  //加法函数，用来得到精确的加法结果
  //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  //调用：$h.Add(arg1,arg2)
  //返回值：arg1加上arg2的精确结果
  Add: function (arg1, arg2) {
    arg2 = parseFloat(arg2);
    var r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(100, Math.max(r1, r2));
    return (this.Mul(arg1, m) + this.Mul(arg2, m)) / m;
  },
  //减法函数，用来得到精确的减法结果
  //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
  //调用：$h.Sub(arg1,arg2)
  //返回值：arg1减去arg2的精确结果
  Sub: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((this.Mul(arg1, m) - this.Mul(arg2, m)) / m).toFixed(n);
  },
  //乘法函数，用来得到精确的乘法结果
  //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
  //调用：$h.Mul(arg1,arg2)
  //返回值：arg1乘以arg2的精确结果
  Mul: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {}
    try {
      m += s2.split(".")[1].length
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  },
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 处理服务器扫码带进来的参数
 * @param string param 扫码携带参数
 * @param string k 整体分割符 默认为：&
 * @param string p 单个分隔符 默认为：=
 * @return object
 * 
 */
const getUrlParams = (param, k, p) => {
  if (typeof param != 'string') return {};
  k = k ? k : '&'; //整体参数分隔符
  p = p ? p : '='; //单个参数分隔符
  var value = {};
  if (param.indexOf(k) !== -1) {
    param = param.split(k);
    for (var val in param) {
      if (param[val].indexOf(p) !== -1) {
        var item = param[val].split(p);
        value[item[0]] = item[1];
      }
    }
  } else if (param.indexOf(p) !== -1) {
    var item = param.split(p);
    value[item[0]] = item[1];
  } else {
    return param;
  }
  return value;
}

const wxgetUserInfo = function () {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      lang: 'zh_CN',
      success(res) {
        resolve(res);
      },
      fail(res) {
        reject(res);
      }
    })
  });
}

const checkLogin = function (token, expiresTime, isLog) {
  if (getApp()) {
    token = getApp().globalData.token;
    expiresTime = getApp().globalData.expiresTime;
    isLog = getApp().globalData.isLog;
  }
  let res = token ? true : false;
  let res1 = isLog;
  let res2 = res && res1;
  if (res2) {
    let newTime = Math.round(new Date() / 1000);
    if (expiresTime < newTime) return false;
  }
  return res2;
}

const logout = function () {
  getApp().globalData.token = '';
  getApp().globalData.isLog = false;
}

const chekWxLogin = function () {
  return new Promise((resolve, reject) => {
    if (checkLogin())
      return resolve({
        userinfo: getApp().globalData.userInfo,
        isLogin: true
      });
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          return reject({
            authSetting: false
          });
        } else {
          wx.getStorage({
            key: 'cache_key',
            success(res) {
              wxgetUserInfo().then(userInfo => {
                userInfo.cache_key = res.data;
                return resolve({
                  userInfo: userInfo,
                  isLogin: false
                });
              }).catch(res => {
                return reject(res);
              });
            },
            fail() {
              getCodeLogin((code) => {
                wxgetUserInfo().then(userInfo => {
                  userInfo.code = code;
                  return resolve({
                    userInfo: userInfo,
                    isLogin: false
                  });
                }).catch(res => {
                  return reject(res);
                })
              });
            }
          })

        }
      },
      fail(res) {
        return reject(res);
      }
    })
  })
}


/**
 * 
 * 授权过后自动登录
 */
const autoLogin = function () {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'cache_key',
      success(res) {
        wxgetUserInfo().then(userInfo => {
          userInfo.cache_key = res.data;
          return resolve(userInfo);
        }).catch(res => {
          return reject(res);
        })
      },
      fail() {
        getCodeLogin((code) => {
          wxgetUserInfo().then(userInfo => {
            userInfo.code = code;
            return resolve(userInfo);
          }).catch(res => {
            return reject(res);
          })
        });
      }
    });
  })
}

const getCodeLogin = function (successFn) {
  wx.login({
    success(res) {
      successFn(res);
    }
  })
}

/*
 * 合并数组
 */
const SplitArray = function (list, sp) {
  if (typeof list != 'object') return [];
  if (sp === undefined) sp = [];
  for (var i = 0; i < list.length; i++) {
    sp.push(list[i]);
  }
  return sp;
}

/**
 * opt  object | string
 * to_url object | string
 * 例:
 * this.Tips('/pages/test/test'); 跳转不提示
 * this.Tips({title:'提示'},'/pages/test/test'); 提示并跳转
 * this.Tips({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值table上
 * tab=1 一定时间后跳转至 table上
 * tab=2 一定时间后跳转至非 table上
 * tab=3 一定时间后返回上页面
 * tab=4 关闭所有页面跳转至非table上
 * tab=5 关闭当前页面跳转至table上
 */
const Tips = function (opt, to_url) {
  if (typeof opt == 'string') {
    to_url = opt;
    opt = {};
  }
  var title = opt.title || '',
    icon = opt.icon || 'none',
    endtime = opt.endtime || 2000;
  if (title) wx.showToast({
    title: title,
    icon: icon,
    duration: endtime
  })
  if (to_url != undefined) {
    if (typeof to_url == 'object') {
      var tab = to_url.tab || 1,
        url = to_url.url || '';
      switch (tab) {
        case 1:
          //一定时间后跳转至 table
          setTimeout(function () {
            wx.switchTab({
              url: url
            })
          }, endtime);
          break;
        case 2:
          //跳转至非table页面
          setTimeout(function () {
            wx.navigateTo({
              url: url,
            })
          }, endtime);
          break;
        case 3:
          //返回上页面
          setTimeout(function () {
            wx.navigateBack({
              delta: parseInt(url),
            })
          }, endtime);
          break;
        case 4:
          //关闭当前所有页面跳转至非table页面
          setTimeout(function () {
            wx.reLaunch({
              url: url,
            })
          }, endtime);
          break;
        case 5:
          //关闭当前页面跳转至非table页面
          setTimeout(function () {
            wx.redirectTo({
              url: url,
            })
          }, endtime);
          break;
      }

    } else if (typeof to_url == 'function') {
      setTimeout(function () {
        to_url && to_url();
      }, endtime);
    } else {
      //没有提示时跳转不延迟
      setTimeout(function () {
        wx.navigateTo({
          url: to_url,
        })
      }, title ? endtime : 0);
    }
  }
}
/*
 * 单图上传
 * @param object opt
 * @param callable successCallback 成功执行方法 data 
 * @param callable errorCallback 失败执行方法 
 */
const uploadImageOne = function (opt, successCallback, errorCallback) {
  if (typeof opt === 'string') {
    var url = opt;
    opt = {};
    opt.url = url;
  }
  var count = opt.count || 1,
    sizeType = opt.sizeType || ['compressed'],
    sourceType = opt.sourceType || ['album', 'camera'],
    is_load = opt.is_load || true,
    uploadUrl = opt.url || '',
    inputName = opt.name || 'pics';
  wx.chooseImage({
    count: count, //最多可以选择的图片总数  
    sizeType: sizeType, // 可以指定是原图还是压缩图，默认二者都有  
    sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有  
    success: function (res) {
      //启动上传等待中...  
      wx.showLoading({
        title: '图片上传中',
      });
      wx.uploadFile({
        url: getApp().globalData.url + '/api/' + uploadUrl,
        filePath: res.tempFilePaths[0],
        name: inputName,
        formData: {
          'filename': inputName
        },
        header: {
          "Content-Type": "multipart/form-data",
          [TOKENNAME]: 'Bearer ' + getApp().globalData.token
        },
        success: function (res) {
          wx.hideLoading();
          if (res.statusCode == 403) {
            Tips({
              title: res.data
            });
          } else {
            var data = res.data ? JSON.parse(res.data) : {};
            if (data.status == 200) {
              successCallback && successCallback(data)
            } else {
              errorCallback && errorCallback(data);
              Tips({
                title: data.msg
              });
            }
          }
        },
        fail: function (res) {
          wx.hideLoading();
          Tips({
            title: '上传图片失败'
          });
        }
      })
    }
  })
}

/**
 * 移除数组中的某个数组并组成新的数组返回
 * @param array array 需要移除的数组
 * @param int index 需要移除的数组的键值
 * @param string | int 值
 * @return array
 * 
 */
const ArrayRemove = (array, index, value) => {
  const valueArray = [];
  if (array instanceof Array) {
    for (let i = 0; i < array.length; i++) {
      if (typeof index == 'number' && array[index] != i) {
        valueArray.push(array[i]);
      } else if (typeof index == 'string' && array[i][index] != value) {
        valueArray.push(array[i]);
      }
    }
  }
  return valueArray;
}
/**
 * 生成海报获取文字
 * @param string text 为传入的文本
 * @param int num 为单行显示的字节长度
 * @return array 
 */
const textByteLength = (text, num) => {
  let strLength = 0;
  let rows = 1;
  let str = 0;
  let arr = [];
  for (let j = 0; j < text.length; j++) {
    if (text.charCodeAt(j) > 255) {
      strLength += 2;
      if (strLength > rows * num) {
        strLength++;
        arr.push(text.slice(str, j));
        str = j;
        rows++;
      }
    } else {
      strLength++;
      if (strLength > rows * num) {
        arr.push(text.slice(str, j));
        str = j;
        rows++;
      }
    }
  }
  arr.push(text.slice(str, text.length));
  return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
}

/**
 * 获取分享海报
 * @param array arr2 海报素材
 * @param string store_name 素材文字
 * @param string price 价格
 * @param function successFn 回调函数
 * 
 * 
 */
const PosterCanvas = (arr2, store_name, price, successFn) => {
  wx.showLoading({
    title: '海报生成中',
    mask: true
  });
  const ctx = wx.createCanvasContext('myCanvas');
  ctx.clearRect(0, 0, 0, 0);
  /**
   * 只能获取合法域名下的图片信息,本地调试无法获取
   * 
   */
  wx.getImageInfo({
    src: arr2[0],
    success: function (res) {
      const WIDTH = res.width;
      const HEIGHT = res.height;
      ctx.drawImage(arr2[0], 0, 0, WIDTH, HEIGHT);
      ctx.drawImage(arr2[1], 0, 0, WIDTH, WIDTH);
      ctx.save();
      let r = 90;
      let d = r * 2;
      let cx = 40;
      let cy = 990;
      ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(arr2[2], cx, cy, d, d);
      ctx.restore();
      const CONTENT_ROW_LENGTH = 40;
      let [contentLeng, contentArray, contentRows] = textByteLength(store_name, CONTENT_ROW_LENGTH);
      if (contentRows > 2) {
        contentRows = 2;
        let textArray = contentArray.slice(0, 2);
        textArray[textArray.length - 1] += '……';
        contentArray = textArray;
      }
      ctx.setTextAlign('center');
      ctx.setFontSize(32);
      let contentHh = 32 * 1.3;
      for (let m = 0; m < contentArray.length; m++) {
        ctx.fillText(contentArray[m], WIDTH / 2, 820 + contentHh * m);
      }
      ctx.setTextAlign('center')
      ctx.setFontSize(48);
      ctx.setFillStyle('red');
      ctx.fillText('￥' + price, WIDTH / 2, 860 + contentHh);
      ctx.draw(true, function () {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          fileType: 'png',
          destWidth: WIDTH,
          destHeight: HEIGHT,
          success: function (res) {
            wx.hideLoading();
            successFn && successFn(res.tempFilePath);
          }
        })
      });
    },
    fail: function () {
      wx.hideLoading();
      Tips({
        title: '无法获取图片信息'
      });
    }
  })
}

/**
 * 数字变动动画效果
 * @param float BaseNumber 原数字
 * @param float ChangeNumber 变动后的数字
 * @param object that 当前this
 * @param string name 变动字段名称
 * */
const AnimationNumber = (BaseNumber, ChangeNumber, that, name) => {
  var difference = $h.Sub(ChangeNumber, BaseNumber) //与原数字的差
  var absDifferent = Math.abs(difference) //差取绝对值
  var changeTimes = absDifferent < 6 ? absDifferent : 6 //最多变化6次
  var changeUnit = absDifferent < 6 ? 1 : Math.floor(difference / 6);
  // 依次变化
  for (var i = 0; i < changeTimes; i += 1) {
    // 使用闭包传入i值，用来判断是不是最后一次变化
    (function (i) {
      setTimeout(() => {
        that.setData({
          [name]: $h.Add(BaseNumber, changeUnit)
        })
        // 差值除以变化次数时，并不都是整除的，所以最后一步要精确设置新数字
        if (i == changeTimes - 1) {
          that.setData({
            [name]: $h.Add(BaseNumber, difference)
          })
        }
      }, 100 * (i + 1))
    })(i)
  }
}

//随机获取五位数
function randomNum(num) {
  let rand = [];
  for (let i = 0; i <= num; i++) {
    rand.push(Math.floor(Math.random() * 10))
  }
  return rand.join('').slice(0, 3)
}

//批发单保存字符串拼接
function wholesaleOrderString(arr) {
  console.log(arr, "下单数据")
  let list = []
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    console.log(item,item.packaging.wholesalePrice,item.cart_num)
    obj = {
      goodsName: item.packaging.packageName,
      goodsBarcode: item.packaging.goodsBarcode,
      goodsCode: item.goodsCode,
      goodsId: item.goodsId,
      goodsPackageId: item.packaging.goodsPackageId || "",
      goodsUnitId: item.packaging.goodsUnitId,
      packageFactor: item.packaging.packageFactor || 1,
      goodsCnt: Math.floor(item.cart_num / (item.packaging.packageFactor || 1)),
      stockCnt: item.cart_num,
      wholesalePrice: item.packaging.wholesalePrice,
      goodsCategoryId: item.goodsCategoryId,
      goodsBrandId: item.goodsBrandId,
      amount:(item.packaging.wholesalePrice*item.cart_num).toFixed(4)
    }
    list.push(obj)
  }
  return list
}

//拼接字符串

function concatStringSave(arr){
  console.log(arr)
    let list = []
  let obj = {}
  arr.map(item=>{
    console.log(item)
    obj = {
      supplierCode:item.merchantCode,
      purchaseCnt:item.cart_num,
      goodsBarcode:item.packaging.goodsBarcode,
      goodsName:item.goodsName,
      purchaseAmt:(item.packaging.wholesalePrice*item.cart_num).toFixed(2),
      goodsPackageId:item.packaging.goodsPackageId || "",
    }
    list.push(obj)
  })
  console.log(list)
  return list
}

function concatString(arr, type) {
  console.log(arr)
  let list = []
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i])
    //type为2时是审核
    if (type == 2) {
      for (let j = 0; j < arr[i].packageResponseList.length; j++) {
        if (arr[i].deliveryPrice == arr[i].packageResponseList[j].wholesalePrice) {
          let item = arr[i].packageResponseList[j]
          console.log(item)
          if (item.goodsPackageId) {
            obj = {
              purchaseCnt: arr[i].purchaseCnt,
              packageFactor: arr[i].packageFactor || 1,
              purchaseFactor: item.purchaseFactor || 1,
              deliveryNumber: Math.ceil(arr[i].purchaseCnt / (item.purchaseFactor || 1)),
              purchasePrice: arr[i].deliveryPrice,
              goodsId: arr[i].goodsId,
              goodsCode: arr[i].goodsCode,
              supplierCode: wx.getStorageSync('supplierCode').code,
              goodsImages: arr[i].goodsImages,
              goodsBarcode: item.goodsBarcode,
              goodsBrandName: arr[i].goodsBrandName,
              goodsBrandId: arr[i].goodsBrandId,
              goodsName: item.packageName,
              goodsUnitId: item.goodsUnitId,
              goodsUnitName: item.goodsUnitName,
              goodsSpec: arr[i].goodsSpec,
              goodsPackageId: item.goodsPackageId,
              goodsCategoryId: arr[i].goodsCategoryId,
              goodsCategoryName: arr[i].goodsCategoryName,
              goodsCategoryCode: arr[i].goodsCategoryCode,
              recentPurchaseCnt: item.recentPurchaseCnt,
              purchaseAmt: Number(arr[i].purchaseAmt),
              inputTaxRate: arr[i].inputTaxRate || "",
              untaxedPrice: arr[i].inputTaxRate ? (arr[i].deliveryPrice / (1 + arr[i].inputTaxRate)).toFixed(4) : "",
              untaxedAmount: arr[i].inputTaxRate ? (Number(arr[i].purchaseAmt) / (1 + arr[i].inputTaxRate)).toFixed(4) : ""
            }
          } else {
            obj = {
              purchaseCnt: arr[i].purchaseCnt,
              packageFactor: arr[i].packageFactor || 1,
              purchaseFactor: item.purchaseFactor || 1,
              deliveryNumber: Math.ceil(arr[i].purchaseCnt / (item.purchaseFactor || 1)),
              purchasePrice: arr[i].deliveryPrice,
              goodsId: arr[i].goodsId,
              goodsCode: arr[i].goodsCode,
              supplierCode: wx.getStorageSync('supplierCode').code,
              goodsImages: arr[i].goodsImages,
              goodsBarcode: item.goodsBarcode,
              goodsBrandName: arr[i].goodsBrandName,
              goodsBrandId: arr[i].goodsBrandId,
              goodsName: item.packageName,
              goodsUnitId: item.goodsUnitId,
              goodsUnitName: item.goodsUnitName,
              goodsSpec: arr[i].goodsSpec,
              goodsCategoryId: arr[i].goodsCategoryId,
              goodsCategoryName: arr[i].goodsCategoryName,
              goodsCategoryCode: arr[i].goodsCategoryCode,
              recentPurchaseCnt: item.recentPurchaseCnt,
              purchaseAmt: (arr[i].deliveryPrice * arr[i].purchaseCnt).toFixed(4),
              purchaseAmt: Number(arr[i].purchaseAmt),
              inputTaxRate: arr[i].inputTaxRate || "",
              untaxedPrice: arr[i].inputTaxRate ? (arr[i].deliveryPrice / (1 + arr[i].inputTaxRate)).toFixed(4) : "",
              untaxedAmount: arr[i].inputTaxRate ? (Number(arr[i].purchaseAmt) / (1 + arr[i].inputTaxRate)).toFixed(4) : ""
            }
          }

        }
      }

    } else {
      let data = arr[i].packaging
      let purchaseAmt = Number((arr[i].deliveryPrice * arr[i].cart_num).toFixed(4))
      if (data.goodsPackageId) {
        obj = {
          purchaseCnt: arr[i].cart_num,
          packageFactor: data.packageFactor || 1,
          purchaseFactor: data.purchaseFactor || 1,
          deliveryNumber: Math.ceil(arr[i].cart_num / (data.purchaseFactor || 1)),
          purchasePrice: arr[i].deliveryPrice,
          goodsId: arr[i].goodsId,
          goodsCode: arr[i].goodsCode,
          supplierCode: wx.getStorageSync('supplierCode').code,
          goodsImages: arr[i].goodsImages,
          goodsBarcode: data.goodsBarcode,
          goodsBrandName: arr[i].goodsBrandName,
          goodsBrandId: arr[i].goodsBrandId,
          goodsName: data.packageName,
          goodsUnitId: data.goodsUnitId,
          goodsUnitName: data.goodsUnitName,
          goodsSpec: arr[i].goodsSpec,
          goodsPackageId: data.goodsPackageId,
          goodsCategoryId: arr[i].goodsCategoryId,
          goodsCategoryName: arr[i].goodsCategoryName,
          goodsCategoryCode: arr[i].goodsCategoryCode,
          recentPurchaseCnt: data.recentPurchaseCnt,
          purchaseAmt: purchaseAmt,
          inputTaxRate: arr[i].inputTaxRate || "",
          untaxedPrice: arr[i].inputTaxRate ? (arr[i].deliveryPrice / (1 + arr[i].inputTaxRate)).toFixed(4) : "",
          untaxedAmount: arr[i].inputTaxRate ? (purchaseAmt / (1 + arr[i].inputTaxRate)).toFixed(4) : ""
        }
      } else {
        obj = {
          purchaseCnt: arr[i].cart_num,
          packageFactor: data.packageFactor || 1,
          purchaseFactor: data.purchaseFactor || 1,
          deliveryNumber: Math.ceil(arr[i].cart_num / (data.purchaseFactor || 1)),
          purchasePrice: arr[i].deliveryPrice,
          goodsId: arr[i].goodsId,
          goodsCode: arr[i].goodsCode,
          supplierCode: wx.getStorageSync('supplierCode').code,
          goodsImages: arr[i].goodsImages,
          goodsBarcode: data.goodsBarcode,
          goodsBrandName: arr[i].goodsBrandName,
          goodsBrandId: arr[i].goodsBrandId,
          goodsName: data.packageName,
          goodsUnitId: data.goodsUnitId,
          goodsUnitName: data.goodsUnitName,
          goodsSpec: arr[i].goodsSpec,
          goodsCategoryId: arr[i].goodsCategoryId,
          goodsCategoryName: arr[i].goodsCategoryName,
          goodsCategoryCode: arr[i].goodsCategoryCode,
          recentPurchaseCnt: data.recentPurchaseCnt,
          purchaseAmt: purchaseAmt,
          inputTaxRate: arr[i].inputTaxRate || "",
          untaxedPrice: arr[i].inputTaxRate ? (arr[i].deliveryPrice / (1 + arr[i].inputTaxRate)).toFixed(4) : "",
          untaxedAmount: arr[i].inputTaxRate ? (purchaseAmt / (1 + arr[i].inputTaxRate)).toFixed(4) : ""
        }
      }
    }
    list.push(obj)
  }
  return list
}

//返回所需的code

function returnCode(arr, type) {
  let newArr = []
  // for (let i = 0; i < traversal(arr).length; i++) {
  //   if (traversal(arr)[i].merchantType == type) {
  //     newArr.push(traversal(arr)[i].instCode)
  //   }
  // }
  // return newArr.toString()
}

//整合数组型对象

function traversal(arr) {
  console.log(arr)
  // let newArr = []
  let code = ""
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    // console.log(JSON.parse(arr[i].groupInfo))
    for (let j = 0; j < JSON.parse(arr[i].groupInfo).length; j++) {
      // console.log(JSON.parse(arr[i].groupInfo)[j])
      if (JSON.parse(arr[i].groupInfo)[j].merchantType == 2) {
        obj = {
          type: 1,
          code: JSON.parse(arr[i].groupInfo)[j].instCode
        }
        return obj
      } else if (JSON.parse(arr[i].groupInfo)[j].merchantType == 3 || JSON.parse(arr[i].groupInfo)[j].merchantType == 4) {
        obj = {
          type: 2,
          code: JSON.parse(arr[i].groupInfo)[j].instCode
        }
        return obj
      }
      // if (!obj[JSON.parse(arr[i].groupInfo)[j].instId]) {
      //   newArr.push(JSON.parse(arr[i].groupInfo)[j]);
      //   obj[JSON.parse(arr[i].groupInfo)[j].instId] = true;
      // }
    }
  }
  // console.log(newArr.toString().length)
  // return newArr.toString()
}

//number值是多少就往后延迟多少天

function dataTime(number) {
  let myDate = new Date();
  let weekDate = formatTime(new Date(myDate.getTime() + number * 24 * 3600 * 1000))
  return weekDate
}

//获取上一周的日期
function getLastDay() {
  let myDate = new Date();
  let weekDate = new Date(myDate.getTime() - 7 * 24 * 3600 * 1000) //上周周一的时间
  var weekDate2 = new Date(myDate.getTime() - 7 * 24 * 3600 * 1000); // 计算结束时间用
  let day = weekDate.getDay();
  let time = weekDate.getDate() - day + (day === 0 ? -6 : 1)
  let startDate = formatTimes(new Date(weekDate.setDate(time)))
  let tuesday = formatTimes(new Date(weekDate.setDate(time + 1)))
  let wednesday = formatTimes(new Date(weekDate.setDate(time + 2)))
  let thursday = formatTimes(new Date(weekDate.setDate(time + 3)))
  let friday = formatTimes(new Date(weekDate.setDate(time + 4)))
  let saturday = formatTimes(new Date(weekDate.setDate(time + 5)))
  let endDate = formatTimes(new Date(weekDate2.setDate(time + 6))) //上周周日的时间
  let arr = [startDate, tuesday, wednesday, thursday, friday, saturday, endDate]
  return arr
}

function formatDateTime(str) {
  let fullYear = str.replace(/-/g, "");
  return fullYear
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimes = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}


function addcart(storeInfo, attrValue) {
  let cartList = wx.getStorageSync("cartList") || []
  let item = JSON.parse(JSON.stringify(storeInfo))
  let type = false
  if (!cartList.length) {
    storeInfo.checked = true
    cartList.push(storeInfo)
  }
  cartList.map(data=>{
    if(item.merchantCode == data.merchantCode){
      type = true
    }
  })
  if(!type){
    storeInfo.checked = true
    cartList.push(storeInfo)
  }
  for(let i=0;i<cartList.length;i++){
    let data = cartList[i]
    console.log(data)
    if(!data.list){
      data.list = []
    }
    if(data.merchantCode == item.merchantCode){
      data.list = formattingData(data.list,item,attrValue)
    }
    console.log(data,storeInfo,item)
  }
  console.log(cartList)
  wx.setStorageSync("cartList", cartList)
  return cartList
}

function formattingData(cartList,storeInfo,attrValue){
  if (!cartList.length) {
    cartList.push(storeInfo)
  } else {
    let flag = false
    cartList.map(item => {
      console.log(item)
      if ((item.goodsId == storeInfo.goodsId) && (item.packaging || storeInfo.packaging) && (item.packaging.goodsUnitId == storeInfo.packaging.goodsUnitId)) {
        item.cart_num += storeInfo.cart_num
        item.goodsUnit = attrValue
        item.checked = true
        flag = true
        return true
      } else if ((item.goodsId == storeInfo.goodsId) && (!item.packaging && !storeInfo.packaging)) {
        item.cart_num += storeInfo.cart_num
        item.goodsUnit = attrValue
        item.checked = true
        flag = true
        return true
      }
    })
    console.log(flag)
    if (!flag) {
      storeInfo.checked = true
      storeInfo.goodsUnit = attrValue
      cartList.push(storeInfo)
    }
  }
  return cartList
}

  /**
   * 获取购物车数量
   */
  function  getCartCount(data) {
    let sumCount = 0
    data.map(item => {
      item.list.map(i => {
        sumCount += Number(i.cart_num)
      })
    })
    return sumCount
  }

  /**
   * 拼接退货单JSON
   */
  function refundOrderJson(data){
    let boole = Array.isArray(data),arr=[],arr2=[],obj={};
    if(!boole){
      arr.push(data)
    }else{
      arr = data
    }
    arr.map(item=>{
      obj={
        goodsId:item.goodsId,
        goodsPackageId:item.goodsPackageId || "",
        goodsCnt:item.sales*1,
        packageFactor:item.packageFactor,
        wholesalePrice:item.wholesalePrice,
        amount:Math.abs((item.sales*item.wholesalePrice).toFixed(2)),
        // remarks:remarks || ""
      }
      arr2.push(obj)
    })
    console.log(arr2)
    return JSON.stringify(arr2)
  }

module.exports = {
  formatTime: formatTime,
  $h: $h,
  Tips: Tips,
  uploadImageOne: uploadImageOne,
  SplitArray: SplitArray,
  ArrayRemove: ArrayRemove,
  PosterCanvas: PosterCanvas,
  AnimationNumber: AnimationNumber,
  getUrlParams: getUrlParams,
  chekWxLogin: chekWxLogin,
  getCodeLogin: getCodeLogin,
  checkLogin: checkLogin,
  wxgetUserInfo: wxgetUserInfo,
  autoLogin: autoLogin,
  logout: logout,
  randomNum,
  wholesaleOrderString,
  concatString,
  concatStringSave,
  returnCode,
  dataTime,
  getLastDay,
  formatDateTime,
  formatDate,
  formatTimes,
  traversal,
  addcart,
  getCartCount,
  refundOrderJson
}