<template>
  <el-row>
    <el-card>
      <el-row style="text-align: left; font-size: 14px">楠姐</el-row>
      <el-row>
        <NanjieDyMktChart />
      </el-row>
      <el-row>
        <NanjieDyMktTable />
      </el-row>
    </el-card>
  </el-row>
</template>

<script>
export default {
  name: 'NanjieAll',
  components: {
    NanjieDyMktChart: ()=>import("./NanjieDyMktChart.vue"),
    NanjieDyMktTable: ()=>import("@/views/home/today/general/ALL/NanJie/NanjieDyMktTable.vue")
  }
}
</script>