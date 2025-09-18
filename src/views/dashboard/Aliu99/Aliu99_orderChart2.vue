<template>
  <div>
    <!--需要选中的room_id-->
    <div class="container" id="orderChart">
      <e-charts class="chart"
                :option="orderChartOption"
                :updateOptions="{notMerge:true}"
                :autoresize="true"/>
    </div>
    <div class="container" id="advChart">
      <e-charts class="chart"
                :option="advChartOption"
                :updateOptions="{notMerge:true}"
                :autoresize="true"/>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  name: "Aliu99_orderChart2",
  props: {
    activeTab: {
      type: String,
      required: true
    },
    selectLive: {
      type: String,
      required: true
    },
    order_goal: {
      type: Number,
      required: true
    },
    last_order_cnt: {
      type: Number,
      required: true
    },
    roiInput: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      liveSeries: {},
      // 单量ROI
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
          {type: 'value', name: '单量', position: 'right', splitLine: {show: false}},
          {type: 'value', name: 'ROI', position: 'left', splitLine: {show: false}}
        ],
        dataZoom: [],
        series: [],
        grid: {
          x: '5%', //相当于距离左边的效果 padding-left
          y: '10%', //相当于距离上边的效果 padding-top
          bottom: '15%',
        }
      },
      // 广告账户消耗
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
    getLiveTrend(room_id) {
      axios.get(`http://47.107.244.209:8967/dashboard/aliu99/dy/trend/get/?room_id=${room_id}`)
          .then(response => {
            if (response.data.code === 1) {
              this.liveSeries = response.data
            }
          })
    },
    setOrderChart() {
      let seriesData = this.liveSeries
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
      let order_min = Math.min(...seriesData.trend_data.map(d => (d.total_GMV.metric_value/99).toFixed()))
      let order_max = Math.max(this.order_goal, this.last_order_cnt)
      this.orderChartOption.yAxis[0].max = order_max
      this.orderChartOption.yAxis[0].min = order_min
      if (Math.max(...seriesData.trend_data.map(d => d.total_ROI)) >=0.5) {
        this.orderChartOption.yAxis[1].max = 0.5
      }
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
          name: "单量",
          type: 'line',
          smooth: true,
          showSymbol: false,
          itemStyle: {
            color: '#9bda6b'
          },
          label: {
            show: false,
            position: 'top'
          },
          lineStyle: {
            width: 0,
          },
          areaStyle: {
            opacity: 0.5,
            color: '#9bda6b'
          },
          data: seriesData.trend_data.map(d => (d.total_order_cnt.metric_value)),
          markLine: {
            silent: true,
            symbol: ['none', 'arrow'],
            lineStyle: {color: 'green'},
            label: {
              position: 'middle',
              color: 'green',
              formatter: '目标单量:'+this.order_goal+'  当前单量'+this.last_order_cnt,
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
          name: '总ROI',
          type: 'line',
          smooth: true,
          symbol: 'emptyDiamond',
          showSymbol: false,
          symbolSize: 10,
          itemStyle: {
            color: '#6f8be8'
          },
          label: {
            show: false,
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
              position: 'start',
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
        }
      ]
    },
    setAdvChart() {
      let seriesData = this.liveSeries
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
    this.getLiveTrend(this.selectLive)
    setInterval(() => {
      if (this.activeTab.includes('Order')) {
        this.getLiveTrend(this.selectLive)
      }
    }, 60000)
  },
  watch: {
    activeTab: function() {
      if (this.activeTab.includes('Order')) {
        this.getLiveTrend(this.selectLive)
      }
    },
    selectLive: function(room_id) {
      if (this.activeTab.includes('Order')) {
        this.getLiveTrend(room_id)
      }
    },
    order_goal: function() {
      this.setOrderChart()
    },
    liveSeries: function() {
      this.setOrderChart()
      this.setAdvChart()
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