<template>
  <div>
    <el-card shadow="hover" style="margin-top: 5px">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="单量ROI" name="Order">
          <Aliu99_orderChart2 :activeTab="activeTab" :selectLive="selectLive"
                              :last_order_cnt="last_order_cnt" :roiInput="roiInput"
                              :order_goal="order_goal"/>
        </el-tab-pane>
        <el-tab-pane label="投流视频" name="Video">
          <Aliu99_materialChart2 :activeTab="activeTab" :tag_type="tag_type"
                                 :liveStart="liveStart" :liveEnd="liveEnd"
                                 :advertiserIdList="advertiserIdList" :advertiserList="advertiserList"/>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Aliu99_orderChart2 from "@/views/dashboard/Aliu99/Aliu99_orderChart2.vue";
import Aliu99_materialChart2 from "@/views/dashboard/Aliu99/Aliu99_materialChart2.vue";

export default {
  name: "Aliu99_chartTab",
  components: {
    Aliu99_materialChart2,
    Aliu99_orderChart2,
  },
  props: {
    tag_type: {
      type: String,
      required: true
    },
    liveStart: {
      type: String,
      required: true
    },
    liveEnd: {
      type: String,
      required: false
    },
    advertiserIdList: {
      type: Array,
      required: true
    },
    advertiserList: {
      type: Array,
      required: true
    },
    order_goal: {
      type: Number,
      required: false
    },
    last_order_cnt: {
      type: Number,
      required: false
    },
    roiInput: {
      type: Number,
      required: false
    },
  },
  data() {
    return {
      activeTab: "Order",
      selectLive: "最新直播",
      // 素材Tab
      selectMetric: "total_cost",
      filterDimension: "material_id",
      recordLimit: 5,
    }
  },
  methods: {
    handleTabClick() {
      // 提交参数，刷新数据
      if (this.activeTab.includes('Order')) {
        this.getLiveTrend(this.roomID)
      } else if (this.activeTab.includes('Video')) {
        this.getMaterialTrend(this.liveStart, this.liveEnd, this.advertiserList)
      }
    },
    // 素材tab
    selectMetricChange(metric) {
      this.selectMetric = metric
      // 向父组件传参

    },
    filterDimensionChange(dimension) {
      this.filterDimension = dimension

    },
    sortMetricChange(metric) {
      this.sortMetric = metric
    },
    recordLimitChange(num) {
      this.recordLimit = num
    },
    searchTypeChange() {

    },
    queryItemChange() {

    },
  },
}
</script>

<style>

</style>