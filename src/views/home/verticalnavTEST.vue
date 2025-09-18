<template>
  <div ref="resizableElement">
    <ve-table
        :columns="columns"
        :table-data="tableData"
        borderY
        :cell-autofill-option="cellAutofillOption"
        :editOption="editOption"
        rowKeyFieldName="rowKey"
        :rowStyleOption="rowStyleOption"
        style="width:100%"
    />
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  data() {
    return {
      resizeObserver: null,
      rowStyleOption: {
        clickHighlight: false,
        hoverHighlight: false,
      },
      cellAutofillOption: true,
      editOption: {
        // cell value change
        cellValueChange: ({ row, column }) => {
          console.log("cellValueChange row::", row);
          console.log("cellValueChange column::", column);
        },
      },
      columns: [
        {
          field: "index",
          key: "index",
          operationColumn: true,
          title: "",
          width: 50,
          align: "center",
          renderBodyCell: ({ row, column, rowIndex }, h) => {
            console.log(row,column,h);
            return ++rowIndex;
          },
          edit: true,
        },
        { field: "date", key: "date", title: "日期", edit: true },
        { field: "platform", key: "platform", title: "平台" },
        { field: "account_name", key: "account_name", title: "广告账户" },
        { field: "stat_cost", key: "stat_cost", title: "消耗" },
        { field: "ALiu_direct_order_amount", key: "ALiu_direct_order_amount", title: "直接成交" },
        { field: "ALiu_indirect_order_amount_today", key: "ALiu_indirect_order_amount_today", title: "间接成交" },
        { field: "ALiu_indirect_order_amount_7days_thisMonth", key: "ALiu_indirect_order_amount_7days_thisMonth", title: "7日当月" },
        { field: "ALiu_indirect_order_amount_7days_lastMonth", key: "ALiu_indirect_order_amount_7days_lastMonth", title: "7日上月" },
        { field: "ALiu_notCourse_order_amount", key: "ALiu_notCourse_order_amount", title: "其他" },
        { field: "AG_direct_order_amount", key: "AG_direct_order_amount", title: "直接成交" },
        { field: "AG_indirect_order_amount_today", key: "AG_indirect_order_amount_today", title: "间接成交" },
        { field: "AG_indirect_order_amount_7days_thisMonth", key: "AG_indirect_order_amount_7days_thisMonth", title: "7日当月" },
        { field: "AG_indirect_order_amount_7days_lastMonth", key: "AG_indirect_order_amount_7days_lastMonth", title: "7日上月" },
        { field: "AG_notCourse_order_amount", key: "AG_notCourse_order_amount", title: "其他" },
        { field: "direct_order_roi_today", key: "direct_order_roi_today", title: "直接ROI"},
        { field: "total_order_roi_today", key: "total_order_roi_today", title: "总ROI"},
        { field: "indirect_order_roi_7days", key: "indirect_order_roi_7days", title: "7日ROI"}
      ],
      tableData: [
        {
          date: "2024-04-08",
          platform: "抖音",
          account_name: "阿留WT-晓康快乐育儿",
          stat_cost: 9500,
          ALiu_direct_order_amount: 6594,
          ALiu_indirect_order_amount_today: 6594,
        }
      ],
    };
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
    updateComponentStateBasedOnSize(width, height) {
      // 更新组件状态或其他操作
      // 确保这些操作不会阻塞事件循环
      this.newWidth = width;
      this.newHeight = height;
    },
  },
  created() {

  },
  mounted() {
    this.resizeObserver = new ResizeObserver(entries => {
      // 使用requestAnimationFrame来异步处理尺寸变化逻辑
      // 这样可以避免阻塞时间循环
      requestAnimationFrame(() => {
        entries.forEach(entry => {
          const {width, height} = entry.contentRect;
          // 这里编写处理尺寸变化的逻辑
          console.log('Element resized:', width, height);
          // 更新组件状态或其他操作
          this.updateComponentStateBasedOnSize(width, height);
          this.getMktData()
        });
      });
    });
    // 开始观察尺寸变化
    this.resizeObserver.observe(this.$refs.resizableElement);
  },
  beforeUnmount() {
    // 组件卸载前断开观察器连接
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
};
</script>