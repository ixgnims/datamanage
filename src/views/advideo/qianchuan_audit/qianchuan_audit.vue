<template>
  <div ref="auditGridWrapper">
    <!--筛选器-->
    <el-row>
      <el-card></el-card>
    </el-row>
    <!--审核列表-->
    <el-row>
      <el-card style="margin-top:10px">
        <el-row></el-row>
        <el-row>
          <div>
            <vxe-grid ref="auditGridRef" v-bind="auditGridOptions">

            </vxe-grid>
          </div>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "qianchuan_audit",
  data() {
    const auditGridOptions = {
      border: true,
      loading: false,
      size: "mini",
      rowConfig: {
        isHover: true,
        keyField: 'material_id'
      },
      columnConfig: {
        resizable: true,
      },
      columns: [
        {title: '视频信息', width: 150, showOverFlow: 'tooltip', slots: {default: "video_info_default"}},
        {title: '审核建议', field: 'audit_reason', width: 300, showOverFlow: true},
        {title: '优先级', field: 'priority', width: 100, showOverFlow: true},
        {title: '剪辑人', field: 'editor', width: 100, showOverFlow: true},
      ],
      data: []
    }
    return {
      auditGridOptions
    }
  }

}
</script>

<style>

</style>