<template>
  <el-row>
    <el-card>
      <el-row style="text-align: left; font-size: 14px">REME</el-row>
      <el-row>
        <RemeDyMktChart />
      </el-row>
      <el-row>
        <RemeDyMktTable />
      </el-row>
    </el-card>
  </el-row>
</template>

<script>
export default {
  name: 'REMEAll',
  components: {
    RemeDyMktChart: () => import("./RemeDyMktChart.vue"),
    RemeDyMktTable: ()=>import("./RemeDyMktTable.vue")
  }
}
</script>