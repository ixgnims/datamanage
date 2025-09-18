<template>
  <el-row>
    <el-row style="text-align: right;">
      <el-switch
          v-model="value"
          active-color="#13ce66"
          active-text="自动更新"
          @change="handleRenew">
      </el-switch>
    </el-row>
    <el-row>
      <!--表格-->
      <el-table :data="tableData"
                :summary-method="getSummaries"
                show-summary
                style="width:100%; font-size:12px">
        <!--列-->
        <el-table-column
            prop="account_name"
            label="广告账户"
            width="180"
            sortable>
        </el-table-column>
        <el-table-column
            prop="stat_cost"
            label="消耗"
            align="center"
            :formatter="rounding"
            sortable>
        </el-table-column>
        <el-table-column
            prop="pay_order_amount"
            label="直接支付"
            align="center"
            sortable>
        </el-table-column>
        <el-table-column
            prop="indirect_order_pay_gmv_7days"
            label="间接支付"
            align="center"
            sortable>
        </el-table-column>
        <el-table-column
            prop="prepay_and_pay_order_roi"
            label="直接ROI"
            align="center"
            sortable>
        </el-table-column>
        <el-table-column
            prop="all_order_pay_roi_7days"
            label="总ROI"
            align="center"
            sortable>
        </el-table-column>
      </el-table>
    </el-row>
  </el-row>
</template>

<script>
import axios from '@/api/axios'
export default {
  name: "AliuDyTable",
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
        const response = await axios.get(`/marketing/today/xiaoming`);
        this.tableData = response.data;
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
    rounding(row, column) {
      if (row[column.property]) {
        return parseFloat((row[column.property]).toFixed(2));
      }
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (column.property === 'stat_cost' ||
            column.property === 'pay_order_amount' ||
            column.property === 'indirect_order_pay_gmv_7days') {
          let sum = 0;
          values.forEach((item) => {
            sum = sum + item;
          });
          sums[index] = sum;
        } else {
          if (column.property === 'prepay_and_pay_order_roi') {
            if (sums[1] === 0) {
              sums[index] = 0;
            } else {
              sums[index] = sums[2] / sums[1]
            }
          }
          if (column.property === 'all_order_pay_roi_7days') {
            if (sums[1] === 0) {
              sums[index] = 0;
            } else {
              sums[index] = (sums[2] + sums[3]) / sums[1]
            }
          }
        }
      });
      for (let i = 1; i < sums.length; i++) {
        sums[i] = parseFloat((sums[i])).toFixed(2);
      }
      return sums;
    }
  },
  mounted() {
    this.getData()
  }
}
</script>