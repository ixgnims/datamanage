<template>
  <div>
    <el-card shadow="never">
      <el-row class="title">投流详情</el-row>
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
                  :option="chartOption"
                  :autosize="true"/>
      </div>
      <!--表格-->
      <el-row style="display: flex; justify-items: center; align-items: center;">
        <el-col :span="9">
          <div class="pieContainer">
            <e-charts class="pie"
                      :option="pieOption"
                      :autosize="true"/>
          </div>
        </el-col>
        <el-col :span="15">
          <vxe-table
              show-footer
              resizable
              :data="tableData"
              :align ="center"
              :footer-data="footerData"
              :row-config="{isHover: true}"
              :column-config="{isCurrent: true, isHover: true}"
              :sort-config="{trigger: 'cell', defaultSort: {field: 'stat_cost', order: 'desc'}, orders: ['desc', 'asc', null]}"
              border="inner"
              style="width:100%; font-size:12px">
            <!--列-->
            <vxe-column
                field="account_name"
                title="广告账户"
                width="120"
                sortable>
            </vxe-column>
            <vxe-column
                field="stat_cost"
                title="消耗"
                :formatter="rounding"
                sort-type="number"
                sortable>
            </vxe-column>
            <vxe-column
                field="pay_order_amount"
                title="直接支付"
                :formatter="rounding"
                sort-type="number"
                sortable>
            </vxe-column>
            <vxe-column
                field="indirect_order_pay_gmv_7days"
                title="间接支付"
                :formatter="rounding"
                sort-type="number"
                sortable>
            </vxe-column>
            <vxe-column
                field="prepay_and_pay_order_roi"
                title="直接ROI"
                :formatter="rounding"
                sort-type="number"
                sortable>
            </vxe-column>
            <vxe-column
                field="all_order_pay_roi_7days"
                title="总ROI"
                :formatter="rounding"
                sort-type="number"
                sortable>
            </vxe-column>
          </vxe-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  name: "AliuDyMktChart",
  props: {
    parentLiveDate: String
  },
  data() {
    return {
      tableData: [],
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
      // 投流图配置
      chartOption: {
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
      },
      // 饼图
      pieOption: {
        tooltip: {
          trigger: 'item'
        },
        legend: {

        },
        series: [],
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
      console.log('日期')
      console.log(this.parentLiveDate)
      console.log('测试')
      var date = this.parentLiveDate.toLocaleDateString('zh-CN',{year: 'numeric', month: '2-digit', day: '2-digit'}).replaceAll('/','-');
      axios.post(`/marketing/date/chart/aliu/last/live/n_minute/cost`, {value: sendValue, selectDate: date})
          .then(response => {
            console.log(response)
            if (response.data.length > 0) {
              const seriesData = response.data
              this.chartOption.title = {text:''}
              this.chartOption.xAxis = {
                type: 'category', //类目轴，适用于离散类目数据
                name: '时间', //坐标轴名称
                boundaryGap: false, // 折线点与y轴之间的间距
                // nameGap: 3 //坐标轴名称与轴线之间的距离
                // axisTicker //是否显示坐标轴刻度
                data: seriesData[1].map(d => d.input_time),
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
              this.chartOption.dataZoom = [
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
              this.chartOption.series = tempSeries
            } else if (response.data.length === 0) {
              this.chartOption.title={
                text: '暂无数据',
                x: 'center',
                y: 'center',
                textStyle: {
                  fontFamily: 'Manteka',
                  fontSize: '15',
                  fontWeight: 'normal',
                  color: '#b6bfcd'
                }
              }
            }
          })
    },
    getTableData() {
      var date = this.parentLiveDate.toLocaleDateString('zh-CN',{year: 'numeric', month: '2-digit', day: '2-digit'}).replaceAll('/','-');
      axios.post(`/marketing/date/aliu`, {selectDate: date})
          .then(response => {
            console.log(response)
            if (response.data.length > 0) {
              // 表格数据
              this.tableData = response.data;
              var stat_cost_sum = response.data.map(item => item.stat_cost).reduce((a, b) => a + b);
              stat_cost_sum = parseFloat(stat_cost_sum.toFixed(2));
              var pay_order_amount_sum = response.data.map(item => item.pay_order_amount).reduce((a, b) => a + b);
              var indirect_order_pay_gmv_7days = response.data.map(item => item.indirect_order_pay_gmv_7days).reduce((a, b) => a + b);
              if (stat_cost_sum > 0) {
                var prepay_and_pay_order_roi_avg = parseFloat((pay_order_amount_sum / stat_cost_sum).toFixed(2));
                var all_order_pay_roi_7days_avg = parseFloat(((pay_order_amount_sum + indirect_order_pay_gmv_7days) / stat_cost_sum).toFixed(2));
              }
              this.footerData = [{
                account_name: '合计',
                stat_cost: stat_cost_sum,
                pay_order_amount: pay_order_amount_sum,
                indirect_order_pay_gmv_7days: indirect_order_pay_gmv_7days,
                prepay_and_pay_order_roi: prepay_and_pay_order_roi_avg,
                all_order_pay_roi_7days: all_order_pay_roi_7days_avg
              }];
              // 饼图数据
              let dataList = []
              response.data.forEach(item => {
                dataList.push({
                  value: item['stat_cost'],
                  name: item['account_name']
                })
              })
              this.pieOption.series = {
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: false,
                  position: 'center'
                },
                labelLine: {
                  show: false
                },
                data: dataList
              }
            }
          })
    },
    rounding({ cellValue }) {
      if (cellValue) {
        return parseFloat(cellValue.toFixed(2));
      }
    },
  },
  mounted() {
    this.generateSeries();
    this.getTableData()
  },
  watch: {
    parentLiveDate: function(newValue) {
      this.generateSeries()
      this.getTableData()
      console.log(newValue)
    }
  }
}
</script>

<style lang="css" scoped>
.title {
  text-align: left;
  font-weight: bold;
  font-size: 13px;
}

.container {
  width: 95%;
  height: 400px;
}

.pieContainer {
  width: 100%;
  height: 300px;
}

.chart {
  width: 100%;
  height: 100%
}
</style>