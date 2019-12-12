<template>
  <div class="title">
    <svg-icon icon-class="logo" class-name="logo"></svg-icon>
    <font style="color:#16f3d9; font-size: 40px; padding:0 15px; font-weight: bold;">&sdot;</font>
    <span class="logo-text">
      {{logoText}}
    </span>
  </div>
</template>

<script>
export default {
  name: 'g-title',
  props: {
    logoText: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  padding: 35px 0 10px 30px;
  display: flex;
  align-items: center;
  .logo {
    width: 144.96px;
    height: 38.27px;
  }
  .logo-text {
    text-align: left;
    font-size: 25px;
    display: inline-block;
    background-image: -webkit-gradient(linear, 0 0, right 0, from(#16f3d9), to(#3fa9f5));
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
