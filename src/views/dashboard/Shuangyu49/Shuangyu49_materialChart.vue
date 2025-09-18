<template>
  <div>
    <!--搜索框-->
    <el-row>
      <el-autocomplete
          class="inline-input"
          v-model="queryItem"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          size="small">
        <el-select v-model="searchType" slot="prepend" class="selectType" size="small" placeholder="全部" style="width:100px">
          <el-option
              v-for="item in searchOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="sendQueryAtChange" slot="append" icon="el-icon-search" size="small"></el-button>
      </el-autocomplete>
    </el-row>
    <!--统计卡片-->
    <el-row style="margin-top:5px;">
      <el-col v-for="(card, index) in statCards" :key="card.metric" :span="4">
        <el-card shadow="hover"
                 :body-style="{padding: '6px'}"
                 :class="{'active-card' :activeIndex === card.metric, 'stat-card': true}"
                 @click.native="handleMetricCardClick(card.metric)">
          <template v-if="index >= 3">
            <div class="card-header" style="position:relative; padding-right:80px">
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
          <div class="card-content">
            <div class="card-label">{{card.label}}</div>
            <div class="card-value">
              {{formattedFooterSum[card.metric]}}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--筛选器-->
    <div class="filter-container">
      <el-dropdown class="el-dropdown-link" @command="handleSortMetricChange">
        <span>
          {{ sortMetricLabel }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
              v-for="option in sortMetricOptions"
              :key="option.metric"
              :command="option">
            {{ option.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
          <el-button type="text" size="mini" disabled style="margin-left:5px" @click="setRecordNumAll">全部</el-button>
          <el-button slot="reference" type="text" size="mini">{{ recordNum === 'all' ? '全部' : recordNum}}</el-button>
        </el-popover>
        <span class="text-label" v-if="recordNum !== 'all'">条</span>
      </div>
      <el-button-group>
        <el-button size="mini" plain round @click="setTypeValue">累积</el-button>
        <el-button size="mini" plain round @click="setTypeDiff">差值</el-button>
      </el-button-group>
    </div>
    <!--素材趋势图-->
    <el-row style="margin-top:10px">
      <div class="container" id="materialChart">
        <e-charts class="chart"
                  :option="materialChartOptions"
                  :updateOptions="{notMerge:true}"
                  :autoresize="true"/>
      </div>
    </el-row>
    <!--素材数据表-->
    <el-row style="margin-top:10px">
      <vxe-grid ref="materialTableRef" v-bind="materialTableOptions">
        <template #action="{ row }">
          <template v-if="row.current_merge_level === 'material_id'">
            <vxe-button
                mode="text" status="primary" icon="vxe-icon-search" size="mini"
                @click="selectEvent(row)"></vxe-button>
          </template>
          <span>{{ row.level_info }}</span>
        </template>
      </vxe-grid>
      <el-drawer
          class="material-detail-drawer"
          :visible.sync="showMaterialDetail"
          :with-header="true"
          size="80%"
          @close="handleDrawerClose">
        <template v-slot:title><div class="material-detail-drawer-title">视频详情</div></template>
        <materialDetailDrawer ref="materialDetail"
                              :selectRow="selectRow" :selectMaterialDetail="selectMaterialDetail"
                              :selectMaterialComment="selectMaterialComment" :selectMaterialCommentPage="selectMaterialCommentPage"
                              @change-commentPage="commentPageChange" @change-commentPageSize="commentPageSizeChange"
                              @change-commentLevel="commentLevelChange" @change-commentEmotion="commentEmotionChange"
                              @change-commentSortField="commentSortFieldChange" @change-commentSortOrder="commentSortOrderChange"/>
      </el-drawer>
    </el-row>
  </div>
</template>

<script>
import { formatAllValues, formatFloat, formatInteger, formatRate } from "@/functions/global_formatter";
import { DateString } from "@/functions/time_function";
import axios from "@/api/axios";
import materialDetailDrawer from "@/views/dashboard/materialDetailDrawer.vue";
export default {
  name: 'Shuangyu49_materialChart',
  components: {materialDetailDrawer},
  props: {
    tag_type: {
      type: String,
      required: true
    },
    liveStart: {
      type: String,
      required: true
    },
    liveEnd: {
      type: String,
      required: false
    },
    advertiserIdList: {
      type: Array,
      required: true
    },
    parentMaterialSeries: {
      type: Object,
      required: true
    },
    parentMaterialAlert: {
      type: Array,
      required: false,
    },
    parentMaterialPivot: {
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
    }
  },
  data() {
    // 表格配置
    const materialTableOptions = {
      border: true,
      maxHeight: 500,
      minHeight: 20,
      size: "mini",
      showOverflow: true,
      showFooter: true,
      rowConfig: {
        isHover: true,
        keyField: 'id',
      },
      columnConfig: {
        resizable: true,
      },
      sortConfig: {
        defaultSort: {
          field: 'total_cost',
          order: 'desc',
        }
      },
      exportConfig: {},
      expandConfig: {
        expandAll: true,
      },
      treeConfig: {
        transform: true,
        rowField: 'id',
        parentField: 'parentId',
        expandAll: true,
        indent: 10
      },
      columns: [
        {field: 'level_info', title: '视频信息', fixed: "left", showOverflow: true, width: 300, treeNode: true, sortable: true, slots: {default: 'action'}},
        {field: 'current_merge_level', title: '当前层级', fixed: "left", showOverflow: true, visible: false},
        {field: 'advertiser_list', title: '关联账户', width:100, showOverflow: true},
        {field: 'total_convert_cnt', title: '转化数', width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'total_cost', title: '消耗', width: 100, showHeaderOver: true, flow: true, formatter: formatFloat, sortable: true},
        {field: 'total_ROI', title: 'ROI', width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: 'total_click_rate', title: '展示点击率', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'total_click_convert_rate', title: '点击转化率', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'standard_click_product_rate', title: '商品点击率(标准推广)', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'standard_click_slidecart_rate', title: '购物车点击率(标准推广)', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'total_like_cnt', title: '点赞数', width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'standard_report_cnt', title: '举报数', width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'standard_dislike_cnt', title: '不喜欢数', width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'total_play_3s_rate', title: '3s播放率', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'standard_play_50_rate', title: '50%播放率', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
      ],
      data: [],
      footerData: [],
      footerRowStyle () {
        return {
          backgroundColor: '#F8F8F9FF',
          fontWeight: 'bold'
        }
      },
      rowStyle ({ row }) {
        // 分级染色
        if (row.video_level.includes("S")) {
          return {
            backgroundColor: '#fffacc',
            color: '#fd9b00',
          }
        } else if (row.video_level.includes("A")) {
          return {
            backgroundColor: '#e9ffe6',
            color: '#447940',
          }
        }
      },
    }
    return {
      // 统计卡片
      activeLabel: '消耗',
      activeMetric: 'total_cost',
      activeIndex: '',
      sortMetric: 'total_cost',
      sortMetricLabel: '消耗',
      sortMetricOptions: [
        {label: "消耗", metric: "total_cost"},
        {label: "转化数", metric: "total_convert_cnt"}
      ],
      numberSelect: 5,
      recordNum: 5,
      valueType: 'select_metric_value',
      statCards: [
        {label: "转化数", metric: "total_convert_cnt", suffix: ""},
        {label: "消耗(元)", metric: "total_cost", suffix: ""},
        {label: "ROI", metric: "total_ROI", suffix: ""},
        {label: "展示点击率", metric: "total_click_rate", suffix: "%"},
        {label: "点击转化率", metric: "total_click_convert_rate", suffix: "%"},
        {label: "点击数", metric: "total_click_cnt", suffix: ""},
        {label: "举报数(标准)", metric: "standard_report_cnt", suffix: ""},
        {label: "不感兴趣数(标准)", metric: "standard_dislike_cnt", suffix: ""},
      ],
      statData: {},
      formattedFooterSum: {},
      formattedFooterAvg: {},
      // 数据表配置
      materialTableOptions,
      searchType: 'any',
      searchOptions: [
        {value: 'any', label: '全部'},
        {value: 'script_name', label: '选题'},
        {value: 'shoot_version', label: '拍摄版本'},
        {value: 'edit_version', label: '剪辑版本'},
        {value: 'file_title', label: '视频标题'},
        {value: 'material_id', label: '素材id'},
        {value: 'advertiser_name', label: '广告账户'},
        {value: 'editor', label: '剪辑师'}
      ],
      queryItem: '',
      searchTimeOut: null,
      // 输入建议列表
      item_list: [],
      filterDimension: 'material_id',
      // 折线图配置
      materialChartOptions: {
        tooltip: {
          trigger: 'axis', // 坐标轴触发
          showContent: true,
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#B3C0D1'
            }
          }
        },
        toolbox: {
          feature: {
          }
        },
        xAxis: {type: 'category', name: '时间', boundaryGap: false, data: []},
        yAxis: [
          {type: 'value', name: this.activeLabel, splitLine: {show: false}, position: 'right'}
        ],
        dataZoom: [],
        series: [],
        grid: {
          x: '5%',
          y: '10%',
          bottom: '5%'
        }
      },
      // 视频详情抽屉
      showMaterialDetail: false,
      selectRow: null,
      selectMaterialCreateTime: "",
      selectMaterialDetail: {},
      selectMaterialComment: {},
      selectMaterialCommentPage: {},
      commentPage: 1,
      commentPageSize: 10,
      commentLevel: "LEVEL_ONE",
      commentEmotion: "ALL",
      commentSortField: "LIKE_COUNT",
      commentSortOrder: "DESC"
    }
  },
  methods: {
    // 向父组件传参
    handleSortMetricChange(option) {
      this.sortMetric = option.metric
      this.sortMetricLabel = option.label
      this.$emit('change-sortMetric', this.sortMetric)
    },
    handleDimensionChange() {
      this.$emit('change-filterDimension', this.filterDimension)
    },
    handleNumChange() {
      this.recordNum = this.numberSelect
      this.$emit('change-recordLimit', this.recordNum)
    },
    setRecordNumAll() {
      this.recordNum = 'all'
      this.$emit('change-recordLimit', this.recordNum)
    },
    setTypeValue() {
      this.valueType = 'select_metric_value'
      this.setMaterialChart()
    },
    setTypeDiff() {
      this.valueType = 'select_metric_diff'
      this.setMaterialChart()
    },
    // stat card选中时高亮，重置active label，重置折线图内容setMaterialChart
    handleMetricCardClick(metric) {
      this.activeIndex = this.activeIndex === metric ? -1 : metric
      const activeObject = this.statCards.find(item => item.metric === metric)
      this.activeMetric = metric
      this.activeLabel = activeObject ? activeObject.label : metric
      this.$emit('change-selectMetric', this.activeMetric)
    },
    // 匹配输入建议，远程搜索
    querySearch(queryString, cb) {
      console.log(queryString)
      if (this.searchTimeOut) {
        clearTimeout(this.searchTimeOut)
      }
      this.searchTimeOut = setTimeout(() => {
        if (!queryString) {
          cb([]);
          return;
        }
        // 向接口发送searchType+queryString
        axios.get(`http://47.107.244.209:8967/material/aliu99/dy/search/get/?search_type=${this.searchType}&query_item=${queryString}`)
            .then(response => {
              cb(response.data.results)
            }).catch(error => {
          console.log(error);
          cb([]);
        });
      }, 100)
    },
    sendQueryAtChange() {
      this.$emit('change-searchType', this.searchType)
      this.$emit('change-queryItem', this.queryItem)
    },
    // 统计卡片
    getValue(metric) {
      return formatAllValues(metric, this.statData[metric]) || 0
    },
    updateStatistics() {
      this.statData = this.footerSum
    },
    // stat_card选中时高亮，重置activeLabel，重置表格内容setMaterialChart
    // 绘制折线图
    setMaterialChart() {
      let seriesData = this.parentMaterialSeries
      this.materialChartOptions.title = {text: ''}
      this.materialChartOptions.xAxis = {
        type: 'category',
        name: '时间',
        boundaryGap: false,
        data: Object.keys(Object.values(seriesData)[0]['trend']),
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
      this.materialChartOptions.yAxis[0]['name'] = this.activeLabel
      // tooltip添加单位
      if (this.activeMetric.includes('dislike_rate')) {
        this.materialChartOptions.tooltip.valueFormatter = function (value) {
          return value + '‰'
        }
      } else if (this.activeMetric.includes('report_rate')) {
        this.materialChartOptions.tooltip.valueFormatter = function (value) {
          return value + '‱'
        }
      } else if (this.activeMetric.includes('rate')) {
        this.materialChartOptions.tooltip.valueFormatter = function (value) {
          return value + '%'
        }
      } else {
        this.materialChartOptions.tooltip.valueFormatter = function (value) {
          return value
        }
      }
      // 添加曲线
      const tempSeriesList = []
      Object.entries(seriesData).forEach(([key, value]) => {
        let metricSeries = Object.values(value['trend']).map(d => formatAllValues(this.activeMetric, d[this.valueType]))
        tempSeriesList.push({
          type: 'line',
          smooth: true,
          showSymbol: false,
          label: {
            show: true,
            position: 'top'
          },
          name: key,
          data: metricSeries,
          emphasis: {
            focus: 'series'
          }
        })
        this.materialChartOptions.series = tempSeriesList
      })
    },
    setMaterialTable() {
      this.materialTableOptions.data = this.parentMaterialPivot
      Object.keys(this.footerSum).forEach(key => {
        if (typeof this.footerSum[key] === 'number') {
          if (key.search('report_rate') !== -1) {
            this.formattedFooterSum[key] = parseFloat((this.footerSum[key]*10000).toFixed(4)) + "‱"
          } else if (key.search('dislike_rate') !== -1) {
            this.formattedFooterSum[key] = parseFloat((this.footerSum[key]*1000).toFixed(4)) + "‰"
          } else if (key.search('rate') !== -1) {
            // eslint-disable-next-line vue/no-mutating-props
            this.formattedFooterSum[key] = parseFloat((this.footerSum[key]*100).toFixed(2)) + "%"
          } else if (key.search('cnt') !== -1) {
            this.formattedFooterSum[key] = Math.round(this.footerSum[key])
          } else {
            this.formattedFooterSum[key] = parseFloat(this.footerSum[key].toFixed(2))
          }
        } else {
          this.formattedFooterSum[key] = this.footerSum[key]
        }
      })
      Object.keys(this.footerAvg).forEach(key => {
        if (typeof this.footerAvg[key] === 'number') {
          if (key.search('report_rate') !== -1) {
            this.formattedFooterSum[key] = parseFloat((this.footerSum[key]*10000).toFixed(4)) + "‱"
          } else if (key.search('dislike_rate') !== -1) {
            this.formattedFooterSum[key] = parseFloat((this.footerSum[key]*1000).toFixed(4)) + "‰"
          } else if (key.search('rate') !== -1) {
            this.formattedFooterAvg[key] = parseFloat((this.footerAvg[key]*100).toFixed(2)) + "%"
          } else if (key.search('cnt') !== -1) {
            this.formattedFooterAvg[key] = Math.round(this.footerAvg[key])
          } else {
            this.formattedFooterAvg[key] = parseFloat(this.footerAvg[key].toFixed(2))
          }
        } else {
          this.formattedFooterAvg[key] = this.footerAvg[key]
        }
      })
      this.materialTableOptions.footerData = [this.formattedFooterSum, this.formattedFooterAvg]
      this.$refs['materialTableRef'].setAllTreeExpand(true)
    },
    // 抽屉弹窗
    selectEvent (row) {
      this.showMaterialDetail = true
      this.selectRow = row
      this.getVideoUrl(row['material_id'])
    },
    // 视频播放链接
    getVideoUrl(material_id) {
      axios.get(`http://47.107.244.209:8967/material/dy/temp_url/get/?material_id=${material_id}`)
          .then(response => {
            if (response.data.temp_url.length > 0) {
              this.selectMaterialDetail = response.data
              this.selectMaterialCreateTime = response.data['create_time']
              this.getVideoComment(material_id)
            } else {console.log('错误')}
          })
    },
    // 视频评论
    getVideoComment(material_id) {
      const start_time = this.selectMaterialCreateTime.split(' ')[0]
      const end_time = DateString(new Date())
      axios.get(`http://47.107.244.209:8967/material/comment/dy/get/?start_time=${start_time}&end_time=${end_time}&advertiser_ids=${this.advertiserIdList}&material_ids=${material_id}&page=${this.commentPage}&page_size=${this.commentPageSize}&level_type=${this.commentLevel}&emotion_type=${this.commentEmotion}&order_field=${this.commentSortField}&order_type=${this.commentSortOrder}`)
          .then(response => {
            if (response.data.code === 1) {
              this.selectMaterialComment = response.data['comment_list']
              this.selectMaterialCommentPage = response.data['page_info']
            } else {console.log('错误')}
          })
    },
    handleDrawerClose() {
      // 通过ref访问子组件中的video元素
      const videoElement = this.$refs.materialDetail.$refs.videoPlayer
      if (videoElement) {
        videoElement.pause()
        videoElement.currentTime = 0
      }
      this.selectRow = null
    }
  },
  mounted() {
    this.setMaterialChart()
    this.setMaterialTable()
  },
  watch: {
    parentMaterialSeries: function() {
      this.setMaterialChart()
    },
    parentMaterialPivot: function() {
      this.setMaterialTable()
    }
  }
}
</script>

<style>
/* 统计指标 */
/* 基础卡片样式 */
.stat-card {
  margin: 3px;
  padding: 3px;
  cursor: pointer;
}
.card-content {
  padding: 10px 0
}
.card-label {
  text-align: left;
  font-size: 12px;
  color: #606266
}
.card-value {
  text-align: left;
  font-size: 18px;
  font-weight: 550;
  color: #606266;
}
/* 激活状态卡片样式 */
.active-card {
  background-color: #eaf3ff;
}
.container {
  width: 95%;
  height: 400px;
}
/* 下拉菜单 */
.filter-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px; /* 元素间距 */
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
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>