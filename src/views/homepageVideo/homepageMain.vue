<template>
  <div class="layout-container">
    <!--左侧固定导航栏-->
    <el-aside class="aside-fixed" width="120px">
      <el-menu :default-active="$route.path"
               mode="vertical"
               router
               :collapse="isCollapse"
               class="el-menu-vertical">
        <div class="menu-logo">
          <img src="@/assets/aliu_logo.png" alt="xhs_logo">
        </div>
        <el-submenu index="/homepageVideo/dy">
          <template slot="title">抖音主页</template>
          <el-menu-item :index="{ path: '/homepageVideo/dy', query: { section: 'main' } }">
            主号
          </el-menu-item>
          <el-menu-item :index="{ path: '/homepageVideo/dy', query: { section: 'seven' } }">
            99直播7号
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/homepageVideo/xhs">
          <span slot="title">小红书主页</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!--主体-->
    <div class="main-scroll">
      <el-main class="home-main">
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script>
export default {
  name: "homepageMain",
  data() {
    return {
      isCollapse: false,
    }
  },
  methods: {

  },
  watch: {}
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
  width: 100%;       /* 按比例缩放 */
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