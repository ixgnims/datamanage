 export function DateTimeString(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = month < 10 ? ('0' + month) : month;
    var day = date.getDate();
    day = day < 10 ? ('0' + day) : day;
    var hour = date.getHours();
    hour = hour < 10 ? ('0' + hour) : hour;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}


export function TimeString(date) {
    var hour = date.getHours();
    hour = hour < 10 ? ('0' + hour) : hour;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return hour + ':' + minute + ':' + second;
}


export function DateString(date) {
    if (date instanceof Date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month < 10 ? ('0' + month) : month;
        var day = date.getDate();
        day = day < 10 ? ('0' + day) : day;
        return year + '-' + month + '-' + day
    } else {
        return date.split(" ")[0]
    }
}


export function yesterdayDateString() {
    const today = new Date();
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1);
    return DateString(yesterday)
}

// 从年份和四位日期字符拼接出日期
 export function extractDate(year, date_str) {
    return year + '-' + date_str.substring(0,2) + '-' + date_str.slice(-2);
 }



