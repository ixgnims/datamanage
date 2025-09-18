<template>
  <el-row>
    <el-card>
      <el-row style="text-align: left; font-size: 14px">奕霏</el-row>
      <el-row>
        <YifeiDyMktChart />
      </el-row>
      <el-row>
        <YifeiDyMktTable />
      </el-row>
    </el-card>
  </el-row>
</template>

<script>
export default {
  name: 'YifeiAll',
  components: {
    YifeiDyMktChart: ()=>import("./YifeiDyMktChart.vue"),
    YifeiDyMktTable: ()=>import("./YifeiDyMktTable.vue")
  }
}
</script>