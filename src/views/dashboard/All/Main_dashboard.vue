<template>
  <div class="page-container">
    <!--日期选择器-->
    <el-row>
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
      <div class="update-time" style="">{{"更新时间："+updateTime}}
        <el-button icon="el-icon-refresh" size="mini" type="text" @click="getLiveList"></el-button>
      </div>
    </el-row>
    <!--汇总所选日期内的直播，正在直播的直播间前置，其余按照开播时间排序-->
    <el-row>
      <div class="cards-container-pc" v-if="LiveOptions.length>0">
        <Main_liveCard ref="showLiveCard"
                       :parentLiveList="ShowLive" :defaultROIGoal="defaultROIGoal"
                       @change-selectLive="selectLiveChange" @submit-RoiGoal="roiGoalSubmit"/>
        <el-button type="text" size="small" v-model="showButton" @click="handlePanelOpen">{{'已结束'+finishCnt+'场（点击展开）'}}<i class="el-icon-more"></i></el-button>
        <Main_liveCard v-if="showButton===true||panelHide===false"
                       ref="hiddenLiveCard"
                       :parentLiveList="HiddenLive" :defaultROIGoal="defaultROIGoal"
                       @change-selectLive="selectLiveChange" @submit-RoiGoal="roiGoalSubmit"/>

      </div>
    </el-row>
    <!--展示所选直播间，自动选择最新直播-->
    <el-row>

    </el-row>
    <!--展示各种图表-->
    <el-row v-loading="!dataLoaded">
      <Aliu99_chartTab v-if="dataLoaded && showAliuChart"
                       :tag_type="tag_type" :liveStart="liveStart" :liveEnd="liveEnd"
                       :advertiserIdList="advertiserIdList" :advertiserList="advertiserList"
                       :order_goal="order_goal" :last_order_cnt="last_order_cnt" :roiInput="roiInput"/>
      <Shuangyu49_chartTab v-if="dataLoaded && showShuangyuChart"
                           :tag_type="tag_type" :liveStart="liveStart" :liveEnd="liveEnd"
                           :advertiserIdList="advertiserIdList" :advertiserList="advertiserList"
                           :order_goal="order_goal" :last_order_cnt="last_order_cnt" :roiInput="roiInput"/>
    </el-row>
  </div>
</template>

<script>
import {DateTimeString} from "@/functions/time_function";
import axios from "@/api/axios";
import Main_liveCard from "./Main_liveCard";
import Aliu99_chartTab from "@/views/dashboard/Aliu99/Aliu99_chartTab";
import Shuangyu49_chartTab from "@/views/dashboard/Shuangyu49/Shuangyu49_chartTab.vue"

export default {
  name: "Main_dashboard",
  components: {
    Shuangyu49_chartTab,
    Main_liveCard,
    Aliu99_chartTab
  },
  data() {
    return {
      activeIndex: '',
      // 最新直播
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
      updateTime: "",
      LiveOptions: [],
      defaultROIGoal: 0.4,
      roiInput: 0.4,
      roiEditMap: {}, // 每个room_id是否正在编辑
      roiGoalDict: {},
      showButton: false,
      // 选中的直播
      selectLive: "",
      selectLiveName: "",
      dataLoaded: false,
      tag_type: "",
      liveStart: "",
      liveEnd: "",
      advertiserIdList: [],
      advertiserList: [],
      order_goal: 0,
      last_order_cnt: 0
    }
  },
  computed: {
    finishCnt() {
      return this.LiveOptions.filter(card => card.room_data.room_status === 'FINISH').length
    },
    allFinished() {
      return this.LiveOptions.length > 0 &&
          this.LiveOptions.every(card => card.room_data.room_status === 'FINISH')
    },
    ShowLive() {
      if (this.allFinished) {
        return []
      }
      return this.LiveOptions.filter(
          card => card.room_data.room_status === 'LIVING' ||
              card.room_data.room_id === this.selectLive
      )
    },
    HiddenLive() {
      if (this.allFinished) {
        return this.LiveOptions
      }
      return this.LiveOptions.filter(
          card => card.room_data.room_status !== 'LIVING' &&
              card.room_data.room_id !== this.selectLive
      )
    },
    panelHide() {
      return !this.allFinished
    },
    showAliuChart() {
      return this.selectLiveName.includes("99")
    },
    showShuangyuChart() {
      return this.selectLiveName.includes("双语")
    }
  },
  methods: {
    // 接收子组件参数
    selectLiveChange(live_data) {
      this.selectLive = live_data.room_data.room_id
      this.selectLiveName = live_data.room_data.aweme_nickname
      this.tag_type = live_data.room_data.room_status
      this.liveStart = live_data.room_data.start_time
      this.liveEnd = live_data.room_data.end_time
      this.advertiserIdList = live_data.advertiser_data.map(d => d.advertiser_id)
      this.advertiserList = live_data.advertiser_data.map(d => d.advertiser_name)
      this.roiInput = live_data.room_data.roi_goal
      this.order_goal = live_data.room_data.order_goal
      this.last_order_cnt = live_data.room_data.live_pay_order_count_unit
    },
    roiGoalSubmit(goal_dict) {
      this.roiGoalDict = goal_dict;
      this.getLiveList()
    },
    // 先获取全部
    getLiveList() {
      let start_date = new Date()
      start_date.setHours(0, 0, 0, 0)
      let end_date = new Date()
      end_date.setHours(23, 59, 59, 59)
      if (this.selectLiveDate.length > 0) {
        start_date = this.selectLiveDate[0]
        end_date = this.selectLiveDate[1]
        end_date.setHours(23, 59, 59, 59)
      }
      start_date = DateTimeString(start_date)
      end_date = DateTimeString(end_date)
      axios.post(`http://127.0.0.1:8000/dashboard/all/dy/live/room/list/post/`,{query_start: start_date, query_end: end_date, roi_goal_dict: this.roiGoalDict})
          .then(response => {
            this.updateTime = DateTimeString(new Date())
            if (response.data.data.length > 0) {
              this.LiveOptions = response.data.data
              // 默认选择最近一场直播
              console.log(this.selectLive)
              if (this.selectLiveDate.length === 0) {
                this.selectLive = this.LiveOptions[0].room_data.room_id
                this.selectLiveName = this.LiveOptions[0].room_data.aweme_nickname
                this.tag_type = this.LiveOptions[0].room_data.room_status
                this.liveStart = this.LiveOptions[0].room_data.start_time
                this.liveEnd = this.LiveOptions[0].room_data.end_time
                this.advertiserIdList = this.LiveOptions[0].advertiser_data.map(d => d.advertiser_id)
                this.advertiserList = this.LiveOptions[0].advertiser_data.map(d => d.advertiser_name)
                this.roiInput = this.LiveOptions[0].room_data.roi_goal
                this.order_goal = this.LiveOptions[0].room_data.order_goal
                this.last_order_cnt = this.LiveOptions[0].room_data.live_pay_order_count_unit
                this.dataLoaded = true
              }
            } else {console.log('错误')}
          })
    },
    handlePanelOpen() {
      this.showButton = !this.showButton
    },
  },
  mounted() {
    this.getLiveList()
    setInterval(() => {
      this.getLiveList();
    }, 60000)
  },
  watch: {

  }
}
</script>

<style>
.page-container {
  background: #f6fafd;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 10px;
  box-sizing: border-box
}

.hidden-panel {
  background-color: transparent;
  margin-top: 10px;
  padding: 0;
}

.cards-container-pc {
  margin-top: 10px;
  margin-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px
}

.update-time {
  float: right;
  display: block;
  white-space: nowrap;
  font-size: 12px;
  color: #8a96a6;
  text-align: right;
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