<template>
  <el-row>
    <el-card>
      <el-row style="text-align: left; font-size: 14px">戴洁</el-row>
      <el-row>
        <DaijieDyMktChart />
      </el-row>
      <el-row>
        <DaijieDyMktTable />
      </el-row>
    </el-card>
  </el-row>
</template>

<script>
export default {
  name: 'DaijieAll',
  components: {
    DaijieDyMktChart: ()=>import("./DaijieDyMktChart.vue"),
    DaijieDyMktTable: ()=>import("./DaijieDyMktTable.vue")
  }
}
</script>