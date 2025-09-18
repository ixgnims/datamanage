<template>
  <div>
    <div class="filter-group">
      <div class="filter-group-name">评论层级</div>
      <el-radio-group v-model="commentLevel" size="mini" @change="commentLevelChange">
        <el-radio-button v-for="option in commentLevelOptions"
                         :key="option.value"
                         :label="option.value">
          {{option.label}}
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="filter-group">
      <div class="filter-group-name">评论情感</div>
      <el-radio-group v-model="commentEmotion"  size="mini" @change="commentEmotionChange">
        <el-radio-button v-for="option in commentEmotionOptions"
                         :key="option.value"
                         :label="option.value">
          {{option.label}}
        </el-radio-button>
      </el-radio-group>
    </div>
    <div>
      <vxe-grid v-bind="commentGridOptions" @sort-change="commentSortChange">
          <template #hide="{ row }">
            <template v-if="row.hide_status === '未隐藏'">
              <vxe-button
                  mode="text" status="primary" size="mini"
                  @click="hideComment(row)"> {{ row.hide_status }} </vxe-button>
            </template>
            <template v-else>
              <span>{{ row.hide_status }}</span>
            </template>
          </template>
      </vxe-grid>
      <vxe-pager @page-change="handlePageChange" :current-page.sync="commentPage.page"
                 :page-size.sync="commentPage.page_size" :total="commentPage.total_number" size="mini"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "materialComment",
  props: {
    selectMaterialComment: {
      type: Array,
      required: true
    },
    selectMaterialCommentPage: {
      type: Object,
      required: true
    }
  },
  data() {
    const commentGridOptions = {
      border: false,
      size: "mini",
      columnConfig: {
        resizable: true,
      },
      sortConfig: {
        remote: true
      },
      rowStyle ({row}) {
        if (row.hide_status === '已隐藏') {
          return {
            color: '#c6c6c6'
          }
        }
      },
      columns: [
        {field: 'text', title: '评论内容', width: 300, showOverFlow: true,},
        {field: 'hide_status', title: '状态', width: 80, showOverFlow: true, slots: {default: 'hide'}, align: "center"},
        {field: 'emotion_type', title: '情感', width: 80, showOverFlow: true},
        {field: 'level_type', title: '层级', width: 80, showOverFlow: true},
        {field: 'like_count', title: '点赞数', width: 80, showOverFlow: true, sortable: true},
        {field: 'reply_count', title: '回复数', width: 80, showOverFlow: true, sortable: true},
        {field: 'create_time', title: '评论时间', width: 150, showOverFlow: true, sortable: true},
      ],
      data: [],
    }
    return {
      commentGridOptions,
      commentPage: {
        page: 1,
        page_size: 10,
        total_number: 0,
        total_page: 1,
      },
      commentLevel: "LEVEL_ONE",
      commentLevelOptions: [
        {label: "全部", value: "LEVEL_ALL"},
        {label: "一级", value: "LEVEL_ONE"},
        {label: "二级", value: "LEVEL_TWO"}
      ],
      commentEmotion: "ALL",
      commentEmotionOptions: [
        {label: "全部", value: "ALL"},
        {label: "正向", value: "POSITIVE"},
        {label: "中性", value: "NEUTRAL"},
        {label: "负向", value: "NEGATIVE"}
      ]
    }
  },
  methods: {
    setMaterialCommentTable() {
      this.commentGridOptions.data = this.selectMaterialComment
      this.commentPage.total_number = this.selectMaterialCommentPage.total_number
      this.commentPage.total_page = this.selectMaterialCommentPage.total_page
    },
    handlePageChange({currentPage, pageSize}) {
      this.commentPage.page = currentPage
      this.commentPage.pageSize = pageSize
      this.$emit('change-commentPage', currentPage)
      this.$emit('change-commentPageSize', pageSize)
    },
    commentLevelChange(level) {
      this.commentLevel = level
      this.$emit('change-commentLevel', level)
    },
    commentEmotionChange(emotion) {
      this.commentEmotion = emotion
      this.$emit('change-commentEmotion', emotion)
    },
    commentSortChange({ field, order }) {
      this.$emit('change-commentSortField', field)
      this.$emit('change-commentSortOrder', order)
    }
  },
  mounted() {
    this.setMaterialCommentTable()
  },
  watch: {
    selectMaterialComment: function() {
      this.setMaterialCommentTable()
    },
    selectMaterialCommentPage: function() {
      this.setMaterialCommentTable()
    },
  }
}
</script>

<style>
.filter-group {
  margin-bottom: 5px;
}
.filter-group-name {
  font-size: 14px
}
</style>