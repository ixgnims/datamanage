<template>
  <div>
    <el-row style="flex-direction:column;">
      <!-- 左侧：搜索框 -->
      <div style="float:left; display:block; white-space:nowrap; margin-bottom:5px; position:sticky; top:0; z-index:1000; background:#fff;">
        <el-autocomplete
            class="inline-input"
            v-model="queryItem"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            :trigger-on-focus="false"
            size="small"
            @select="handleAutoSelect">
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
      </div>
      <!-- 右侧：日期筛选器 -->
      <div style="float:right; display:block; white-space:nowrap; text-align:right">
        <el-date-picker
            v-model="selectDate"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :editable="false"
            @change="sendQueryAtChange"
            size="mini"
            align="right">
        </el-date-picker>
      </div>
    </el-row>
    <!--筛选项目概况-->
    <el-row style="display:flex;flex-direction:row;align-items:center;font-size:12px;margin-bottom:5px;">
      <div v-if="filterIsDefault" class="filter-tag" style="background-color:#f0fff3;border-color:#82cd69;color:#82cd69">{{'实时'+'  '+updateTime}}</div>
      <div v-else class="filter-tag" style="background-color:#fffaf0;border-color:#efca4e;color:#efca4e">{{'筛选'+'  '+updateTime}}</div>
      <div class="filter-tag" style="background-color:#f0f8ff;border-color:#78aae6;color:#78aae6">{{filterDateRange}}</div>
      <div class="filter-tag" style="background-color:#fdfcfc;border-color:#bfbfdb;color:#777794">{{filterItem}}</div>
      <div style="color:#797f88;letter-spacing:0.1em;margin-left:3px">共{{filterRecCnt}}条素材记录</div>
    </el-row>
    <!--趋势图子组件传参 单维度选择--><!--接受父组件传递的趋势图数据-->
    <qc_videoDashboard @change-chartDimension="chartDimensionSelect" @change-recordLimit="chartRecordLimitChange" :chartSeries="chartSeries" :combinePivot="combinePivot" :footerSum="footerSum" :footerAvg="footerAvg"/>
    <!--表格子组件传参 多维度选择--><!--接收父组件传递表格数据-->
    <qc_videoTable @change-dimensions="dimensionsChecked" :combinePivot="combinePivot" :footerSum="footerSum" :footerAvg="footerAvg"/>
  </div>
</template>

<script>
import axios from "@/api/axios";
import {DateString, TimeString} from "@/functions/time_function";
import qc_videoTable from './qc_videoTable.vue'
import qc_videoDashboard from './qc_videoDashboard.vue'
export default {
  name: "qianchuan_video",
  components: {  //注册子组件
    qc_videoTable,
    qc_videoDashboard,
  },
  data() {
    return {
      // 搜索框
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
      // 日期选择器
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
      selectDate: [],
      // 筛选项目概况
      filterIsDefault: true,
      updateTime: '',
      filterDateRange: '今日',
      filterItem: '全部',
      filterRecCnt: 0,
      dimensionsList: ['edit_version', 'material_id'],
      chartDimension: 'material_id',
      chartRecordLimit: 20,
      // 向透视表子组件传参
      combinePivot: [],
      footerSum: {},
      footerAvg: {},
      // 向趋势图子组件传参
      chartSeries: {}
    }
  },
  methods: {
    dimensionsChecked(data) {
      this.dimensionsList = data;
    },
    chartDimensionSelect(data) {
      this.chartDimension = data;
    },
    chartRecordLimitChange(data) {
      this.chartRecordLimit = data
    },
    // 匹配输入建议，远程搜索
    querySearch(queryString, cb) {
      console.log(queryString)
      if (this.searchTimeOut) {
        clearTimeout(this.searchTimeOut);
      }
      this.searchTimeOut = setTimeout(() => {
        if (!queryString) {
          cb([]);
          return;
        }
        // 向接口发送searchType+queryString
        axios.post(`http://47.107.244.209:8967/material/aliu99/dy/search/post/`,{search_type: this.searchType, query_item: queryString})
            .then(response => {
          cb(response.data.results)
        }).catch(error => {
          console.log(error);
          cb([]);
        });
      }, 100)
    },
    handleAutoSelect(item) {
      console.log(item);
    },
    getTrendChart() {
      // 默认获取昨天数据
      let start_date = new Date()
      let end_date = new Date()
      if (this.selectDate.length > 0) {
        start_date = this.selectDate[0]
        end_date = this.selectDate[1]
      }
      start_date = DateString(start_date)
      end_date = DateString(end_date)
      // 获取数据
      axios.get(`http://47.107.244.209:8967/material/aliu99/dy/kpi/trend/get/?start_date=${start_date}&end_date=${end_date}&dimension=${this.chartDimension}&record_limit=${this.chartRecordLimit}&search_type=${this.searchType}&query_item=${this.queryItem}`)
          .then(response => {
            if (response.data.code === 1) {
              // 向子组件传参 qc_videoDashboard
              this.chartSeries = response.data
            } else {
              console.log(response.data.message)
              this.chartSeries = {}
            }
          })
    },
    getPivot() {
      // 默认获取昨天数据
      let start_date = new Date()
      //start_date.setDate(start_date.getDate()-1)
      let end_date = new Date()
      //end_date.setDate(end_date.getDate()-1)
      if (this.selectDate.length > 0) {
        start_date = this.selectDate[0]
        end_date = this.selectDate[1]
      }
      start_date = DateString(start_date)
      end_date = DateString(end_date)
      // 获取数据
      axios.get(`http://47.107.244.209:8967/material/aliu99/dy/combine/pivot/get/?start_date=${start_date}&end_date=${end_date}&dimensions=${this.dimensionsList}&search_type=${this.searchType}&query_item=${this.queryItem}`)
          .then(response => {
            if (response.data.pivot_data.length > 0) {
              // 向子组件传参 qc_videoTable
              this.combinePivot = response.data.pivot_data
              this.footerSum = response.data.footer_sum
              this.footerAvg = response.data.footer_avg
              this.filterRecCnt = response.data.record_cnt
            } else {
              console.log(response.data.message)
              this.combinePivot = []
              this.footerSum = {}
              this.footerAvg = {}
            }
          })
    },
    sendQueryAtChange() {
      this.updateTime = TimeString(new Date())
      if (this.selectDate.length > 0) {
        let start_date = DateString(this.selectDate[0])
        let end_date = DateString(this.selectDate[1])
        if (end_date !== (new Date())) {
          this.filterIsDefault = false
        }
        if (start_date === end_date) {
          this.filterDateRange = end_date
        } else {
          this.filterDateRange = start_date + '至' + end_date
        }
      }
      if (this.queryItem.length > 0) {
        this.filterItem = this.searchOptions.find(item => item.value === this.searchType).label + "：" + this.queryItem
      } else {
        this.filterItem = "全部"
      }
      this.getTrendChart()
      this.getPivot()
    }
  },
  mounted() {
    this.sendQueryAtChange()
    if (this.selectDate.length === 0 || this.selectDate[1]===(new Date())) {
      setInterval(() => {
        this.sendQueryAtChange();
      }, 60000);
    }
  },
  watch: {
    dimensionsList: function(newValue) {
      this.getPivot()
      console.log(newValue)
    },
    chartDimension: function(newValue) {
      this.getTrendChart()
      console.log(newValue)
    },
    chartRecordLimit: function(newValue) {
      this.getTrendChart()
      console.log(newValue)
    }
  }
}
</script>

<style>

.filter-card ::v-deep .el-card__body {
  padding: 5px;
  margin: 3px;
  position:sticky;
  top:0;
  z-index:1000;
  background:#fff;
}

.filter-tag {
  padding: 2px 9px;
  margin-right: 5px;
  border-radius: 4px;
  border: 1px solid #a3b1c6;
}

/** 移动端显示 **/
@media screen and (max-width: 800px) {
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



