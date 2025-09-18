<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="header">
        <el-row>
          <el-col :span="4" style="text-align: left; font-size: 15px; font-weight: bold">抖音广告数据</el-col>
        </el-row>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="日期范围">
          <el-col :span="10">
            <el-date-picker type="date" placeholder="开始日期" v-model="form.start_date" size="small"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="10">
            <el-date-picker placeholder="结束时间" v-model="form.end_date" size="small"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="直播间">
          <el-checkbox-group v-model="form.room">
            <el-checkbox label="全部" name="type"></el-checkbox>
            <el-checkbox label="阿留" name="type"></el-checkbox>
            <el-checkbox label="戴洁" name="type"></el-checkbox>
            <el-checkbox label="小铭" name="type"></el-checkbox>
            <el-checkbox label="Reme" name="type"></el-checkbox>
            <el-checkbox label="楠姐" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="update_dy_mkt_date">开始更新</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

import axios from "@/api/axios";

export default {
  name: "dyMkt",
  data() {
    return {
      form: {
        start_date: '',
        end_date: '',
        room: [],
      }
    }
  },
  methods: {

    update_dy_mkt_date() {
      var start = this.form.start_date.toLocaleDateString('zh-CN',{year: 'numeric', month: '2-digit', day: '2-digit'}).replaceAll('/','-');
      var end = this.form.end_date.toLocaleDateString('zh-CN',{year: 'numeric', month: '2-digit', day: '2-digit'}).replaceAll('/','-');
      axios.post(`/admin/dy/mkt/update/all/date/`, {start_date: start, end_date: end})
          .then(response => {
            console.log(response)
            if (response.data.msg === "success") {
              this.$message({
                message: "抖音广告数据更新完成！",
                type: 'success'
              })
            }
          })
    },
    update_dy_live_date() {
      axios.post(`/admin/dy/live/update/all/date/`, {start_date: '2024-05-21', end_date: '2024-05-29'})
          .then(response => {
            console.log(response)
          })
    },
  },
  mounted() {

  },
}
</script>

<style scoped>

</style>