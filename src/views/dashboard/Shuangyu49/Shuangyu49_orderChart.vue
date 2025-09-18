<template>
  <div class="container" id="orderChart">
    <e-charts class="chart"
              :option="orderChartOption"
              :updateOptions="{notMerge:true}"
              :autoresize="true"/>
  </div>
</template>

<script>
export default {
  name: "Shuangyu49_orderChart",
  props: {
    parentSeries: {
      type: Object,
      required: true
    },
    order_goal: {
      type: Number,
      required: true
    },
    last_order_cnt: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      orderChartOption: {
        tooltip: {
          trigger: 'axis', // 坐标轴触发
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#B3C0D1'
            }
          },
        },
        toolbox: {
          feature: {
          }
        },
        xAxis: {type: 'category', name:'时间', boundaryGap : false, data: []},
        yAxis: [
          {type: 'value', name: '单量', position: 'left', splitLine: {show: false}},
          {type: 'value', name: '直播观看次数', position: 'right', splitLine: {show: false}},
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
    setOrderChart() {
      const seriesData = this.parentSeries
      this.orderChartOption.title = {text: ''}
      this.orderChartOption.xAxis = {
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
        },
        //min: '2025-02-07 15:19:00',
        //max: '2025-02-07 15:51:00',
      }
      let min = Math.min(...seriesData.trend_data.map(d => (d.total_GMV.metric_value/99).toFixed()))
      let max = Math.max(this.order_goal, this.last_order_cnt)
      this.orderChartOption.yAxis[0].max = max
      this.orderChartOption.yAxis[0].min = min
      this.orderChartOption.dataZoom = [
        {
          type: 'inside',
          start: 0,
          end: 10000
        },
        {
          start: 0,
          end: 10000
        }
      ]
      this.orderChartOption.series = [
        //单量
        {
          yAxisIndex: 0,
          type: 'line',
          smooth: true,
          showSymbol: false,
          label: {
            show: false,
            position: 'top'
          },
          name: "单量",
          data: seriesData.trend_data.map(d => (d.total_order_cnt.metric_value)),
          markLine: {
            silent: true,
            symbol: ['none', 'arrow'],
            lineStyle: {color: 'green'},
            label: {
              position: 'middle',
              color: 'green',
              formatter: '目标单量:'+this.order_goal,
            },
            animation: false,
            data: [
              {
                silent: false,
                lineStyle: {
                  width: 1,
                  color: 'green'
                },
                yAxis: this.order_goal
              }
            ]
          }
        },
        {
          yAxisIndex: 1,
          type: 'line',
          smooth: false,
          showSymbol: false,
          areaStyle: {},
          lineStyle: {
            width: 0,
          },
          label: {
            show: false,
            position: 'top'
          },
          name: '直播观看次数',
          data: seriesData.trend_data.map(d => d.total_live_watch.metric_diff),
        }
      ]
    }
  },
  mounted() {
    this.setOrderChart()
  },
  watch: {
    parentSeries: function() {
      this.setOrderChart()
    },
    order_goal: function() {
      this.setOrderChart()
    }
  }
}
</script>

<style scoped>
.container {
  width: 95%;
  height: 400px;
}
</style>