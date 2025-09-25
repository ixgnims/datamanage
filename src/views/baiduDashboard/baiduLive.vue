<template>
  <div>
    <!--数字人1号-->
    <el-card class="content-card">
      <el-row>
        <div class="content-title">百度数字人1号</div>
        <div class="update-time" style="">{{"更新时间："+updateTimeOne}}
          <el-button icon="el-icon-refresh" size="mini" type="text" @click="getBaiduAnchorOne"></el-button>
        </div>
      </el-row>
      <el-row>
        <el-date-picker
            v-model="selectDateOne"
            type="daterange"
            range-separator="~"
            :start-placeholder= "start_info_one"
            :end-placeholder="start_info_one"
            :editable="false"
            @change="getBaiduAnchorOne"
            size="mini"
            align="right">
        </el-date-picker>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-col v-for="(card) in statCardsOne" :key="card.metric" :span="4">
          <el-card shadow="hover"
                   :body-style="{padding: '6px'}"
                   :class="{'active-card' :activeIndexOne === card.metric, 'stat-card': true}"
                   @click.native="handleMetricCardClickOne(card.metric)">
            <div class="card-content">
              <div class="card-label">{{card.label}}</div>
              <div class="card-value">
                {{formattedFooterSumOne[card.metric]}}
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </el-card>

    <!--数字人2号-->
    <el-card class="content-card">
      <el-row>
        <div class="content-title">百度数字人2号</div>
        <div class="update-time" style="">{{"更新时间："+updateTimeTwo}}
          <el-button icon="el-icon-refresh" size="mini" type="text" @click="getBaiduAnchorTwo"></el-button>
        </div>
      </el-row>
      <el-row>
        <el-date-picker
            v-model="selectDateTwo"
            type="daterange"
            range-separator="~"
            :start-placeholder= "start_info_two"
            :end-placeholder="start_info_two"
            :editable="false"
            @change="getBaiduAnchorTwo"
            size="mini"
            align="right">
        </el-date-picker>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { DateString, DateTimeString } from "@/functions/time_function"
import axios from "@/api/axios"
export default {
  name: 'baiduLive',
  data() {
    return {
      // 数字人1
      updateTimeOne: "",
      start_info_one: "",
      end_info_one: "",
      selectDateOne: [],
      activeLabelOne: "单量",
      activeMetricOne: "live_convert_cnt",
      activeIndexOne: '',
      statCardsOne: [
        {label: "消耗", metric: "cost", suffix: ""},
        {label: "单量", metric: "live_convert_cnt", suffix: ""},
        {label: "GMV", metric: "live_GMV", suffix: ""},
        {label: "ROI", metric: "live_ROI", suffix: ""},
        {label: "点击率", metric: "ctr", suffix: "%"},
        {label: "观看人数", metric: "live_watch_user_cnt", suffix: ""},
      ],
      footerSumOne: {},
      formattedFooterSumOne: {},
      // 数字人2
      updateTimeTwo: "",
      start_info_two: "",
      end_info_two: "",
      selectDateTwo: [],
      activeLabelTwo: "单量",
      activeMetricTwo: "live_convert_cnt",

    }
  },
  methods: {
    getCommonDate() {
      const today = new Date();
      const todayStr = DateString(today)
      const yesterdayStr = DateString(new Date(today.getTime() - 24 * 60 * 60 * 1000))
      const monthStart = DateString(new Date(today.getFullYear(), today.getMonth(), 1))
      return {
        today: todayStr,
        yesterday: yesterdayStr,
        monthStart: monthStart,
      }
    },
    getBaiduLiveUniversal(params) {
      return axios.get(`http://dashboard1.xiyao888.cn/baidu/ds/live_report/api/get/`, { params })
    },
    async getBaiduAnchorOne() {
      this.updateTimeOne = DateTimeString(new Date())
      let end_date = this.getCommonDate()['today']
      let start_date = this.getCommonDate()['today']
      this.start_info_one = start_date
      this.end_info_one = end_date
      if (this.selectDateOne.length > 0) {
        start_date = DateString(new Date(this.selectDateOne[0]))
        end_date = DateString(new Date(this.selectDateOne[1].setHours(23, 59, 59, 59)))
      }
    },
    handleMetricCardClickOne(metric) {
      console.log(metric)
    },
    async getBaiduAnchorTwo() {
      this.updateTimeTwo = DateTimeString(new Date())
      let end_date = this.getCommonDate()['today']
      let start_date = this.getCommonDate()['today']
      this.start_info_two = start_date
      this.end_info_two = end_date
      if (this.selectDateTwo.length > 0) {
        start_date = DateString(new Date(this.selectDateTwo[0]))
        end_date = DateString(new Date(this.selectDateTwo[1].setHours(23, 59, 59, 59)))
      }
    },
    reloadData() {
      this.getBaiduAnchorOne()
      this.getBaiduAnchorTwo()
    }
  },
  mounted() {
    this.reloadData()
  }
}
</script>

<style>

.content-card {
  margin-top: 10px;
  margin-bottom: 10px
}

.content-header {
  flex-direction: column;
}

.content-title {
  float: left;
  display: block;
  white-space: nowrap;
  margin-right: 20px;
  color: #606266;
  font-size: 16px;
  font-weight: 550;
}

.update-time {
  float: right;
  display: block;
  white-space: nowrap;
  font-size: 12px;
  color: #8a96a6;
}

.square-button {
  width: 30px;
  height: 30px;
  border-radius: 3px;
  padding: 0;
  justify-content: center;
  align-items: center;
}

.content-filter {
  flex-direction: column;
  white-space: nowrap;
}

.record-selector {
  float: left;
  display: block
}

.text-label {
  font-size: 13px;
  color: #606266;
  margin: 0 5px;
}

</style>