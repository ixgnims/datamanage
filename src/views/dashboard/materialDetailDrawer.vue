<template>
  <el-row class="drawer-content">
    <!--视频基础信息-->
    <el-col class="material-basic" :span="6">
      <el-card class="video-container" :body-style="{ padding: '0px' }">
        <video
            ref="videoPlayer"
            :src="videoUrl"
            controls
            style="width: 100%;">
          您的浏览器不支持视频播放
        </video>
        <div class="video-title"> {{selectMaterialDetail.filename}} </div>
      </el-card>
      <div class="video-description">
        <div v-for="(item, index) in videoDescriptionItems" :key="index" class="video-description-item">
          <div class="video-description-title">{{ item.title }}</div>
          <div class="video-description-content">{{ item.content }}</div>
        </div>
      </div>
    </el-col>
    <!--评论，历史审核信息等-->
    <el-col class="material-detail" :span="18">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick" style="margin-left:15px;margin-right:15px">
        <el-tab-pane label="评论列表" name="comment">
          <materialComment :selectMaterialComment="selectMaterialComment"
                           :selectMaterialCommentPage="selectMaterialCommentPage"
                           @change-commentPage="commentPageChange" @change-commentPageSize="commentPageSizeChange"
                           @change-commentLevel="commentLevelChange" @change-commentEmotion="commentEmotionChange"
                           @change-commentSortField="commentSortFieldChange" @change-commentSortOrder="commentSortOrderChange"/>
        </el-tab-pane>
        <el-tab-pane label="审核记录" name="audit"></el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import materialComment from "./materialComment";
export default {
  name: "materialDetailDrawer",
  components: {
    materialComment,
  },
  props: {
    selectRow: {
      type: Object,
      required: false
    },
    selectMaterialDetail: {
      type: Object,
      required: true
    },
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
    return {
      activeTab: "comment",
      videoUrl: ""
    }
  },
  computed: {
    videoDescriptionItems() {
      return [
        { title: "选题", content: this.selectRow?.script_name || "--" },
        { title: "拍摄版本", content: this.selectRow?.shoot_version || "--" },
        { title: "剪辑版本", content: this.selectRow?.edit_version || "--" },
        { title: "上传时间", content: this.selectMaterialDetail?.create_time || "--" },
        { title: "时长", content: this.selectMaterialDetail?.duration ? `${this.selectMaterialDetail.duration}秒` : "--" },
      ]
    }
  },
  methods: {
    loadMaterialDetail() {
      this.videoUrl = this.selectMaterialDetail['temp_url']
    },
    handleTabClick() {

    },
    commentPageChange(current_page) {
      this.$emit('change-commentPage', current_page)
    },
    commentPageSizeChange(page_size) {
      this.$emit('change-commentPageSize', page_size)
    },
    commentLevelChange(level) {
      this.$emit('change-commentLevel', level)
    },
    commentEmotionChange(emotion) {
      this.$emit('change-commentEmotion', emotion)
    },
    commentSortFieldChange(field) {
      this.$emit('change-commentSortField', field)
    },
    commentSortOrderChange(order) {
      this.$emit('change-commentSortOrder', order)
    }
  },
  mounted() {
    this.loadMaterialDetail()
  },
  watch: {
    selectMaterialDetail: function() {
      this.loadMaterialDetail()
    }
  }
}
</script>


<style>
.drawer-content {
  padding: 20px;
  margin-top: 0;
}
.material-basic {
  margin-bottom: 0
}
.material-detail {
  margin-bottom: 0px;
}
.drawer-item-title {
  margin-bottom: 10px;
  margin-top: 0;
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