<template>
  <el-form ref="metric_form" :model="metric_form">
    <div class="section-title">汇总数据</div>
    <el-form-item>
      <el-checkbox-group v-model="metric_form.checkedBasicMetricIds" class="checkbox-group" @change="handleMetricChange">
        <el-checkbox v-for="metric in basicMetricOptions" :label="metric.id" :key="metric.id">{{metric.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <div class="section-title">标准推广数据</div>
    <el-form-item>
      <el-checkbox-group v-model="metric_form.checkedStandardMetricIds" class="checkbox-group" @change="handleMetricChange">
        <el-checkbox v-for="metric in standardMetricOptions" :label="metric.id" :key="metric.id">{{metric.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <div class="section-title">全域推广数据</div>
    <el-form-item>
      <el-checkbox-group v-model="metric_form.checkedUniMetricIds" class="checkbox-group" @change="handleMetricChange">
        <el-checkbox v-for="metric in uniMetricOptions" :label="metric.id" :key="metric.id">{{metric.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "qc_metric_select_panel",
  props: {

  },
  data() {
    const basicMetricOptions = [
      {id: 'total_show_cnt', label: '展示数'},
      {id: 'total_click_cnt', label: '点击数'},
      {id: 'total_click_rate', label: '点击率'},
      {id: 'total_convert_cnt', label: '转化数'},
      {id: 'total_direct_convert_cnt', label: '直接转化数'},
      {id: 'total_cost', label: '消耗'},
      {id: 'total_gmv', label: 'GMV'},
      {id: 'total_ROI', label: 'ROI'},
      {id: 'total_convert_cost', label: '转化成本'},
      {id: 'total_cpc', label: '点击单价'},
      {id: 'total_cpm', label: '平均千次展示费用'},
      {id: 'total_click_convert_rate', label: '点击转化率'},
      {id: 'total_show_convert_rate', label: '展示转化率'},
      {id: 'total_play_cnt', label: '播放数'},
      {id: 'total_play_over_cnt', label: '完播数'},
      {id: 'total_play_over_rate', label: '完播率'},
      {id: 'total_follow_rate', label: '关注率'},
      {id: 'total_estimated_profit', label: '预估利润'},
      {id: 'video_level', label: '视频级别'}
    ]
    const standardMetricOptions = [
      {id: 'standard_show_cnt', label: '展示数(标准推广)'},
      {id: 'standard_click_cnt', label: '点击数(标准推广)'},
      {id: 'standard_convert_cnt', label: '转化数(标准推广)'},
      {id: 'standard_direct_convert_cnt', label: '直接转化数(标准推广)'},
      {id: 'standard_indirect_convert_cnt', label: '间接转化数(标准推广)'},
      {id: 'standard_cost', label: '消耗(标准推广)'},
      {id: 'standard_gmv', label: 'GMV(标准推广)'},
      {id: 'standard_ROI', label: 'ROI(标准推广)'},
      {id: 'standard_click_product_cnt', label: '商品点击数(标准推广)'},
      {id: 'standard_click_product_rate', label: '商品点击率(标准推广)'},
      {id: 'standard_click_slidecart_cnt', label: '购物车点击数(标准推广)'},
      {id: 'standard_click_slidecart_rate', label: '购物车点击率(标准推广)'},
      {id: 'standard_slidecart_click_convert_rate', label: '购物车点击转化率(标准推广)'},
      {id: 'standard_live_enter_cnt', label: '直播间观看数(标准推广)'},
      {id: 'standard_live_enter_rate', label: '直播间进入率(标准推广)'},
      {id: 'standard_play_cnt', label: '播放数(标准推广)'},
      {id: 'standard_play_3s_cnt', label: '3s播放数(标准推广)'},
      {id: 'standard_play_3s_rate', label: '3s播放率(标准推广)'},
      {id: 'standard_play_50_cnt', label: '50%播放数(标准推广)'},
      {id: 'standard_play_50_rate', label: '50%播放率(标准推广)'},
      {id: 'standard_play_over_cnt', label: '完播数(标准推广)'},
      {id: 'standard_play_over_rate', label: '完播率(标准推广)'},
      {id: 'standard_report_cnt', label: '举报数(标准推广)'},
      {id: 'standard_report_rate', label: '举报率‱(标准推广)'},
      {id: 'standard_dislike_cnt', label: '不感兴趣数(标准推广)'},
      {id: 'standard_dislike_rate', label: '不感兴趣率‰(标准推广)'},
    ]
    const uniMetricOptions = [
      {id: 'uni_show_cnt', label: '展示数(全域推广)'},
      {id: 'uni_click_cnt', label: '点击数(全域推广)'},
      {id: 'uni_convert_cnt', label: '转化数(全域推广)'},
      {id: 'uni_direct_convert_cnt', label: '直接转化数(全域推广)'},
      {id: 'uni_cost', label: '消耗(全域推广)'},
      {id: 'uni_gmv', label: 'GMV(全域推广)'},
      {id: 'uni_ROI', label: 'ROI(全域推广)'},
      {id: 'uni_play_cnt', label: '播放数(全域推广)'},
      {id: 'uni_play_over_cnt', label: '完播数(全域推广)'},
    ]
    return {
      metric_form: {
        checkedBasicMetricIds: ['total_show_cnt', 'total_click_cnt', 'total_convert_cnt', 'total_cost', 'total_click_rate',
          'total_click_convert_rate', 'total_show_convert_rate', 'total_ROI', 'total_cpc', 'total_convert_cost',
          'total_cpm', 'total_estimated_profit', 'total_play_over_rate', 'total_follow_rate', 'video_level'],
        checkedStandardMetricIds: ['standard_live_enter_rate', 'standard_click_slidecart_rate', 'standard_click_product_rate',
          'standard_slidecart_click_convert_rate', 'standard_play_3s_rate', 'standard_play_50_rate'],
        checkedUniMetricIds: []
      },
      // 向父组件传参 qc_video_table
      metric_list_whole: [
        {id: 'total_show_cnt', label: '展示数'},
        {id: 'total_click_cnt', label: '点击数'},
        {id: 'total_convert_cnt', label: '转化数'},
        {id: 'total_cost', label: '消耗'},
        {id: 'total_click_rate', label: '点击率'},
        {id: 'total_click_convert_rate', label: '点击转化率'},
        {id: 'total_show_convert_rate', label: '展示转化率'},
        {id: 'total_ROI', label: 'ROI'},
        {id: 'total_cpc', label: '平均点击单价'},
        {id: 'total_convert_cost', label: '转化成本'},
        {id: 'total_cpm', label: '平均千次展示费用'},
        {id: 'total_estimated_profit', label: '预估利润'},
        {id: 'total_play_over_rate', label: '完播率'},
        {id: 'total_follow_rate', label: '直播间关注率'},
        {id: 'video_level', label: '视频级别'},
        {id: 'standard_live_enter_rate', label: '直播间进入率(标准推广)'},
        {id: 'standard_click_slidecart_rate', label: '购物车点击率(标准推广)'},
        {id: 'standard_click_product_rate', label: '商品点击率(标准推广)'},
        {id: 'standard_slidecart_click_convert_rate', label: '查看购物车转化率(标准推广)'},
        {id: 'standard_play_3s_rate', label: '3s播放率(标准推广)'},
        {id: 'standard_play_50_rate', label: '50%播放率(标准推广)'},
      ],
      basicMetricOptions,
      standardMetricOptions,
      uniMetricOptions,
      // 用于储存id到对象的映射
      basicMetricMap: null,
      standardMetricMap: null,
      uniMetricMap: null,
    }
  },
  created() {
    // 初始化metricMap
    this.basicMetricMap = new Map(this.basicMetricOptions.map(d => [d.id, d]))
    this.standardMetricMap = new Map(this.standardMetricOptions.map(d => [d.id, d]))
    this.uniMetricMap = new Map(this.uniMetricOptions.map(d => [d.id, d]))
  },
  methods: {
    sortAndMapCheckedMetrics(ids, metricMap, metricOptions) {
      return ids
          .map(id => metricMap.get(id))
          .filter(Boolean)
          .sort((a, b) => {
            const indexA = metricOptions.findIndex(d => d.id === a.id)
            const indexB = metricOptions.findIndex(d => d.id === b.id)
            return indexA - indexB
          })
    },
    processMetrics(checkedIdsKey, metricMapKey, metricOptionsKey) {
      const sortedMetrics = this.sortAndMapCheckedMetrics(
          this.metric_form[checkedIdsKey],
          this[metricMapKey],
          this[metricOptionsKey]
      );
      this.metric_form[checkedIdsKey] = sortedMetrics.map(d => d.id);
      return sortedMetrics;
    },
    handleMetricChange(){
      // 处理三种指标类型
      const checkedBasicMetrics = this.processMetrics('checkedBasicMetricIds', 'basicMetricMap', 'basicMetricOptions')
      const checkedStandardMetrics = this.processMetrics('checkedStandardMetricIds', 'standardMetricMap', 'standardMetricOptions')
      const checkedUniMetrics = this.processMetrics('checkedUniMetricIds', 'uniMetricMap', 'uniMetricOptions')
      const new_metric_list_whole = [...checkedBasicMetrics, ...checkedStandardMetrics, ...checkedUniMetrics]
      if (new_metric_list_whole.length > 0) {
        this.metric_list_whole = new_metric_list_whole
      }
      // 向父组件传参 qc_video_table
      this.$emit('change-metrics', this.metric_list_whole)
    },
  }
}

</script>

<style scoped>
.section-title {
  font-weight: bold;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
}

.checkbox-group .el-checkbox {
  margin-right: 10px;
  margin-bottom: 0;
}
</style>