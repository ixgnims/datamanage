<template>
  <div class="page-container">
    <el-row>
      <el-button round size="small" @click="updateAweme" :loading="updateAwemeLoading">更新管理抖音号</el-button>
      <el-button round size="small" @click="updateAwemeAdvertiser" :loading="updateAwemeAdvertiserLoading">更新抖音号广告账户关联</el-button>
    </el-row>
    <el-row>
      <div style="float:left; display:block; white-space:nowrap; margin-bottom:5px; position:sticky; top:0; z-index:1000; background:#fff;">
        <el-input
            class="inline-input"
            v-model="queryItem"
            placeholder="请输入内容"
            size="small">
          <el-select v-model="searchType" slot="prepend" class="selectType" size="small" placeholder="全部" style="width:100px">
            <el-option
                v-for="item in searchOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="fetchDyAweme" slot="append" icon="el-icon-search" size="small"></el-button>
        </el-input>
      </div>
    </el-row>
    <el-row>
      <el-checkbox v-model="onlyUnnamed">仅筛选未命名账号</el-checkbox>
    </el-row>
    <el-row>
      <div v-if="awemeList.length>0">
        <el-card v-for="(item) in awemeList"
                 :key="item.aweme_id"
                 style="margin-bottom:10px">
          <div class="card-content">
            <div class="form-wrapper">
              <el-form :model="item" :ref="item.aweme_id" label-width="80px" size="mini">
                <el-form-item label="id" class="form-line"> {{item.aweme_id}} </el-form-item>
                <el-form-item label="显示id" class="form-line"> {{item.aweme_show_id}} </el-form-item>
                <el-form-item label="账号名" class="form-line"> {{item.aweme_name}} </el-form-item>
                <el-form-item label="内部名称" class="form-line">
                  <el-input v-model="item.aweme_nickname" style="width:100%"></el-input>
                </el-form-item>
                <el-form-item label="归属" class="form-line">
                  <el-input v-model="item.room" style="width:100%"></el-input>
                </el-form-item>
                <el-form-item label="状态" class="form-line">
                  <el-input v-model="item.status" style="width:100%"></el-input>
                </el-form-item>
                <el-form-item class="form-line">
                  <el-button size="small" type="primary" @click="updateAwemeInfo(item)" :loading="item.is_loading">提交</el-button>
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
    </el-row>
  </div>
</template>

<script>
import axios from "@/api/axios"
export default {
  name: "dy_aweme_update",
  data() {
    return {
      updateAwemeLoading: false,
      updateAwemeAdvertiserLoading: false,
      awemeList: [],
      // 搜索框
      searchType: "aweme_name",
      searchOptions: [
        {value: 'aweme_id', label: "id"},
        {value: 'aweme_show_id', label: "显示id"},
        {value: 'aweme_name', label: "账号名"},
        {value: 'aweme_nickname', label: "内部名称"},
        {value: "room", label: "归属"},
        {value: "status", label: "状态"},
        {value: "advertiser_name", label: "广告账户"}
      ],
      queryItem: '',
      onlyUnnamed: true,
    }
  },
  methods: {
    async updateAweme() {
      this.updateAwemeLoading = true
      try {
        const res = await axios.get(`http://47.107.244.209:8002/api/qianchuan/aweme/update_manual`)
        if (res.data.length > 0) {
          this.fetchDyAweme()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.updateAwemeLoading = false
      }
    },
    async updateAwemeAdvertiser() {
      this.updateAwemeAdvertiserLoading = true
      try {
        const res = await axios.get(`http://47.107.244.209:8002/api/qianchuan/aweme_advertiser/update_manual`)
        if (res.data.length > 0) {
          this.fetchDyAweme()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.updateAwemeAdvertiserLoading = false
      }
    },
    fetchDyAweme() {
      const params = {
        search_type: this.searchType,
        query_item: this.queryItem,
        only_unnamed: this.onlyUnnamed,
      }
      axios.get(`http://47.107.244.209:8967/dashboard/any/dy/live/aweme_list/get/`, { params })
          .then(response => {
            if (response.data.code === 1) {
              this.awemeList = response.data['aweme_list']
            }
          })
    },
    updateAwemeInfo(item) {
      item.isloading = true
      console.log(item)
      axios.post(`http://47.107.244.209:8967/dashboard/any/dy/aweme_info/update/post/`, { item_dict: item })
          .then(response => {
            item['update_status'] = response.data.message
          }).finally(() => {
            item.is_loading = false
          })
    }
  },
  mounted() {
    this.fetchDyAweme()
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