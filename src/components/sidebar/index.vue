<template>
  <div class="sidebar">
    <Menu theme="light" v-model="selectedName" @on-select="gotoPage">
      <MenuItem :name="item.path" v-for="item in menuList" :key="item.path">
      <svg-icon :icon-class="item.path.slice(1)" class-name="icon"></svg-icon> {{ item.name }}</MenuItem>
    </Menu>
    <br />
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedName: '',
      menuList: []
    }
  },
  mounted() {
    this.menuList = this.$store.getters.menuList
  },
  methods: {
    gotoPage(name) {
      this.$router.push({
        path: name || ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  .ivu-menu-item {
    margin-bottom: 50px;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    color: rgba(100, 105, 116, 1);
    text-align: center;
  }
  .ivu-menu-item > img {
    margin: 0 10px 0 -10px;
    transform: translate(0, 6px);
  }
  .ivu-menu-light:after {
    width: 0 !important;
  }
  .ivu-menu-item-active:not(.ivu-menu-submenu):after {
    background: white;
  }
  .ivu-menu-item-active:not(.ivu-menu-submenu) {
    background: white;
  }
}
</style>
<style lang="scss" scoped>
.sidebar {
  padding-top: 10px;
  margin-top: 10px;
  width: 280px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 4px 0px 4px rgba(122, 122, 122, 0.2);
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 15px;
  }
}
</style>
