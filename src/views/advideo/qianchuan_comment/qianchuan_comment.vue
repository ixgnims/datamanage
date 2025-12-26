<template>
  <!--验证成功显示内容-->
  <div v-if="accessGranted" class="comment-page" ref="commentGridWrapper">
    <el-row>
      <el-card>
        <!-- 第一行 -->
        <el-row :gutter="10">
          <el-col :span="10">
            <div class="select-with-label">
              <span class="select-label">评论日期：</span>
              <el-date-picker
                  v-model="commentDateRange"
                  type="daterange"
                  range-separator="~"
                  :start-placeholder="commentCreateStart"
                  :end-placeholder="commentCreateEnd"
                  :editable="false"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  size="mini"
              />
            </div>
          </el-col>
          <el-col :span="14">
            <div class="select-with-label">
              <span class="select-label" style="color:#c41a1a;font-weight:600">选择账户：</span>
              <el-select v-model="filters.advertiser_ids"
                         :loading="loadingAdvertisers"
                         @visible-change="getAdvertiserOptions"
                         placeholder="99WT1-合数教育"
                         size="mini">
                <el-option v-for="item in advertiserOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :gutter="10">
          <el-col :span="6">
            <div class="select-with-label">
              <span class="select-label">隐藏状态：</span>
              <el-select v-model="filters.hide_status"
                         placeholder="请选择"
                         size="mini">
                <el-option v-for="item in commentHideStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="select-with-label">
              <span class="select-label">评论层级：</span>
              <el-select v-model="filters.level_type"
                         placeholder="评论层级"
                         size="mini">
                <el-option v-for="item in commentLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="select-with-label">
              <span class="select-label">情感类型：</span>
              <el-select v-model="filters.emotion_type"
                         placeholder="全部"
                         size="mini">
                <el-option v-for="item in commentEmotionTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="select-with-label">
              <span class="select-label">回复状态：</span>
              <el-select v-model="filters.is_replied"
                         placeholder="处理状态"
                         size="mini">
                <el-option label="不限" value="" />
                <el-option label="未回复" value="0" />
                <el-option label="已回复" value="1" />
              </el-select>
            </div>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <el-row :gutter="10">
          <el-col :span="6">
            <div class="select-with-label">
              <span class="select-label">关键词：</span>
              <el-input placeholder="请输入"
                        clearable
                        prefix-icon="el-icon-search"
                        v-model="filters.content"
                        size="mini" />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="select-with-label">
              <span class="select-label">选择计划：</span>
              <el-select v-model="filters.ad_ids"
                         placeholder="请选择"
                         size="mini"
                         disabled
                         clearable
                         filterable>
                <!--点击弹出面板-->
                <el-option v-for="item in AdOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="select-with-label">
              <span class="select-label">选择视频：</span>
              <el-select v-model="filters.material_ids"
                         placeholder="请选择"
                         size="mini"
                         disabled
                         clearable
                         filterable>
                <!--点击弹出面板-->
                <el-option v-for="item in materialOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="select-with-label">
              <span class="select-label">选择抖音号：</span>
              <el-select v-model="filters.author_ids"
                         placeholder="请选择"
                         size="mini"
                         disabled
                         clearable
                         filterable>
                <!--点击弹出面板-->
                <el-option v-for="item in awemeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row>
      <el-card style="margin-top:10px">
        <el-row style="margin-bottom:10px" class="content-header">
          <el-button size="small" type="primary" plain round @click="openReplyCommentPanelBatch">批量回复</el-button>
          <el-button size="small" type="info" plain round @click="openHideCommentPanelBatch">批量隐藏</el-button>
          <el-button size="small" plain round @click="exportCommentList">导出</el-button>
          <el-checkbox v-model="badWordFilter" style="margin-left:15px">
            <el-button size="small" type="text">常见负评筛选</el-button>
          </el-checkbox>
          <div class="update-time" style="">{{"更新时间："+updateTime}}
            <el-button icon="el-icon-refresh" size="mini" type="text" @click="getVideoComment"></el-button>
          </div>
        </el-row>
        <el-row>
          <div>
            <vxe-grid ref="commentGridRef" v-bind="commentGridOptions" @sort-change="commentSortChange">
              <template #video_info_default="{ row }">
                <img :src="row.poster_url" width="90" height="160" style="object-fit: cover;" alt=""/>
                <el-tooltip class="item" effect="dark" :content="row.file_title" placement="top">
                <span style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block;">
                  {{ row.file_title }}
                </span>
                </el-tooltip>
              </template>
              <template #handle_default="{ row }">
                <el-tooltip v-if="row.comment_permission === 'READ'"
                            content="用户设置不可回复"
                            placement="top">
                  <vxe-button mode="text" status="primary" disabled>回复</vxe-button>
                </el-tooltip>
                <vxe-button v-else mode="text" status="primary" @click="openReplyCommentPanel(row)">回复</vxe-button>
                <vxe-button mode="text" status="primary" @click="openHideCommentPanel(row)" :disabled="row.hide_status==='已隐藏'">隐藏</vxe-button>
                <vxe-button mode="text" status="primary" @click="openBanUserPanel(row)">屏蔽用户</vxe-button>
                <vxe-button mode="text" status="primary" @click="checkDetail(row)">查看详情</vxe-button>
              </template>
            </vxe-grid>
            <vxe-pager @page-change="handlePageChange" :current-page="commentPage.page"
                       :page-size="commentPage.page_size" :total="commentPage.total_number" size="mini"/>
          </div>
          <!--视频详情播放器播放-->
          <el-drawer class="material-detail-drawer"
                     ref="materialDetail"
                     :visible.sync="showMaterialDetail"
                     @close="handleDrawerClose"
                     :with-header="true"
                     size="30%">
            <template v-slot:title><div class="material-detail-drawer-title">视频详情</div></template>
            <div class="video-container">
              <el-card :body-style="{ padding: '0px' }">
                <video
                    ref="videoPlayer"
                    :src="videoUrl"
                    controls
                    style="width: 100%;">
                  您的浏览器不支持视频播放
                </video>
                <div class="video-title">
                  {{selectMaterialDetail.filename}}
                  <el-button icon="el-icon-refresh" type="text" @click="getVideoUrl"></el-button>
                </div>
              </el-card>
            </div>
            <div class="video-description">
              <div v-for="(item, index) in videoDescriptionItems" :key="index" class="video-description-item">
                <div class="video-description-title">{{ item.title }}</div>
                <div class="video-description-content">{{ item.content }}</div>
              </div>
            </div>
          </el-drawer>
          <!--回复评论-->
          <el-dialog
              :visible.sync="replyDialogVisible"
              @close="cancelReplyComment"
              width="50%">
            <span slot="title">{{`回复${selectCommentsCnt}条评论`}}</span>
            <div v-for="comment in selectComments" :key=comment.comment_id>
              {{`@${comment.aweme_name}：${comment.text}`}}
            </div>
            <el-input size="mini" style="margin-top:10px"
                      type="textarea" autosize
                      placeholder="输入回复内容"
                      maxlength="100" show-word-limit
                      v-model="replyText">
            </el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancelReplyComment">取 消</el-button>
              <el-button type="primary"
                         :loading="replyLoading"
                         @click="confirmReplyComment">
                {{ replyLoading ? "执行中..." : "确 定" }}
              </el-button>
            </span>
          </el-dialog>
          <!--屏蔽用户-->
          <el-dialog
              :visible.sync="banUserDialogVisible"
              @close="cancelBanUser"
              width="50%">
            <span slot="title">屏蔽用户</span>
            <div>
              {{`${selectBanUserRow.advertiser_name} 关联抖音号`}}
              <el-select size="mini"
                         multiple
                         style="margin-right:5px"
                         clearable
                         v-model="selectRelatedAweme"
                         placeholder="可多选，不选则默认全选"
                         :loading="loadingRelatedAweme"
                         @visible-change="showRelatedAwemeList">
                <el-option v-for="item in relatedAwemeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div style="color:#F08080;margin-top:10px">
              {{`将为以上所选抖音号屏蔽用户 @${selectBanUserRow.aweme_name}`}}
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancelBanUser">取 消</el-button>
              <el-button type="primary"
                         :loading="banUserLoading"
                         @click="confirmBanUser">
                {{ replyLoading ? "执行中..." : "确 定" }}
              </el-button>
            </span>
          </el-dialog>
        </el-row>
      </el-card>
    </el-row>
  </div>
  <div v-else class="password-overlay">
    <div class="password-card">
      <div class="password-title">请输入访问密码</div>
      <el-row :gutter="10" class="password-row">
        <el-col :span="14">
          <el-input
              v-model="password"
              size="mini"
              type="password"
              show-password
              placeholder="请输入密码"
              @keyup.enter="verify"
          />
        </el-col>
        <el-col :span="10">
          <el-button
              type="primary"
              size="mini"
              style="width:100%"
              @click="verify"
          >
            确认
          </el-button>
        </el-col>
      </el-row>

      <div v-if="error" class="password-error">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import {DateString, DateTimeString} from "@/functions/time_function";
import {confirmWithLoading} from "@/functions/dialog"
import axios from "@/api/axios";

const STORAGE_KEY = 'comment_page_auth'
const PAGE_KEY = 'comment_report_page'

export default {
  name: "qianchuan_comment",
  data() {
    const commentGridOptions = {
      border: true,
      loading: false,
      size: "mini",
      rowConfig: {
        isHover: true,
        keyField: 'comment_id'
      },
      columnConfig: {
        resizable: true,
      },
      checkboxConfig: {
        labelField: 'text',
        highlight: true,
      },
      sortConfig: {
        remote: true
      },
      rowStyle ({row}) {
        if (row.hide_status === '已隐藏') {
          return {
            color: '#b6b5b5'
          }
        }
      },
      columns: [
        {type: 'checkbox', field: 'text', title: '评论内容', width: 200, showOverFlow: true},
        {title: '视频信息', width: 150, showOverFlow: 'tooltip', slots: {default: "video_info_default"}},
        {title: '操作', width: 80, slots: {default: "handle_default"}},
        {title: '状态', field: 'hide_status', width: 80, showOverFlow: true},
        {title: '情感', field: 'emotion_type', width: 80, showOverFlow: true},
        {title: '层级', field: 'level_type', width: 80, showOverFlow: true},
        {title: '点赞数', field: 'like_count', width: 80, showOverFlow: true, sortable: true},
        {title: '回复数', field: 'reply_count', width: 80, showOverFlow: true, sortable: true},
        {title: '评论时间', field: 'create_time', width: 150, showOverFlow: true, sortable: true},
      ],
      data: []
    }
    return {
      // 密码验证
      accessGranted: false,
      password: '',
      error: '',
      pwdDialogVisible: true,
      // 评论管理
      commentDateRange: [],
      filters: {
        content: '',
        advertiser_ids: '',
        material_ids: [],
        hide_status: 'NOT_HIDE',
        level_type: 'LEVEL_ONE',
        emotion_type: 'ALL',
        is_replied: '',
        author_ids: [],
        ad_ids: [],
      },
      badWordFilter: false,
      commentCreateStart: "",
      commentCreateEnd: "",
      advertiserOptions: [],
      loadingAdvertisers: false,
      commentHideStatusOptions: [
        {label: "不限", value: "ALL"},
        {label: "未隐藏", value: "NOT_HIDE"},
        {label: "已隐藏", value: "HIDE"}
      ],
      commentLevelOptions: [
        {label: "不限", value: "LEVEL_ALL"},
        {label: "一级评论", value: "LEVEL_ONE"},
        {label: "二级评论", value: "LEVEL_TWO"}
      ],
      commentEmotionTypeOptions: [
        {label: "不限", value: "ALL"},
        {label: "负向评论", value: "NEGATIVE"},
        {label: "中性评论", value: "NEUTRAL"},
        {label: "正向评论", value: "POSITIVE"},
      ],
      commentIsRepliedOptions: [
        {label: "不限", value: "ALL"},
        {label: "未回复", value: "0"},
        {label: "已回复", value: "1"}
      ],
      updateTime: "",
      // 接口获取列表，弹出面板
      materialOptions: [],
      awemeOptions: [],
      AdOptions: [],
      commentGridOptions,
      commentPage: {
        page: 1,
        page_size: 20,
        total_number: 0,
        total_page: 1,
      },
      selectPage: 1,
      selectPageSize: 20,
      commentSortField: "LIKE_COUNT",
      commentSortOrder: "DESC",
      commentList: [],
      // 回复评论
      replyDialogVisible: false,
      selectComments: [],
      selectCommentsCnt: 0,
      replyLoading: false,
      replyText: "",
      // 屏蔽用户
      banUserDialogVisible: false,
      banUserLoading: false,
      selectBanUserRow: {},
      loadingRelatedAweme: false,
      relatedAwemeOptions: [],
      selectRelatedAweme: [],
      // 视频详情抽屉
      showMaterialDetail: false,
      selectRow: null,
      selectMaterialDetail: {},
      selectMaterialCreateTime: "",
      videoUrl: "",
    }
  },
  computed: {
    videoDescriptionItems() {
      return [
        { title: "选题", content: this.selectRow?.script_name || "--" },
        { title: "拍摄版本", content: this.selectRow?.shoot_version || "--" },
        { title: "剪辑版本", content: this.selectRow?.edit_version || "--" },
        { title: "素材ID", content: this.selectRow?.material_id || "--" },
        { title: "上传时间", content: this.selectMaterialDetail?.create_time || "--" },
        { title: "时长", content: this.selectMaterialDetail?.duration ? `${this.selectMaterialDetail.duration}秒` : "--" },
      ]
    }
  },
  methods: {
    async verify() {
      const res = await axios.post('http://47.107.244.209:8967/material/comment/admin/verify', {
        page_key: PAGE_KEY,
        password: this.password
      })

      if (res.data.success) {
        this.accessGranted = true
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          verified: true,
          password_version: res.data.password_version
        }))
      } else {
        this.error = res.data.msg
      }
    },
    async verifyVersion(version) {
      const res = await axios.post('http://127.0.0.1:8000/material/comment/admin/verify', {
        page_key: PAGE_KEY,
        password_version: version
      })

      if (res.data.success) {
        this.accessGranted = true
      } else {
        // 密码已更新
        localStorage.removeItem(STORAGE_KEY)
        this.accessGranted = false
        this.error = res.data.msg
      }
    },
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
    handlePageChange({currentPage, pageSize}) {
      this.selectPage = currentPage
      this.selectPageSize = pageSize
      this.$nextTick(() => {
        this.$refs.commentGridWrapper.scrollIntoView({ behavior: 'smooth' })
      })
    },
    // 当filter重置时，重置页码
    resetPage() {
      this.commentPage = {
        page: 1,
            page_size: 20,
            total_number: 0,
            total_page: 1,
      }
      this.selectPage = 1
      this.selectPageSize = 20
    },
    commentSortChange({ field, order }) {
      if (field != null) {
        this.commentSortField = field
      }
      if (order != null) {
        this.commentSortOrder = order
      }
      this.getVideoComment()
    },
    async getAdvertiserOptions(visible) {
      if (visible && this.advertiserOptions.length === 0) {
        // 第一次点击才加载
        this.loadingAdvertisers = true
        try {
          const res = await axios.get(`http://47.107.244.209:8967/common/dy/advertiser/all/get/`)
          if (res.data.code === 1) {
            this.advertiserOptions = res.data['advertiser_list'].map(item => ({
              label: item.advertiser_name,
              value: item.advertiser_id,
            }))
          }
        } catch(err) {
          this.$message.error('加载广告账户列表失败')
        } finally {
          this.loadingAdvertisers = false
        }
      }
    },
    activateBadWordFilter(commentList) {
      let bad_word_list = ["焦虑", "卷", "屏蔽", "拉黑", "账号", "营销", "账户", "卖", "课", "烦", "讨厌", "不喜欢", "不感兴趣", "骗", "刷到", "推", "挣钱", "矩阵号", "坑人"]
      let filtered_comments = []
      commentList.forEach(item => {
        // 如果 item.text 里包含任意一个敏感词，就加入结果
        const hasBadWord = bad_word_list.some(word => item.text.includes(word))
        if (hasBadWord) {
          filtered_comments.push(item)
        }
      })
      return filtered_comments
    },
    getVideoComment() {
      this.commentGridOptions.loading =true
      let start_date = this.getCommonDate()['today']
      let end_date = this.getCommonDate()['today']
      this.commentCreateStart = start_date
      this.commentCreateEnd = end_date
      if (this.commentDateRange.length > 0) {
        start_date = DateString(new Date(this.commentDateRange[0]))
        end_date = DateString(new Date(this.commentDateRange[1]))
      }
      const params = {
        start_time: start_date,
        end_time: end_date,
        page: this.selectPage,
        page_size: this.selectPageSize,
        need_info: "true",
        order_field: this.commentSortField,
        order_type: this.commentSortOrder
      }
      // 动态添加filters中的字段
      if (this.filters['advertiser_ids'].length === 0) {
        params['advertiser_ids'] = "1846658357848392"
      }
      for (const [key, value] of Object.entries(this.filters)) {
        if (
            Array.isArray(value) ? value.length > 0 : (value !== '' && value !== null && value !== 'ALL')
        ) {
          params[key] = Array.isArray(value) ? value.join(',') : value
        }
      }
      axios.get(`http://47.107.244.209:8967/material/comment/dy/get/`, { params })
          .then(response => {
            if (response.data.code === 1) {
              let commentList = response.data['comment_list']
              if (this.badWordFilter === true) {
                this.commentList = this.activateBadWordFilter(commentList)
              } else {
                this.commentList = commentList
              }
              this.commentPage = response.data['page_info']
            } else {
              this.commentList = []
              console.log('错误')
            }
          }).catch(error => {
            console.log(error)
            this.commentList = []
          }).finally(() => {
            this.commentGridOptions.loading = false
          })
      this.updateTime = DateTimeString(new Date())
    },
    exportCommentList() {
      this.$message.info('正在跳转生成文件，请稍候…')
      let start_date = this.getCommonDate()['today']
      let end_date = this.getCommonDate()['today']
      this.commentCreateStart = start_date
      this.commentCreateEnd = end_date
      if (this.commentDateRange.length > 0) {
        start_date = DateString(new Date(this.commentDateRange[0]))
        end_date = DateString(new Date(this.commentDateRange[1]))
      }
      const params = {
        start_time: start_date,
        end_time: end_date,
        need_info: "true",
        order_field: this.commentSortField,
        order_type: this.commentSortOrder
      }
      // 动态添加filters中的字段
      if (this.filters['advertiser_ids'].length === 0) {
        params['advertiser_ids'] = "1846658357848392"
      }
      for (const [key, value] of Object.entries(this.filters)) {
        if (
            Array.isArray(value) ? value.length > 0 : (value !== '' && value !== null && value !== 'ALL')
        ) {
          params[key] = Array.isArray(value) ? value.join(',') : value
        }
      }
      // 去掉空值
      Object.keys(params).forEach(key => {
        if (
            params[key] === undefined ||
            params[key] === null ||
            params[key] === '' ||
            (Array.isArray(params[key]) && !params[key].length)
        ) {
          delete params[key]
        }
      })
      const query = Object.keys(params)
          .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
          .join('&')
      const url = `http://dashboard1.xiyao888.cn/material/comment/dy/export/?${query}`
      window.open(url)
    },
    setCommentGrid(newList) {
      this.commentGridOptions.data = newList || []
    },
    // 评论勾选
    getSelectComments() {
      const $grid = this.$refs.commentGridRef
      if ($grid) {
        return $grid.getCheckboxRecords()
      }
    },
    // 查看详情
    checkDetail(row) {
      this.selectRow = row
      this.showMaterialDetail = true
      this.getVideoUrl(row['material_id'])
    },
    getVideoUrl(material_id) {
      axios.get(`http://47.107.244.209:8967/material/aliu99/dy/temp_url/get/?material_id=${material_id}`)
          .then(response => {
            if (response.data.temp_url.length > 0) {
              this.selectMaterialDetail = response.data
              this.videoUrl = response.data['temp_url']
              this.selectMaterialCreateTime = response.data['create_time']
              console.log(response.data)
            } else {console.log('错误')}
          })
    },
    handleDrawerClose() {
      // 通过ref访问组件中的video元素
      const videoElement = this.$refs.materialDetail.$refs.videoPlayer
      if (videoElement) {
        videoElement.pause()
        videoElement.currentTime = 0
      }
      this.selectRow = null
    },
    // 回复评论
    async replyComment(advertiser_id, comment_ids, reply_text) {
      try {
        const response = await axios.post(
            `http://47.107.244.209:8967/material/comment_reply/dy/post/`,
            { advertiser_id, comment_ids, reply_text },
        );
        if (response.data.code === 1) {
          return "OK";
        } else {
          return "FAIL"
        }
      } catch (error) {
        console.log(error)
        return "FAIL"
      }
    },
    async openReplyCommentPanel(row) {
      this.replyDialogVisible = true
      this.selectComments.push({
        comment_id: row.comment_id,
        aweme_name: row.aweme_name,
        aweme_id: row.aweme_id,
        text: row.text,
        text_digest: row.text,
        advertiser_id: row.advertiser_id,
      })
      this.selectCommentsCnt = 1
    },
    async openReplyCommentPanelBatch() {
      this.replyDialogVisible = true
      const selectRows = this.getSelectComments()
      if (selectRows.length === 0) {
        this.$message.info("未选中评论")
      } else if (selectRows.length > 20) {
        this.$message.error("选择评论数不得大于20条")
      } else {
        this.selectComments = selectRows.map(item => ({
          comment_id: item.comment_id,
          aweme_name: item.aweme_name,
          aweme_id: item.aweme_id,
          text: item.text,
          text_digest: item.text,
          advertiser_id: item.advertiser_id,
        }))
        this.selectCommentsCnt = this.selectComments.length
      }
    },
    cancelReplyComment() {
      this.replyDialogVisible = false
      this.$message.info("取消回复")
      this.selectComments = []
      this.selectCommentsCnt = 0
    },
    async confirmReplyComment() {
      const advertiser_id = this.selectComments[0].advertiser_id
      const comment_ids = this.selectComments.map(item => item.comment_id)
      const replyText = this.replyText
      if (replyText.length === 0) {
        this.$message.error("回复内容为空")
        return
      }
      this.replyLoading =  true
      let timeoutId
      try {
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("TIMEOUT")), 60000)
        })
        const result = await Promise.race([
          this.replyComment(advertiser_id, comment_ids, replyText),
          timeoutPromise
        ])
        if (result === "OK") {
          this.$message.success("评论回复成功")
          this.replyText = ""
        } else {
          this.$message.error("回复失败")
        }
      } catch (error) {
        if (error.message === "TIMEOUT") {
          this.$message.error("操作超时，请稍后重试")
        } else {
          this.$message.error("回复失败")
        }
      } finally {
        clearTimeout(timeoutId)
        this.replyLoading = false
        this.replyDialogVisible = false
        this.selectComments = []
        this.selectCommentsCnt = 0
      }
    },
    // 隐藏评论
    async hideComment(advertiser_id, comment_ids) {
      try {
        const response = await axios.post(
            `http://47.107.244.209:8967/material/comment_hide/dy/post/`,
            { advertiser_id, comment_ids }
        );
        if (response.data.code === 1) {
          return "OK";
        } else {
          return "FAIL";
        }
      } catch (error) {
        console.error(error);
        return "FAIL";
      }
    },
    async openHideCommentPanel(row) {
      try {
        const h = this.$createElement;
        const result = await confirmWithLoading({
          vm: this,
          title: "隐藏评论",
          message: h("div", null, [
            h("p", null, row.text),
            h("p", { style: "color: #F08080;" }, "隐藏评论后无法恢复"),
          ]),
          onConfirm: () => this.hideComment(row.advertiser_id, row.comment_id),
          timeout: 60000
        });

        if (result === "OK") {
          this.$message.success("评论隐藏成功");
          this.getVideoComment();
        } else {
          this.$message.error("隐藏失败");
        }
      } catch (error) {
        if (error.message === "TIMEOUT") {
          this.$message.error("操作超时，请稍后重试");
        } else if (error.message === "CANCEL") {
          this.$message.info("取消隐藏");
        } else {
          this.$message.error("隐藏失败");
        }
      }
    },
    // 批量隐藏评论
    async openHideCommentPanelBatch() {
      const selectComment = this.getSelectComments();
      if (selectComment.length === 0) {
        this.$message.info("未选中评论")
      } else if (selectComment.length > 20) {
        this.$message.error("选择评论数不得大于20条")
      } else {
        const comment_ids = selectComment.map(item => item.comment_id);
        const advertiser_id = selectComment.map(item => item.advertiser_id)[0];
        const comment_count = selectComment.length
        let comment_digest = ""
        selectComment.forEach(item => {
          if (item.text.length <= 10) {
            comment_digest += item.text
          } else {
            comment_digest += item.text.slice(0, 7)+'...'
          }
          comment_digest += ', '
        })
        try {
          const h = this.$createElement;
          const result = await confirmWithLoading({
            vm: this,
            title: `隐藏${comment_count}条评论`,
            message: h("div", null, [
              h("p", null, comment_digest),
              h("p", { style: "color: #F08080;" }, "隐藏评论后无法恢复"),
            ]),
            onConfirm: () => this.hideComment(advertiser_id, comment_ids),
            timeout: 60000
          });

          if (result === "OK") {
            this.$message.success(`${comment_count}评论隐藏成功`);
            this.getVideoComment();
          } else {
            this.$message.error("隐藏失败");
          }
        } catch (error) {
          if (error.message === "TIMEOUT") {
            this.$message.error("操作超时，请稍后重试");
          } else if (error.message === "CANCEL") {
            this.$message.info("取消隐藏");
          } else {
            this.$message.error("隐藏失败");
          }
        }
      }
    },
    async banUser(advertiser_id, live_room_list, ban_user_ids) {
      try {
        return await axios.post(
            `http://47.107.244.209:8967/material/dy/banned_user/add/post/`,
            {advertiser_id: advertiser_id, live_room_list: live_room_list, aweme_user_ids: ban_user_ids},
        );
      } catch (error) {
        console.log(error)
        return "FAIL"
      }
    },
    async openBanUserPanel(row) {
      this.banUserDialogVisible = true
      this.selectBanUserRow = row
    },
    async showRelatedAwemeList(visible) {
      if (visible && this.relatedAwemeOptions.length === 0) {
        // 第一次点击才加载
        this.loadingRelatedAweme = true
        const advertiser_id = this.selectBanUserRow.advertiser_id
        try {
          const res = await this.getRelatedAweme(advertiser_id)
          if (res.data.code === 1) {
            this.relatedAwemeOptions = res.data['aweme_list'].map(item => ({
              label: item.aweme_nickname,
              value: item.aweme_show_id,
            }))
          } else {
            this.$message.error('加载关联抖音号失败')
          }
        } catch(err) {
          this.$message.error('加载关联抖音号失败')
        } finally {
          this.loadingRelatedAweme = false
        }
      }
    },
    getRelatedAweme(advertiser_id) {
      return axios.get(`http://47.107.244.209:8967/common/dy/advertiser_related_aweme/all/get/`, {params: {advertiser_id}})
    },
    cancelBanUser() {
      this.banUserDialogVisible = false
      //this.$message.info("取消屏蔽")
      this.selectBanUserRow = {}
      this.relatedAwemeOptions = []
      this.selectRelatedAweme = []
    },
    async confirmBanUser() {
      const advertiser_id = this.selectBanUserRow.advertiser_id
      let aweme_ids = []
      if (this.selectRelatedAweme.length === 0) {
        if (this.relatedAwemeOptions.length === 0) {
          const res = await this.getRelatedAweme(advertiser_id)
          if (res.data.code === 1) {
            aweme_ids = res.data['aweme_list'].map(item => item.aweme_show_id)
          }
        } else {
          aweme_ids = this.relatedAwemeOptions.map(item => item.value)
        }
      } else {
        aweme_ids = this.selectRelatedAweme
      }
      if (aweme_ids.length === 0) {
        this.$message.error("暂无选中抖音号")
      }
      this.banUserLoading = true
      let timeoutId
      try {
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("TIMEOUT")), 120000)
        })
        const result = await Promise.race([
          this.banUser(advertiser_id, aweme_ids, this.selectBanUserRow.aweme_id),
          timeoutPromise
        ])
        const h = this.$createElement
        if (result !== "FAIL") {
          let not_available_message = ""
          if (result.data['not_available_room'].length > 0) {
            not_available_message = "无直播抖音号操作权限："+result.data['not_available_room'].join(',')
          }
          if (result.data.code === 1) {
            let success_message = "屏蔽用户成功"
            this.$message({
              type: "success",
              message: h('p', null, [
                  h('p', null, success_message),
                  h('p', null, not_available_message),
              ])
            })
          } else {
            let fail_message = "后端接口屏蔽用户失败"
            if (result.data['fail_list'][0]['message'] === "已重复") {
              fail_message += "重复屏蔽"
            }
            this.$message({
              type: "error",
              message: h('p', null, [
                h('p', null, fail_message),
                h('p', null, not_available_message),
              ])
            })
          }
        } else {
          this.$message.error("接口连接失败")
        }
      } catch (error) {
        if (error.message === "TIMEOUT") {
          this.$message.error("操作超时，请稍后重试")
        } else {
          this.$message.error("屏蔽用户失败："+error.message)
        }
      } finally {
        clearTimeout(timeoutId)
        this.banUserLoading = false
        this.selectBanUserRow = {}
        this.relatedAwemeOptions = []
        this.selectRelatedAweme = []
        this.banUserDialogVisible = false
      }
    }
  },
  mounted() {
    const cache = localStorage.getItem(STORAGE_KEY)
    if (cache) {
      const { password_version } = JSON.parse(cache)

      // 向后端确认：版本还有效吗？
      this.verifyVersion(password_version)
    } else {
      this.accessGranted = false
    }
    this.getVideoComment()
  },
  watch: {
    commentDateRange: function() {
      this.resetPage()
      this.getVideoComment()
    },
    selectPage: function() {
      this.getVideoComment()
    },
    selectPageSize: function() {
      this.getVideoComment()
    },
    badWordFilter(value) {
      if (value === true) {
        this.commentList = this.activateBadWordFilter(this.commentList)
      } else {
        this.getVideoComment()
      }
    },
    filters: {
      handler() {
        this.resetPage()
        this.getVideoComment()
      },
      deep: true
    },
    commentList(newList) {
      this.setCommentGrid(newList)
    }
  }
}
</script>

<style>
.comment-page {
  position: relative;
  min-height: 100%
}

.password-overlay {
  position: absolute;
  inset: 0;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.password-card {
  width: 320px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.password-title {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 16px;
}

.password-row {
  margin-bottom: 10px;
}

.password-error {
  margin-top: 8px;
  font-size: 12px;
  color: #f56c6c;
  text-align: center;
}


.select-with-label {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 6px;
}

.select-label {
  white-space: nowrap;
  margin-right: 5px;
  font-size: 13px;
  color: #606266;
}

.content-header {
  flex-direction: column
}

.update-time {
  float: right;
  display: block;
  white-space: nowrap;
  font-size: 12px;
  color: #8a96a6;
}

/* 控制整个标题区域的高度 */
.material-detail-drawer .el-drawer__header {
  height: 30px; /* 设置你需要的标题高度 */
  padding: 0 20px; /* 根据需要调整内边距 */
  margin-top: 15px;
  margin-bottom: 15px;
}

/* 自定义标题内容的样式 */
.material-detail-drawer .material-detail-drawer-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 40px; /* 与标题高度一致，实现垂直居中 */
  margin: 0;
}

.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%
}

.video-title {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 10px;
}
.video-description {
  font-size: 14px;
  margin: 4px;
}
.video-description-item {
  margin: 10px
}
.video-description-title {
  color: #797f88;
}
.video-description-content {
  color: #333333;
}
</style>