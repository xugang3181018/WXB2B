const formatTime = dates => {
    const year = dates.getFullYear()
    const month = dates.getMonth() + 1
    const day = dates.getDate()
    const hour = dates.getHours()
    const minute = dates.getMinutes()
    const second = dates.getSeconds()
    let time = [year, month, day, hour, minute, second].map(formatNumber).join("").toLocaleString()                                 //将时间转换为字符串  如20191231101457
    let fullYear = [year, month, day].map(formatNumber).join("")
    let date = [year, month, day].map(formatNumber).join("-")
    let dateTime = [year, month, day].map(formatNumber).join("-") + ' ' + [hour, minute, second].map(formatNumber).join(':')                   //以日期和时间得格式展示  如2019-12-31 10:17:53
    return { time: time, fullYear: fullYear,date:date,dateTime:dateTime}
}

//判断日期和时间小于十时加入前导零
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
//格式化开始时间
let startDate = (num, format) => {
    let dayValue = 24 * 60 * 60 * 1000
    return new Date(new Date().getTime() - dayValue * (num || 0)).Format(format)
}

function strDateFormat(str) {
    return str.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3 $4:$5:$6");
}

function formatYearMonthDate(str) {
    return str.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1$2$3");
}

function formatHHMMSS(str) {
    return str.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$4$5$6");
}

function formatDateTime(str) {
    let fullYear = str.replace(/-/g, "");
    let time = fullYear.replace(/:/g, "");
    return string(time)
}

const string = data => {
    let date = data.replace(/^(\d{8})(\s{1})(\d{6})$/, "$1")
    let time = data.replace(/^(\d{8})(\s{1})(\d{6})$/, "$3")
    return { date: date, time: time }
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

const reg = {
    mobile: phone => /^1[34578]\d{9}$/.test(phone),
    password: word => /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(word)
}

function aggregate(data) {
    let totalOrderAmt = data.memberOrderAmt + data.alipayOrderAmt + data.wechatOrderAmt
    let totalTradeAmt = data.alipayTradeAmt + data.memberTradeAmt + data.wechatTradeAmt
    let totalDiscountableAmt = data.alipayDiscountableAmt + data.memberDiscountableAmt + data.wechatDiscountableAmt
    let totalRefundAmt = data.alipayRefundAmt + data.memberRefundAmt + data.wechatRefundAmt
    return { totalOrderAmt: totalOrderAmt, totalTradeAmt: totalTradeAmt, totalDiscountableAmt: totalDiscountableAmt, totalRefundAmt: totalRefundAmt }
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
    formatHHMMSS,
    formatDateTime,
    aggregate,
    reg
}