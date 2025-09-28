<template>
  <div>
      <el-card class="content-card">
        <el-row class="content-header">
          <div class="content-title">今日汇总</div>
          <div class="update-time" style="">{{"更新时间："+updateTimeDay}}
            <el-button icon="el-icon-refresh" size="mini" type="text" @click="getXhsWindAdvertiserDay"></el-button>
          </div>
        </el-row>
        <el-row>
          <div class="content-time">{{dayInfo}}</div>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-col v-for="(card) in statCardsDay" :key="card.metric" :span="4">
            <el-card shadow="hover"
                     :body-style="{padding: '6px'}"
                     :class="{'active-card' :activeIndexDay === card.metric, 'stat-card': true}"
                     @click.native="handleMetricCardClickDay(card.metric)">
              <div class="card-content">
                <div class="card-label">{{card.label}}</div>
                <div class="card-value">
                  {{formattedFooterSumDay[card.metric]}}
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row type="flex" justify="end" style="margin-top: 10px">
          <el-button icon="el-icon-download" size="mini" class="square-button" @click="exportPivotDay"></el-button>
        </el-row>
        <el-row style="margin-top:5px">
          <vxe-grid ref="advertiserTableDay" v-bind="advertiserTableDayOptions"></vxe-grid>
        </el-row>
    </el-card>
    <el-card class="content-card">
      <el-row class="content-header">
        <div class="content-title">昨日汇总</div>
        <div class="update-time" style="">{{"更新时间："+updateTimeYesterday}}
          <el-button icon="el-icon-refresh" size="mini" type="text" @click="getXhsWindAdvertiserYesterday"></el-button>
        </div>
      </el-row>
      <el-row>
        <div class="content-time">{{yesterdayInfo}}</div>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-col v-for="(card) in statCardsYesterday" :key="card.metric" :span="4">
          <el-card shadow="hover"
                   :body-style="{padding: '6px'}"
                   :class="{'active-card' :activeIndexYesterday === card.metric, 'stat-card': true}"
                   @click.native="handleMetricCardClickYesterday(card.metric)">
            <div class="card-content">
              <div class="card-label">{{card.label}}</div>
              <div class="card-value">
                {{formattedFooterSumYesterday[card.metric]}}
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end" style="margin-top: 10px;">
        <el-button icon="el-icon-download" size="mini" class="square-button" @click="exportPivotYesterday"></el-button>
      </el-row>
      <el-row style="margin-top:5px">
        <vxe-grid ref="advertiserTableYesterday" v-bind="advertiserTableYesterdayOptions"></vxe-grid>
      </el-row>
    </el-card>
    <el-card class="content-card">
      <el-row>
        <div class="content-title">本月汇总</div>
        <div class="update-time" style="">{{"更新时间："+updateTimeMonth}}
          <el-button icon="el-icon-refresh" size="mini" type="text" @click="getXhsWindAdvertiserMonth"></el-button>
        </div>
      </el-row>
      <el-row>
        <el-date-picker
            v-model="selectDateMonth"
            type="daterange"
            range-separator="~"
            :start-placeholder= "monthStartInfo"
            :end-placeholder="monthEndInfo"
            :editable="false"
            @change="getXhsWindAdvertiserMonth"
            size="mini"
            align="right">
        </el-date-picker>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-col v-for="(card) in statCardsMonth" :key="card.metric" :span="4">
          <el-card shadow="hover"
                   :body-style="{padding: '6px'}"
                   :class="{'active-card' :activeIndexMonth === card.metric, 'stat-card': true}"
                   @click.native="handleMetricCardClickMonth(card.metric)">
            <div class="card-content">
              <div class="card-label">{{card.label}}</div>
              <div class="card-value">
                {{formattedFooterSumMonth[card.metric]}}
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <div class="monthChartContainer" id="monthChart">
          <e-charts class="chart"
                    :option="monthChartOptions"
                    :updateOptions="{notMerge:true}"
                    :autoresize="true"/>
        </div>
      </el-row>
      <el-row style="flex-direction: column; margin-top: 10px; width: 100%;">
        <div style="float: left; display: block; white-space: nowrap">
          <el-radio-group v-model="monthTableRadio" @change="getXhsWindAdvertiserMonth" size="mini">
            <el-radio :label="1" size="mini">合计</el-radio>
            <el-radio :label="2" size="mini">分日</el-radio>
          </el-radio-group>
        </div>
        <div v-if="monthTableRadio === 1" style="float: right; display: block;white-space: nowrap">
          <el-button icon="el-icon-download" size="mini" class="square-button" @click="exportPivotMonth"></el-button>
        </div>
      </el-row>
      <el-row style="margin-top:5px">
        <div v-if="monthTableRadio === 1">
          <vxe-grid ref="advertiserTableMonth" v-bind="advertiserTableMonthOptions"></vxe-grid>
        </div>
      </el-row>
      <el-row style="margin-top:5px">
        <div v-if="monthTableRadio === 2" class="grid-wrapper">
          <div
              class="grid-box"
              v-for="(gridOption, adv_nickname) in advertiserMonthDateGrids"
              :key="adv_nickname"
          >
            <vxe-grid v-bind="gridOption" />
          </div>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { formatFloat, formatInteger, formatRate } from "@/functions/global_formatter"
import { DateString, DateTimeString } from "@/functions/time_function"
import * as d3Chromatic from 'd3-scale-chromatic'
import axios from "@/api/axios"
export default {
  name: 'xhsAdvertiser',
  data() {
    const advertiserTableDayOptions = {
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

      }, //远程
      exportConfig: {},
      columns: [
        {field: "advertiser_nickname", title: '账户名称', fixed: 'left', showOverflow: true, width: 150, sortable: true},
        {field: "fee", title: "消耗", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "deal_order_gmv_7d", title: "GMV", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "deal_order_num_7d", title: "单量", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: "deal_order_roi_7d", title: "ROI", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "ctr", title: "点击率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: "cvr", title: "转化率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: "cpm", title: "CPM", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "CES", title: "CES", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: "action_button_ctr", title: "按钮点击率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'interaction_rate', title: "互动率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'like', title: "点赞", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'share', title: "转发", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'collect', title: "收藏", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'comment', title: "评论", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'pic_save', title: "保存图片", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'screenshot', title: "截图", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'follow', title: "关注", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
      ],
      data: [],
      footerData: [],
      footerRowStyle () {
        return {
          backgroundColor: '#F8F8F9FF',
          fontWeight: 'bold'
        }
      },
    }
    const advertiserTableYesterdayOptions = {
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

      }, //远程
      exportConfig: {},
      columns: [
        {field: "advertiser_nickname", title: '账户名称', fixed: 'left', showOverflow: true, width: 150, sortable: true},
        {field: "fee", title: "消耗", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "deal_order_gmv_7d", title: "GMV", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "deal_order_num_7d", title: "单量", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: "deal_order_roi_7d", title: "ROI", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "ctr", title: "点击率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: "cvr", title: "转化率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: "cpm", title: "CPM", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "CES", title: "CES", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: "action_button_ctr", title: "按钮点击率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'interaction_rate', title: "互动率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'like', title: "点赞", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'share', title: "转发", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'collect', title: "收藏", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'comment', title: "评论", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'pic_save', title: "保存图片", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'screenshot', title: "截图", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'follow', title: "关注", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},

      ],
      data: [],
      footerData: [],
      footerRowStyle () {
        return {
          backgroundColor: '#F8F8F9FF',
          fontWeight: 'bold'
        }
      },
    }
    // 聚合
    const advertiserTableMonthOptions = {
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

      },
      //远程
      exportConfig: {},
      columns: [
        {field: "advertiser_nickname", title: '账户名称', fixed: 'left', showOverflow: true, width: 150, sortable: true},
        {field: "fee", title: "消耗", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "deal_order_gmv_7d", title: "GMV", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "deal_order_num_7d", title: "单量", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: "deal_order_roi_7d", title: "ROI", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "ctr", title: "点击率", width: 100, showHeaderOverflow: true, sortable: true},
        {field: "cvr", title: "转化率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: "cpm", title: "CPM", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "CES", title: "CES", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: "action_button_ctr", title: "按钮点击率", width: 100, showHeaderOverflow: true, sortable: true},
        {field: 'interaction_rate', title: "互动率", width: 100, showHeaderOverflow: true, sortable: true},
        {field: 'like', title: "点赞", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'share', title: "转发", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'collect', title: "收藏", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'comment', title: "评论", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'pic_save', title: "保存图片", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'screenshot', title: "截图", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'follow', title: "关注", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
      ],
      data: [],
      footerData: [],
      footerRowStyle () {
        return {
          backgroundColor: '#F8F8F9FF',
          fontWeight: 'bold'
        }
      },
    }
    const advColorGroups = {
      "星裴": d3Chromatic.schemeBlues[5], // 5阶蓝色
      "火兴": d3Chromatic.schemeReds[5], // 5阶红色
      "炬美": d3Chromatic.schemeGreens[5] // 5阶绿色
    }
    return {
      advColorGroups,
      // 每日
      advertiserTableDayOptions,
      updateTimeDay: "",
      dayInfo: "",
      activeLabelDay: "单量",
      activeMetricDay: "deal_order_num_7d",
      activeIndexDay: '',
      statCardsDay: [
        {label: "消耗", metric: "fee", suffix: ""},
        {label: "单量", metric: "deal_order_num_7d", suffix: ""},
        {label: "GMV", metric: "deal_order_gmv_7d", suffix: ""},
        {label: "ROI", metric: "deal_order_roi_7d", suffix: ""},
        {label: "点击率", metric: "ctr", suffix: "%"},
        {label: "互动量", metric: "interaction", suffix: ""}
      ],
      advertiserDay: {},
      footerSumDay: {},
      formattedFooterSumDay: {},
      // 昨日
      advertiserTableYesterdayOptions,
      updateTimeYesterday: "",
      yesterdayInfo: "",
      activeLabelYesterday: "单量",
      activeMetricYesterday: "deal_order_num_7d",
      activeIndexYesterday: '',
      statCardsYesterday: [
        {label: "消耗", metric: "fee", suffix: ""},
        {label: "单量", metric: "deal_order_num_7d", suffix: ""},
        {label: "GMV", metric: "deal_order_gmv_7d", suffix: ""},
        {label: "ROI", metric: "deal_order_roi_7d", suffix: ""},
        {label: "点击率", metric: "ctr", suffix: "%"},
        {label: "互动量", metric: "interaction", suffix: ""}
      ],
      advertiserYesterday: {},
      footerSumYesterday: {},
      formattedFooterSumYesterday: {},
      // 本月
      advertiserTableMonthOptions,
      updateTimeMonth: "",
      monthStartInfo: "",
      monthEndInfo: "",
      selectDateMonth: [],
      activeLabelMonth: "单量",
      activeMetricMonth: "deal_order_num_7d",
      activeIndexMonth: '',
      statCardsMonth: [
        {label: "消耗", metric: "fee", suffix: ""},
        {label: "单量", metric: "deal_order_num_7d", suffix: ""},
        {label: "GMV", metric: "deal_order_gmv_7d", suffix: ""},
        {label: "ROI", metric: "deal_order_roi_7d", suffix: ""},
        {label: "点击率", metric: "ctr", suffix: "%"},
        {label: "互动量", metric: "interaction", suffix: ""}
      ],
      advertiserMonth: {},
      advertiserMonthTable: {},
      advertiserMonthMetric: {},
      advertiserMonthDateGrids: {},
      footerSumMonth: {},
      formattedFooterSumMonth: {},
      monthTableRadio: 1,
      // 账户月折线图配置
      monthChartOptions: {
        legend: {
          orient: 'horizontal',
          data: [],
          selected: {}
        },
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
        xAxis: {type: 'category', name: '日期', boundaryGap: false, data: []},
        yAxis: [
          {type: 'value', name: this.activeLabelMonth, splitLine: {show: false}}
        ],
        dataZoom: [],
        series: [],
        grid: {
          x: '5%',
          y: '10%',
          bottom: '15%'
        }
      }
    }
  },
  methods: {
    // 通用日期
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
    // 乘风每日数据
    getXhsWindAdvertiserDay() {
      const { today } = this.getCommonDate();
      this.dayInfo = today
      axios.get(`http://47.107.244.209:8967/xhs/advertiser_report/wind/api/get/?start_date=${today}&end_date=${today}`)
          .then(response => {
            if (response.data.code === 1) {
              this.advertiserDay = Object.values(response.data['advertiser_data'])
              this.footerSumDay = response.data['total_data']
            }
          })
      this.updateTimeDay = DateTimeString(new Date())
    },
    setAdvertiserTableDay() {
      this.advertiserTableDayOptions.data = this.advertiserDay
      Object.keys(this.footerSumDay).forEach(key => {
        if (typeof this.footerSumDay[key] === 'number') {
          if (key.search('rate') !== -1) {
            this.formattedFooterSumDay[key] = parseFloat((this.footerSumDay[key]*100).toFixed(2)) + "%"
          } else if (key.search('ctr') !== -1) {
            this.formattedFooterSumDay[key] = parseFloat((this.footerSumDay[key]*100).toFixed(2)) + "%"
          } else if (key.search('cnt') !== -1) {
            this.formattedFooterSumDay[key] = Math.round(this.footerSumDay[key])
          } else {
            this.formattedFooterSumDay[key] = parseFloat(this.footerSumDay[key].toFixed(2))
          }
        } else {
          this.formattedFooterSumDay[key] = this.footerSumDay[key]
        }
      })
      this.advertiserTableDayOptions.footerData = [this.formattedFooterSumDay]
    },
    handleMetricCardClickDay() {

    },
    exportPivotDay() {
      const $grid = this.$refs.advertiserTableDay
      let { today } = this.getCommonDate()
      today = today.replace(/-/g, '')
      if ($grid) {
        $grid.exportData({
          filename: "小红书乘风账户数据"+today,
          type: 'csv',
        })
      }
    },
    // 乘风昨日数据
    getXhsWindAdvertiserYesterday() {
      const { yesterday } = this.getCommonDate()
      this.yesterdayInfo = yesterday
      axios.get(`http://47.107.244.209:8967/xhs/advertiser_report/wind/api/get/?start_date=${yesterday}&end_date=${yesterday}`)
          .then(response => {
            if (response.data.code === 1) {
              this.advertiserYesterday = Object.values(response.data['advertiser_data'])
              this.footerSumYesterday = response.data['total_data']
            }
          })
      this.updateTimeYesterday = DateTimeString(new Date())
    },
    setAdvertiserTableYesterday() {
      this.advertiserTableYesterdayOptions.data = this.advertiserYesterday
      Object.keys(this.footerSumYesterday).forEach(key => {
        if (typeof this.footerSumYesterday[key] === 'number') {
          if (key.search('rate') !== -1) {
            this.formattedFooterSumYesterday[key] = parseFloat((this.footerSumYesterday[key]*100).toFixed(2)) + "%"
          } else if (key.search('ctr') !== -1) {
            this.formattedFooterSumYesterday[key] = parseFloat((this.footerSumYesterday[key]*100).toFixed(2)) + "%"
          } else if (key.search('cnt') !== -1) {
            this.formattedFooterSumYesterday[key] = Math.round(this.footerSumYesterday[key])
          } else {
            this.formattedFooterSumYesterday[key] = parseFloat(this.footerSumYesterday[key].toFixed(2))
          }
        } else {
          this.formattedFooterSumYesterday[key] = this.footerSumYesterday[key]
        }
      })
      this.advertiserTableYesterdayOptions.footerData = [this.formattedFooterSumYesterday]
    },
    exportPivotYesterday() {
      const $grid = this.$refs.advertiserTableYesterday
      let { yesterday } = this.getCommonDate()
      yesterday = yesterday.replace(/-/g, '')
      if ($grid) {
        $grid.exportData({
          filename: "小红书乘风账户数据"+yesterday,
          type: 'csv'
        })
      }
    },
    handleMetricCardClickYesterday() {

    },
    // 乘风每月数据
    getXhsWindAdvertiserMonth() {
      let end_date = this.getCommonDate()['today']
      let start_date = this.getCommonDate()['monthStart']
      this.monthStartInfo = start_date
      this.monthEndInfo = end_date
      if (this.selectDateMonth.length > 0) {
        start_date = DateString(new Date(this.selectDateMonth[0]))
        end_date = DateString(new Date(this.selectDateMonth[1].setHours(23, 59, 59, 59)))
      }
      axios.get(`http://47.107.244.209:8967/xhs/advertiser_report/wind/api/get/?start_date=${start_date}&end_date=${end_date}&dimension_list=date`)
          .then(response => {
            if (response.data.code === 1) {
              this.advertiserMonth = response.data
              this.advertiserMonthTable = Object.values(response.data['total_data']['advertiser_aggregate'])
              this.footerSumMonth = response.data['total_data']['total_aggregate']
              this.initAdvDateGrids(this.advertiserMonth.advertiser_data)
            }
          })
      this.updateTimeMonth = DateTimeString(new Date())
    },
    setAdvertiserTableMonth() {
      this.advertiserTableMonthOptions.data = this.advertiserMonthTable
      Object.keys(this.footerSumMonth).forEach(key => {
        if (typeof this.footerSumMonth[key] === 'number') {
          if (key.search('rate') !== -1) {
            this.formattedFooterSumMonth[key] = parseFloat((this.footerSumMonth[key]*100).toFixed(2)) + "%"
          } else if (key.search('ctr') !== -1) {
            this.formattedFooterSumMonth[key] = parseFloat((this.footerSumMonth[key]*100).toFixed(2)) + "%"
          } else if (key.search('cnt') !== -1) {
            this.formattedFooterSumMonth[key] = Math.round(this.footerSumMonth[key])
          } else {
            this.formattedFooterSumMonth[key] = parseFloat(this.footerSumMonth[key].toFixed(2))
          }
        } else {
          this.formattedFooterSumMonth[key] = this.footerSumMonth[key]
        }
      })
      this.advertiserTableMonthOptions.footerData = [this.formattedFooterSumMonth]
    },
    initAdvDateGrids(advertiserData) {
      this.advertiserMonthDateGrids = {}
      // 为每个账户构建gridOptions
      Object.keys(advertiserData).forEach(adv_nickname => {
        this.advertiserMonthDateGrids[adv_nickname] = {
          border: true,
          maxHeight: 1000,
          minHeight: 20,
          size: "mini",
          showOverflow: true,
          showFooter: true,
          rowConfig: {
            isHover: true,
            keyField: 'id',
          },
          columnConfig: {},
          sortConfig: {},
          exportData: {},
          columns: [
            {title: adv_nickname,
              children: [
                {field: "time", title: '日期', width: 100},
                {field: "fee", title: '消耗', width: 80},
                {field: "deal_order_gmv_7d", title: 'GMV', width: 80},
                {field: "deal_order_num_7d", title: "单量", width: 80},
                {field: "deal_order_roi_7d", title: 'ROI', width: 80},
              ]},
          ],
          data: [],
          footerData: [],
          footerRowStyle () {
            return {
              backgroundColor: '#F8F8F9FF',
              fontWeight: 'bold'
            }
          },
        }
      })
    },
    setAdvertiserTableMonthDate() {
      // 为每个账户构建gridOptions
      if (this.advertiserMonth.code === 1) {
        Object.entries(this.advertiserMonth['advertiser_data']).forEach(([adv_nickname, adv_dict]) => {
          this.advertiserMonthDateGrids[adv_nickname].data = Object.values(adv_dict)
          let advFooterSum = this.advertiserMonth['total_data']['advertiser_aggregate'][adv_nickname]
          advFooterSum['time'] = "合计"
          Object.keys(advFooterSum).forEach(key => {
            if (typeof advFooterSum[key] === 'number') {
              if (key.search('rate') !== -1) {
                advFooterSum[key] = parseFloat((advFooterSum[key]*100).toFixed(2)) + "%"
              } else if (key.search('ctr') !== -1) {
                advFooterSum[key] = parseFloat((advFooterSum[key]*100).toFixed(2)) + "%"
              } else if (key.search('cnt') !== -1) {
                advFooterSum[key] = Math.round(advFooterSum[key])
              } else {
                advFooterSum[key] = parseFloat(advFooterSum[key].toFixed(2))
              }
            }
          })
          this.advertiserMonthDateGrids[adv_nickname].footerData = [advFooterSum]

        })
      } else {
        this.advertiserMonthDateGrids = []
      }
    },
    setAdvertiserChartMonth() {
      let advertiserData = this.advertiserMonth['advertiser_data']
      let totalData = this.advertiserMonth['total_data']['date_aggregate']
      let seriesLength = Object.keys(totalData).length
      this.monthChartOptions.title = {text: ''}
      this.monthChartOptions.xAxis = {
        type: 'category',
        name: '日期',
        boundaryGap: false,
        data: Object.keys(totalData),
        axisLabel: {
          // 转换x轴时间格式
          formatter: function (value) {
            const parts = value.split("-")
            return `${parts[1]}-${parts[2]}`
          }
        }
      }
      this.monthChartOptions.dataZoom = [
        {
          startValue: Math.max(seriesLength-6, 0),
          endValue: seriesLength
        },
      ]
      this.monthChartOptions.yAxis[0]['name'] = this.activeLabelMonth
      // tooltip添加单位
      if (this.activeMetricMonth.includes('ctr')) {
        this.monthChartOptions.tooltip.valueFormatter = function (value) {
          return parseFloat((value*100).toFixed(2)) + '%'
        }
      } else if (this.activeMetricMonth.includes('rate')) {
        this.monthChartOptions.tooltip.valueFormatter = function (value) {
          return parseFloat((value*100).toFixed(2)) + '%'
        }
      } else {
        this.monthChartOptions.tooltip.valueFormatter = function (value) {
          return parseFloat(value.toFixed(2))
        }
      }
      // 添加曲线
      const tempSeriesList = []
      // 各个账户
      Object.entries(advertiserData).forEach(([key, value]) => {
        this.monthChartOptions.legend.data.push(key)
        this.monthChartOptions.legend.selected[key] = true
        let metricSeries = Object.values(value).map(d => d[this.activeMetricMonth])
        tempSeriesList.push({
          type: 'line',
          smooth: true,
          showSymbol: false,
          label: {
            show: true,
            position: 'top',
          },
          name: key,
          data: metricSeries,
          emphasis: {
            focus: 'series'
          }
        })
      })
      // 汇总
      this.monthChartOptions.legend.data.push('全部')
      this.monthChartOptions.legend.selected['全部'] = true
      let dateTotalSeries = Object.values(totalData).map(d => d[this.activeMetricMonth])
      tempSeriesList.push({
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbol: 'emptyDiamond',
        symbolSize: 10,
        itemStyle: {
          color: "#FFB6C1",
        },
        label: {
          show: true,
          position: 'top',
          formatter: function (params) {
            const value = params.value
            if (
                this.activeMetricMonth.includes('ctr') ||
                this.activeMetricMonth.includes('rate')
            ) {
              return (parseFloat(value) * 100).toFixed(2) + '%'
            } else {
              return parseFloat(value.toFixed(2))
            }
          }.bind(this)
        },
        name: '全部',
        data: dateTotalSeries,
        lineStyle: {
          type: 'dashed',
          color: "#FFB6C1",
          width: 3
        },
        emphasis: {
          focus: 'series'
        }
      })
      this.monthChartOptions.series = tempSeriesList
    },
    exportPivotMonth() {
      const $grid = this.$refs.advertiserTableMonth
      const today = new Date()
      const yesterday = DateString(new Date(today.getTime() - 24 * 60 * 60 * 1000)).replace(/-/g, '')
      if ($grid) {
        $grid.exportData({
          filename: "小红书乘风账户数据"+yesterday,
          type: 'csv'
        })
      }
    },
    handleMetricCardClickMonth(metric) {
      this.activeIndexMonth = this.activeIndexMonth === metric ? -1 : metric
      const activeObjectMonth = this.statCardsMonth.find(item => item.metric === metric)
      this.activeMetricMonth = metric
      this.activeLabelMonth = activeObjectMonth ? activeObjectMonth.label : metric
    },
    reloadData() {
      this.getXhsWindAdvertiserDay();
      this.getXhsWindAdvertiserYesterday();
      this.getXhsWindAdvertiserMonth();
    }
  },
  mounted() {
    this.reloadData();
    this.autoUpdateTimer = setInterval(() => {
      this.getXhsWindAdvertiserDay();
      this.getXhsWindAdvertiserMonth();
    }, 60000);
  },
  beforeDestroy() {
    // 清除定时器避免内存泄露
    if (this.autoUpdateTimer) clearInterval(this.autoUpdateTimer);
  },
  watch: {
    advertiserDay: function() {
      this.setAdvertiserTableDay();
    },
    advertiserYesterday: function() {
      this.setAdvertiserTableYesterday()
    },
    advertiserMonth: function() {
      this.setAdvertiserTableMonth()
      this.setAdvertiserChartMonth()
      this.setAdvertiserTableMonthDate()
    },
    activeMetricMonth: function() {
      this.setAdvertiserChartMonth()
    },
    $route(to) {
      console.log(to.path)
      if (to.path === '/xhs/dashboard/advertiser') {
        this.reloadData()
      }
    }
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

.content-time {
  float: left;
  display: block;
  white-space: nowrap;
  font-size: 12px;
  color: #8a96a6;
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
.monthChartContainer {
  width: 95%;
  height: 400px;
}
.grid-wrapper {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 10px;
}
.grid-box {
  min-width: 300px;
  flex: 0 0 auto;
}

</style>