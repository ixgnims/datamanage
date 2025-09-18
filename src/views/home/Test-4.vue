<template>
  <vxe-table
      border
      ref="xTable4"
      height="200"
      :data="tableData">
    <vxe-colgroup title="当日数据">
      <vxe-colgroup title="阿留">
        <vxe-column field="name" title="Name" width="200">
          <template #header>
            <i :class="collapsable1 ? 'vxe-icon-square-minus' : 'vxe-icon-square-plus'" @click="collapsable1Event"></i>
            <span>Name</span>
          </template>
        </vxe-column>
        <vxe-column field="role" title="Role" :visible="false" width="200"></vxe-column>
        <vxe-column field="sex" title="Sex" width="200"></vxe-column>
      </vxe-colgroup>
      <vxe-colgroup>
        <vxe-column field="age" title="Age" width="200">
          <template #header>
            <i :class="collapsable2 ? 'vxe-icon-square-minus' : 'vxe-icon-square-plus'" @click="collapsable2Event"></i>
            <span>Age</span>
          </template>
        </vxe-column>
        <vxe-column field="rate" title="Rate" :visible="false" width="200"></vxe-column>
        <vxe-column field="address" title="Address" :visible="false" width="200"></vxe-column>
      </vxe-colgroup>
    </vxe-colgroup>
  </vxe-table>
</template>

<script>
export default {
  data () {
    return {
      tableData: [
        { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
        { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
        { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
        { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 23, address: 'test abc' },
        { id: 10005, name: 'Test5', role: 'Develop', sex: 'Women', age: 30, address: 'Shanghai' },
        { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 21, address: 'test abc' },
        { id: 10007, name: 'Test7', role: 'Test', sex: 'Man', age: 29, address: 'test abc' },
        { id: 10008, name: 'Test8', role: 'Develop', sex: 'Man', age: 35, address: 'test abc' }
      ]
    }
  },
  methods: {
    collapsable1Event () {
      const fields = ['role']
      this.collapsable1 = !this.collapsable1
      const xTable4 = this.$refs.xTable4
      fields.forEach(field => {
        const column = xTable4.getColumnByField(field)
        column.visible = this.collapsable1
      })
      xTable4.refreshColumn()
    },
    collapsable2Event () {
      const fields = ['rate', 'address']
      this.collapsable2 = !this.collapsable2
      const xTable4 = this.$refs.xTable4
      fields.forEach(field => {
        const column = xTable4.getColumnByField(field)
        column.visible = this.collapsable2
      })
      xTable4.refreshColumn()
    }
  }
}
</script>

<style scoped>

</style>