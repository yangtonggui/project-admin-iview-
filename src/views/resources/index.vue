<template>
  <div class="resources">
    <div class="title">资源管理</div>
    <div class="content">
      <div class="header">
        <template>
          <Modal class="modal res-modal" v-model="modal1" title="新增资源" footer-hide>
            <p>
              <label class="form-label">资源名称</label>
              <i-input type="text" v-model="self.permissionName" class="ipt" autocomplete="off" :maxlength="maxlength"/>
              <label class="form-label">父级名称</label>
              <i-input type="text" :value="fatherroot.nickName" disabled class="ipt-disable"/>
            </p>
            <p>
              <label class="form-label">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址</label>
              <i-input type="text" v-model="self.url" class="ipt" autocomplete="off" :maxlength="maxlength"/>
              <label class="form-label">状态启用</label>
              <Radio-group type="button" v-model="self.permissionIsEnable">
                <Radio value="启用" :label="1">是</Radio>
                <Radio value="禁用" :label="0">否</Radio>
              </Radio-group>
            </p>
            <div class="btns">
              <i-button class="btn" type="primary" @click="create">确认</i-button>
            </div>
          </Modal>
          <Modal class="modal res-modal" v-model="modal2" title="修改资源" footer-hide>
            <p>
              <label class="form-label">资源名称</label>
              <i-input type="text" v-model="self.permissionName" class="ipt" autocomplete="off" :maxlength="maxlength"/>
              <label class="form-label">父级名称</label>
              <Cascader class="ipt-cascader" v-model="self.parentId" :data="parentdata" change-on-select :placeholder="fatherroot.nickName"></Cascader>
            </p>
            <p>
              <label class="form-label">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址</label>
              <i-input type="text" v-model="self.url" class="ipt" autocomplete="off" :maxlength="maxlength"/>
              <label class="form-label">状态启用</label>
              <Radio-group v-model="self.permissionIsEnable" type="button">
                <Radio value="启用" :label="1">是</Radio>
                <Radio value="禁用" :label="0">否</Radio>
              </Radio-group>
            </p>
            <div class="btns">
              <i-button class="btn" type="primary" @click="edit">确认</i-button>
            </div>
          </Modal>
        </template>
      </div>
      <div class="resmenu">
        <i-menu accordion>
          <template>
            <submenu name="root">
              <template slot="title">
                <svg-icon icon-class="folder" class-name="folder"></svg-icon>
                <a>{{ resourcesdata.nickName }}</a>
                <svg-icon icon-class="add" class-name="add" @on-click="add(resourcesdata)"></svg-icon>
              </template>
              <template>
                <submenu v-for="(item, index1) in resourcesdata.children" :key="index1" :name="index1">
                  <template slot="title">
                    <svg-icon icon-class="folder" class-name="folder"></svg-icon>
                    <a>{{ item.nickName }}</a>
                    <svg-icon icon-class="add" class-name="add" @on-click="add(item)"></svg-icon>
                    <svg-icon icon-class="alter_green" class-name="alter_green" @on-click="update(resourcesdata,item)"></svg-icon>
                    <svg-icon icon-class="delete_red" class-name="delete_red" @on-click="remove(item)"></svg-icon>
                  </template>
                  <menuItem v-for="(items, index2) in item.children" :key="index2" :name="items + ''">
                  <svg-icon icon-class="txt" class-name="txt"></svg-icon>
                  <a>{{ items.nickName }}</a>
                  <svg-icon icon-class="alter_green" class-name="alter_green" @on-click="update(item,items)"></svg-icon>
                  <svg-icon icon-class="delete_red" class-name="delete_red" @on-click="remove(items)"></svg-icon>
                  </menuItem>
                </submenu>
              </template>
            </submenu>
          </template>
        </i-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { Menu, MenuItem, Submenu, Button, Modal, Radio, RadioGroup, Cascader } from 'iview'
import { parse } from 'path'
import { stringify } from 'querystring'
const reg = /^$|(\/\w){1,3}/
export default {
  name: 'container',
  data() {
    return {
      maxlength: 30,
      modal1: false,
      modal2: false,
      fatherroot: {
        nickName: ''
      },
      self: {
        appId: sessionStorage.getItem('appId'),
        permissionId: '',
        permissionName: '',
        url: '',
        permissionIsEnable: '',
        permissionIsMenu: 1,
        parentId: []
      },
      /* 状态选择的数据 */
      state: [
        {
          value: 'on',
          label: '启用'
        },
        {
          value: 'off',
          label: '禁用'
        }
      ],
      resourcesdata: [
        {
          nickName: '',
          children: ''
        }
      ],
      parentdata: []
    }
  },
  components: {
    iMenu: Menu,
    MenuItem,
    Submenu,
    Modal,
    Radio,
    Cascader,
    RadioGroup: RadioGroup
  },
  mounted() {
    this.selectresources()
  },
  methods: {
    selectresources() {
      this.parentdata = [{ label: '根节点', value: 1, children: [] }]
      let appId = sessionStorage.getItem('appId')
      this.$http.post('/permission/list', { appId: appId }).then(response => {
        if (response.data && response.data.data) {
          this.resourcesdata = response.data.data.data
          let resourceslist = Object.values(response.data.data.data.children)
          resourceslist.forEach(cascadervalue => {
            this.parentdata[0].children.push({ label: cascadervalue.nickName, value: cascadervalue.id })
          })
        }
      })
    },
    add(father) {
      this.self = {
        appId: sessionStorage.getItem('appId'),
        permissionId: '',
        permissionName: '',
        url: '',
        permissionIsEnable: '',
        permissionIsMenu: 1,
        parentId: []
      }
      this.modal1 = true
      this.self.parentId = father.id
      this.fatherroot.nickName = father.nickName
      this.self.permissionIsEnable = 0
    },
    create() {
      var result = reg.test(this.self.url)
      if ( this.self.permissionIsEnable === undefined || !this.self.permissionName) {
        this.$Message.warning('资源名称，状态启用均不能为空')
      } else if (!result) {
        this.$Message.warning('你输入的地址不正确,地址中必须含有/')
      } else {
        this.$http.post('/permission/save', this.self).then(response => {
          this.selectresources()
          this.modal1 = false
          this.$Message.success('添加成功')
        })
      }
    },
    update(father, self) {
      this.modal2 = true
      this.fatherroot.nickName = father.nickName
      this.self.permissionName = self.nickName
      this.self.url = self.url
      this.self.permissionId = self.id
      this.self.permissionIsEnable = self.isEnable
    },
    edit() {
      var result = reg.test(this.self.url)
      if (!this.self.permissionName || this.self.permissionIsEnable === undefined || !this.self.parentId) {
        this.$Message.warning('资源名称，父级名称，状态启用均不能为空')
      } else if (!result) {
        this.$Message.warning('你输入的地址不正确,地址中必须含有/')
      } else {
        this.self.parentId = this.self.parentId[this.self.parentId.length - 1]
        this.$http.post('/permission/edit', this.self).then(response => {
          this.selectresources()
          this.modal2 = false
          this.$Message.success('修改成功')
        })
      }
    },
    remove(self) {
      let appId = self.appId
      let permissionId = self.id
      this.$Modal.confirm({
       title: '确定删除',
       onOk: () => {
          this.$http.post('/permission/delete', { appId: appId, permissionId: permissionId }).then(response => {
          this.selectresources()
          this.$Message.success('删除成功')
        })
       }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.resources {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.content {
  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(#b6e6ff, #409eff);
    border-radius: 5px;
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
}
.res-modal {
  .ipt {
    width: 253px;
    height: 40px;
    margin-right: 160px;
  }
  .ipt-disable{
    width:253px;
    height: 40px;
  }
  .ipt-cascader{
    width:253px;
    height: 40px;
    display: inline-block;
  }
}
/* menu的样式 */
.resmenu {
  margin-top: 3px;
  margin-left: 40px;
  box-sizing: border-box;
  .add,
  .alter_green,
  .delete_red,
  .folder,
  .txt {
    margin-right: 14px;
    width: 18px;
    height: 18px;
  }
  a {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 22px;
    color: rgba(34, 34, 34, 1);
    margin-right: 21px;
  }
  /deep/ .ivu-menu-submenu-title {
    width: auto;
    white-space: nowrap;
  }
  /deep/ .ivu-menu-item {
    width: auto;
    white-space: nowrap;
  }
  /* menu总体的右边框 */
  .ivu-menu-vertical.ivu-menu-light:after {
    background: transparent;
  }
  /* 一级菜单左测箭头图标位置 */
  /deep/ .ivu-menu:nth-child(1) .ivu-menu-submenu-title > i {
    margin-right: 90%;
    color: #666;
  }
  /* 二级菜单左测箭头图标位置 */
  /deep/ .ivu-menu:nth-child(2) .ivu-menu-submenu-title > i {
    margin-right: 80%;
    color: #666;
  }
  /* 二级菜单左侧边框的样式 */
  /deep/ .ivu-menu:nth-child(2) .ivu-menu-submenu-title:after {
    content: '';
    display: block;
    width: 2px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 290px;
    background: transparent;
  }
  /* 三级菜单左侧边框的样式 */
  .ivu-menu-item:after {
    content: '';
    display: block;
    width: 2px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 320px;
    background: transparent;
  }
  /* 三级菜单当前选中的左侧边框样式 */
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after {
    right: 320px;
    background: transparent;
  }
  /* 三级菜单当前选中的背景色 */
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    background: transparent;
    z-index: 2;
  }
}
</style>
