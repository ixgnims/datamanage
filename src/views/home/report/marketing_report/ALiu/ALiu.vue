<template>
  <div>
    <!--日期选择器-->
    <div class="block" style="padding:10px;float:right;">
      <span class="demonstration"></span>
      <el-date-picker
          v-model="datePair"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          @change="getData">
      </el-date-picker>
    </div>
    <div class="block" style="font-size: 13px;float: left;padding: 10px">{{`共 ${(live_num)} 场`}}</div>
    <!--报表-->
    <div>
      <el-table
          :data="tableData"
          :span-method="dateSpanMethod"
          default-sort="{prop:'account_name,order:'ascending}"
          border
          style="width: 100%">
        <el-table-column prop="stat_datetime" label="日期" align="center"></el-table-column>
        <el-table-column prop="account_name" label="广告账户名" align="center" width="180px"></el-table-column>
        <el-table-column prop="stat_cost" label="消耗" align="center"></el-table-column>
        <el-table-column label="阿留" align="center">
          <el-table-column prop="pay_order_amount" label="直接成交" align="center"></el-table-column>
          <el-table-column prop="indirect_order_pay_gmv_7days" label="间接成交" align="center"></el-table-column>
          <el-table-column prop="indirect_current_month_7days" label="7日当月" align="center"></el-table-column>
          <el-table-column prop="indirect_last_month_7days" label="7日上月" align="center"></el-table-column>
          <el-table-column prop="other" label="其他" align="center"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios';
export default {
  data() {
    return {
      tableData: [],
      // 日期快捷选项
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
      value1: '',
      datePair: '',
      live_num: 0,
    }
  },
  methods: {
    // 默认本月数据
    getMonthStartEnd() {
      var now = new Date()
      // 获取本月第一天
      var monthStart = new Date(now.getFullYear(), now.getMonth(),1).toLocaleDateString().replaceAll('/', "-");
      // 获取本月最后一天
      var monthEnd = new Date(now.getFullYear(), now.getMonth()+1,0,23,59,59).toLocaleDateString().replaceAll('/', "-");
      return [monthStart, monthEnd];
    },
    getData() {
      var daterange = []
      var rspData = []
      if (this.datePair.length===0) {
        var [monthStart, monthEnd] = this.getMonthStartEnd()
        daterange = [monthStart, monthEnd];
      } else {
        daterange = this.datePair.map(d => d.toLocaleDateString().replaceAll('/', "-"))
      }
      axios.post(`/report/marketing/date/`,{daterange: daterange})
          .then((response) => {
            console.log(response)
            rspData = response.data
            // 去除空值
            let dataList = rspData;
            let newList = []
            for (let i = 0; i < dataList.length; i++) {
              if(dataList[i].stat_cost !== 0) {
                newList.push(dataList[i]);
              }
            }
            let dateList = []
            for (let i = 0; i < newList.length; i++) {
              dateList.push(newList[i].stat_datetime);
            }
            dateList = Array.from(new Set(dateList));
            this.tableData = newList;
            this.live_num = dateList.length;
          })
    },
    // 合并相同日期的单元格
    dateSpanMethod({row,column,rowIndex,columnIndex}) {
      if(columnIndex === 0) {
        // 获取当前单元格的值
        const currentValue = row[column.property];
        // 获取上一行相同列的值
        const preRow = this.tableData[rowIndex - 1];
        const preValue = preRow ? preRow[column.property] : null;

        // 如果当前值和上一行的值相同，则当前单元格隐藏
        if (currentValue === preValue) {
          return {rowspan:0, colspan:0};
        } else {
          // 否则计算当前单元格应该跨越多少行
          let rowspan = 1;
          for (let i = rowIndex + 1; i < this.tableData.length; i++) {
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
  },
  mounted() {
    this.getData();
  }
}
</script>