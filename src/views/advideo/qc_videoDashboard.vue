<template>
  <el-row>
    <el-card class="dash-card">
      <!--基础指标-->
      <el-row>
        <el-col v-for="(card, index) in statCards" :key="card.metric" :span="6">
          <el-card shadow="hover"
                   :class="{'active-card' :activeIndex === card.metric, 'stat-card': true}"
                   @click.native="handleMetricCardClick(card.metric)">
            <template v-if="index >= 5">
              <div class="card-header" style="position:relative; padding-right:80px">
                <!--率和数的转换按钮-->
                <el-tooltip content="切换率/数" placement="top" size="mini">
                  <vxe-button
                      mode="text"
                      icon="vxe-icon-swap"
                      status="info"
                      size="mini"
                      style="position: absolute; top: 0; right: 0; font-size: 10px"
                      @click="handleRateCntSwitch(card.metric)">
                  </vxe-button>
                </el-tooltip>
              </div>
            </template>
            <el-statistic :value="getValue(card.metric)"
                          :title="card.label"
                          :suffix="card.suffix"></el-statistic>
          </el-card>
        </el-col>
      </el-row>
      <!-- Echarts趋势图 带选项 -->
      <el-row>
        <!-- 选项组 - 使用 flex 布局靠右对齐 -->
        <div class="filter-container">
          <el-select v-model="selectDimension" size="mini" style="width: 120px" @change="handleChartDimensionChange">
            <el-option
                v-for="dimension in dimensionOptions"
                :key="dimension.value"
                :label="dimension.label"
                :value="dimension.value">
            </el-option>
          </el-select>
          <div class="record-selector">
            <span class="text-label" v-if="recordNum !== 'all'">前</span>
            <el-popover placement="bottom" width="100px" trigger="click">
              <el-input-number
                  v-model="numberSelect"
                  @change="handleNumChange"
                  :min="5"
                  size="mini"
                  :step="5"
                  :precision="0"
                  step-strictly>
              </el-input-number>
              <el-button type="text" size="mini" style="margin-left:5px" @click="setRecordNumAll">全部</el-button>
              <el-button slot="reference" type="text" size="mini">{{ recordNum === 'all' ? '全部' : recordNum}}</el-button>
            </el-popover>
            <span class="text-label" v-if="recordNum !== 'all'">条</span>
          </div>
        </div>
        <!-- ECharts图表 -->
        <div class="materialChartContainer" id="materialChart">
          <e-charts
              class="materialChartStyle"
              :option="materialChartOption"
              :updateOptions="{notMerge:true}"
              :autoresize="true"/>
        </div>
      </el-row>
    </el-card>
  </el-row>
</template>

<script>
import { formatAllValues } from "@/functions/global_formatter";
export default {
  name: "qc_videoDashboard",
  props: {
    combinePivot: {
      type: Array,
      required: true
    },
    footerSum: {
      type: Object,
      required: true
    },
    footerAvg: {
      type: Object,
      required: true
    },
    chartSeries: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeIndex: '',
      activeMetric: 'total_convert_cnt',
      activeLabel: '成交单数',
      statCards: [],
      statData: {},
      selectDimension: 'material_id',
      dimensionOptions: [
        {value: 'live_date', label: '日期'},
        {value: 'script_name', label: '选题'},
        {value: 'shoot_version', label: '拍摄版本'},
        {value: 'edit_version', label: '剪辑版本'},
        {value: 'material_id', label: '标题'},
      ],
      numberSelect: 20,
      recordNum: 20,
      // Echarts图表配置
      materialChartOption: {
        tooltip: {
          trigger: 'item', // 数据点触发
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#B3C0D1',
            }
          },
        },
        toolbox: {
          feature: {
          }
        },
        xAxis: {type: 'category', name:'日期', boundaryGap : false, data: []},
        yAxis: [{type: 'value', name: this.activeLabel, splitLine: {show: false}}],
        dataZoom: [],
        series: [],
        grid: {
          x: '5%', //相当于距离左边的效果 padding-left
          y: '10%', //相当于距离上边的效果 padding-top
          bottom: '5%',
        }
      },
    };
  },
  methods: {
    getValue(metric) {
      // 格式化
      return formatAllValues(metric, this.statData[metric]) || 0
    },
    updateStatistics() {
      this.statCards = [
        {label: "消耗(元)", metric: "total_cost", suffix: ""},
        {label: "成交单数", metric: "total_convert_cnt", suffix: ""},
        {label: "ROI", metric: "total_ROI", suffix: ""},
        {label: "预估利润", metric: "total_estimated_profit", suffix: ""},
        {label: "CPM", metric: "total_cpm", suffix: ""},
        {label: "展示点击率", metric: "total_click_rate", suffix: "%"},
        {label: "点击转化率", metric: "total_click_convert_rate", suffix: "%"},
        {label: "直播间进入率(标准)", metric: "standard_live_enter_rate", suffix: "%"},
        {label: "举报率(标准)", metric: "standard_report_rate", suffix: "‱"},
        {label: "不感兴趣率(标准)", metric: "standard_dislike_rate", suffix: "‰"},
      ]
      this.statData = this.footerSum
    },
    // stat card选中时高亮，重置activeLabel，重置折线图内容setMaterialChart
    handleMetricCardClick(metric) {
      this.activeIndex = this.activeIndex === metric ? -1 : metric
      const activeObject = this.statCards.find(item => item.metric === metric)
      this.activeMetric = metric
      this.activeLabel = activeObject ? activeObject.label : metric
      this.setMaterialChart()
    },
    // 指标数与率的转换
    handleRateCntSwitch(metric) {
      const index = this.statCards.findIndex(card => card.metric === metric)
      if (index === -1) return
      const card = this.statCards[index]
      const isRate = card.metric.includes('rate')
      const isCnt = card.metric.includes('cnt')
      // 按钮点击前card是否为选中highlight状态
      const initialActive = metric === this.activeIndex
      if (isRate) {
        this.$set(this.statCards, index, {
          ...card,
          label: card.label.replace('率', '数'),
          metric: card.metric.replace('rate', 'cnt'),
          suffix: ""
        })
        if (initialActive) {
          this.activeIndex = this.activeIndex.replace('rate', 'cnt')
          this.activeMetric = this.activeMetric.replace('rate', 'cnt')
          this.activeLabel = this.activeLabel.replace('率', '数')
          this.setMaterialChart()
        }
      } else if (isCnt) {
        if (metric.includes('dislike')) {
          this.$set(this.statCards, index, {
            ...card,
            label: card.label.replace('数', '率'),
            metric: card.metric.replace('cnt', 'rate'),
            suffix: "‰"
          })
        } else if (metric.includes('report')) {
          this.$set(this.statCards, index, {
            ...card,
            label: card.label.replace('数', '率'),
            metric: card.metric.replace('cnt', 'rate'),
            suffix: "‱"
          })
        } else {
          this.$set(this.statCards, index, {
            ...card,
            label: card.label.replace('数', '率'),
            metric: card.metric.replace('cnt', 'rate'),
            suffix: "%"
          })
        }
        if (initialActive) {
          this.activeIndex = this.activeIndex.replace('cnt', 'rate')
          this.activeMetric = this.activeMetric.replace('cnt', 'rate')
          this.activeLabel = this.activeLabel.replace('数', '率')
          this.setMaterialChart()
        }
      }
    },
    // dimension选项改变时，向父组件传参
    handleChartDimensionChange() {
      this.$emit('change-chartDimension', this.selectDimension)
    },
    setRecordNumAll() {
      this.recordNum = 'all'
      this.$emit('change-recordLimit', this.recordNum)
    },
    // 图表显示的条数，改变时向父组件传参，重置表格内容setMaterialChart
    handleNumChange() {
      this.recordNum = this.numberSelect
      this.$emit('change-recordLimit', this.recordNum)
    },
    setMaterialChart() {
      const seriesData = this.chartSeries.trend_data
      const dateList = this.chartSeries.date_list
      this.materialChartOption.title = {text: ''}
      this.materialChartOption.xAxis = {
        type: 'category',
        name: '日期',
        boundaryGap: false,
        data: dateList,
        axisLabel : {
          // 转换x轴时间样式
          formatter: function (value) {
            const live_date = new Date(value)
            const month = live_date.getMonth() + 1
            const date = live_date.getDate()
            return `${month}-${date}`
          }
        }
      }
      this.materialChartOption.yAxis[0]['name'] = this.activeLabel
      // tooltip添加单位
      if (this.activeMetric.includes('dislike_rate')) {
        this.materialChartOption.tooltip.valueFormatter = function (value) {
          return value + '‰'
        }
      } else if (this.activeMetric.includes('report_rate')) {
        this.materialChartOption.tooltip.valueFormatter = function (value) {
          return value + '‱'
        }
      } else if (this.activeMetric.includes('rate')) {
        this.materialChartOption.tooltip.valueFormatter = function (value) {
          return value + '%'
        }
      } else {
        this.materialChartOption.tooltip.valueFormatter = function (value) {
          return value
        }
      }
      // 添加曲线
      const tempSeriesList = []
      console.log(this.activeMetric)
      Object.entries(seriesData).forEach(([key, value]) => {
        if (key !== 'date_trend' && key !== 'None' && key.length > 0) {
          let metricSeries = Object.values(value).map(d => formatAllValues(this.activeMetric, d[this.activeMetric]))
          // metricSeries = Object.values(value).map(d => d[this.activeMetric])
          // key 为dimension名称，value 为数据
          tempSeriesList.push({
            type: 'line',
            smooth: true,
            showSymbol: true,
            label: {
              show: false,
              position: 'top'
            },
            name: key,
            data: metricSeries,
            emphasis: {
              focus: 'series'
            }
          })
          this.materialChartOption.series = tempSeriesList
        }
      })
    }
  },
  mounted() {
    this.updateStatistics()
    this.setMaterialChart()
  },
  watch: {
    footerSum: function() {
      this.updateStatistics()
    },
    chartSeries: function() {
      this.setMaterialChart()
    }
  }
}
</script>

<style scoped>
.dash-card ::v-deep .el-card__body {
  padding: 10px;
}

/* 统计指标 */
/* 基础卡片样式 */
.stat-card {
  margin: 3px;
  padding: 3px;
  cursor: pointer;
}
/* 激活状态卡片样式 */
.active-card {
  background-color: #eaf3ff;
}
.filter-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px; /* 元素间距 */
  width: 100%;
}
.record-selector {
  display: flex;
  align-items: center;
}
.text-label {
  font-size: 13px;
  color: #606266;
  margin: 0 5px;
}
/* 图表容器样式 */
.materialChartContainer {
  width: 100%;
  height: 400px;
}
.materialChartStyle {
  width: 100%;
  height: 100%;
}
</style>