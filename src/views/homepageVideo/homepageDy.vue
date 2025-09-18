<template>
  <div>
    <!--主号-->
    <el-card class="content-card" id="main">
      <el-row class="content-header">
        <div class="content-title">抖音主号</div>
        <div class="update-time" style="">{{"更新时间："+updateTimeMain}}
          <el-button icon="el-icon-refresh" size="mini" type="text" @click="getDyMainVideo"></el-button>
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
              @change="getDyMainVideo"
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
        <div>
          <vxe-grid ref="dyMainGrid" v-bind="dyMainGridOptions">
            <template #video_info_default="{ row }">
              <template v-if="row.video_cover_url">
                <el-image :src="row.video_cover_url"
                          :preview-src-list="[row.video_cover_url]"
                          fit="cover"
                          style="width:90px; height:160px;">
                </el-image>
              </template>
              <template v-else>
                <el-image style="width: 90px; height: 160px; object-fit: cover;"
                          :src="`http://dashboard1.xiyao888.cn/homepage/dy/video/cover_url/get/?advertiser_id=${row.advertiser_id}&aweme_id=${row.aweme_id}&aweme_item_id=${row.aweme_item_id}`"
                          :preview-src-list="[`http://dashboard1.xiyao888.cn/homepage/dy/video/cover_url/get/?advertiser_id=${row.advertiser_id}&aweme_id=${row.aweme_id}&aweme_item_id=${row.aweme_item_id}`]"
                          lazy fit="cover" >
                  <div slot="placeholder">
                    <img src="@/assets/loading.gif" style="width: 90px; height: 160px; object-fit: cover;">
                  </div>
                </el-image>
              </template>
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

    <!--7号-->
    <el-card class="content-card" id="seven">
      <el-row class="content-header">
        <div class="content-title">抖音99直播7号</div>
        <div class="update-time" style="">{{"更新时间："+updateTimeSeven}}
          <el-button icon="el-icon-refresh" size="mini" type="text" @click="getDySevenVideo"></el-button>
        </div>
      </el-row>
      <el-row class="content-filter">
        <div class="record-selector">
          <el-date-picker
              v-model="selectDateSeven"
              type="daterange"
              range-separator="~"
              :start-placeholder= "start_info_seven"
              :end-placeholder="end_info_seven"
              :editable="false"
              @change="getDySevenVideo"
              size="mini"
              align="right">
          </el-date-picker>
        </div>
        <div class="record-selector" style="margin-left:10px">
          <span class="text-label" v-if="recordSeven !== 'all'">前</span>
          <el-popover placement="bottom" width="100px" trigger="click">
            <el-input-number
                v-model="numberSelectSeven"
                @change="handleSevenNumChange"
                :min="5"
                size="mini"
                :step="5"
                :precision="0"
                step-strictly>
            </el-input-number>
            <el-button type="text" size="mini" style="margin-left:5px" @click="setRecordSevenAll">全部</el-button>
            <el-button slot="reference" type="text" size="mini">{{ recordSeven === 'all' ? '全部' : recordSeven}}</el-button>
          </el-popover>
          <span class="text-label" v-if="recordSeven !== 'all'">条</span>
        </div>
      </el-row>
      <el-row style="margin-top: 5px">
        <div>
          <vxe-grid ref="dySevenGrid" v-bind="dySevenGridOptions">
            <template #video_info_default="{ row }">
              <template v-if="row.video_cover_url">
                <el-image :src="row.video_cover_url"
                          :preview-src-list="[row.video_cover_url]"
                          fit="cover"
                          style="width:90px; height:160px;">
                </el-image>
              </template>
              <template v-else>
                <el-image style="width: 90px; height: 160px; object-fit: cover;"
                          :src="`http://dashboard1.xiyao888.cn/homepage/dy/video/cover_url/get/?advertiser_id=${row.advertiser_id}&aweme_id=${row.aweme_id}&aweme_item_id=${row.aweme_item_id}`"
                          :preview-src-list="[`http://dashboard1.xiyao888.cn/homepage/dy/video/cover_url/get/?advertiser_id=${row.advertiser_id}&aweme_id=${row.aweme_id}&aweme_item_id=${row.aweme_item_id}`]"
                          lazy fit="cover" >
                  <div slot="placeholder">
                    <img src="@/assets/loading.gif" style="width: 90px; height: 160px; object-fit: cover;">
                  </div>
                </el-image>
              </template>
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
import axios from "@/api/axios"
export default {
  name: 'homepageDy',
  data() {
    const dyMainGridOptions = {
      border: true,
      loading: false,
      size: "mini",
      minHeight: 20,
      maxHeight: 600,
      showFooter: false,
      rowConfig: {
        isHover: true,
        keyField: 'aweme_item_id',
      },
      columnConfig: {
        resizable: true,
      },
      sortConfig: {
        defaultSort: {
          field: "create_order_desc",
          order: "asc"
        }
      },
      exportConfig: {},
      columns: [
        {field: "level_info", title: "视频信息", width: 150, showOverFlow: 'tooltip', slots: {default: "video_info_default"}},
        {field: "view_cnt", title: "观看数", width: 100, showOverFlow: true, sortable: true},
        {field: "like_cnt", title: "点赞数", width: 100, showOverFlow: true, sortable: true},
        {field: "share_cnt", title: "分享数", width: 100, showOverFlow: true, sortable: true},
        {field: "comment_cnt", title: "评论数", width: 100, showOverFlow: true, sortable: true},
        {field: "view_diff_cnt", title: "新增观看数", width: 100, showOverFlow: true, sortable: true},
        {field: "like_diff_cnt", title: "新增点赞数", width: 100, showOverFlow: true, sortable: true},
        {field: "share_diff_cnt", title: "新增分享数", width: 100, showOverFlow: true, sortable: true},
        {field: "comment_diff_cnt", title: "新增评论数", width: 100, showOverFlow: true, sortable: true},
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
    const dySevenGridOptions = {
      border: true,
      loading: false,
      size: "mini",
      minHeight: 20,
      maxHeight: 600,
      showFooter: false,
      rowConfig: {
        isHover: true,
        keyField: 'aweme_item_id',
      },
      columnConfig: {
        resizable: true,
      },
      sortConfig: {
        defaultSort: {
          field: "create_order_desc",
          order: "asc"
        }
      },
      exportConfig: {},
      columns: [
        {field: "level_info", title: "视频信息", width: 150, showOverFlow: 'tooltip', slots: {default: "video_info_default"}},
        {field: "view_cnt", title: "观看数", width: 100, showOverFlow: true, sortable: true},
        {field: "like_cnt", title: "点赞数", width: 100, showOverFlow: true, sortable: true},
        {field: "share_cnt", title: "分享数", width: 100, showOverFlow: true, sortable: true},
        {field: "comment_cnt", title: "评论数", width: 100, showOverFlow: true, sortable: true},
        {field: "view_diff_cnt", title: "新增观看数", width: 100, showOverFlow: true, sortable: true},
        {field: "like_diff_cnt", title: "新增点赞数", width: 100, showOverFlow: true, sortable: true},
        {field: "share_diff_cnt", title: "新增分享数", width: 100, showOverFlow: true, sortable: true},
        {field: "comment_diff_cnt", title: "新增评论数", width: 100, showOverFlow: true, sortable: true},
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
      // 主号
      updateTimeMain: "",
      start_info_main: "",
      end_info_main: "",
      selectDateMain: [],
      recordMain: 20,
      numberSelectMain: 20,
      dyMainGridOptions,
      dyMainData: [],
      // 99直播7号
      updateTimeSeven: "",
      start_info_seven: "",
      end_info_seven: "",
      selectDateSeven: [],
      recordSeven: 20,
      numberSelectSeven: 20,
      dySevenGridOptions,
      dySevenData: [],
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
      this.recordMain = this.numberSelectMain;
    },
    setRecordMainAll() {
      this.recordMain = "all"
    },
    handleSevenNumChange() {
      this.recordSeven = this.numberSelectSeven;
    },
    setRecordSevenAll() {
      this.recordSeven = "all"
    },
    getDyHomepageUniversal(params) {
      return axios.post(`http://dashboard1.xiyao888.cn/homepage/dy/video/post/`, params)
    },
    async getDyMainVideo() {
      this.dyMainGridOptions.loading = true
      this.updateTimeMain = DateTimeString(new Date())
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
        aweme_nickname_list: "主号"
      }
      try {
        const res = await this.getDyHomepageUniversal(params)
        if (res.data.code === 1) {
          this.dyMainData = Object.values(res.data['video_dict'])
        } else {
          this.dyMainData = []
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.dyMainGridOptions.loading = false
      }
    },
    setDyMainGrid() {
      this.dyMainGridOptions.data = [...this.dyMainData]
    },
    async getDySevenVideo() {
      this.dySevenGridOptions.loading = true
      this.updateTimeSeven = DateTimeString(new Date())
      let end_date = this.getCommonDate()['today']
      let start_date = this.getCommonDate()['today']
      this.start_info_seven = start_date
      this.end_info_seven = end_date
      if (this.selectDateSeven.length > 0) {
        start_date = DateString(new Date(this.selectDateSeven[0]))
        end_date = DateString(new Date(this.selectDateSeven[1].setHours(23, 59, 59, 59)))
      }
      const params = {
        start_date: start_date,
        end_date: end_date,
        latest_n: this.recordSeven,
        aweme_nickname_list: "99直播7号"
      }
      try {
        const res = await this.getDyHomepageUniversal(params)
        if (res.data.code === 1) {
          this.dySevenData = Object.values(res.data['video_dict'])
        } else {
          this.dySevenData = []
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.dySevenGridOptions.loading = false
      }
    },
    setDySevenGrid() {
      this.dySevenGridOptions.data = [...this.dySevenData]
    },
    reloadData() {
      this.getDyMainVideo()
      this.getDySevenVideo()
    },
    postJump(row) {
      const url = 'https://www.douyin.com/video/' + row.aweme_item_id
      window.open(url, '_blank')
    },
    scrollToSection(section) {
      this.$nextTick(() => {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  },
  mounted() {
    this.reloadData()
  },
  watch: {
    recordMain: function() {
      this.getDyMainVideo()
    },
    dyMainData: function() {
      this.setDyMainGrid()
    },
    recordSeven: function() {
      this.getDySevenVideo()
    },
    dySevenData: function() {
      this.setDySevenGrid()
    },
    $route(to) {
      if (to.path === '/homepageVideo/dy') {
        this.reloadData()
      }
    },
    '$route.query.section': {
      handler(newVal) {
        if (newVal) {
          this.scrollToSection(newVal);
        }
      },
      immediate: true
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
</style>