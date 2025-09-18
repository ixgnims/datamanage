<template>
  <el-row>
    <el-card>
      <el-row style="text-align: left; font-size: 14px">小铭</el-row>
      <el-row>
        <XiaomingDyMktChart />
      </el-row>
      <el-row>
        <XiaomingDyMktTable />
      </el-row>
    </el-card>
  </el-row>
</template>

<script>
export default {
  name: 'XiaoMingAll',
  components: {
    XiaomingDyMktChart: () => import("./XiaomingDyMktChart.vue"),
    XiaomingDyMktTable: ()=>import("./XiaomingDyMktTable.vue")
  }
}
</script>