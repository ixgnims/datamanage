<template>
  <div>
    <!--日期选择器-->
    <el-row style="text-align: right">
      <el-date-picker
          v-model="datePair"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          align="right"
          @change="getVideoData">
      </el-date-picker>
      <el-button @click="exportDataEvent" size="mini">导出csv</el-button>
    </el-row>

    <!--报表-->
    <el-row>
      <vxe-table
          show-footer
          border
          round
          resizable
          :data="tableData"
          :align="center"
          :footer-data="footerData"
          :edit-config="{trigger: 'dblclick', mode: 'cell'}"
          :row-config="{isHover: true}"
          :sort-config="{trigger: 'cell', defaultSort: {field: 'stat_cost', order: 'desc'}, orders: ['desc', 'asc', null]}"
          show-header-overflow
          show-overflow
          ref="xTable"
          class="videoTable">
        <!--素材基本信息-->
        <vxe-column
            field="material_id"
            title="素材id">
        </vxe-column>
        <vxe-column
            field="link"
            title="素材名"
            type="html">
        </vxe-column>
        <vxe-column
            field="create_time"
            title="创建时间">
        </vxe-column>
        <vxe-column
            field="video_url"
            title = "视频链接">
        </vxe-column>
        <!--数据-->
        <vxe-column
            field="show_cnt"
            title="展示数"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="click_cnt"
            title="点击数"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="convert_cnt"
            title="转化数"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="stat_cost"
            title="消耗"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="ctr"
            title="点击率"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="convert_rate"
            title="转化率"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="ecp_cpc_platform"
            title="点击成本"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="ecp_cpa_platform"
            title="转化成本"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
      </vxe-table>
    </el-row>
  </div>
</template>

<script>
import axios from "@/api/axios";
export default {
  data () {
    return {
      tableData: [],
      footerData: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      datePair: ''
    }
  },
  methods: {
    // 默认近三个月数据
    getThreeMonthsStartEnd() {
      var now = new Date()
      var threeMonthStart = new Date(now.getFullYear(), now.getMonth()-3,1).toLocaleDateString().replaceAll('/', "-");
      var threeMonthEnd = new Date(now.getFullYear(), now.getMonth()+1,0,23,59,59).toLocaleDateString().replaceAll('/', "-");
      return [threeMonthStart, threeMonthEnd];
    },
    getVideoData() {
      var daterange = []
      if (this.datePair.length===0) {
        var [threeMonthsStart, threeMonthsEnd] = this.getThreeMonthsStartEnd();
        daterange = [threeMonthsStart, threeMonthsEnd];
      } else {
        daterange = this.datePair.map(d => d.toLocaleDateString().replaceAll('/', "-"))
      }
      axios.post(`/video/aliu/dy/video/date`, {daterange: daterange})
          .then((response) => {
            if (response.data.length > 0) {
              response.data.forEach(material => {
                material['link'] = '<a href=' + material['video_url'] + '>' + material['filename'] + '</a>'
              })
              console.log(response.data)
              this.tableData = response.data
            }
      })
    },
    rounding({ cellValue }) {
      if (cellValue) {
        return parseFloat(cellValue.toFixed(2));
      }
    },
    exportDataEvent () {
      this.$refs.xTable.exportData({ type: 'csv' })
    },
  },
  created() {
    this.getVideoData();
  }
}
</script>

<style scoped>
.videoTable{
  width: 100%;
  text-align: center;
}
</style>