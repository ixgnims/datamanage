<template>
  <div>
    <el-container>
      <!--左侧导航-->
      <NavMenu />
      <el-container>
        <!--右侧主体-->
        <!--头部-->
        <el-header class="header">Header</el-header>
        <!--主体-->
        <el-main class="home-main"><router-view /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import NavMenu from './navMenu.vue'
export default {
  data(){
    return {

    }
  },
  methods: {

  },
  components: {
    NavMenu
  }
}
</script>


<style scoped>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.header {
  width: auto;
}
.home-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  width: auto;
  height: auto;
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