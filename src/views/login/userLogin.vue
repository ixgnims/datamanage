<template>
  <div class="login">
    <p>数据管理</p>
    <el-row>
      <el-button round @click="submitForm">进入</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
    submitForm(){
      this.$router.push({path:'/home'})
    }
  }
}
</script>