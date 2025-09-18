<template>
  <div class="container" id="roiChart">
    <e-charts class="chart"
              :option="roiChartOption"
              :updateOptions="{notMerge:true}"
              :autoresize="true"/>
  </div>
</template>

<script>
import {calculateAvg} from "@/functions/chart_function";
export default {
  name: "Aliu99_roiChart",
  props: {
    parentSeries: {
      type: Object,
      required: true
    },
    roiInput: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      max_roi: 0,
      roiChartOption: {
        legend: {
          show: true,
        },
        tooltip: {
          trigger: 'axis', // 坐标轴触发
          showContent: false,
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#B3C0D1'
            },
          },
        },
        toolbox: {
          feature: {
          }
        },
        xAxis: {type: 'category', name:'时间', boundaryGap : false, data: []},
        yAxis: [
          {type: 'value', name: '消耗', splitLine: {show: false}},
          {type: 'value', name: '消耗趋势', show: false, splitLine: {show: false}},
          {type: 'value', name: 'ROI', splitLine: {show: false}},
        ],
        dataZoom: [],
        series: [],
        grid: {
          x: '5%', //相当于距离左边的效果 padding-left
          y: '10%', //相当于距离上边的效果 padding-top
          bottom: '15%',
        }
      },
    }
  },
  methods: {
    setRoiChart() {
      let seriesData = this.parentSeries
      this.max_roi = Math.max(...seriesData.trend_data.map(d => d.total_ROI.toFixed(3)))
      this.roiChartOption.title = {text: ''}
      this.roiChartOption.xAxis = {
        type: 'category',
        name: '时间',
        boundaryGap: false,
        data: seriesData.trend_data.map(d => d.trend_minute),
        axisLabel: {
          // 转换x轴时间格式
          formatter: function (value) {
            const dateTime = new Date(value)
            const hours = dateTime.getHours()
            const minutes = dateTime.getMinutes()
            const seconds = dateTime.getSeconds()
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          }
        }
      }
      this.roiChartOption.yAxis[2].max = Math.ceil(Math.max(this.roiInput, this.max_roi).toFixed(2)*10)/10
      this.roiChartOption.series = [
        {
          yAxisIndex: 2,
          name: "总ROI",
          type: 'line',
          smooth: true,
          symbol: 'emptyDiamond',
          showSymbol: false,
          symbolSize: 10,
          label: {
            show: true,
            position: 'top'
          },
          lineStyle: {
            width: 3,
            color: '#839ce6',
          },
          data: seriesData.trend_data.map(d => d.total_ROI.toFixed(3)),
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            label: {
              position: 'end',
              color: '#4169E1',
              formatter: this.roiInput,
            },
            data: [
              {
                silent: false,
                lineStyle: {
                  width: 2,
                  color: '#839ce6',
                },
                yAxis: this.roiInput
              }
            ]
          }
        },
        {
          yAxisIndex: 0,
          type: 'line',
          smooth: true,
          showSymbol: false,
          areaStyle: {opacity: 0.5},
          lineStyle: {width: 0},
          label: {
            show: true,
            position: 'top'
          },
          name: '总消耗',
          data: seriesData.trend_data.map(d => d.stat_cost.metric_diff.total)
        },
        {
          yAxisIndex: 0,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: {},
          label: {
            show: false,
            position: 'top'
          },
          name: '总消耗(3分钟平均)',
          data: calculateAvg(3, seriesData.trend_data.map(d => d.stat_cost.metric_diff.total))
        }
      ]
    }
  },
  mounted() {
    this.setRoiChart()
  },
  watch: {
    parentSeries: function() {
      this.setRoiChart()
    },
    roiInput: function() {
      this.setRoiChart()
    }
  }
}
</script>

<style>
.container {
  width: 95%;
  height: 400px;
}
</style>