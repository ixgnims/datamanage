<template>
  <div>
    <div>
      <el-row :gutter="3">
        <!--统计卡片-->
        <div style="width: 100%;padding: 1px"><XiaomingStatistics :sendAuto="sendAuto"/></div>
        <!--表格-->
        <div style="width: 100%;padding: 1px">
          <el-card shadow="hover" style="width:100%">
            <el-collapse v-model="activeNames" class="tablePanel">
              <el-collapse-item title="抖音" name="1" style="font-size: 14px;">
                <XiaomingDyTable />
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import XiaomingDyTable from './XiaomingDyTable.vue'
import XiaomingStatistics from "./XiaomingStatistics.vue";
export default {
  data() {
    return {
      activeNames: ['1'],
    };
  },
  components: {
    XiaomingDyTable,
    XiaomingStatistics,
  },
  name: 'XiaoMing',
  methods: {

  }
}
</script>

<style scoped>
.tablePanel {
  padding: 0;
  border: 0;
  margin: 0;
}
</style>