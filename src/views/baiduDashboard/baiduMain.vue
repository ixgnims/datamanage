<template>
  <div class="layout-container">
    <!--左侧固定导航栏-->
    <el-aside class="aside-fixed" width="120px">
      <el-menu :default-active="$route.path"
               router
               class="el-menu-vertical">
        <div class="menu-logo">
          <img src="@/assets/baidu_logo.png" alt="baidu_logo">
        </div>
        <el-menu-item index="/baidu/dashboard/live">
          <span slot="title">直播报表</span>
        </el-menu-item>
        <el-menu-item index="/baidu/dashboard/video">
          <span slot="title">视频报表</span>
        </el-menu-item>
        <el-menu-item index="/baidu/dashboard/advertiser">
          <span slot="title">账户报表</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <div class="main-scroll">
      <el-main class="home-main">
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script>
export default {
  name: "baiduMain",
  components: {
  },
  watch: {

  }
}
</script>

<style>

.layout-container {
  display: flex;
  height: 100vh; /* 让页面满屏 */
  overflow: hidden;
}

.aside-fixed {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  background-color: #fff;
  border-right: 1px solid #ebeef5;
}

.menu-logo {
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-logo img {
  height: auto;      /* 按比例缩放 */
  width: 70%;       /* 按比例缩放 */
  display: block;
}

.main-scroll {
  margin-left: 120px; /* 留出aside宽度 */
  flex: 1;
  height: 100vh;
  overflow-y: auto;
}

.el-menu-vertical {
  height: 100%;
  border-right: none;
}

.home-main {
  padding: 20px;
  background-color: #f6fafd;
  min-height: 100%;
  box-sizing: border-box;
}

</style>