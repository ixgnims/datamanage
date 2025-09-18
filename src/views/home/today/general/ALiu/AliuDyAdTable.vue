<template>
  <div>
    <el-row style="text-align: right;">
      <el-col style="text-align:right">
        <el-switch
            v-model="value"
            active-color="#13ce66"
            active-text="自动更新"
            @change="handleRenew">
        </el-switch>
      </el-col>
    </el-row>
    <el-row>
      <!--表格-->
      <vxe-table
          show-footer
          resizable
          :data="tableData"
          :row-config="{isHover: true}"
          :column-config="{isCurrent: true, isHover: true}"
          :sort-config="{trigger: 'cell', defaultSort: {field: 'all_order_pay_roi_7days', order: 'desc'}, orders: ['desc', 'asc', null]}"
          :tree-config="{transform: true, expandAll: true, rowField: 'ad_id', parentField: 'account_name'}"
          border="inner"
          style="width:100%; font-size:12px">
        <!--列-->
        <vxe-column
            field="account_name"
            title="广告账户"
            width="120"
            sortable>
        </vxe-column>
        <vxe-column
            field="ad_id"
            title="计划id"
            width="130"
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
            field="luban_live_enter_cnt"
            title="人次"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="live_watch_one_minute_count"
            title="停留"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="live_fans_club_join_cnt"
            title="加粉"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="luban_live_slidecart_click_cnt"
            title="查购"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="luban_live_click_product_cnt"
            title="查品"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="all_order_pay_roi_7days"
            title="总ROI"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="category"
            type="html"
            title="预测"
            :formatter="colorCategory"
            sortable>
        </vxe-column>
        <vxe-column
            field="score"
            type="html"
            title="得分"
            :formatter="colorScore"
            sort-type="number"
            sortable>
        </vxe-column>
      </vxe-table>
    </el-row>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  name: "AliuDyAdTable",
  data () {
    return {
      tableData: [],
      pollingInterval: null,
      value: false,
    }
  },
  methods: {
    async getData() {
      try {
        // 尝试API直连
        const response = await axios.get(`/predict/ad/dy/aliu/today/svm/`);
        this.tableData = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    handleRenew(value){
      if (value) {
        this.pollingInterval = setInterval(this.getData,60000);
        this.getData()
      } else {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    },
    rounding({ cellValue }) {
      if (cellValue) {
        return parseFloat(cellValue.toFixed(2));
      }
    },
    colorCategory({ cellValue }) {
      if (cellValue === "合格") {
        return `<span style="color: #9ad294">合格</span>`
      } else {
        return `<span style="color: #ff98a6">不合格</span>`
      }
    },
    colorScore({ cellValue }) {
      if (cellValue >= 50) {
        return `<span style="color: #9ad294">${parseFloat(cellValue.toFixed(2))}</span>`
      } else {
        return `<span style="color: #ff98a6">${parseFloat(cellValue.toFixed(2))}</span>`
      }
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>

</style>