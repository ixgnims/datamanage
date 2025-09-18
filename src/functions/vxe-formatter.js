import VxeGrid from 'vxe-table';

import XEUtils from "xe-utils";


// 格式化日期，默认 yyyy-MM-dd HH:mm:ss
VxeGrid.formats.add('formatDate', {
    cellFormatMethod ({ cellValue }, format) {
        return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd HH:mm:ss')
    }
})


// 格式化数字，四舍五入，默认保留2位小数
VxeGrid.formats.add('formatFloat', {
    cellFormatMethod ({ cellValue }) {
        return XEUtils.round(XEUtils.toNumber(cellValue), 2)
    }
})


// 格式化数字，四舍五入，默认保留整数
VxeGrid.formats.add('formatInteger', {
    cellFormatMethod ({ cellValue }) {
        return XEUtils.round(XEUtils.toNumber(cellValue), 0)
    }
})


// 格式化百分比
VxeGrid.formats.add('formatRate', {
    cellFormatMethod ({ cellValue }) {
        return XEUtils.toValueString(XEUtils.round(XEUtils.toNumber(cellValue)*100, 2)) + "%"
    }
})


