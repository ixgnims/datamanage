import XEUtils from "xe-utils";


// 格式化日期，默认 yyyy-MM-dd HH:mm:ss
export function formatDate({ cellValue }, format) {
    return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd HH:mm:ss')
}


// 格式化数字，四舍五入，默认保留2位小数
export function formatFloat({ cellValue }) {
    return XEUtils.round(XEUtils.toNumber(cellValue), 2)
}

// 格式化整数
export function formatInteger({ cellValue }) {
    return XEUtils.round(XEUtils.toNumber(cellValue), 0)
}

// 格式化百分比
export function formatRate({cellValue}) {
    return XEUtils.toValueString(XEUtils.round(XEUtils.toNumber(cellValue)*100, 2)) + "%"
}

// 格式化千分比
export function formatRate1000({cellValue}) {
    return XEUtils.toValueString(XEUtils.round(XEUtils.toNumber(cellValue)*1000, 4)) + "‰"
}

// 格式化万分比
export function formatRate10000({cellValue}) {
    return XEUtils.toValueString(XEUtils.round(XEUtils.toNumber(cellValue)*10000, 4)) + "‱"
}

export function formatAll(key_name, cell_value) {
    if (typeof cell_value === 'number') {
        if (key_name.search('report_rate') !== -1) {
            return parseFloat((cell_value*10000).toFixed(4)) + "‱"
        } else if (key_name.search('dislike_rate') !== -1) {
            return parseFloat((cell_value*1000).toFixed(4)) + "‰"
        } else if (key_name.search('rate') !== -1) {
            return parseFloat((cell_value*100).toFixed(2)) + "%"
        } else if (key_name.search('cnt') !== -1) {
            return Math.round(cell_value)
        } else {
            return parseFloat(cell_value.toFixed(2))
        }
    }
    else {
        return cell_value
    }
}


// 仅处理数值部分，不添加额外的符号
export function formatAllValues(key_name, cell_value) {
    if (typeof cell_value === 'number') {
        if (key_name.search('report_rate') !== -1) {
            return parseFloat((cell_value*10000).toFixed(4))
        } else if (key_name.search('dislike_rate') !== -1) {
            return parseFloat((cell_value*1000).toFixed(4))
        } else if (key_name.search('rate') !== -1) {
            return parseFloat((cell_value*100).toFixed(2))
        } else if (key_name.search('cnt') !== -1) {
            return Math.round(cell_value)
        } else {
            return parseFloat(cell_value.toFixed(2))
        }
    }
    else {
        return cell_value
    }
}


