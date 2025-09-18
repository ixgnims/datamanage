// 折线图震荡过大时，取n个值之间的平均以展示趋势
// recordsCount -> 计算n个数的平均值
export function calculateAvg(recordsCount, series) {
    let result = [];
    for (let i=0; i<series.length; i++) {
        if (i < recordsCount) {
            result.push('-')
        }
        let sum = 0;
        for (let j=0; j<recordsCount; j++) {
            sum += series[i-j];
        }
        result.push((sum / recordsCount).toFixed(2));
    }
    return result;
}


export function calculateAverageRate(array, n) {
    let speed = "-";
    if (array.length < n) {
        speed = "-"
    }
    else if (array[array.length - n] === 0) {
        speed = "-"
    }
    else {
        speed = Math.pow((array[array.length-1] / array[array.length-1-n]), 1/n);
        speed = (speed*100).toFixed(0) + "%"
    }
    return speed
}


// ROI异常过高
export function compressROI(roi) {
    if (roi <= 1) return roi;
    return 1 + Math.log10(roi - 1 + 1); // 压缩 >10 的 ROI
}

