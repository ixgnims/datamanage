<template>
  <el-row>
    <el-row>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 10px 0;"></div>
      <el-row style="flex-direction: column; margin-bottom: 5px; width: 100%;">
        <!-- 左侧：Checkbox 组 向父组件qianchuan_video传递参数-->
        <div style="float: left; display: block; white-space: nowrap">
          <el-checkbox-group v-model="checkedDimensionsIds" value-key="id" @change="handleCheckedDimensionsChange">
            <el-checkbox v-for="dimension in dimensions" :label="dimension.id" :key="dimension.id" :value="dimension">{{dimension.label}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- 右侧：按钮组 -->
        <div style="float: right; display: block;white-space: nowrap">
          <el-button icon="el-icon-s-operation" size="mini" class="square-button" @click="dialogVisible=true"></el-button>
          <el-dialog
              width="80%"
              :visible.sync="dialogVisible">
            <span slot="title">自定义列</span>
            <!--对话框面板子组件传参 统计指标选择-->
            <qc_metric_select_panel @change-metrics="childMetricsChecked"/>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="metricChangeConfirm">确 定</el-button>
            </span>
          </el-dialog>
          <el-button icon="el-icon-download" size="mini" class="square-button" @click="exportPivot"></el-button>
        </div>
      </el-row>
    </el-row>
    <el-row>
      <vxe-grid ref="materialTreeRef" v-bind="materialTreeOptions">
        <template #action="{ row }">
          <template v-if="row.current_merge_level === 'material_id'">
            <vxe-button
                mode="text" status="primary" icon="vxe-icon-search" size="mini"
                @click="selectEvent(row)"></vxe-button>
            <span>{{ row.level_info }}</span>
          </template>
          <template v-else>
            <span>{{ row.level_info }}</span>
          </template>
        </template>
      </vxe-grid>
      <el-drawer
          class="material-detail-drawer"
          :visible.sync="showMaterialDetail"
          :with-header="true"
          size="80%"
          @close="handleDrawerClose">
        <template v-slot:title><div class="material-detail-drawer-title">视频详情</div></template>
        <materialDetailDrawer ref="materialDetail"
                              :selectRow="selectRow" :selectMaterialDetail="selectMaterialDetail"
                              :selectMaterialComment="selectMaterialComment" :selectMaterialCommentPage="selectMaterialCommentPage"
                              @change-commentPage="commentPageChange" @change-commentPageSize="commentPageSizeChange"
                              @change-commentLevel="commentLevelChange" @change-commentEmotion="commentEmotionChange"
                              @change-commentSortField="commentSortFieldChange" @change-commentSortOrder="commentSortOrderChange"/>
      </el-drawer>
    </el-row>
  </el-row>
</template>

<script>
import axios from "@/api/axios";
import qc_metric_select_panel from './qc_metric_select_panel.vue'
import {formatFloat, formatInteger, formatRate, formatRate1000, formatRate10000} from '@/functions/global_formatter'
import materialDetailDrawer from "@/views/dashboard/materialDetailDrawer.vue";
import {DateString} from "@/functions/time_function";
export default {
  name: "qc_videoTable",
  components: {
    materialDetailDrawer,
    qc_metric_select_panel
  },
  props: {
    combinePivot: {
      type: Array,
      required: true
    },
    footerSum: {
      type: Object,
      required: true
    },
    footerAvg: {
      type: Object,
      required: true
    }
  },
  data() {
    // 维度多选
    const dimensionOptions = [
      {id: 'live_date', label: '日期'},
      {id: 'script_name', label: '选题'},
      {id: 'shoot_version', label: '拍摄版本'},
      {id: 'edit_version', label: '剪辑版本'},
      {id: 'material_id', label: '素材id/标题'}
    ];
    // 表格配置
    const materialTreeOptions = {
      border: true,
      maxHeight: 500,
      minHeight: 20,
      size: "small",
      showOverflow: true,
      showFooter: true,
      rowConfig: {
        isHover: true,
        keyField: 'id',
      },
      columnConfig: {
        resizable: true,
      },
      sortConfig: {
        defaultSort: {
          field: 'total_cost',
          order: 'desc',
        }
      },
      exportConfig: {},
      expandConfig: {
        expandAll: true,
      },
      treeConfig: {
        transform: true,
        rowField: 'id',
        parentField: 'parentId',
        expandAll: true,
        indent: 0,
      },
      columns: [
        {field: 'level_info', title: '视频信息', fixed: "left", showOverflow: true, width: 400, treeNode: true, sortable: true, slots: {default: 'action'}},
        {field: 'current_merge_level', title: '当前层级', fixed: "left", showOverflow: true, visible: false},
        //{field: 'material_id', title: '素材id', showOverflow: true, width: 150, fixed: "left"},
        //{field: 'file_title', title: '文件名', showOverflow: true, width: 150, fixed: "left"},
        {field: 'total_show_cnt', title: '展示数', width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'total_click_cnt', title: '点击数', width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'total_convert_cnt', title: '转化数', width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'total_cost', title: '消耗', width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: 'total_click_rate', title: '点击率', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'total_click_convert_rate', title: '点击转化率', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'total_show_convert_rate', title: '展示转化率', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'total_ROI', title: 'ROI', width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: 'total_cpc', title: '平均点击单价',  width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: 'total_convert_cost', title: '转化成本', width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: 'total_cpm', title: '平均千次展示费用', width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: 'total_estimated_profit', title: '预估利润', fixed: "right", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: 'total_play_3s_rate', title: '3s播放率', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'total_play_over_rate', title: '完播率', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'total_follow_rate', title: '直播间关注率', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'video_level', title: '视频级别', fixed: "right", width: 100, showHeaderOverflow: true},
        {field: 'standard_live_enter_rate', title: '直播间进入率(标准推广)', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'standard_click_slidecart_rate', title: '购物车点击率(标准推广)', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'standard_click_product_rate', title: '商品点击率(标准推广)', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'standard_slidecart_click_convert_rate', title: '查看购物车转化率(标准推广)', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'standard_play_50_rate', title: '50%播放率(标准推广)', width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
      ],
      data: [],
      footerData: [],
      videoDrawer: false,
      footerRowStyle () {
        return {
          backgroundColor: '#F8F8F9FF',
          fontWeight: 'bold'
        }
      },
      rowStyle ({ row }) {
        // 分级染色
        if (row.video_level.includes("S")) {
          return {
            backgroundColor: '#fffacc',
            color: '#fd9b00',
          }
        } else if (row.video_level.includes("A")) {
          return {
            backgroundColor: '#e9ffe6',
            color: '#447940',
          }
        }
      },

    }
    return {
      materialTreeOptions,
      dialogVisible: false,
      checkAll: false,
      checkedDimensionsIds: ['edit_version', 'material_id'],
      checkedDimensions: [
        {id: 'edit_version', label: '剪辑版本'},
        {id: 'material_id', label: '素材id/标题'}
      ],
      checkedMetricsIds: ['total_show_cnt', 'total_click_cnt', 'total_convert_cnt', 'total_cost', 'total_click_rate',
        'total_click_convert_rate', 'total_show_convert_rate', 'total_ROI', 'total_cpc', 'total_convert_cost',
        'total_cpm', 'total_estimated_profit', 'total_play_3s_rate', 'total_play_over_rate', 'total_follow_rate', 'video_level',
        'standard_live_enter_rate', 'standard_click_slidecart_rate', 'standard_click_product_rate',
        'standard_slidecart_click_convert_rate', 'standard_play_50_rate',
      ],
      checkedMetrics: [
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
        {id: 'total_play_3s_rate', label: '3s播放率'},
        {id: 'total_play_over_rate', label: '完播率'},
        {id: 'total_follow_rate', label: '直播间关注率'},
        {id: 'video_level', label: '视频级别'},
        {id: 'standard_live_enter_rate', label: '直播间进入率(标准推广)'},
        {id: 'standard_click_slidecart_rate', label: '购物车点击率(标准推广)'},
        {id: 'standard_click_product_rate', label: '商品点击率(标准推广)'},
        {id: 'standard_slidecart_click_convert_rate', label: '查看购物车转化率(标准推广)'},
        {id: 'standard_play_50_rate', label: '50%播放率(标准推广)'},
      ],
      dimensions: dimensionOptions,
      dimensionsMap: null, // 用于存储id到对象映射
      isIndeterminate: true,
      // 视频详情抽屉
      showMaterialDetail: false,
      selectRow: null,
      selectMaterialCreateTime: "",
      selectMaterialDetail: {},
      selectMaterialComment: {},
      selectMaterialCommentPage: {},
      advertiserIdList: "1807974073493577,1808805567146204,1809425772328217,1806253617705065",
      commentPage: 1,
      commentPageSize: 10,
      commentLevel: "LEVEL_ONE",
      commentEmotion: "ALL",
      commentSortField: "LIKE_COUNT",
      commentSortOrder: "DESC"
    }
  },
  created() {
    // 初始化 dimensionsMap
    this.dimensionsMap = new Map(this.dimensions.map(d => [d.id, d]))
  },

  methods: {
    sortAndMapCheckedDimensions(ids) {
      return ids
          .map(id => this.dimensionsMap.get(id))
          .filter(Boolean)
          .sort((a, b) => {
            const indexA = this.dimensions.findIndex(d => d.id === a.id)
            const indexB = this.dimensions.findIndex(d => d.id === b.id)
            return indexA - indexB
          })
    },
    handleCheckAllChange(val) {
      this.checkedDimensionsIds = val ? this.dimensions.map(d => d.id) : [];
      this.isIndeterminate = false;
    },
    // 当前组件选择的聚合dimension改变时
    handleCheckedDimensionsChange(value) {
      this.checkAll = value.length === this.dimensions.length;
      this.isIndeterminate = value.length > 0 && value.length < this.dimensions.length;
      // 排序
      const sortedCheckedDimensions = this.sortAndMapCheckedDimensions(value)
      this.checkedDimensionsIds = sortedCheckedDimensions.map(d => d.id)
      this.checkedDimensions = sortedCheckedDimensions
      // 向父组件传参
      this.$emit('change-dimensions', this.checkedDimensionsIds)
      // 执行函数更改表格的列
      this.resetTreeCols()
    },
    // 子组件选择的metric改变时
    childMetricsChecked(data) {
      if (data.length > 0) {
        this.checkedMetrics = data
      }
    },
    // 弹窗点击确认metric的修改时
    metricChangeConfirm() {
      this.dialogVisible = false;
      // 执行函数更改表格的列
      this.resetTreeCols()
    },
    // 生成列配置的通用方法
    generateColumnConfig(item, isDimension = true) {
      const baseConfig = {
        field: isDimension ? "level_info" : item.id,
        title: isDimension ? "视频信息" : item.label,
        showHeaderOverflow: true,
        width: isDimension ? 400 : 100, // 根据类型设置宽度
        sortable: true,
        ...(isDimension && {fixed: "left"}) // 如果是dimension，固定左侧
      };
      //
      // 特殊处理material_id
      if (isDimension && item.id !== 'material_id') {
        baseConfig.treeNode = true
      }
      // 特殊处理 total_estimated_profit, video_level
      if (!isDimension && item.id === 'total_estimated_profit' || item.id === 'video_level') {
        baseConfig.fixed = "right"
      }
      // 处理数字
      if (!isDimension && item.id.search('report_rate') !== -1) {
        baseConfig.formatter = formatRate10000
      } else if (!isDimension && item.id.search('dislike_rate') !== -1) {
        baseConfig.formatter = formatRate1000
      } else if (!isDimension && item.id.search('rate') !== -1) {
        baseConfig.formatter = formatRate
      } else if (!isDimension && item.id.search('cnt') !== -1) {
        baseConfig.formatter = formatInteger
      } else if (!isDimension && item.id !== 'video_level') {
        baseConfig.formatter = formatFloat
      }
      return baseConfig
    },
    // 重置表格列的函数
    resetTreeCols() {
      // 生成 dimensions 列配置
      // 仅添加一列视频信息
      const dimensionConfig = [
        {field: 'level_info', title: '视频信息', fixed: "left", showOverflow: true, width: 400, treeNode: true, sortable: true},
        {field: 'current_merge_level', title: '当前层级', fixed: "left", showOverflow: true, visible: false},
      ]
      //const dimensionColumns = this.checkedDimensions.map(item =>
      //this.generateColumnConfig(item, true)
      //);
      // 生成 metrics 列配置
      const metricColumns = this.checkedMetrics.map(item =>
          this.generateColumnConfig(item, false)
      );
      // 合并列配置
      this.materialTreeOptions.columns = [...dimensionConfig, ...metricColumns]
    },
    setTreeData() {
      this.materialTreeOptions.data = this.combinePivot;
      let formattedFooterSum = {}
      let formattedFooterAvg = {}
      Object.keys(this.footerSum).forEach(key => {
        if (typeof this.footerSum[key] === 'number') {
          if (key.search('report_rate') !== -1) {
            formattedFooterSum[key] = parseFloat((this.footerSum[key]*10000).toFixed(4)) + "‱"
          } else if (key.search('dislike_rate') !== -1) {
            formattedFooterSum[key] = parseFloat((this.footerSum[key]*1000).toFixed(4)) + "‰"
          } else if (key.search('rate') !== -1) {
            // eslint-disable-next-line vue/no-mutating-props
            formattedFooterSum[key] = parseFloat((this.footerSum[key]*100).toFixed(2)) + "%"
          } else if (key.search('cnt') !== -1) {
            formattedFooterSum[key] = Math.round(this.footerSum[key])
          } else {
            formattedFooterSum[key] = parseFloat(this.footerSum[key].toFixed(2))
          }
        } else {
          formattedFooterSum[key] = this.footerSum[key]
        }
      })

      Object.keys(this.footerAvg).forEach(key => {
        if (typeof this.footerAvg[key] === 'number') {
          if (key.search('report_rate') !== -1) {
            formattedFooterSum[key] = parseFloat((this.footerSum[key]*10000).toFixed(4)) + "‱"
          } else if (key.search('dislike_rate') !== -1) {
            formattedFooterSum[key] = parseFloat((this.footerSum[key]*1000).toFixed(4)) + "‰"
          } else if (key.search('rate') !== -1) {
            formattedFooterAvg[key] = parseFloat((this.footerAvg[key]*100).toFixed(2)) + "%"
          } else if (key.search('cnt') !== -1) {
            formattedFooterAvg[key] = Math.round(this.footerAvg[key])
          } else {
            formattedFooterAvg[key] = parseFloat(this.footerAvg[key].toFixed(2))
          }
        } else {
          formattedFooterAvg[key] = this.footerAvg[key]
        }
      })
      this.materialTreeOptions.footerData = [formattedFooterSum, formattedFooterAvg]
      this.$refs['materialTreeRef'].setAllTreeExpand(true)
    },
    handleMaterialCellClick: function({ row, column}) {
      if (row.current_merge_level === 'material_id') {
        console.log(column.title)
        console.log(row.material_id)
        // 打开弹窗，抽屉
        console.log(this.videoDrawer)
        this.videoDrawer = true
        console.log(this.videoDrawer)
        // 获取视频播放链接
        axios.get(`http://47.107.244.209:8967/material/aliu99/dy/temp_url/get/?material_id=${row.material_id}`)
            .then(response => {
              console.log(response.data)
            })
      }
    },
    exportPivot() {
      const $grid = this.$refs.materialTreeRef
      if($grid) {
        $grid.exportData({
          type: 'csv'
        })
      }
    },
    // 抽屉弹窗
    selectEvent (row) {
      this.showMaterialDetail = true
      this.selectRow = row
      this.getVideoUrl(row['material_id'])
    },
    // 视频播放链接
    getVideoUrl(material_id) {
      axios.get(`http://47.107.244.209:8967/material/aliu99/dy/temp_url/get/?material_id=${material_id}`)
          .then(response => {
            if (response.data.temp_url.length > 0) {
              this.selectMaterialDetail = response.data
              this.selectMaterialCreateTime = response.data['create_time']
              this.getVideoComment(material_id)
            } else {console.log('错误')}
          })
    },
    // 视频评论
    getVideoComment(material_id) {
      const start_time = this.selectMaterialCreateTime.split(' ')[0]
      const end_time = DateString(new Date())
      axios.get(`http://47.107.244.209:8967/material/comment/dy/get/?start_time=${start_time}&end_time=${end_time}&advertiser_ids=${this.advertiserIdList}&material_ids=${material_id}&page=${this.commentPage}&page_size=${this.commentPageSize}&level_type=${this.commentLevel}&emotion_type=${this.commentEmotion}&order_field=${this.commentSortField}&order_type=${this.commentSortOrder}`)
          .then(response => {
            if (response.data.code === 1) {
              this.selectMaterialComment = response.data['comment_list']
              this.selectMaterialCommentPage = response.data['page_info']
            } else {console.log('错误')}
          })
    },
    handleDrawerClose() {
      // 通过ref访问子组件中的video元素
      const videoElement = this.$refs.materialDetail.$refs.videoPlayer
      if (videoElement) {
        videoElement.pause()
        videoElement.currentTime = 0
      }
      this.selectRow = null
    },
    // 接受抽屉子组件参数
    commentPageChange(page) {
      this.commentPage = page
      this.getVideoComment(this.selectRow['material_id'])
    },
    commentPageSizeChange(page_size) {
      this.commentPageSize = page_size
      this.getVideoComment(this.selectRow['material_id'])
    },
    commentLevelChange(level_type) {
      this.commentLevel = level_type
      this.getVideoComment(this.selectRow['material_id'])
    },
    commentEmotionChange(emotion_type) {
      this.commentEmotion = emotion_type
      this.getVideoComment(this.selectRow['material_id'])
    },
    commentSortFieldChange(field) {
      if (field !== null) {
        this.commentSortField = field
        this.getVideoComment(this.selectRow['material_id'])
      }
    },
    commentSortOrderChange(order) {
      if (order !== null) {
        this.commentSortOrder = order
        this.getVideoComment(this.selectRow['material_id'])
      }
    },
  },
  mounted() {
    this.setTreeData()
    this.$refs['materialTreeRef'].setAllTreeExpand(true)
  },
  watch: {
    checkedMetrics: function(newValue) {
      console.log(newValue);
    },
    combinePivot: function() {
      this.setTreeData()
    }
  }
}
</script>

<style scoped>
.square-button {
  width: 30px;
  height: 30px;
  border-radius: 3px;
  padding: 0;
  justify-content: center;
  align-items: center;
}
/* 控制整个标题区域的高度 */
.material-detail-drawer .el-drawer__header {
  height: 30px; /* 设置你需要的标题高度 */
  padding: 0 20px; /* 根据需要调整内边距 */
  margin-top: 15px;
  margin-bottom: 0;
}
/* 自定义标题内容的样式 */
.material-detail-drawer .material-detail-drawer-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 40px; /* 与标题高度一致，实现垂直居中 */
  margin: 0;
}




</style>