<template>
  <div class="login">
    <div class="title">
      <svg-icon icon-class="login_white" class-name="logo"></svg-icon>
      <h1 style="font-size: 28px; font-weight: 500; display: inline-block">权限管理系统</h1>
    </div>
    <div class="info">
      <svg-icon icon-class="loginlogo_bulue" class-name="loginlogo_bulue"></svg-icon>
      <h1 style="color:#333333;font-size:30px;font-weight:500; margin:0 auto; width:180px; border-bottom: 2px solid rgba(112,112,112,1);padding-bottom: 8px;

        ">权限管理系统</h1>
      <div class="prompt">
        <svg-icon icon-class="login_portrait" class-name="infologo"></svg-icon>
        <Input placeholder="账号" style="width: 80% ;height:40px" name="id" v-model="name" value="id" />
        <p class="line"></p>
      </div>
      <div class="prompt">
        <svg-icon icon-class="login_lock" class-name="infologo"></svg-icon>
        <Input type="password" @keyup.enter.native="subbtn" placeholder="密码" style="width: 80% ;height:40px;  " name="password" v-model="password" />
        <p class="line"></p>
      </div>
      <div class="prompt submit" v-on:click="subbtn">登录</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      name: '',
      password: ''
    }
  },
  methods: {
    subbtn() {
      if (!this.name) {
        this.$Message.error('账号不能为空')
      }
      if (!this.password) {
        this.$Message.error('密码不能为空')
      } else if (this.name && this.password) {
        global.Http.post(`${global.config.url.login}/auth/login`, {
          name: this.name,
          password: this.password
        })
          .then(response => {
            if (response.data.code == 500) {
              this.$Message.error('账号或密码错误')
              return
            }
            let resData = response.data.data
            if (resData) {
              if (resData.sessionId && resData.token) {
                this.$store.dispatch('saveSessionId', resData.sessionId)
                this.$store.dispatch('saveToken', resData.token)
                let menulist = []
                let userDetail = resData.userDetail
                let appId = userDetail.appId
                let name = userDetail.name
                this.$store.dispatch('saveAppId', appId)
                this.$store.dispatch('saveName', name)
                if (userDetail.role && userDetail.role.length) {
                  userDetail.role.forEach(roleItem => {
                    if (roleItem.permissions && roleItem.permissions.length) {
                      roleItem.permissions.forEach(permission => {
                        menulist.push({ path: permission.url, name: permission.nickName })
                      })
                    }
                  })
                }
                this.$store.dispatch('saveMenu', menulist)

                if (menulist && menulist.length) {
                  this.$router.push(menulist[0].path)
                }
              }
            }
          })
          .catch(error => {})
      }
    }
  }
}
</script>
<style lang="scss">
.logo {
  width: 50px !important;
  height: 50px !important;
  margin-right: 20px;
}
.login {
  .ivu-input {
    font-size: 24px;
  }
  input::-webkit-input-placeholder {
    font-size: 24px;
    font-weight: 400;
    line-height: 29px;
    color: rgba(179, 179, 179, 1);
  }
  .ivu-input-wrapper,
  .ivu-input-default {
    background: transparent !important ;
    border: none !important ;
    outline: medium !important ;
  }
  .ivu-input:focus {
    outline: none;
    border: none;
    box-shadow: 0 0 0 2px transparent;
  }
}
</style>
<style lang="scss" scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(38, 66, 152, 1);
  color: rgba(255, 255, 255, 1);
  background: url('../../assets/images/login/1x/bgc.png');
  background-size: 100% 100%;
  .title {
    padding: 80px 0 0 90px;
  }
  .line {
    width: 95%;
    height: 0px;
    border: 1px solid rgba(204, 204, 204, 1);
  }
  .content {
    position: absolute;
    bottom: 180px;
    left: 230px;
    text-align: right;
  }
  .info {
    position: absolute;
    top: 42px;
    right: 2.81%;
    width: 29%;
    height: 91%;
    background: rgba(255, 255, 255, 1);
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    .loginlogo_bulue {
      width: 54px;
      height: 66px;
      margin: 150px auto 26px;
    }
    .infologo {
      width: 30px;
      height: 30px;
      transform: translate(0, -6px);
    }
  }
  .prompt {
    width: 80%;
    text-align: left;
    height: 60px;
    margin: 56px auto;
  }
  .submit {
    cursor: pointer;
    margin-top: 105px;
    font-size: 30px;
    font-weight: 500;
    line-height: 60px;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    background: linear-gradient(90deg, rgba(57, 106, 226, 1) 0%, rgba(18, 97, 255, 1) 100%);
    box-shadow: 0px 4px 5px rgba(2, 2, 3, 0.75);
  }
}
</style>
