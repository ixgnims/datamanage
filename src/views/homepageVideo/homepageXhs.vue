<template>
  <div>
    <el-alert
        title="因资源紧张，小红书官方正在维修获取笔记的API接口，当前调用受限中，若无法加载切勿频繁刷新，可稍后重试"
        type="warning"
        show-icon>
    </el-alert>
    <el-card class="content-card">
      <el-row class="content-header">
        <div class="content-title">小红书主号</div>
        <div class="update-time" style="">{{"更新时间："+updateTimeXhs}}
          <el-button icon="el-icon-refresh" size="mini" type="text" @click="getXhsMainNote"></el-button>
        </div>
      </el-row>
      <el-row class="content-filter">
        <div class="record-selector">
          <el-date-picker
              v-model="selectDateMain"
              type="daterange"
              range-separator="~"
              :start-placeholder= "start_info_main"
              :end-placeholder="end_info_main"
              :editable="false"
              @change="getXhsMainNote"
              size="mini"
              align="right">
          </el-date-picker>
        </div>
        <div class="record-selector" style="margin-left:10px">
          <span class="text-label" v-if="recordMain !== 'all'">前</span>
          <el-popover placement="bottom" width="100px" trigger="click">
            <el-input-number
                v-model="numberSelectMain"
                @change="handleMainNumChange"
                :min="5"
                size="mini"
                :step="5"
                :precision="0"
                step-strictly>
            </el-input-number>
            <el-button type="text" size="mini" style="margin-left:5px" @click="setRecordMainAll">全部</el-button>
            <el-button slot="reference" type="text" size="mini">{{ recordMain === 'all' ? '全部' : recordMain}}</el-button>
          </el-popover>
          <span class="text-label" v-if="recordMain !== 'all'">条</span>
        </div>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-col span="10">
          <span class="radio-group-title">笔记类型：</span>
          <el-radio-group v-model="noteContentType" size="mini" @change="getXhsMainNote">
            <el-radio v-for="option in noteContentTypeOptions"
                      :key="option.value"
                      :label="option.value">
              {{option.label}}
            </el-radio>
          </el-radio-group>
        </el-col>
        <el-col span="13">
          <span class="radio-group-title">作者：</span>
          <el-radio-group v-model="writerMain"  size="mini" @change="getXhsMainNote">
            <el-radio v-for="option in writerOptionsMain"
                      :key="option.value"
                      :label="option.value">
              {{option.label}}
            </el-radio>
          </el-radio-group>
        </el-col>
        <el-col span="1">
          <el-button icon="el-icon-download" size="mini" class="square-button" @click="exportXhsMain"></el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 5px">
        <div>
          <vxe-grid ref="xhsMainGrid" v-bind="xhsMainGridOptions">
            <template #note_info_default="{ row }">
              <el-image style="width: 90px; height: 120px; object-fit: cover;"
                        :src="`http://dashboard1.xiyao888.cn/homepage/xhs/note/cover_url/get/?note_id=${row.note_id}&image=${row.image}`"
                        :preview-src-list="[`http://dashboard1.xiyao888.cn/homepage/xhs/note/cover_url/get/?note_id=${row.note_id}&image=${row.image}`]"
                        lazy :fit="'cover'" >
                <div slot="placeholder">
                  <img src="@/assets/loading.gif" style="width: 90px; height: 120px; object-fit: cover;">
                </div>
              </el-image>
              <el-tooltip class="item" effect="dark" :content="row.title" placement="top">
                <div style="display: flex; align-items: center; max-width: 120px; overflow: hidden;">
                  <el-button type="text" icon="el-icon-search"
                             style="margin-right: 4px;" size="mini"
                             @click="postJump(row)">
                  </el-button>
                  <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ row.title }}
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
import { formatRate } from "@/functions/global_formatter"
import axios from "@/api/axios"
export default {
  name: 'homepageXhs',
  data() {
    const xhsMainGridOptions = {
      border: true,
      loading: false,
      size: "mini",
      minHeight: 20,
      maxHeight: 600,
      showFooter: false,
      rowConfig: {
        isHover: true,
        keyField: 'note_id',
      },
      columnConfig: {
        resizable: true,
      },
      exportConfig: {},
      columns: [
        {field: "level_info", title: "笔记信息", width: 150, showOverFlow: "tooltip", slots: {default: "note_info_default"}},
        {field: "read_count", title: "阅读数", width: 100, showOverFlow: true, sortable: true},
        {field: "read_rate", title: "阅读率", width: 100, showOverFlow: true, formatter: formatRate, sortable: true},
        {field: "interact_count", title: "互动数", width: 100, showOverFlow: true, sortable: true},
        {field: "interact_rate", title: "互动率", width: 100, showOverFlow: true, formatter: formatRate, sortable: true},
        {field: "read_diff_count", title: "新增阅读数", width: 100, showOverFlow: true, sortable: true},
        {field: "interact_diff_count", title: "新增互动数", width: 100, showOverFlow: true, sortable: true},
        {field: "create_time", title: "创建时间", width: 150, showOverFlow: true, sortable: true},
      ],
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
      updateTimeXhs: "",
      start_info_main: "",
      end_info_main: "",
      selectDateMain: "",
      recordMain: 20,
      numberSelectMain: 20,
      noteContentType: "2",
      noteContentTypeOptions: [
        {label: "全部", value: "all"},
        {label: "视频", value: "2"},
        {label: "图文", value: "1"}
      ],
      writerMain: "all",
      writerOptionsMain: [
        {label: "全部", value: "all"},
        {label: "哲涛", value: "哲涛"}
      ],
      xhsMainGridOptions,
      xhsMainData: []
    }
  },
  methods: {
    // 通用日期
    getCommonDate() {
      const today = new Date();
      const todayStr = DateString(today)
      const yesterdayStr = DateString(new Date(today.getTime() - 24 * 60 * 60 * 1000))
      const monthStart = DateString(new Date(today.getFullYear(), today.getMonth(), 1))
      return {
        today: todayStr,
        yesterday: yesterdayStr,
        monthStart: monthStart,
      }
    },
    handleMainNumChange() {
      this.recordMain = this.numberSelectMain
    },
    setRecordMainAll() {
      this.recordMain = "all"
    },
    getXhsNoteUniversal(params) {
      return axios.post(`http://dashboard1.xiyao888.cn/homepage/xhs/note/post/`, params)
    },
    async getXhsMainNote() {
      this.xhsMainGridOptions.loading = true
      this.updateTimeXhs = DateTimeString(new Date())
      let end_date = this.getCommonDate()['today']
      let start_date = this.getCommonDate()['today']
      this.start_info_main = start_date
      this.end_info_main = end_date
      if (this.selectDateMain.length > 0) {
        start_date = DateString(new Date(this.selectDateMain[0]))
        end_date = DateString(new Date(this.selectDateMain[1].setHours(23, 59, 59, 59)))
      }
      const params = {
        start_date: start_date,
        end_date: end_date,
        latest_n: this.recordMain,
        note_content_type: this.noteContentType
      }
      try {
        const res = await this.getXhsNoteUniversal(params)
        if (res.data.code === 1) {
          this.xhsMainData = Object.values(res.data['note_dict'])
        } else {
          this.xhsMainData = []
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.xhsMainGridOptions.loading = false
      }
    },
    setXhsMainGrid() {
      this.xhsMainGridOptions.data = [...this.xhsMainData]
    },
    reloadData() {
      this.getXhsMainNote()
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
    exportXhsMain() {
      const $grid = this.$refs.xhsMainGrid;
      if ($grid) {
        $grid.exportData({
          filename: "小红书笔记数据",
          type: 'csv'
        })
      }
    }
  },
  mounted() {
    this.reloadData()
  },
  watch: {
    recordMain: function() {
      this.getXhsMainNote()
    },
    noteContentType: function() {
      this.getXhsMainNote()
    },
    xhsMainData: function() {
      this.setXhsMainGrid()
    },
    $route(to) {
      if (to.path === '/homepageVideo/xhs') {
        this.reloadData()
      }
    }
  }
}
</script>

<style>
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

.radio-group-title {
  color: #606266;
  font-size: 14px;
  font-weight: 550;
}

.update-time {
  float: right;
  display: block;
  white-space: nowrap;
  font-size: 12px;
  color: #8a96a6;
}

.content-filter {
  flex-direction: column;
  white-space: nowrap;
}

.record-selector {
  float: left;
  display: block
}

.text-label {
  font-size: 13px;
  color: #606266;
  margin: 0 5px;
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