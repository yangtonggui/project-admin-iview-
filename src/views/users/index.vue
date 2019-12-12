<template>
  <div class="person">
    <div class="title">用户管理</div>
    <div class="content">
      <div class="search-form">
        <label>用户名</label>
        <i-input class="ipt_name" v-model="searchData.userName" placeholder="请输入" :maxlength="15" />
        <label>角色</label>
        <Select v-model="searchData.roleId" clearable class=" ipt_name">
          <Option v-for="item in rolesList" :value="item.roleId" :key="item.roleId">{{ item.nameZh }}</Option>
        </Select>
        <label>部门</label>
        <Cascader :data="departmentData" change-on-select v-model="searchData.deptIds" class="ipt_name inputstyle"></Cascader>
        <div class="btns">
          <i-button class="btn" type="primary" @click="search">确认</i-button>
          <i-button class="btn btn_add" @click="showModal(null)">新增用户</i-button>
        </div>
      </div>

      <!-- 表格列表 -->
      <div class="list">
        <Table :columns="userstitle" :data="datalist">
          <template slot-scope="{ row }" slot="userName">
            <span class="rowhead">{{ row.userName }}</span>
          </template>
          <template slot-scope="{ row }" slot="action">
            <svg-icon icon-class="alter" class-name="alter listBtn" @on-click="showModal(row)"></svg-icon>
            <svg-icon icon-class="delete" class-name="delete listBtn" @on-click="remove(row)"></svg-icon>
          </template>
        </Table>
        <div class="page">
          <Page :total="total" show-total :page-size="7" show-elevator @on-change="changePage" />
        </div>
      </div>
    </div>
    <!-- 模态框部分 -->
    <Modal v-model="modalVisible" :title="title" class="modal person-modal" footer-hide>
      <p>
        <label class="form-label">姓 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</label>
        <i-input v-model="editItem.userRealName" placeholder="请输入" class="ipt" :maxlength="5" />
        <label class="form-label">所属部门</label>
        <Cascader :data="departmentData" v-model="editItem.deptIds" change-on-select class="ipt" :render-format="formatDept"></Cascader>
      </p>
      <p>
        <label class="form-label">用 户 名</label>
        <i-input @on-blur="userRepeat" v-model="editItem.userName" placeholder="请输入" class="ipt ipt_name" ref="ipt_userName" :maxlength="15" />
        <label class="form-label">用户密码</label>
        <Input type="password" v-model="editItem.userPassword" placeholder="****" class="ipt ipt_name" />
      </p>
      <p>
        <label class="form-label">角色授权</label>
        <i-select v-model="editItem.roleIds" clearable filterable multiple class="ipt ipt_name">
          <Option v-for="item in rolesList" :value="item.roleId" :key="item.roleId">{{ item.nameZh }}</Option>
        </i-select>
        <span style="margin:40px" class="form-label">状态启用</span>
        <template>
          <Radio-group class="form-label form-button" type="button" v-model="editItem.isEnable">
            <Radio label="1">是</Radio>
            <Radio class="btn-lf" label="0">否</Radio>
          </Radio-group>
        </template>
      </p>
      <div class="btns">
        <i-button class="btn" type="primary" @click="confirmModal">确认</i-button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'User',
  data() {
    return {
      departmentData: [],
      title: '',
      modalVisible: false,
      userstitle: [
        {
          title: '用户名',
          slot: 'userName',
          width: 200,
          height: '200px'
        },
        {
          title: '姓名',
          key: 'userRealName'
        },
        {
          title: '部门',
          key: 'departmentName'
        },
        {
          title: '角色',
          key: 'roleStr'
        },
        {
          title: '最后登录时间',
          key: 'lastLoginTime'
        },
        {
          title: '状态',
          key: 'isEnable',
          render: (h, params) => {
            const row = params.row
            const text = row.isEnable == 1 ? '是' : '否'
            if (row.isEnable) {
              return h('span', { style: { color: '#69C638' } }, text)
            } else {
              return h('span', { style: { color: '#FF5622' } }, text)
            }
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      total: 0,
      rolesList: [],
      departmentList: [],
      datalist: [], //获取数据列表
      editItem: {
        id: '',
        userName: '', //姓名
        userRealName: '', //用户名
        userPassword: '', //用户密码
        isEnable: '', //用户是否可以启用
        deptIds: [],
        roleIds: []
      },
      option: 'save', //是新增或修改
      searchData: {
        currentPage: 1, //当前页
        deptIds: [],
        userName: '',
        roleId: ''
      },

      isUserRepeat: false
    }
  },
  computed: {
    appId() {
      return this.$store.getters.appId
    }
  },
  mounted() {
    this.searchRoles()
    this.searcDepartment()
    this.search()
  },
  methods: {
    formatDept(lable) {
      return lable[lable.length - 1] || this.editItem.departmentName
    },
    validateForm() {
      if (!this.editItem.userRealName) {
        this.$Message.error('用户名称不可为空')
        return false
      }
      if (!this.editItem.userName) {
        this.$Message.error('姓名不可为空')
        return false
      }
      if (this.option === 'save' && !this.editItem.userPassword) {
        this.$Message.error('用户密码不可为空')
        return false
      }
      if (!this.editItem.deptIds || !this.editItem.deptIds.length) {
        this.$Message.error('部门不可为空')
        return false
      }
      if (!this.editItem.roleIds) {
        this.$Message.error('角色授权不可为空')
        return false
      }
      if (!this.editItem.isEnable) {
        this.$Message.error('状态启用未选择')
        return false
      }
      return true
    },
    userRepeat() {
      this.$http.post('/user/searchUserName ', { userName: this.editItem.userName, appId: this.appId }).then(response => {
        this.isUserRepeat = response.data.data
        if (this.isUserRepeat) {
          this.$Message.error('该用户已存在')
          this.$refs['ipt_userName'].focus()
        }
      })
    },
    //迭代 (函数自调用)
    getChildren(dept) {
      dept['value'] = dept.pid
      dept['label'] = dept.name
      if (dept.children && dept.children.length) {
        dept.children.forEach(child => {
          child['value'] = child.pid
          child['label'] = child.name
          if (child.children && child.children.length) {
            this.getChildren(child)
          }
        })
      }
    },
    searcDepartment() {
      this.departmentData = []
      this.$http.post('/department/listTree', { appId: this.appId }).then(response => {
        if (response.data.code == 200) {
          let dept = response.data.data
          this.getChildren(dept)
          // dept['value'] = dept.pid
          // dept['label'] = dept.name
          this.departmentData.push(dept)
        }
      })
    },
    searchRoles() {
      this.$http
        .post('/role/list', {
          startPage: '1',
          size: '1',
          appId: this.appId
        })
        .then(response => {
          if (response.data.code == 200) {
            let list = response.data.data.list
            let rolesList = []
            if (list && list.length) {
              list.forEach(roleItem => {
                rolesList.push({ roleId: roleItem.id, nameZh: roleItem.nameZh })
              })
            }
            this.rolesList = rolesList
          }
        })
    },
    showModal(data, index) {
      this.modalVisible = true
      this.title = data ? '修改用户' : '新增用户'
      this.option = data ? 'edit' : 'save'
      this.editItem = data ? { ...data } : {}
      if (this.editItem.departmentId) {
        this.editItem.deptIds = []
        this.editItem.deptIds.push(this.editItem.departmentId)
      }

      if (this.editItem.roles && this.editItem.roles.length) {
        this.editItem.roleIds = this.editItem.roles.map(item => item.id)
      }
    },
    //新增或修改
    confirmModal() {
      if (this.isUserRepeat) {
        return
      } else if (this.validateForm()) {
        this.option === 'save' ? this.add() : this.update()
      }
    },
    //分页
    changePage(page) {
      this.searchData.currentPage = page
      this.search()
    },
    //增
    add() {
      this.$http
        .post('/user/save', {
          ...this.editItem,
          appId: this.appId,
          departmentId: this.editItem.deptIds[this.editItem.deptIds.length - 1]
        })
        .then(response => {
          this.$Message.success('新增成功')
          this.modalVisible = false
          this.search()
        })
    },
    //删
    remove(data, index) {
      this.$Modal.confirm({
        title: '确定删除',
        onOk: () => {
          this.$http.post('/user/delete', { id: data.id, appId: this.appId }).then(response => {
            this.$Message.success('删除成功')
            this.search()
          })
        },
        onCancel: () => {}
      })
    },
    //改
    update(index) {
      this.$http
        .post('/user/edit', {
          ...this.editItem,
          appId: this.appId,
          departmentId: this.editItem.deptIds[this.editItem.deptIds.length - 1]
        })
        .then(response => {
          this.$Message.success('修改成功')
          this.modalVisible = false
          this.search()
        })
    },
    // 查
    search() {
      this.$http
        .post('/user/search', {
          ...this.searchData,
          appId: this.appId,
          startPage: this.searchData.currentPage,
          departmentId: this.searchData.deptIds[this.searchData.deptIds.length - 1] || ''
        })
        .then(response => {
          console.log(111)
          let respdata = response.data.data
          this.datalist = respdata.list
          this.total = respdata.total
          this.datalist.forEach(item => {
            let roleStr = ''
            if (item.roles) {
              item.roles.forEach(item => {
                roleStr += item.nameZh + ','
              })
              roleStr = roleStr.substr(0, roleStr.length - 1)
            }
            item['roleStr'] = roleStr
          })
        })
        .catch(function name(params) {
          console.log(2222)
        })
    }
  }
}
</script>
<style lang="scss">
.person {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .search-form {
    padding-top: 30px;
    label {
      font-size: 18px;
      height: 40px;
      margin-right: 10px;
    }
    .ipt_name {
      width: 252px;
      height: 40px;
      margin-right: 13%;
      display: inline-block;
    }
    .inputstyle {
      display: inline-block;
      width: 252px;
    }
    .btns {
      text-align: center;
      margin: 50px 0 40px 0;
      .btn {
        margin-left: 80px;
        height: 40px;
        width: 144px;
      }
    }
  }
  .list {
    .page {
      margin-top: 20px;
      text-align: center;
    }
    .ivu-table th,
    .ivu-table-cell {
      text-align: center;
    }
    .listBtn {
      transform: translate(3px, 0);
    }
  }
}
</style>
<style lang="scss" scoped>
.person-modal {
  .ipt {
    display: inline-block;
    width: 252px;
  }
  label {
    margin: 40px;
  }
  .form-button {
    height: 0;
    transform: translate(-51px, -60px);
  }
  .btn-lf {
    transform: translate(-49px, 0);
  }
}
</style>
