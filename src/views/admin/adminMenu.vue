<template>
  <div>
    <el-aside width="auto">
      <el-menu
          default-active="this.$route.path"
          router
          class="fixed-menu"
          @open="handleOpen" @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
        <el-menu-item index="/index">
          <i class="el-icon-arrow-left"></i>
          <span slot="title">返回</span>
        </el-menu-item>
        <el-menu-item>
          <template class="title">
            <span slot="title">API授权码</span>
          </template>
        </el-menu-item>
        <!--有子类-->
        <el-submenu index="1">
          <template class="title">
            <span slot="title">账户信息</span>
          </template>
          <el-menu-item index="1-1">广告账户</el-menu-item>
          <el-menu-item index="1-2">直播账户</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template class="title">
            <span slot="title">数据更新</span>
          </template>
          <el-menu-item index="/admin/marketing">广告数据</el-menu-item>
          <el-menu-item index="2-2">直播数据</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>
.fixed-menu {
  width: 210px;
  height: 100vh;
  top: 0;
  left: 0;
}

.title {
  font-size: 13px;
}

</style>