<template>
  <div class="callback-page">
    <h3>第三方授权回调</h3>
    <p>请复制下方链接，谢谢！</p>
    <div>{{this.fullUrl}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullUrl: ''
    }
  },
  created() {
    this.fullUrl = window.location.href
  }
}
</script>