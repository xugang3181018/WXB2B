//获取屏幕宽高
export function getClientSize() {
    let h = document.documentElement.clientHeight || document.body.clientHeight;
    let w = document.documentElement.clientWidth || document.body.clientWidth;
    return {
        width: w,
        height: h
    }
}

//获取滚动条宽度
export function getScrollWidth() {
    let noScroll, scroll, oDiv = document.createElement("DIV");
    oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
    noScroll = document.body.appendChild(oDiv).clientWidth;
    oDiv.style.overflowY = "scroll";
    scroll = oDiv.clientWidth;
    document.body.removeChild(oDiv);
    return noScroll - scroll;
}

//回到顶部
export function backToTop() {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 0) {
        window.requestAnimationFrame(backToTop);
        window.scrollTo(0, scrollTop - (scrollTop / 5));
    }
}

//取本地储存数据
export function getLocalItem(key) {
    let value;
    try {
        value = localStorage.getItem(key);
    } catch (ex) {
        // 开发环境下提示error
        if (__DEV__) {
            console.error('localStorage.getItem报错, ', ex.message);
        }
    } finally {
        return value;
    }
}

//设置本地储存数据
export function setLocalItem(key, value) {
    try {
        // ios safari 无痕模式下，直接使用 localStorage.setItem 会报错
        localStorage.setItem(key, value);
    } catch (ex) {
        // 开发环境下提示 error
        if (__DEV__) {
            console.error('localStorage.setItem报错, ', ex.message);
        }
    }
}

//取会话储存数据
export function getSessionItem(key) {
    let value;
    try {
        value = sessionStorage.getItem(key);
    } catch (ex) {
        // 开发环境下提示error
        if (__DEV__) {
            console.error('sessionStorage.getItem报错, ', ex.message);
        }
    } finally {
        return value;
    }
}

//设置会话储存数据
export function setSessionItem(key, value) {
    try {
        // ios safari 无痕模式下，直接使用 sessionStorage.setItem 会报错
        sessionStorage.setItem(key, value);
    } catch (ex) {
        // 开发环境下提示 error
        if (__DEV__) {
            console.error('sessionStorage.setItem报错, ', ex.message);
        }
    }
}

//Unicode转中文汉字
export function decode(str) {
    str = str.replace(/(\\u)(\w{1,4})/gi, function ($0) {
        return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
    });
    str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    });

    return str;
}

//转化为00:00时间格式
export function convertTime(seconds) {
    return [
        parseInt(seconds / 60 % 60),
        parseInt(seconds % 60)
    ].join(":").replace(/\b(\d)\b/g, "0$1");
}

export function shuffle(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let itemAtIndex = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = itemAtIndex;
    }
    return arr;
}


//二维数组转一维数组

export function steamroller(arr) {
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            newArr.push(...steamroller(arr[i]));
        } else {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

//数组去重

export function distinct(arr) {
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
        if (!newArr.includes(arr[i])) {
            newArr.push(arr[i])
        }
    }
    return newArr
}

//整合数组型对象

export function traversal(arr) {
    let newArr = []
    let obj = {}
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < JSON.parse(arr[i].groupInfo).length; j++) {
            if (!obj[JSON.parse(arr[i].groupInfo)[j].instId]) {
                newArr.push(JSON.parse(arr[i].groupInfo)[j]);
                obj[JSON.parse(arr[i].groupInfo)[j].instId] = true;
            }
        }
    }
    // console.log(newArr)
    return newArr
}

//返回所需的code

export function returnCode(arr, type) {
    let newArr = []
    for (let i = 0; i < traversal(arr).length; i++) {
        if (!(traversal(arr)[i].merchantType == 0 || traversal(arr)[i].merchantType == 1)) {
            console.log(traversal(arr)[i].instCode)
            newArr.push(traversal(arr)[i].instCode)
        }
    }
    // console.log(newArr.toString())
    return  {supplierCodeArr:newArr,supplierCodes:newArr.toString()}
    // return newArr[0]
}


//往后延迟一个月的日期

export function dataTime(number) {
    let myDate = new Date();
    let weekDate = formatTime(new Date(myDate.getTime() + number * 24 * 3600 * 1000)) //上周周一的时间
    return weekDate
}


//格式化日期

export function formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-')
}

//格式化当天的日期
export function presentDataTime() {
    let myDate = new Date();
    let weekDate = formatTime(new Date(myDate.getTime()))
    return weekDate
}


//日期添加前导零
export function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

//拼接字符串

export function concatString(arr, type,code) {
    console.log(arr,"下单数据")
    let list = []
    let obj = {}
    for (let i = 0; i < arr.length; i++){
        let item = arr[i]
        console.log(item)
        obj = {
            goodsName:item.goodsName,
            goodsBarcode:item.goodsBarcode,
            goodsCode:item.goodsCode,
            goodsId:item.goodsId,
            goodsPackageId:item.goodsPackageId || "",
            goodsUnitId:item.goodsUnitId,
            packageFactor:item.packageFactor || 1,
            goodsCnt:item.goodsAmount,
            stockCnt:Math.floor(item.goodsAmount*(item.packageFactor || 1)),
            wholesalePrice:item.wholesalePrice,
            goodsCategoryId:item.goodsCategoryId,
            goodsBrandId:item.goodsBrandId,
            amount:item.goodsTotal
        }
        list.push(obj)
    }
    return list
    // let list = []
    // let obj = {}
    // if (type == 2) {
    //     for (let i = 0; i < arr.length; i++) {
    //         for (let j = 0; j < arr[i].packageResponseList.length; j++){
    //             if (arr[i].deliveryPrice == arr[i].packageResponseList[j].wholesalePrice){
    //                 let item = arr[i].packageResponseList[j]
    //                 console.log(arr[i].purchaseCnt, arr[i],arr[i].deliveryNumber,)
    //                 obj = {
    //                     purchaseCnt: arr[i].purchaseCnt,
    //                     packageFactor: arr[i].packageFactor,
    //                     purchaseFactor: arr[i].purchaseFactor,
    //                     deliveryNumber: arr[i].deliveryNumber,
    //                     purchasePrice: arr[i].deliveryPrice,
    //                     goodsId: arr[i].goodsId,
    //                     goodsCode: arr[i].goodsCode,
    //                     // supplierCode: 'EW_N4334345652',
    //                     supplierCode:code,
    //                     goodsImages: arr[i].goodsImages || "",
    //                     goodsBarcode: arr[i].goodsBarcode,
    //                     goodsBrandName: arr[i].goodsBrandName,
    //                     goodsBrandId: arr[i].goodsBrandId,
    //                     goodsName: arr[i].goodsName,
    //                     goodsUnitId: item.goodsUnitId,
    //                     goodsUnitName: item.goodsUnitName,
    //                     goodsSpec: arr[i].goodsSpec,
    //                     goodsPackageId: item.goodsPackageId || "",
    //                     goodsCategoryId: arr[i].goodsCategoryId,
    //                     goodsCategoryName: arr[i].goodsCategoryName,
    //                     goodsCategoryCode: arr[i].goodsCategoryCode,
    //                     recentPurchaseCnt: item.recentPurchaseCnt,
    //                     purchaseAmt: Number(arr[i].purchaseAmt) ,
    //                     inputTaxRate: arr[i].inputTaxRate || "",
    //                     untaxedPrice: arr[i].inputTaxRate? (arr[i].deliveryPrice / (1 + arr[i].inputTaxRate)).toFixed(4):"",
    //                     untaxedAmount: arr[i].inputTaxRate ? (Number(arr[i].purchaseAmt) / (1 + arr[i].inputTaxRate)).toFixed(4):""
    //                 }
    //             }
    //         }
    //         list.push(obj)
    //     }
    // } else {
    //     for (let i = 0; i < arr.length; i++) {
    //         console.log(arr[i],arr[i].goodsAmount,arr[i].purchaseFactor)
    //         obj = {
    //             purchaseCnt: arr[i].goodsAmount,
    //             packageFactor: arr[i].packageFactor,
    //             purchaseFactor: arr[i].purchaseFactor,
    //             deliveryNumber: arr[i].goodsAmount / arr[i].purchaseFactor,
    //             purchasePrice: arr[i].wholesalePrice,
    //             goodsId: arr[i][0].goodsId,
    //             goodsCode: arr[i][0].goodsCode,
    //             // supplierCode: 'EW_N4334345652',
    //             supplierCode:code,
    //             goodsImages: arr[i][0].goodsImages || "",
    //             goodsBarcode:arr[i].goodsBarcode,
    //             goodsBrandName:arr[i][0].goodsBrandName,
    //             goodsBrandId:arr[i][0].goodsBrandId,
    //             goodsName:arr[i][0].goodsName,
    //             goodsUnitId:arr[i].goodsUnitId,
    //             goodsUnitName:arr[i].goodsUnitName,
    //             goodsSpec:arr[i][0].goodsSpec || "",
    //             goodsPackageId: arr[i].goodsPackageId || "",
    //             goodsCategoryId:arr[i][0].goodsCategoryId || "",
    //             goodsCategoryName:arr[i][0].goodsCategoryName || "",
    //             goodsCategoryCode:arr[i][0].goodsCategoryCode || "",
    //             recentPurchaseCnt:arr[i].recentPurchaseCnt || 0,
    //             inputTaxRate: arr[i].inputTaxRate || "",
    //             untaxedPrice: arr[i].inputTaxRate ? (arr[i].deliveryPrice / (1 + arr[i].inputTaxRate)).toFixed(4) : "",
    //             untaxedAmount: arr[i].inputTaxRate ? (Number(arr[i].purchaseAmt) / (1 + arr[i].inputTaxRate)).toFixed(4) : ""
    //         }
    //         list.push(obj)
    //     }
    // }
    // return list
}


//拼接入库字符串
export function concatPutString(arr) {
    let list = []
    let obj = {}
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i])
        // obj = {
        //     goodsId: this.deliveryList.goodsId,
        //     packageFactor: this.deliveryList.packageFactor,
        //     // 收货数量
        //     stock: this.$refs.number[0].value,
        //     purchaseFactor: this.deliveryList.purchaseFactor,
        //     deliveryStock: this.deliveryList.deliveryStock,
        //     goodsCostPrice: this.deliveryList.goodsCostPrice,
        //     //  商品售价
        //     goodsPrice: this.$refs.money[0].value,
        //     // 批发价
        //     // wholsePrice: 24,
        //     // 进货总金额
        //     amount: this.totalAmount,
        //     // 生产日期
        //     productionDate: '2020-03-18',
        //     // 过期日期
        //     expirationDate: "2020-03-29"
        // }
        list.push(obj)
    }
    console.log(list)
}