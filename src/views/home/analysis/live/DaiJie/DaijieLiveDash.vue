<template>
  <div>
    <el-row>
      <el-card shadow="never">
        <el-row class="title">直播数据</el-row>
        <el-row :gutter="10">
          <!--整体数据-->
          <el-col :span="12">
            <el-card shadow = "never">
              <el-row class="sub-title">整体数据</el-row>
              <el-row class="dataRow">
                <el-col :span="8">
                  <el-statistic :precision="2" :value="live_pay_order_gmv_alias" :title="title1">
                  </el-statistic>
                </el-col>
                <el-col :span="8">
                  <el-statistic :precision="0" :value="live_pay_order_count_alias" :title="title2">
                  </el-statistic>
                </el-col>
                <el-col :span="8">
                  <el-statistic :precision="2" :value="live_roi" :title="title3">
                  </el-statistic>
                </el-col>
              </el-row>
              <el-row class="dataRow">
                <el-col :span="8">
                  <el-statistic :precision="2" :value="total_live_pay_order_gpm" :title="title4">
                  </el-statistic>
                </el-col>
                <el-col :span="8">
                  <el-statistic :precision="0" :value="total_live_watch_cnt" :title="title5">
                  </el-statistic>
                </el-col>
                <el-col :span="8">
                  <el-statistic :precision="0" :value="total_live_follow_cnt" :title="title6">
                  </el-statistic>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <!--广告数据-->
          <el-col :span="12">
            <el-card shadow="never">
              <el-row class="sub-title">广告数据</el-row>
              <el-row class="dataRow">
                <el-col :span="8">
                  <el-statistic :precision="2" :value="stat_cost" :title="title7">
                  </el-statistic>
                </el-col>
                <el-col :span="8">
                  <el-statistic :precision="2" :value="ad_gmv" :title="title8">
                  </el-statistic>
                </el-col>
                <el-col :span="8">
                  <el-statistic :precision="2" :value="ad_roi" :title="title9">
                  </el-statistic>
                </el-col>
              </el-row>
              <el-row class="dataRow">
                <el-col :span="8">
                  <el-statistic :precision="2" :value="cost_per_click" :title="title10">
                  </el-statistic>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  name: "DaiJieLiveDash",
  props: {
    parentLiveDate: String
  },
  data() {
    return {
      title1: "累计成交金额",
      live_pay_order_gmv_alias: 0,
      title2: "整体成单数",
      live_pay_order_count_alias: 0,
      title3: "整体ROI",
      live_roi: 0,
      title4: "整体GPM",
      total_live_pay_order_gpm: 0,
      title5: "累计观看人次",
      total_live_watch_cnt: 0,
      title6: "新增粉丝数",
      total_live_follow_cnt: 0,
      title7: "消耗",
      stat_cost: 0,
      title8: "广告成交金额",
      ad_gmv: 0,
      title9: "广告ROI",
      ad_roi: 0,
      title10: "广告点击单价",
      cost_per_click: 0,
    }
  },
  methods: {
    getLive() {
      var date = this.parentLiveDate.toLocaleDateString('zh-CN',{year: 'numeric', month: '2-digit', day: '2-digit'}).replaceAll('/','-');
      axios.post(`/live/date/daijie`, {selectDate: date})
          .then(response => {
            console.log(response)
            if (response.data.length > 0) {
              this.live_pay_order_gmv_alias = response.data[0].live_pay_order_gmv_alias
              this.live_pay_order_count_alias = response.data[0].live_pay_order_count_alias
              this.total_live_pay_order_gpm = response.data[0].total_live_pay_order_gpm
              this.total_live_watch_cnt = response.data[0].total_live_watch_cnt
              this.total_live_follow_cnt = response.data[0].total_live_follow_cnt
              if (this.stat_cost > 0) {
                this.live_roi = this.live_pay_order_gmv_alias/this.stat_cost
              }
            }
          })
    },
    getMkt() {
      var date = this.parentLiveDate.toLocaleDateString('zh-CN',{year: 'numeric', month: '2-digit', day: '2-digit'}).replaceAll('/','-');
      axios.post(`/marketing/date/daijie`, {selectDate: date})
          .then(response => {
            console.log(response)
            if (response.data.length > 0) {
              this.stat_cost = response.data.map(item => item.stat_cost).reduce((a, b) => a + b, 0);
              var direct_pay = response.data.map(item => item.
                  pay_order_amount).reduce((a, b) => a + b, 0);
              var indirect_pay = response.data.map(item => item
                  .indirect_order_pay_gmv_7days).reduce((a, b) => a + b, 0);
              this.ad_gmv = direct_pay + indirect_pay;
              if (this.stat_cost > 0) {
                this.ad_roi = this.ad_gmv / this.stat_cost;
              }
              var click_sum = response.data.map(item => item
                  .click_cnt).reduce((a, b) => a + b, 0);
              if (click_sum > 0) {
                this.cost_per_click = this.stat_cost/click_sum;
              }
            }
          })
    }
  },
  mounted() {
    this.getMkt()
    this.getLive()
  },
  watch: {
    parentLiveDate: function(newValue) {
      this.getMkt()
      this.getLive()
      console.log(newValue)
    }
  }
}
</script>

<style scoped>
.title {
  text-align: left;
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 12px;
}
.sub-title {
  text-align: left;
  font-size: 13px;
  margin-bottom: 12px;
}

.dataRow {
  margin-bottom: 12px;
}
</style>