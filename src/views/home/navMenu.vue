<template>
  <div>
    <el-aside width="auto">
      <el-menu :default-active="this.$route.path"
               router
               class="el-menu-vertical"
               @open="handleOpen" @close="handleClose"
               :collapse="isCollapse">
        <div :title="isCollapse ? '点击展开' : '点击收起'" class="box_bgd" @click="isC">
          <!-- 点击展开收起导航和切换对应图标 -->
          <i :class="!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
        </div>
        <!--无子类-->
        <el-menu-item index="/index">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <!--有子类-->
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-data-line"></i>
            <span slot="title">今日数据</span>
          </template>
          <el-menu-item index="/today/general/All">总览</el-menu-item>
          <el-menu-item index="2-2">投流</el-menu-item>
          <el-menu-item index="2-3">直播</el-menu-item>
        </el-submenu>
        <!--有子类-->
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-s-data"></i>
            <span slot="title">往期分析</span>
          </template>
          <el-menu-item index="/analysis/live/ALiu">直播分析</el-menu-item>
          <el-menu-item index="3-2">待定</el-menu-item>
          <el-menu-item index="3-3">待定</el-menu-item>
        </el-submenu>
        <!--有子类-->
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span slot="title">数据报表</span>
          </template>
          <el-menu-item index="/report/marketing">投流</el-menu-item>
          <el-menu-item index="4-2">直播</el-menu-item>
          <el-menu-item index="/report/video">视频</el-menu-item>
        </el-submenu>
        <!--无子类-->
        <el-menu-item index="/admin/index">
          <i class="el-icon-s-custom"></i>
          <span slot="title">管理后台</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    isC() {
      this.isCollapse = !this.isCollapse;
    }
  }
}
</script>

<style>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
  text-align: left;
}
.el-menu-vertical{
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100vh;
  top: 0;
  left: 0;
}
.box_bgd {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>