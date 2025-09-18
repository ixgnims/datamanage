<template>
  <div>
    <vxe-table
        border
        round
        resizable
        show-header-overflow
        show-overflow
        ref="xTable"
        :row-config="{isHover: true}"
        :data="tableData"
        :span-method="mergeRowMethod"
        class="mktTable">
      <vxe-colgroup title="当日数据" align="center">
        <vxe-column field="date" title="日期" align="center"></vxe-column>
        <vxe-column field="platform" title="平台" align="center"></vxe-column>
        <vxe-column field="account_name" title="广告账户" align="center"></vxe-column>
        <vxe-column field="stat_cost" title="消耗" align="center"></vxe-column>
        <vxe-colgroup title="阿留" align="center">
          <vxe-column field="ALiu_Mkt_total_amount" title="投流成交" align="center">
            <template #header>
              <i :class="collapsable1 ? 'vxe-icon-square-minus' : 'vxe-icon-square-plus'" @click="collapsable1Event"></i>
              <span>投流成交</span>
            </template>
          </vxe-column>
          <vxe-column field="ALiu_direct_order_amount" title="直接成交" align="center" :visible="false"> </vxe-column>
          <vxe-column field="ALiu_indirect_order_amount_today" title="间接成交" align="center" :visible="false"> </vxe-column>
          <vxe-column field="ALiu_indirect_order_amount_7days_thisMonth" title="7日当月" align="center" :visible="false"> </vxe-column>
          <vxe-column field="ALiu_indirect_order_amount_7days_lastMonth" title="7日上月" align="center" :visible="false"> </vxe-column>
          <vxe-column field="ALiu_notCourse_order_amount" title="其他" align="center"> </vxe-column>
        </vxe-colgroup>
        <vxe-colgroup title="Grace" align="center">
          <vxe-column field="AG_Mkt_total_amount" title="投流成交" align="center">
            <template #header>
              <i :class="collapsable2 ? 'vxe-icon-square-minus' : 'vxe-icon-square-plus'" @click="collapsable2Event"></i>
              <span>投流成交</span>
            </template>
          </vxe-column>
          <vxe-column field="AG_direct_order_amount" title="直接成交" align="center" :visible="false"> </vxe-column>
          <vxe-column field="AG_indirect_order_amount_today" title="间接成交" align="center" :visible="false"> </vxe-column>
          <vxe-column field="AG_indirect_order_amount_7days_thisMonth" title="7日当月" align="center" :visible="false"> </vxe-column>
          <vxe-column field="AG_indirect_order_amount_7days_lastMonth" title="7日上月" align="center" :visible="false"> </vxe-column>
          <vxe-column field="AG_notCourse_order_amount" title="其他" align="center"> </vxe-column>
        </vxe-colgroup>
          <vxe-column field="direct_order_roi_today" title="直接ROI" align="center"> </vxe-column>
          <vxe-column field="total_order_roi_today" title="总ROI" align="center"> </vxe-column>
          <vxe-column field="indirect_order_roi_7days" title="7日ROI" align="center"> </vxe-column>
      </vxe-colgroup>
    </vxe-table>
  </div>
</template>

<script>
import axios from "@/api/axios";
export default {
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    getMktData() {
      axios.get(`/report/aliu/aliu_mkt_all`)
          .then((response) => {
            if (response.data.length > 0) {
              console.log(response)
              this.tableData = response.data;
            }
          })
    },
    mergeRowMethod({row,column,_rowIndex,_columnIndex}) {
      if(_columnIndex === 0 || _columnIndex === 1) {
        // 获取当前单元格的值
        const currentValue = row[column.property];
        // 获取上一行相同列的值
        const preRow = this.tableData[_rowIndex - 1];
        const preValue = preRow ? preRow[column.property] : null;

        // 如果当前值和上一行的值相同，则当前单元格隐藏
        if (currentValue === preValue) {
          return {rowspan:0, colspan:0};
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1;
          for (let i = _rowIndex + 1; i < this.tableData.length; i++) {
            const nextRow = this.tableData[i];
            const nextValue = nextRow[column.property];
            if (nextValue === currentValue) {
              rowspan++;
            } else {
              break;
            }
          }
          return {rowspan, colspan: 1}
        }
      }
    },
    collapsable1Event() {
      const fields = ['ALiu_direct_order_amount',
        'ALiu_indirect_order_amount_today',
        'ALiu_indirect_order_amount_7days_thisMonth',
        'ALiu_indirect_order_amount_7days_lastMonth']
      this.collapsable1 = !this.collapsable1
      const xTable = this.$refs.xTable
      fields.forEach(field => {
        const column = xTable.getColumnByField(field)
        column.visible = this.collapsable1;
      })
      xTable.refreshColumn()
    },
    collapsable2Event() {
      const fields = ['AG_direct_order_amount',
        'AG_indirect_order_amount_today',
        'AG_indirect_order_amount_7days_thisMonth',
        'AG_indirect_order_amount_7days_lastMonth']
      this.collapsable2 = !this.collapsable2
      const xTable = this.$refs.xTable
      fields.forEach(field => {
        const column = xTable.getColumnByField(field)
        column.visible = this.collapsable2;
      })
      xTable.refreshColumn()
    }
  },
  mounted() {
    this.getMktData()
  }
}
</script>

<style scoped>
.mktTable{
  width: 100%;
  text-align: center;
}
</style>