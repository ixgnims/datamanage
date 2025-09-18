<template>
  <div>
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="title">
          <span>阿留教育规划</span>
        </div>
        <AliuChart />
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="title">
          <span>戴洁家庭教育</span>
        </div>
        <DaijieChart />
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="title">
          <span>奕霏说家教</span>
        </div>
        <YifeiChart />
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="title">
          <span>哈佛小铭精英艺术教育</span>
        </div>
        <XiaomingChart />
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="title">
          <span>前雅思考官Reme</span>
        </div>
        <RemeChart />
      </el-card>
    </el-row>
  </div>
</template>

<script>
import AliuChart from './ALiu/AliuChart.vue'
import DaijieChart from './DaiJie/DaijieChart.vue'
import YifeiChart from './YiFei/YifeiChart.vue'
import XiaomingChart from './XiaoMing/XiaomingChart.vue'
import RemeChart from './REME/RemeChart.vue'
export default {
  name: 'homeMain',
  data() {
    return {

    };
  },
  components: {
    AliuChart,
    DaijieChart,
    YifeiChart,
    XiaomingChart,
    RemeChart
  }
}
</script>

<style scoped>
.title {
  text-align: left;
  font-size: 13px;
}
.box-card {
  margin-bottom: 10px;
}
</style>