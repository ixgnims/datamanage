<template>
  <div class="page-container">
    <!--筛选器-->
    <el-row class="selector">
      <el-row style="flex-direction: column; margin-bottom: 5px">
          <div style="float: left; display: block; white-space: nowrap; margin-right: 20px">
            {{"选择直播日期"}}
            <el-date-picker
                v-model="selectLiveDate"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :editable="false"
                @change="getLiveList"
                size="mini"
                align="right">
            </el-date-picker>
          </div>
          <div style="float: left; display: block;white-space: nowrap;">
            {{"选择场次"}}
            <el-select v-model="selectLive"
                       placeholder="请选择"
                       @change="getLiveData"
                       size="mini">
              <el-option
                  v-for="item in LiveOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="update-time" style="">{{"更新时间："+updateTime}}
            <el-button icon="el-icon-refresh" size="mini" type="text" @click="getLiveData"></el-button>
          </div>
      </el-row>
      <el-row>
        <div style="float: left; display:block; white-space: nowrap">
          {{"输入目标ROI"}}
          <el-input v-model="roiInput"
                    placeholder="默认0.45"
                    @change="getLiveData"
                    style="width: 30%"
                    size="mini"></el-input>
        </div>
        <div style="float: left; display: block; white-space: nowrap">
          {{"数据来源"}}
          <el-select v-model="selectSource"
                     placeholder=""
                     @change="getLiveData"
                     size="mini">
            <el-option
                v-for="item in SourceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-row>
    </el-row>
    <el-row class="data-area">
      <!--基本信息-->
      <el-row type="flex" align="bottom">
        <!--
        <el-col :span="8" type="flex">
          <vxe-table
              border
              size="small"
              min-height="30"
              :show-header="false"
              :data="advertiser_tableData">
            <vxe-column field="advertiser_name" title="" wdith="66%"></vxe-column>
            <vxe-column field="stat_cost" title="" width="34%"></vxe-column>
          </vxe-table>
        </el-col>
        -->
        <el-col :span="8" :offset="8">
          <el-card style="min-height: 200px">
            <div slot="header">
              <span>{{aweme_nickname}}</span>
              <el-tag v-if="tag_type === 'LIVING'" type="success" size="mini">直播中</el-tag>
              <el-tag v-else-if="tag_type === 'FINISH'" type="info" size="mini">已结束</el-tag>
            </div>
            <div class="card-item">{{"RoomID："+roomID}}</div>
            <div class="card-item">{{"直播时间："+liveStart}}</div>
            <div class="card-item">{{"直播时长："+liveDuration}}</div>
            <div class="card-item">{{"推广类型："}}
              <el-tag v-if="isStandard" type="primary" size="mini">标准推广</el-tag>
              <el-tag v-if="isUni" type="warning" size="mini">全域推广</el-tag>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <vxe-table
              border
              size="small"
              min-height="200"
              :show-header="false"
              :data="goal_tableData">
            <vxe-column field="roi_goal" title=""></vxe-column>
            <vxe-column field="order_goal" title=""></vxe-column>
            <vxe-column field="order_gap" title="" type="html" :formatter="colorGap"></vxe-column>
          </vxe-table>
        </el-col>
      </el-row>
      <!--直播间数据-->
      <el-row>
        <vxe-table
            border
            size="small"
            min-height="50"
            :cell-style="highlightCell"
            :data="current_tableData">
          <vxe-column field="description" title=""></vxe-column>
          <vxe-column field="estimate_level" title="消耗流速" :title-suffix="{content: '过去3分钟的平均增长率', icon: 'vxe-icon-info-circle'}"></vxe-column>
          <vxe-column field="live_stat_cost" title="当前消耗"></vxe-column>
          <vxe-column field="live_pay_order_gmv_alias" title="当前GMV"></vxe-column>
          <vxe-column field="live_pay_order_count_unit" title="当前单量"></vxe-column>
          <vxe-column field="live_pay_order_gmv_roi" title="当前ROI"></vxe-column>
          <vxe-column field="roi_goal" title="目标ROI"></vxe-column>
          <vxe-column field="order_goal" title="目标单量"></vxe-column>
          <vxe-column field="order_gap" title="单量差额" type="html" :formatter="colorGap"></vxe-column>
        </vxe-table>
      </el-row>
      <!--广告账户数据-->
      <el-row>
        <vxe-table
            border
            size="small"
            min-height="50"
            :cell-style="highlightCell"
            :show-header="false"
            :data="advertiser_tableData">
          <vxe-column field="advertiser_name" title=""></vxe-column>
          <vxe-column field="" title="消耗流速" :title-suffix="{content: '过去3分钟的平均增长率', icon: 'vxe-icon-info-circle'}"></vxe-column>
          <vxe-column field="stat_cost" title="当前消耗"></vxe-column>
          <vxe-column field="luban_live_pay_order_gmv" title="当前GMV"></vxe-column>
          <vxe-column field="luban_live_pay_order_count_unit" title="当前单量"></vxe-column>
          <vxe-column field="advertiser_roi" title="当前ROI"></vxe-column>
          <vxe-column field="roi_goal" title="目标ROI"></vxe-column>
          <vxe-column field="advertiser_order_goal" title="目标单量"></vxe-column>
          <vxe-column field="advertiser_order_gap" title="单量差额" type="html" :formatter="colorGap"></vxe-column>
        </vxe-table>
      </el-row>
      <!--投流预估数据-->
      <!--
      <el-row>
        <vxe-table
            border
            size="small"
            :row-style="rowStyle"
            :data="estimate_tableData">
          <vxe-column field="description" title=""></vxe-column>
          <vxe-column field="estimate_level" title="消耗增量"></vxe-column>
          <vxe-column field="estimate_cost" title="预估消耗"></vxe-column>
          <vxe-column field="cost_gap" title="消耗差值"></vxe-column>
          <vxe-column field="current_order" title="当前单量"></vxe-column>
          <vxe-column field="estimate_roi" title="预估ROI"></vxe-column>
          <vxe-column field="roi_goal" title="目标ROI"></vxe-column>
          <vxe-column field="order_goal" title="目标单量"></vxe-column>
          <vxe-column field="order_gap" title="单量差额" type="html" :formatter="colorGap"></vxe-column>
        </vxe-table>
      </el-row>
      -->
      <!--轮次
      <el-row style="margin-top: 5px">
        <div style="float: left; display: block; white-space: nowrap; margin-right: 20px">
          {{"本轮开始时间"}}
          <el-time-picker
              size="small"

              v-model="roundStart"
              :picker-options="{selectableRange: '06:00:00 - 18:00:00', format: 'HH:mm:00'}"
          >
          </el-time-picker>
        </div>
      </el-row>
      -->
      <!--投流预估图表-->
      <el-row>
        <el-card shadow="hover" style="margin-top: 5px">
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="单量ROI" name="Order2">
              <Aliu99_orderChart2 :activeTab="activeTab" :selectLive="selectLive" :last_order_cnt="last_order_cnt" :roiInput="roiInput" :order_goal="order_goal"/>
            </el-tab-pane>
            <!--
            <el-tab-pane label="投流视频" name="Video2">
              <Aliu99_materialChart2 :activeTab="activeTab" :tag_type="tag_type"
                                     :liveStart="liveStart" :liveEnd="liveEnd"
                                     :advertiserIdList="advertiserIdList" :advertiserList="advertiserList"/>
            </el-tab-pane>
            -->
            <el-tab-pane label="投流视频" name="Video">
              <Aliu99_materialChart @change-selectMetric="selectMetricChange" @change-filterDimension="filterDimensionChange"
                                    @change-sortMetric="sortMetricChange" @change-recordLimit="recordLimitChange"
                                    @change-searchType="searchTypeChange" @change-queryItem="queryItemChange"
                                    :tag_type="tag_type"
                                    :liveStart="liveStart" :liveEnd="liveEnd" :advertiserIdList="advertiserIdList"
                                    :parentMaterialSeries="parentMaterialSeries"
                                    :parentMaterialAlert="parentMaterialAlert"
                                    :parentMaterialPivot="parentMaterialPivot"
                                    :footerSum="footerSum" :footerAvg="footerAvg"/>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import axios from "@/api/axios";
import {DateTimeString, DateString} from '@/functions/time_function'
import {calculateAverageRate} from '@/functions/chart_function'
import Aliu99_orderChart2 from "./Aliu99_orderChart2.vue"
import Aliu99_materialChart from "./Aliu99_materialChart.vue";
//import Aliu99_materialChart2 from "./Aliu99_materialChart2.vue"
export default {
  name: "Aliu99Estimate",
  components: {
    Aliu99_orderChart2,
    Aliu99_materialChart,
    //Aliu99_materialChart2
  },
  data() {
    const rowStyle = ({rowIndex}) => {
      if ([2].includes(rowIndex)) {
        return {
          backgroundColor: '#fff7e5',
        }
      }
      return null
    }
    return {
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      selectLiveDate: [],
      LiveOptions: [{info: {room_id: '', start_time: ''}, label: '请先选择日期', value: ''}],
      selectLive: '最新直播',
      SourceOptions: [{value: 'db', label: '数据库'}, {value: 'api', label: 'API直连(测试)'}],
      selectSource: 'db',
      roundStart: new Date(2025, 2, 5, 15, 40),
      advertiser_tableData: [],
      advertiserList: [],
      advertiserIdList: [],
      current_tableData: [],
      estimate_tableData: [],
      goal_tableData: [],
      rowStyle,
      aweme_nickname: "暂无数据",
      tag_type: "",
      roomID: "",
      isStandard: false,
      isUni: false,
      liveStart: "",
      liveEnd: "",
      liveDuration: "",
      updateTime: "",
      activeTab: "Order2",
      // 向投流图表子组件传参
      parentSeries: [],
      last_order_cnt: 0,
      roiInput: 0.4,
      order_goal: 0,
      // 向素材图表子组件传参
      parentMaterialSeries: {},
      parentMaterialAlert: [],
      parentMaterialPivot: [],
      footerSum: {},
      footerAvg: {},
      filterDimension: "material_id",
      sortMetric: "total_cost",
      recordLimit: 5,
      selectMetric: "total_cost",
      searchType: "",
      queryItem: "",
    };
  },
  methods: {
    filterDimensionChange(dimension) {
      this.filterDimension = dimension
    },
    selectMetricChange(metric) {
      this.selectMetric = metric
    },
    sortMetricChange(metric) {
      this.sortMetric = metric
    },
    recordLimitChange(num) {
      this.recordLimit = num
    },
    searchTypeChange(type) {
      this.searchType = type
    },
    queryItemChange(item) {
      this.queryItem = item
    },
    getLiveList() {
      let start_date = new Date();
      start_date.setHours(0, 0, 0, 0)
      let end_date = new Date()
      if (this.selectLiveDate.length > 0) {
        start_date = this.selectLiveDate[0]
        end_date = this.selectLiveDate[1]
        end_date.setHours(23, 59, 59, 59)
      }
      start_date = DateTimeString(start_date)
      end_date = DateTimeString(end_date)
      axios.get(`http://47.107.244.209:8967/dashboard/aliu99/dy/live/room/list/get/?query_start=${start_date}&query_end=${end_date}`)
          .then(response => {
            if (response.data.data.length > 0) {
              const LiveData = response.data.data
              const LiveList = []
              if (LiveData.length > 0) {
                for (let i = 0; i < LiveData.length; i++) {
                  LiveList.push({info: {room_id: LiveData[i]['room_id'], start_time: LiveData[i]['start_time']}, value: LiveData[i]['room_id'], label: LiveData[i]['start_time']})
                }
                this.LiveOptions = LiveList
              }
            } else {console.log('错误')}
          })
    },
    getLiveData() {
      if (this.selectLive) {
        if (this.selectLive === '最新直播') {
          var room_id = this.selectLive
          var live_date = DateString(new Date())
        } else {
          room_id = this.selectLive
          if (this.LiveOptions.length > 0) {
            for (var i = 0; i < this.LiveOptions.length; i++) {
              if(this.LiveOptions[i].value === room_id) {
                live_date = this.LiveOptions[i].info.start_time.split(' ')[0]
              }
            }
          }
        }
        let roi_goal = this.roiInput
        let data_source = this.selectSource
        // 表格数据接口
        axios.get(`http://47.107.244.209:8967/dashboard/aliu99/dy/live/room/estimate/get/?room_id=${room_id}&roi_goal=${roi_goal}&live_date=${live_date}&data_source=${data_source}`)
            .then(response => {
              this.updateTime = DateTimeString(new Date())
              if (response.data.room_data.length > 0) {
                var room_data = response.data.room_data
                this.current_tableData = room_data
                this.aweme_nickname = room_data[0].aweme_nickname
                this.tag_type = room_data[0].room_status
                this.roomID = room_data[0].room_id
                this.liveStart = room_data[0].start_time
                this.liveEnd = room_data[0].end_time
                this.liveDuration = room_data[0].live_duration
                this.order_goal = room_data[0].order_goal
                this.last_order_cnt = room_data[0].live_pay_order_count_unit
              }
              if (response.data.advertiser_data.length > 0) {
                const advertiser_data = response.data.advertiser_data;
                this.advertiser_tableData = advertiser_data
                this.advertiserList = advertiser_data.map(d => d.advertiser_name)
                this.advertiserIdList = advertiser_data.map(d => d.advertiser_id)
                if (advertiser_data.length > 0) {
                  const promotion_type_list = [];
                  for (let i = 0; i < advertiser_data.length; i++) {
                    if (advertiser_data[i]['promo_type'] === "标准推广") {
                      promotion_type_list.push('isStandard')
                    }
                    if (advertiser_data[i]['promo_type'] === "全域推广") {
                      promotion_type_list.push('isUni')
                    }
                  }
                  this.isStandard = promotion_type_list.includes('isStandard')
                  this.isUni = promotion_type_list.includes('isUni')
                }
              } else{this.advertiser_tableData = []}
              /*
              if (response.data.estimate_data.length > 0) {
                var estimate_data = response.data.estimate_data
                this.estimate_tableData = estimate_data
              }
              */
              if (response.data.goal_data.length > 0) {
                var goal_data = response.data.goal_data
                this.goal_tableData = goal_data
              }
              // Echarts各趋势图
              // 直播趋势图
              if (this.activeTab === 'Order' || this.activeTab === 'ROI') {
                this.getLiveTrend(room_id)
              } else if (this.activeTab === 'Video') {
                this.getMaterialTrend(this.liveStart, this.liveEnd, this.advertiserList)
              }
            })
      } else {console.log('错误')}
    },
    getLiveTrend(room_id) {
      axios.get(`http://47.107.244.209:8967/dashboard/aliu99/dy/trend/get/?room_id=${room_id}`)
          .then(response => {
            if (response.data.code === 1) {
              this.parentSeries = response.data
              if (this.tag_type === "LIVING") {
                let cost_array = response.data.trend_data.map(d => d.stat_cost.metric_value.total)
                // 表格中的消耗流速
                this.current_tableData[0].estimate_level = calculateAverageRate(cost_array, 3)
              } else {
                this.current_tableData[0].estimate_level = "-"
              }
            }
          })
    },
    getMaterialTrend(start_time, end_time, advertiser_list) {
      // 折线图
      axios.get(`http://47.107.244.209:8967/dashboard/aliu99/dy/live/material/trend/get/?start_time=${start_time}&end_time=${end_time}&advertiser_list=${advertiser_list}&dimension=${this.filterDimension}&select_metric=${this.selectMetric}&sort_metric=${this.sortMetric}&search_type=${this.searchType}&query_item=${this.queryItem}&record_limit=${this.recordLimit}`)
          .then(response => {
            if (response.data.code === 1) {
              this.parentMaterialSeries = response.data.trend_data
              this.parentMaterialAlert = response.data.alert_list
            }
          })
      // 表格
      let live_date = start_time.split(' ')[0]
      axios.get(`http://47.107.244.209:8967/dashboard/aliu99/dy/live/material/table/get/?live_date=${live_date}&advertiser_list=${advertiser_list}&dimensions=edit_version,material_id&having_info=True&search_type=${this.searchType}&query_item=${this.queryItem}`)
          .then(response => {
            if (response.data.code === 1) {
              this.parentMaterialPivot = response.data.pivot_data
              this.footerSum = response.data.footer_sum
              this.footerAvg = response.data.footer_avg
            }
          })
    },
    // 素材数据表
    handleTabClick() {
      if (this.activeTab === 'Order' || this.activeTab === 'ROI') {
        this.getLiveTrend(this.roomID)
      } else if (this.activeTab === 'Video') {
        this.getMaterialTrend(this.liveStart, this.liveEnd, this.advertiserList)
      }
    },
    colorGap({ cellValue }) {
      if (cellValue >= 0) {
        return `<span style="color: #9ad294; font-weight: bold">${parseFloat(cellValue.toFixed())}</span>`
      } else {
        return `<span style="color: #ff98a6; font-weight: bold">${parseFloat(cellValue.toFixed())}</span>`
      }
    },
    highlightCell({row, column}) {
      if (column.field === 'live_pay_order_gmv_roi') {
        if (row.live_pay_order_gmv_roi >= this.roiInput) {
          return {
            backgroundColor: '#e2fae1',
            fontWeight: 'bold',
          }
        }
        return {
          backgroundColor: '#d0e4ff',
          fontWeight: 'bold',
        }
      }
      if (column.field === 'roi_goal') {
        return {
          fontWeight: 'bold',
        }
      }
    }
  },
  mounted() {
    this.getLiveData();
    setInterval(() => {
      this.getLiveData();
    }, 60000);
  },
  watch: {
    selectMetric: function() {
      this.getLiveData()
    },
    sortMetric: function() {
      this.getLiveData()
    },
    recordLimit: function() {
      this.getLiveData()
    },
    filterDimension: function() {
      this.getLiveData()
    },
    queryItem: function() {
      this.getLiveData()
    }
  }
};
</script>

<style>
.page-container {
  padding: 8px
}
.selector {
  margin: 3px;
  padding-bottom: 3px;
}
.update-time {
  float: right;
  display: block;
  white-space: nowrap;
  font-size: 12px;
  color: #8a96a6;
  text-align: right;
}
.card-item {
  font-size: 12px;
  padding: 1px;
  margin: 3px
}

.container {
  width: 95%;
  height: 400px;
}

/** 移动端显示 **/
@media screen and (max-width: 800px) {
  .update-time {
    float: left;
    display: block;
    white-space: nowrap;
    font-size: 12px;
    color: #8a96a6;
    text-align: left;
  }
  .el-picker-panel__sidebar {
    width: 100%;
  }
  .el-picker-panel {
    width: 300px !important;
  }
  .el-picker-panel__content {
    width: 100%;
  }
  .el-picker-panel__body{
    margin-left: 0!important;
    display: flex;
    flex-direction: column;
    min-width: auto!important;
  }
  .el-picker-panel__sidebar {
    position: relative;
  }
  .el-picker-panel__body-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>