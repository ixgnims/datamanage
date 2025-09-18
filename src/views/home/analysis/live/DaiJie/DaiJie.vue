<template>
  <div>
    <el-row>
      <el-card class="dataBox" shadow="never">
        <!--筛选开播日期-->
        <div slot="header" class="header">
          <el-row>
            <el-col :span="4" style="text-align: left; font-size: 15px; font-weight: bold">直播分析</el-col>
            <el-col :span="20" style="text-align: right">
              <div class="date-picker">
                <span class="demonstration">开播日期：</span>
                <el-date-picker
                    v-model="live_date"
                    type="date"
                    size = "mini"
                    :picker-options="pickerOptions"
                    placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-col>
          </el-row>
        </div>
        <!--直播间信息-->
      </el-card>
    </el-row>
    <!--直播数据看板-->
    <DaijieLiveDash :parentLiveDate = "live_date" class="dataBox"/>
    <DaijieDyMktDetail :parentLiveDate="live_date" class="dataBox"/>
  </div>
</template>

<script>
import DaijieLiveDash from "./DaijieLiveDash.vue"
import DaijieDyMktDetail from "./DaijieDyMktDetail.vue"
export default {
  name: "DaiJieLiveAnalysis",
  data() {
    return {
      pickerOptions: {
        disabledDate(date) {
          return date.getTime() > Date.now() - 8.64e6 || date.getTime() < new Date(2024, 0, 1);
        }
      },
      live_date: new Date().toLocaleDateString('zh-CN',{year: 'numeric', month: '2-digit', day: '2-digit'}).replaceAll('/', "-"),
    }
  },
  components: {
    DaijieLiveDash,
    DaijieDyMktDetail,
  },
  methods: {

  },
  mounted() {

  },
}
</script>

<style scoped>
.header {
  height: 20px;
}
.date-picker {
  font-size: 13px;
}
.dataBox {
  margin-bottom: 10px;
}
</style>