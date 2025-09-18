<template>
  <div class="page-container">
    <el-row>
      <span class="demonstration">上传日期</span>
      <el-date-picker
          v-model="dateRange"
          @change="fetchNewVideo"
          type="daterange"
          size="small"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
      </el-date-picker>
      <el-button round size="small" @click="updateQianchuanVideo" :loading="updateQcLoading">更新千川视频库</el-button>
      <el-button round size="small" @click="updateStandardData" :loading="updateStandardLoading">更新标准投流视频</el-button>
      <el-button round size="small" @click="updateUniData" :loading="updateUniLoading">更新全域投流视频</el-button>
      <el-button round size="small" icon="el-icon-s-operation" @click="openFilter">更多筛选</el-button>
      <el-dialog
          width="80%"
          :visible.sync="filterVisible">
        <span slot="title">更多筛选</span>

        <span slot="footer" class="dialog-footer">
              <el-button @click="filterVisible = false">取 消</el-button>
              <el-button type="primary" @click="sendMaterialQuery">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
    <el-row>
      <div v-if="newMaterial.length>0">
        <el-card v-for="(item) in newMaterial"
                 :key="item.material_id"
                 style="margin-bottom:10px">
          <div class="card-content">
            <!--左侧：视频播放器 / 视频封面-->
            <div v-if="item.video_url" class="video-wrapper">
              <video :src="item.video_url"
                     controls
                     style="width:100%; border-radius:6px">
                浏览器不支持video标签
              </video>
            </div>
            <div v-else>
              <el-image :src="item.cover_url"
                        :preview-src-list="[item.cover_url]"
                        style="width: 180px; height: 320px"
                        fit="cover">
              </el-image>
            </div>
            <!--右侧：表单-->
            <div class="form-wrapper">
              <el-form :model="item" :ref="item.material_id" label-width="80px" size="mini">
                <el-form-item label="素材ID" class="form-line"> {{item.material_id}} </el-form-item>
                <el-form-item label="视频标题" class="form-line">
                  <el-input v-model="item.file_title" style="width:100%"></el-input>
                </el-form-item>
                <el-form-item label="选题" class="form-line">
                  <el-autocomplete v-model="item.script_name" :fetch-suggestions="scriptSuggestion" style="width:100%"></el-autocomplete>
                </el-form-item>
                <el-form-item label="拍摄版本" class="form-line">
                  <el-autocomplete v-model="item.shoot_version" :fetch-suggestions="shootSuggestion" @change="extractShootDate(item)" style="width:100%"></el-autocomplete>
                </el-form-item>
                <el-form-item label="剪辑版本" class="form-line">
                  <el-autocomplete v-model="item.edit_version" :fetch-suggestions="editSuggestion" @change="() => {fillPrep(item); extractEditDate(item); extractShootDate(item); extractEditorCode(item)}" style="width:100%"></el-autocomplete>
                </el-form-item>
                <el-form-item label="剪辑师代码" class="form-line">
                  <el-input v-model="item.editor_code" @change="extractEditor(item)" style="width:100%"></el-input>
                </el-form-item>
                <el-form-item label="剪辑师" class="form-line">
                  <el-input v-model="item.editor" style="width:100%"></el-input>
                </el-form-item>
                <el-form-item label="年份" class="form-line">
                  <el-input v-model="item.year"></el-input>
                </el-form-item>
                <el-form-item label="拍摄日期" class="form-line">
                  <el-input v-model="item.shoot_date"></el-input>
                </el-form-item>
                <el-form-item label="剪辑日期" class="form-line">
                  <el-input v-model="item.edit_date"></el-input>
                </el-form-item>
                <el-form-item label="创建日期" class="form-line"> {{item.create_time}}</el-form-item>
                <el-form-item class="form-line">
                  <el-button size="small" @click="resetMaterialInfo(item)">重置</el-button>
                  <el-button size="small" type="primary" @click="updateMaterialInfo(item)" :loading="item.is_loading">提交</el-button>
                </el-form-item>
                <el-form-item v-if="item.update_status" class="form-line">
                  <span :style="{ color: item.update_status.includes('成功') ? '#9ad294' : '#ff98a6' }">
                    {{ item.update_status }}
                  </span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-card>
      </div>
      <div v-else style="padding:20px;color:#b4b4ca;text-align:center">暂无待更新素材</div>
    </el-row>
  </div>
</template>

<script>
import axios from "@/api/axios"
import {DateString, yesterdayDateString, extractDate} from "@/functions/time_function";
export default {
  name: "qianchuan_videoInfoUpdate",
  data() {
    const today = new Date();
    const yesterday = today.setDate(today.getDate() - 1)
    return {
      today,
      yesterday,
      dateRange: "",
      newMaterial: [],
      updateQcLoading: false,
      updateStandardLoading: false,
      updateUniLoading: false,
      scriptSearchTimeOut: null,
      scriptItemList: [],
      shootSearchTimeOut: null,
      shootItemList: [],
      editSearchTimeOut: null,
      editItemList: [],
      filterVisible: false,
      filterOptions: [
        {type: "script_name", label: "选题"},
        {type: "shoot_version", label: "拍摄版本"},
        {type: "edit_version", label: "剪辑版本"}
      ]
    }
  },
  methods: {
    async updateQianchuanVideo() {
      let start_date = yesterdayDateString()
      let end_date = DateString(new Date())
      if (this.dateRange.length > 0) {
        // 若未选择日期，默认日期范围为昨天到今天
        start_date = DateString(this.dateRange[0])
        end_date = DateString(this.dateRange[1])
      }
      this.updateQcLoading = true
      try {
        const res = await axios.get(`http://47.107.244.209:8967/material/script/aliu99/qianchuan_video/update/get/?start_date=${start_date}&end_date=${end_date}`)
        if (res.data.code === 1) {
          this.fetchNewVideo()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.updateQcLoading = false
      }
    },
    async updateStandardData() {
      let start_date = yesterdayDateString()
      let end_date = DateString(new Date())
      if (this.dateRange.length > 0) {
        // 若未选择日期，默认日期范围为昨天到今天
        start_date = DateString(this.dateRange[0])
        end_date = DateString(this.dateRange[1])
      }
      this.updateStandardLoading = true
      try {
        const res = await axios.get(`http://47.107.244.209:8002/api/qianchuan/report/advetiser_material_aweme/all/date/daterange/update_manual/get/?start_date=${start_date}&end_date=${end_date}`)
        if (res.data.code === 1) {
          this.fetchNewVideo()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.updateStandardLoading = false
      }
    },
    async updateUniData() {
      let start_date = yesterdayDateString()
      let end_date = DateString(new Date())
      if (this.dateRange.length > 0) {
        // 若未选择日期，默认日期范围为昨天到今天
        start_date = DateString(this.dateRange[0])
        end_date = DateString(this.dateRange[1])
      }
      this.updateUniLoading = true
      try {
        const res = await axios.get(`http://47.107.244.209:8002/api/qianchuan/report/uni_promotion_ad/video/all/date/daterange/update_manual/get/?start_date=${start_date}&end_date=${end_date}`)
        if (res.data.code === 1) {
          this.fetchNewVideo()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.updateUniLoading = false
      }
    },
    fetchNewVideo() {
      let start_date = yesterdayDateString()
      let end_date = DateString(new Date())
      if (this.dateRange.length > 0) {
        start_date = DateString(this.dateRange[0])
        end_date = DateString(this.dateRange[1])
      }
      axios.get(`http://47.107.244.209:8967/material/script/aliu99/new/material/show/get/?start_date=${start_date}&end_date=${end_date}`)
          .then(response => {
            if (response.data.code === 1) {
              this.newMaterial = response.data['material_list']
              this.newMaterial.forEach(item => {
                this.fillPrep(item)
                this.extractEditDate(item)
                this.extractShootDate(item)
                this.extractEditorCode(item)
                this.extractEditor(item)
              })
            }
          })
    },
    // script_name和shoot_version的预填写
    fillPrep(item) {
      if (item['script_name'].length === 0) {
        item['script_name'] = item['edit_version'].split('+')[0]
      }
      item['shoot_version'] = item['edit_version'].split('+')[0] + '+' +item['edit_version'].split('+')[1]
    },
    // 根据后四位字符串提取拍摄日期和剪辑日期
    extractShootDate(item) {
      let date_str = item.shoot_version.slice(-4)
      item.shoot_date = extractDate(item.year, date_str)

    },
    extractEditDate(item) {
      let lastPlusIndex = item.edit_version.lastIndexOf("+")
      let date_str = item.edit_version.substring(0, lastPlusIndex).slice(-4)
      item.edit_date = extractDate(item.year, date_str)
    },
    // 提取剪辑师和剪辑师代码
    extractEditorCode(item) {
      let code = item.edit_version.includes('+') ? item.edit_version.split('+').pop() : ''
      if (code.length > 0) {
        code = code.replace(/\d+/g, '')
      }
      item.editor_code = code
    },
    extractEditor(item) {
      const editor_map = {
        "QQ": "董琦琪",
        "XL": "刘绚丽",
        "XS": "席莎",
        "LX": "李鑫",
        "GG": "嘎嘎",
        "XML": "熊美玲",
        "wyx": "王雨萱",
        "YX": "王雨萱",
        "QJ": "巫奇津",
        "JJ": "李嘉靖",
        "KY": "胡可屹",
        "ZH": "吴仔豪"
      }
      if (item.editor_code.length > 0) {
        item.editor = editor_map[item.editor_code] || ''
      } else {
        item.editor = ''
      }
    },
    openFilter() {
      this.filterVisible = true
    },
    // 匹配输入建议，远程搜索
    scriptSuggestion(queryString, cb) {
      if (this.scriptSearchTimeOut) {
        clearTimeout(this.scriptSearchTimeOut);
      }
      this.scriptSearchTimeOut = setTimeout(() => {
        if (!queryString) {
          cb([])
          return
        }
        // 向接口发送searchType+queryString
        const searchType = "script_name"
        axios.post(`http://47.107.244.209:8967/material/aliu99/dy/search/post/`, {search_type: searchType, query_item: queryString})
            .then(response => {
              cb(response.data.results)
            }).catch(error => {
          console.log(error);
          cb([]);
        })
      }, 100)
    },
    shootSuggestion(queryString, cb) {
      if (this.shootSearchTimeOut) {
        clearTimeout(this.shootSearchTimeOut);
      }
      this.shootSearchTimeOut = setTimeout(() => {
        if (!queryString) {
          cb([])
          return
        }
        // 向接口发送searchType+queryString
        const searchType = "shoot_version"
        axios.post(`http://47.107.244.209:8967/material/aliu99/dy/search/post/`, {search_type: searchType, query_item: queryString})
            .then(response => {
              cb(response.data.results)
            }).catch(error => {
          console.log(error);
          cb([]);
        })
      }, 100)
    },
    editSuggestion(queryString, cb) {
      if (this.editSearchTimeOut) {
        clearTimeout(this.editSearchTimeOut);
      }
      this.editSearchTimeOut = setTimeout(() => {
        if (!queryString) {
          cb([])
          return
        }
        // 向接口发送searchType+queryString
        const searchType = "edit_version"
        axios.post(`http://47.107.244.209:8967/material/aliu99/dy/search/post/`, {search_type: searchType, query_item: queryString})
            .then(response => {
              cb(response.data.results)
            }).catch(error => {
          console.log(error);
          cb([]);
        })
      }, 100)
    },
    resetMaterialInfo(item) {
      item.script_name = ""
      item.shoot_version = ""
      item.edit_version = ""
    },
    updateMaterialInfo(item) {
      item.is_loading = true
      axios.post(`http://47.107.244.209:8967/material/script/aliu99/new/material/update/post`, {item_dict: item})
          .then(response => {
            item['update_status'] = response.data.message
          })
          .finally(() => {
            item.is_loading = false
          })
    }
  },
  mounted() {
    this.fetchNewVideo()
  }
}
</script>

<style>
.page-container {
  padding: 10px
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.video-wrapper {
  flex: 1;
  max-width: 20%;
}

.form-wrapper {
  flex: 1;
}

.form-line {
  font-size: 10px;
  margin-bottom: 5px
}
</style>