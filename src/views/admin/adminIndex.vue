<template>
  <div>
    <el-container>
      <!--左侧导航-->
      <adminMenu />
      <el-container>
        <!--右侧主体-->
        <!--头部-->
        <el-header class="admin-header">管理后台</el-header>
        <!--主体-->
        <el-main class="admin-main"><router-view /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AdminMenu from "@/views/admin/adminMenu.vue";
export default {
  data(){
    return {

    }
  },
  methods: {

  },
  components: {
    AdminMenu,
  }
}
</script>


<style scoped>
.admin-header {
  background-color: #cad1e8;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: left;
  line-height: 200px;
  position: fixed;
  width: auto;
  height: 100vh;
  top: 0;
  left: 0;
}

.admin-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  height: 100vh
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>