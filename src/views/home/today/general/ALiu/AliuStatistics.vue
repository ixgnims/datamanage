<template>
  <div>
    <el-row :gutter="4">
      <el-card shadow="hover" class="dataBox">
        <!--直播间信息-->
        <div slot="header" class="header">
          <el-row>
            <el-col :span="3" style="text-align: left">{{live_date}}</el-col>
            <el-col :span="15" style="text-align: left">{{room_title}}</el-col>
            <el-col :span="6" style="text-align: right">{{room_status}}</el-col>
          </el-row>
        </div>
        <div class="content">
          <!--第一行-->
          <el-row class="dataRow">
            <el-col :span="6">
              <el-statistic :precision="2" :value="value1" :title="title1">
              </el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic :precision="2" :value="value2" :title="title2">
              </el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic :precision="2" :value="value3" :title="title3">
              </el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic :precision="0" :value="value4" :title="title4">
              </el-statistic>
            </el-col>
          </el-row>
          <!--第二行-->
          <el-row>
            <el-col :span="6">
              <el-statistic :precision="0" :value="value5" :title="title5">
              </el-statistic>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  name: "AliuStatistics",
  data() {
    return {
      value1: 0,
      value2: 0,
      value3: 0,
      value4: 0,
      value5: 0,
      title1: "投流消耗累计",
      title2: "投流成交累计",
      title3: "直播间成交累计",
      title4: "直播间成交单数",
      title5: "累计观看人次",
      live_date: '',
      room_title: '暂无直播',
      room_status: 'waiting',
      pollingInterval_Live: null,
      pollingInterval_Mkt: null,
    };
  },
  methods: {
    default_date() {
      var today = new Date();
      var formated_today = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
      this.live_date = formated_today;
    },
    getTodayLive() {
      axios.get(`/live/today/aliu`)
          .then((response) => {
            console.log(response)
            if (response.data.length > 0) {
              this.room_title = response.data[0].room_title;
              this.live_date = response.data[0].live_date;
              this.room_status = response.data[0].room_status;
              this.value4 = response.data[0].live_pay_order_count_alias;
              this.value5 = response.data[0].total_live_watch_cnt;
              let sumLiveGMV = 0
              for (let i = 0; i < response.data.length; i++) {
                sumLiveGMV = sumLiveGMV + response.data[i].live_pay_order_gmv_alias;
              }
              this.value3 = sumLiveGMV
            }
          })
    },
    getTodayMkt() {
      axios.get(`/marketing/today/aliu`)
          .then((response) => {
            console.log(response)
            if (response.data.length > 0) {
              let sumMktCost = 0;
              let sumMktGMV = 0;
              for (let i = 0; i < response.data.length; i++) {
                sumMktCost = sumMktCost + response.data[i].stat_cost;
                sumMktGMV = sumMktGMV + response.data[i].pay_order_amount + response.data[i].indirect_order_pay_gmv_7days;
              }
              this.value1 = sumMktCost
              this.value2 = sumMktGMV
            }
          })
    },
  },
  watch: {
    room_status: function(newValue) {
      if (newValue === 'LIVING') {
        this.pollingInterval_Live = setInterval(this.getTodayLive,5000);
        this.pollingInterval_Mkt = setInterval(this.getTodayMkt,5000);
        this.getTodayLive()
        this.getTodayMkt()
      } else {
        clearInterval(this.pollingInterval_Live);
        clearInterval(this.pollingInterval_Mkt);
        this.pollingInterval_Live = null;
        this.pollingInterval_Mkt = null;
      }
    }
  },
  created() {
    this.default_date()
    this.getTodayLive()
    this.getTodayMkt()
  }
}
</script>

<style>
.header {
  font-size: 13px;
  color: #333333;
}

.dataBox {
  border-radius: 8px;
}

.dataRow {
  margin-bottom: 15px;
}
</style>