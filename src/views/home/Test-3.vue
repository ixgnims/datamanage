<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="日期范围">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="开始日期" v-model="form.start_date" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker placeholder="结束时间" v-model="form.end_date" style="width: 100%;"></el-date-picker>
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
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  name: "AliuDyMktChart",
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
      axios.post(`/admin/dy/mkt/update/all/date/`, {start_date: this.form.start_date, end_date: this.form.end_date})
          .then(response => {
            console.log(response)
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

<style lang="css" scoped>

</style>