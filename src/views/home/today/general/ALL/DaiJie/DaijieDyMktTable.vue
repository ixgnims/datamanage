<template>
  <div>
    <el-row style="text-align: right;">
      <el-col :span="18" style="text-align:left;font-size: 13px">
        {{`更新时间：${update_time}`}}
      </el-col>
      <el-col :span="6" style="text-align:right">
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
          :align="center"
          :footer-data="footerData"
          :row-config="{isHover: true}"
          :column-config="{isCurrent: true, isHover: true}"
          :sort-config="{trigger: 'cell', defaultSort: {field: 'cost_diff', order: 'desc'}, orders: ['desc', 'asc', null]}"
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
            field="cost_diff"
            title="消耗变化"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="click_diff"
            title="点击变化"
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
        <!--
        <vxe-column
            field="delivery_cnt"
            title="在投计划"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        -->
        <vxe-column
            field="pay_order_amount"
            title="直接支付"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="indirect_order_pay_gmv_7days"
            title="间接支付"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="DaiJie_indirect_order_amount_7days_thisMonth"
            title="7日支付"
            :formatter="rounding"
            sort-type="number"
            sortable>
        </vxe-column>
        <vxe-column
            field="prepay_and_pay_order_roi"
            title="直接ROI"
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
      </vxe-table>
    </el-row>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  name: "DaijieDyMktTable",
  data () {
    return {
      update_time: '',
      tableData: [],
      footerData: [
        {
          account_name: '合计', cost_diff: '0', click_diff: '0', stat_cost: '0', //delivery_cnt: '0',
          pay_order_amount: '0', indirect_order_pay_gmv_7days: '0', DaiJie_indirect_order_amount_7days_thisMonth: '0',
          prepay_and_pay_order_roi: '0', all_order_pay_roi_7days: '0'
        }
      ],
      pollingInterval: null,
      value: false,
    }
  },
  methods: {
    async getData() {
      try {
        // 尝试API直连
        const response = await axios.get(`/marketing/today/table/daijie/`);
        this.tableData = response.data;
        this.update_time = response.data[0].input_time;
        var cost_diff_sum = response.data.map(item => item.cost_diff).reduce((a, b) => a + b);
        cost_diff_sum = parseFloat(cost_diff_sum.toFixed(2));
        var click_diff_sum = response.data.map(item => item.click_diff).reduce((a, b) => a + b);
        var stat_cost_sum = response.data.map(item => item.stat_cost).reduce((a, b) => a + b);
        stat_cost_sum = parseFloat(stat_cost_sum.toFixed(2));
        // var delivery_cnt_sum = response.data.map(item => item.delivery_cnt).reduce((a, b) => a + b);
        var pay_order_amount_sum = response.data.map(item => item.pay_order_amount).reduce((a, b) => a + b);
        var indirect_order_pay_gmv_7days = response.data.map(item => item.indirect_order_pay_gmv_7days).reduce((a, b) => a + b);
        var DaiJie_indirect_order_amount_7days_thisMonth = response.data.map(item => item.DaiJie_indirect_order_amount_7days_thisMonth).reduce((a, b) => a + b);
        DaiJie_indirect_order_amount_7days_thisMonth = parseFloat(DaiJie_indirect_order_amount_7days_thisMonth.toFixed(2));
        if (stat_cost_sum > 0) {
          var prepay_and_pay_order_roi_avg = parseFloat((pay_order_amount_sum / stat_cost_sum).toFixed(2));
          var all_order_pay_roi_7days_avg = parseFloat(((pay_order_amount_sum + indirect_order_pay_gmv_7days) / stat_cost_sum).toFixed(2));
        }
        this.footerData = [{
          account_name: '合计',
          cost_diff: cost_diff_sum,
          click_diff: click_diff_sum,
          stat_cost: stat_cost_sum,
          //delivery_cnt: delivery_cnt_sum,
          pay_order_amount: pay_order_amount_sum,
          indirect_order_pay_gmv_7days: indirect_order_pay_gmv_7days,
          DaiJie_indirect_order_amount_7days_thisMonth: DaiJie_indirect_order_amount_7days_thisMonth,
          prepay_and_pay_order_roi: prepay_and_pay_order_roi_avg,
          all_order_pay_roi_7days: all_order_pay_roi_7days_avg
        }];
      } catch (error) {
        console.log(error);
      }
    },
    handleRenew(value){
      if (value) {
        this.pollingInterval = setInterval(this.getData,5000);
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
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>

</style>