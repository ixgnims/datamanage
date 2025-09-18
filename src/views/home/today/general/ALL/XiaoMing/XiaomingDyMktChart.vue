<template>
  <div>
    <el-row>
      <el-col style="text-align: right" :span="21">
        <el-select v-model="selectIndex"
                   placeholder="默认消耗差"
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
      </el-col>
      <el-col style="text-align: right" :span="3">
        <el-select v-model="selectValue"
                   placeholder="默认1分钟"
                   size="mini"
                   @change="generateSeries"
                   style="width: 100%">
          <el-option
              v-for="item in timeInterval"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="container">
      <e-charts class="chart"
                :option="option"
                :autosize="true"/>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  name: "DaijieDyMktChart",
  data() {
    return {
      timeInterval: [
        {value: 1, label: '1分钟'},
        {value: 2, label: '2分钟'},
        {value: 5, label: '5分钟'}
      ],
      selectValue: '',
      index: [
        {value: 'cost_diff', label: '消耗差'},
        {value: 'stat_cost', label: '消耗累计'},
        {value: 'click_diff', label: '点击差'}
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
          selected: {
            '消耗合计': false,
          }
        }, // 稍后添加
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: [],
        yAxis: {
          type: 'value',
          name: '投流消耗',
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
      var sendValue = 1
      if (this.selectValue === '') {
        sendValue = 1
      } else {
        sendValue = this.selectValue
      }
      var field = 'cost_diff'
      if (this.selectIndex === '') {
        field = 'cost_diff'
      } else {
        field = this.selectIndex
      }
      axios.post(`marketing/today/chart/xiaoming/last/live/n_minute/cost`, {value: sendValue})
          .then(response => {
            console.log(response)
            if (response.data.length > 0) {
              const seriesData = response.data
              this.option.xAxis = {
                type: 'category', //类目轴，适用于离散类目数据
                name: '时间', //坐标轴名称
                boundaryGap: false, // 折线点与y轴之间的间距
                // nameGap: 3 //坐标轴名称与轴线之间的距离
                // axisTicker //是否显示坐标轴刻度
                data: seriesData[0].map(d => d.input_time),
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
              let tempSeries = []
              seriesData.forEach(adv => {
                tempSeries.push({
                  type: 'line',
                  smooth: true,
                  // symbol: 'circle',
                  showSymbol: false,
                  label: {
                    show: false, //标记上方显示数据
                    position: 'top'
                  },
                  name: adv[0].account_name,
                  data: adv.map(d => d[field])
                })
              })
              this.option.series = tempSeries
            }
          })
    },
  },
  mounted() {
    this.generateSeries();
    setInterval(() => {
      this.generateSeries();
    }, 60000);
  },
}
</script>

<style lang="css" scoped>
.container {
  width: 100%;
  height: 300px
}

.chart {
  width: 100%;
  height: 100%
}
</style>