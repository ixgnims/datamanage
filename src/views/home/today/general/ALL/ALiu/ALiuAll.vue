<template>
  <el-row>
    <el-card>
      <el-row style="text-align: left; font-size: 14px">阿留</el-row>
      <el-row>
        <AliuDyMktChart />
      </el-row>
      <el-row>
        <AliuDyMktTable />
      </el-row>
    </el-card>
  </el-row>
</template>

<script>
export default {
  name: 'ALiuAll',
  components: {
    AliuDyMktChart: () => import("./AliuDyMktChart.vue"),
    AliuDyMktTable: () => import("./AliuDyMktTableTest.vue")
  }
}
</script>