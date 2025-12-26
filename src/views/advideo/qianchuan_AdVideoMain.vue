<template>
  <div>
    <div class="layout-container">
      <!--左侧固定导航栏-->
      <el-aside class="aside-fixed" width="120px">
        <el-menu :default-active="$route.path"
                 router
                 class="el-menu-vertical">
          <div class="menu-logo">
            <img src="@/assets/qc_logo.png" alt="qc_logo">
          </div>
          <el-menu-item index="/AdVideo/qianchuan_video">
            <span slot="title">视频看板</span>
          </el-menu-item>
          <el-menu-item index="/AdVideo/qianchuan_audit">
            <span slot="title">视频审核</span>
          </el-menu-item>
          <el-menu-item index="/AdVideo/qianchuan_comment">
            <span slot="title">评论管理</span>
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
  </div>
</template>

<script>
export default {
  name: "qianchuan_AdVideoMain"
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
  width: 80%;       /* 按比例缩放 */
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