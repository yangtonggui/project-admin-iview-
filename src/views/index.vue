<template>
  <div class="container">
    <ly-head></ly-head>
    <div class="content">
      <ly-sidebar></ly-sidebar>
      <ly-content></ly-content>
    </div>
  </div>
</template>
<script>
import LyHead from '@/layout/head.vue'
import LyContent from '@/layout/content.vue'
import LySidebar from '../components/sidebar/index.vue'

export default {
  name: 'Container',
  data() {
    return {}
  },
  components: {
    LyHead,
    LyContent,
    LySidebar
  }
}
</script>

<style lang="scss">
.container {
  .content {
    .title {
      display: flex;
      align-items: center;
      height: 58px;
      font-size: 18px;
    }
    .content {
      background: rgba(255, 255, 255, 1);
      box-shadow:8px 0px 8px rgba(122,122,122,0.2);
      height: 100%;
      padding: 0 30px;
      .btns {
        .btn {
          font-size: 18px;
          font-weight: 400;
        }
      }
    }
   
  }
}
</style>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background: rgba(247, 248, 250, 1);
  .content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
  }
}
</style>

