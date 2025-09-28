<template>
  <div>
    <!--笔记汇总-->
    <el-card class="content-card">
      <el-row class="content-header">
        <div class="content-title">笔记汇总</div>
      </el-row>
      <!--筛选器-->
      <el-row style="margin-top: 10px; margin-bottom: 10px;">
        <!--日期-->
        <div class="select-with-label">
          <span class="select-label">日期范围：</span>
          <el-date-picker
              v-model="selectDateNoteTotal"
              type="daterange"
              range-separator="~"
              :start-placeholder= "monthStartInfo"
              :end-placeholder="monthEndInfo"
              :editable="false"
              @change="getXhsWindNoteTotal"
              size="mini"
              align="right">
          </el-date-picker>
        </div>
        <div class="select-with-label">
          <span class="select-label">维度：</span>
          <el-checkbox-group v-model="checkedDimensionsIds" value-key="id" @change="getXhsWindNoteTotal">
            <el-checkbox v-for="dimension in dimensionOptions" :label="dimension.id" :key="dimension.id" :value="dimension">
              {{dimension.label}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-row>
      <el-row style="flex-direction: column; margin-bottom: 5px; width: 100%;">
        <div class="update-time">{{"更新时间："+updateTimeTotal}}
          <el-button icon="el-icon-refresh" size="mini" type="text" @click="getXhsWindNoteTotal"></el-button>
        </div>
        <div>
          <el-button icon="el-icon-download" size="mini" class="square-button" @click="exportPivotNoteTotal"></el-button>
        </div>
      </el-row>
      <el-row style="margin-top:5px">
        <div>
          <vxe-grid ref="noteTotalGrid" v-bind="noteTotalGridOptions">
            <template #note_info_default="{ row }">
              <el-image style="width: 90px; height: 120px; object-fit: cover;"
                        :src="`http://dashboard1.xiyao888.cn/xhs/note_image/?image_url=${row.note_image}&note_id=${row.note_id}`"
                        :preview-src-list="[`http://dashboard1.xiyao888.cn/xhs/note_image/?image_url=${row.note_image}&note_id=${row.note_id}`]"
                        lazy :fit="'cover'" >
                <div slot="placeholder">
                  <img src="@/assets/loading.gif" style="width: 90px; height: 120px; object-fit: cover;">
                </div>
              </el-image>
              <el-tooltip class="item" effect="dark" :content="row.note_title" placement="top">
                <div style="display: flex; align-items: center; max-width: 120px; overflow: hidden;">
                  <el-button type="text" icon="el-icon-search"
                             style="margin-right: 4px;" size="mini"
                             @click="postJump(row)">
                  </el-button>
                  <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ row.note_title }}
                  </span>
                </div>
              </el-tooltip>
            </template>
          </vxe-grid>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { DateString, DateTimeString } from "@/functions/time_function"
import {formatFloat, formatInteger, formatRate} from "@/functions/global_formatter";
import axios from "@/api/axios";
export default {
  name: 'xhsNote',
  data() {
    const noteTotalGridOptions = {
      border: true,
      loading: false,
      size: "mini",
      maxHeight: 600,
      minHeight: 20,
      showFooter: true,
      rowConfig: {
        isHover: true,
        keyField: 'row_key',
      },
      columnConfig: {
        resizable: true,
      },
      sortConfig: {
        defaultSort: {
          field: "deal_order_gmv_7d",
          order: "desc"
        },
      },
      exportConfig: {
        type: "csv",
        columns: []
      },
      // 横向虚拟滚动
      virtualXConfig: {
        enabled: true,
        gt: 0
      },
      // 纵向虚拟滚动
      virtualYConfig: {
        enabled: true,
        gt: 0
      },
      columns: [],
      data: [],
      footerData: [],
      footerRowStyle () {
        return {
          backgroundColor: '#F8F8F9FF',
          fontWeight: 'bold'
        }
      },
    }
    return {
      // 笔记汇总
      updateTimeTotal: "",
      selectDateNoteTotal: [],
      monthStartInfo: "",
      monthEndInfo: "",
      checkedDimensionsIds: ['note'],
      checkedDimensions: [{id: 'note', label: '笔记'}],
      dimensionOptions: [
        {id: 'note', label: "笔记"},
        {id: 'advertiser', label: "广告账户"},
        {id: 'day', label: "日期"}
      ],
      // 按照所选的dimension动态添加列
      noteColumn: {field: "level_info", title: "笔记信息", width: 150, showOverFlow: 'tooltip', slots: {default: "note_info_default"}},
      advertiserColumn: {field: "advertiser_nickname", title: "广告账户", width: 100, showOverFlow: true, filters: []},
      dayColumn: {field: "time", title: "日期", width: 100, showOverFlow: true, sortable: true},
      basicColumns: [
        {field: "note_id", title: "笔记id", width: 100, showOverFlow: true, visible: false},
        {field: "note_jump_url", title: "笔记链接", width: 100, showOverFlow: true, visible: false},
        {field: "fee", title: "消耗", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "deal_order_gmv_7d", title: "GMV", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "deal_order_num_7d", title: "单量", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: "deal_order_roi_7d", title: "ROI", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "ctr", title: "点击率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: "cvr", title: "转化率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: "cpm", title: "CPM", width: 100, showHeaderOverflow: true, formatter: formatFloat, sortable: true},
        {field: "CES", title: "CES", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: "action_button_ctr", title: "按钮点击率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'interaction_rate', title: "互动率", width: 100, showHeaderOverflow: true, formatter: formatRate, sortable: true},
        {field: 'like', title: "点赞", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'share', title: "转发", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'collect', title: "收藏", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'comment', title: "评论", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'pic_save', title: "保存图片", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'screenshot', title: "截图", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
        {field: 'follow', title: "关注", width: 100, showHeaderOverflow: true, formatter: formatInteger, sortable: true},
      ],
      noteTotalGridOptions,
      noteTotalData: [],
      footerNoteTotal: {},
      formattedFooterNoteTotal: {},
    }
  },
  methods: {
    // 通用日期
    getCommonDate() {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const todayStr = DateString(today)
      const yesterdayStr = DateString(yesterday)
      const monthStart = DateString(new Date(today.getFullYear(), today.getMonth(), 1))
      const lastMonthStart = DateString(new Date(today.getFullYear(), today.getMonth() - 1, 1))
      return {
        today: todayStr,
        yesterday: yesterdayStr,
        monthStart: monthStart,
        lastMonthStart: lastMonthStart
      }
    },
    getXhsWindNoteUniversal(params) {
      return axios.get(`http://dashboard1.xiyao888.cn/xhs/note_report/wind/api/get/`, { params })
    },
    async getXhsWindNoteTotal() {
      this.noteTotalGridOptions.loading = true
      // 动态生成列
      const dimensionColumnsMap = {
        note: this.noteColumn,
        advertiser: this.advertiserColumn,
        day: this.dayColumn
      }
      const dimension_columns = this.checkedDimensionsIds.map(dim => dimensionColumnsMap[dim]).filter(Boolean)
      this.noteTotalGridOptions.columns = [...dimension_columns, ...this.basicColumns]
      this.noteTotalGridOptions.exportConfig.columns = this.noteTotalGridOptions.columns.map(col => ({ field: col.field }))
      this.updateTimeTotal = DateTimeString(new Date())
      // 日期处理
      let end_date = this.getCommonDate()['yesterday']
      let start_date = this.getCommonDate()['monthStart']
      if (start_date > end_date) {
        start_date =  this.getCommonDate()['lastMonthStart']
      }
      this.monthStartInfo = start_date
      this.monthEndInfo = end_date
      if (this.selectDateNoteTotal.length > 0) {
        start_date = DateString(new Date(this.selectDateNoteTotal[0]))
        end_date = DateString(new Date(this.selectDateNoteTotal[1].setHours(23, 59, 59, 59)))
      }
      const params = {
        start_date: start_date,
        end_date: end_date,
        dimension_list: this.checkedDimensionsIds.join(),
      }
      try {
        const res = await this.getXhsWindNoteUniversal(params)
        if (res.data.code !== 1) return
        let advFilter = []
        this.noteTotalData = res.data['note_data']
        /*
        switch(dimKey) {
          case 'note':
            this.noteTotalData = Object.values(total_data.note_aggregate)
            break
          case 'advertiser':
            this.noteTotalData = Object.values(total_data.advertiser_aggregate)
            advFilter = Object.keys(total_data.advertiser_aggregate).map(adv => ({ field: adv, value: adv }))
            break
          case 'day':
            this.noteTotalData = Object.values(total_data.time_aggregate)
            break
          default:
            this.noteTotalData = Object.values(note_data).flatMap(adv =>
                Object.values(adv).flatMap(note => Object.values(note))
            )
            advFilter = Object.keys(note_data).map(adv => ({ label: adv, value: adv }))
        }
         */
        if (advFilter.length > 0) {
          await this.$refs.noteTotalGrid.setFilter('advertiser_nickname', advFilter)
        }
        this.footerNoteTotal = res.data['total_data']['total_aggregate']
      } catch (error) {
        console.log(error)
      } finally {
        this.noteTotalGridOptions.loading = false
      }

    },
    setNoteTotalGrid() {
      this.noteTotalGridOptions.data = [...this.noteTotalData]
      Object.keys(this.footerNoteTotal).forEach(key => {
        if (typeof this.footerNoteTotal[key] === 'number') {
          if (key.search('rate') !== -1) {
            this.formattedFooterNoteTotal[key] = parseFloat((this.footerNoteTotal[key]*100).toFixed(2)) + "%"
          } else if (key.search('ctr') !== -1) {
            this.formattedFooterNoteTotal[key] = parseFloat((this.footerNoteTotal[key]*100).toFixed(2)) + "%"
          } else if (key.search('cnt') !== -1) {
            this.formattedFooterNoteTotal[key] = Math.round(this.footerNoteTotal[key])
          } else {
            this.formattedFooterNoteTotal[key] = parseFloat(this.footerNoteTotal[key].toFixed(2))
          }
        } else {
          this.formattedFooterNoteTotal[key] = this.footerNoteTotal[key]
        }
      })
      this.noteTotalGridOptions.footerData = [this.formattedFooterNoteTotal]
    },
    exportPivotNoteTotal() {
      let start_date;
      let end_date;
      const $grid = this.$refs.noteTotalGrid
      if (this.selectDateNoteTotal.length > 0) {
        start_date = DateString(new Date(this.selectDateNoteTotal[0]));
        end_date = DateString(new Date(this.selectDateNoteTotal[1].setHours(23, 59, 59, 59)))
      } else {
        end_date = this.getCommonDate()['yesterday']
        start_date = this.getCommonDate()['monthStart']
        if (start_date > end_date) {
          start_date = this.getCommonDate()['lastMonthStart']
        }
      }
      start_date = start_date.replace(/-/g, '')
      end_date = end_date.replace(/-/g, '')
      if ($grid) {
        $grid.exportData({
          filename: "小红书乘风笔记数据"+start_date+"~"+end_date,
          type: 'csv',
          isExportAll: false
        })
      }
    },
    reloadData() {
      this.getXhsWindNoteTotal()
    },
    async postJump(row) {
      let url = '';
      if ('note_url' in row && row.note_url) {
        url = row.note_url;
      } else {
        try {
          const response = await axios.get('http://dashboard1.xiyao888.cn/homepage/xhs/note/post_url/get/', {
            params: { note_id: row.note_id },
            responseType: 'text'
          });
          url = response.data;
        } catch (error) {
          console.error('获取笔记URL失败:', error);
          this.$message.error('获取链接失败，请稍后重试');
          return;
        }
      }
      if (url && url.startsWith('http')) {
        window.open(url, '_blank');
      } else {
        this.$message.warning('未获取到有效的URL');
      }
    },
  },
  mounted() {
    this.reloadData()
  },
  watch: {
    noteTotalData: function() {
      this.setNoteTotalGrid()
    },
    $route(to) {
      if (to.path === '/xhs/dashboard/note') {
        this.reloadData()
      }
    }
  }
}
</script>

<style>
.select-with-label {
  display: flex;
}

.select-label {
  white-space: nowrap;
  margin-right: 5px;
  font-size: 13px;
  color: #606266;
}

.content-card {
  margin-top: 10px;
  margin-bottom: 10px
}

.content-header {
  flex-direction: column;
}

.content-title {
  float: left;
  display: block;
  white-space: nowrap;
  margin-right: 20px;
  color: #606266;
  font-size: 16px;
  font-weight: 550;
}

.content-time {
  float: left;
  display: block;
  white-space: nowrap;
  font-size: 12px;
  color: #8a96a6;
}

.update-time {
  float: right;
  display: block;
  white-space: nowrap;
  font-size: 12px;
  color: #8a96a6;
}

.square-button {
  width: 30px;
  height: 30px;
  border-radius: 3px;
  padding: 0;
  justify-content: center;
  align-items: center;
}
</style>