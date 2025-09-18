<template>
  <div class="container" id="advChart">
    <e-charts class="chart"
              :option="advChartOption"
              :updateOptions="{notMerge:true}"
              :autoresize="true"/>
  </div>
</template>

<script>
export default {
  name: 'Aliu99_advChart',
  props: {
    parentSeries: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      advChartOption: {
        legend: {
          orient: 'vertical',
          formatter: function(name) {
            name = name.split('-')[0]
            return name
          }
        },
        tooltip: {
          trigger: 'axis', // 坐标轴触发
          showContent: true,
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
    setAdvChart() {
      let seriesData = this.parentSeries
      this.advChartOption.title = {text: ''}
      this.advChartOption.xAxis = {
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
      let adv_list = seriesData.info.advertiser_list
      this.advChartOption.dataZoom = [
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
      let adv_temp_series = []
      for (let i = 0; i < adv_list.length; i++) {
        adv_temp_series.push(
            {
              yAxisIndex: 0,
              type: 'line',
              smooth: true,
              showSymbol: false,
              label: {
                show: true,
                position: 'top'
              },
              name: adv_list[i],
              data: seriesData.trend_data.map(d => d.stat_cost.metric_diff[adv_list[i]])
            }
        )
      }
      this.advChartOption.series = adv_temp_series
    }
  },
  mounted() {
    this.setAdvChart()
  },
  watch: {
    parentSeries: function() {
      this.setAdvChart()
    },
  }
}
</script>

<style>
.container {
  width: 95%;
  height: 400px;
}
</style>