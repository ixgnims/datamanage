<template>
  <div>
    <el-container class="container">
      <!--上方导航栏-->

      <!--下方视图内容-->
      <el-main class="view-main">
        <el-row>
          <router-view />
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    handleSelect(key,keyPath) {
      console.log(key,keyPath);
    }
  }
}

</script>

<style scoped>
.nav-header {
  background-color: #E9EEF3;
  color: #333;
  text-align: center !important;
  padding: 0 !important;
  margin: 0 !important;
}
.view-main {
  padding: 0 !important;
  margin: 0 !important;
}
.el-menu-horizontal {
  width: 35%;
  height: 40px;
  display: flex;
  border: 0;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px;
  margin-top: 0;
  background-color: #E9EEF3;
}
.el-menu-horizontal:hover {
  color: #E9EEF3;
  opacity: 80%;
  filter: drop-shadow(0px 0px 3px #B3C0D1);

}
.el-menu-horizontal .is-active {
  border-bottom: 0 !important;
  background-color: #E9EEF3;
}
.el-menu-item-1 {
  border-radius: 15px !important;
  height: 40px !important;
  display: flex;
  align-items: center;
  margin: 0 !important;
  border: 0 !important;
}
</style>