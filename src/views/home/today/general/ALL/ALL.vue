<template>
  <div>
    <el-row>
      <div>
        <component :is="item" v-for="item in allComponents" :key="item"
                   style="padding-bottom: 8px" />
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allComponents: ['ALiuAll','DaiJieAll','XiaoMingAll','YiFeiAll','REMEAll']
    }
  },
  components: {
    ALiuAll: ()=>import("@/views/home/today/general/ALL/ALiu/ALiuAll.vue"),
    DaiJieAll: ()=>import("@/views/home/today/general/ALL/DaiJie/DaiJieAll.vue"),
    YiFeiAll: ()=>import("@/views/home/today/general/ALL/YiFei/YiFeiAll.vue"),
    XiaoMingAll: ()=>import("@/views/home/today/general/ALL/XiaoMing/XiaoMingAll.vue"),
    REMEAll: ()=>import("@/views/home/today/general/ALL/REME/REMEAll.vue")
  }
}
</script>


<style scoped>

</style>