<template>
  <div class="ly-head" ref="head">
    <div class="title">
      <svg-icon icon-class="logo" class-name="logo"></svg-icon>
      <label>权限管理系统</label>
    </div>
    <div class="user-info">
      <Icon class="icon-admin" type="ios-person" />
      <span class="admin">{{name}}</span>
      <svg-icon icon-class="logout" class-name="logout" @on-click="logout()"></svg-icon>
    </div>
  </div>
</template>
<script>
const name = 'Head'
export default {
  data() {
    return {
      name: sessionStorage.getItem('name')
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('saveSessionId', null)
      this.$store.dispatch('saveToken', null)
      this.$store.dispatch('saveMenu', [])
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.ly-head {
  width: 100%;
  height: 72px;
  background-color: #fff;
  box-shadow: 2px 0px 2px rgba(122, 122, 122, 0.2);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    display: flex;
    align-items: center;
    .logo {
      width: 48px;
      height: 48px;
    }
    label {
      font-size: 24px;
      font-weight: bold;
      margin-left: 20px;
      color: rgba(0, 0, 0, 1);
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    .icon-admin {
      width: 40px;
      border: 1px solid rgba(44, 114, 255, 1);
      border-radius: 50%;
      text-align: center;
      font-size: 30px;
      margin-left: 49px;
    }
    .admin {
      display: inline;
      font-size: 18px;
      font-weight: 400;
      color: rgba(61, 56, 86, 1);
      margin-left: 16px;
      margin-right: 16px;
    }
    .logout {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }
}
</style>
