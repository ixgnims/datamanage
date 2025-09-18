<template>
  <div>
    <el-row style="text-align: right">
      <el-select v-model="selectIndex"
                 placeholder="默认新增粉丝"
                 size="mini"
                 @change="generateSeries"
                 style="width: 14%">
        <el-option
            v-for="item in index"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </el-row>
    <el-row>
      <div class="container">
        <e-charts class="chart"
                  :option="option"
                  :autosize="true"/>
      </div>
    </el-row>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  name: 'AliuChart',
  data() {
    return {
      index: [
        {value: 'total_live_follow_cnt', label: '新增粉丝'},
        {value: 'live_pay_order_gmv_alias', label: '成交金额GMV'},
        {value: 'live_pay_order_count_alias', label: '成交订单数'},
        {value: 'total_live_pay_order_gpm', label: '千次观看成交金额GPM'},
        {value: 'total_live_watch_cnt', label: '累计观看人次'}
      ],
      selectIndex: '',
      option: {
        title: {
          //text: '投流消耗变化图' // 标题怎么改字体大小？
        },
        tooltip: {
          trigger: 'axis', // 坐标轴触发
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#B3C0D1'
            }
          },
        },
        legend: {
        }, // 稍后添加
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: [],
        yAxis: {
          type: 'value',
          name: '',
          splitLine: {
            show: false //不显示分隔线
          }
        },
        dataZoom: [],
        series: [],
        grid: {
          x: '5%', //相当于距离左边的效果 padding-left
          y: '15%', //相当于距离上边的效果 padding-top
          bottom: '15%',
        }
      }
    }
  },
  methods: {
    generateSeries() {
      var field = 'total_live_follow_cnt'
      if (this.selectIndex === '') {
        field = 'total_live_follow_cnt'
      } else {
        field = this.selectIndex
      }
      axios.get('/live/aliu/dylive/chart/')
          .then(response => {
            console.log(response)
            if (response.data.length > 0) {
              const seriesData = response.data
              this.option.xAxis = {
                type: 'category',
                name: '时间',
                boundaryGap: false,
                data: seriesData.map(d => d.live_date),
              }
              this.option.dataZoom = [
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
              this.option.series = {
                type: 'bar',
                smooth: true,
                showSymbol: false,
                label: {
                  show: false,
                  position: 'top'
                },
                itemStyle: {
                  color: '#6495ED',
                },
                name: '',
                data: seriesData.map(d => d[field]),
              }
            }
          })
    }
  },
  mounted() {
    this.generateSeries();
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 300px
}

.chart {
  width: 100%;
  height: 100%
}
</style>