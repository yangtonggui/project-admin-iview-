<template>
  <div class="ly-content">
    <router-view></router-view>
  </div>
</template>
<script>
const name = 'Content'
export default {
  name
}
</script>

<style lang="scss" scoped>
.ly-content {
  position: relative;
  width: calc(100% - 330px);
  height: calc(100% - 100px);
  overflow: hidden;
  margin-left: 20px;
}
</style>
