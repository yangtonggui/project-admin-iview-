<template>
  <!--  角色管理 -->
  <div class="role">
    <div class="title">角色管理</div>
    <div class="content">
      <div class="search-form">
        <label class="form-label">名称</label>
        <i-input
          class="ipt"
          type="text"
          v-model="formItem.nameZh"
          @keyup.enter.native="search"
          :maxlength="10"
        />
        <label class="form-label">状态</label>
        <i-select
          class="ipt"
          placeholder="全部状态"
          v-model="formItem.isEnable"
          @keyup.enter.native="search"
          clearable
        >
          <i-option
            v-for="(item,index) in stateList"
            :value="item.value"
            :key="index"
          >{{ item.label }}</i-option>
        </i-select>
        <div class="btns">
          <i-button class="btn" type="primary" @click="search">确认</i-button>
          <i-button class="btn btn_add" @click="showModal(null)">新增角色</i-button>
        </div>
      </div>
      <!--  表格部分 -->
      <div class="list">
        <Table :columns="tabletitle" :data="datalist">
          <template slot-scope="{ row }" slot="nameZh">
            <span>{{ row.nameZh }}</span>
          </template>
          <template slot-scope="{ row }" slot="permissionStr">
            <Poptip
              word-wrap
              width="200"
              transfer
              trigger="hover"
              placement="right-start"
              :content="row.permissionStr"
            >
              <span>{{ row.permissionStr }}</span>
            </Poptip>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <svg-icon icon-class="alter" class-name="alter" @on-click="showModal(row)"></svg-icon>
            <svg-icon icon-class="delete" class-name="delete" @on-click="remove(index)"></svg-icon>
          </template>
        </Table>
        <!-- 分页 -->
        <div class="page">
          <Page
            :page-size="7"
            :total="total"
            show-elevator
            :current="currentPage"
            @on-change="changePage"
          />
        </div>
      </div>
    </div>
    <!-- 角色模态框 -->
    <Modal class="modal role-modal" v-model="modalVisible" :title="title" footer-hide closable>
      <p>
        <label class="form-label">角色名称</label>
        <i-input v-model="editItem.nameZh" class="ipt" style="margin-right:180px;" :maxlength="8" />
      </p>
      <p>
        <label class="form-label">角色描述</label>
        <i-input v-model="editItem.description" class="ipt ipt-desc" :maxlength="40" />
      </p>
      <p>
        <label class="form-label">分配资源</label>
        <template>
          <!-- <cascaderMulti
            class="ipt ipt-casc"
            multiple
            :data="parentdata"
             change-on-select
            :placeholder="editItem.permissionStr"
            v-model="editItem.permissions"
            :filterable="false"
          ></cascaderMulti>-->
          <Select v-model="editItem.permissions" style="width:200px" class="ipt ipt-casc" multiple>
            <OptionGroup :label="item.nickName" v-for="item in permissionList" :key="item.id">
              <Option
                v-for="child in item.children "
                :value="child.id"
                :key="child.id"
              >{{ child.nickName }}</Option>
            </OptionGroup>
          </Select>
        </template>
        <label class="form-label">状态启用</label>
        <template>
          <Radio-group v-model="editItem.isEnable" type="button">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
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
import { Table, Modal, Button, Select, Option, Radio, RadioGroup } from 'iview'
const name = 'role'
export default {
  name: 'Role',
  data() {
    return {
      modalVisible: false,
      formItem: {
        nameZh: '',
        isEnable: '',
        appId: '',
        startPage: 1
      },
      /* 当前页 */
      currentPage: 1,
      total: 0,
      option: 'save',
      title: '',
      stateList: [
        {
          value: '1',
          label: '启用'
        },
        {
          value: '0',
          label: '关闭'
        }
      ],
      tabletitle: [
        {
          title: '名称', //名称
          slot: 'nameZh',
          align: 'center'
        },
        {
          title: '描述', //描述
          key: 'description',
          align: 'center'
        },
        {
          title: '分配资源', //分配资源
          slot: 'permissionStr',
          align: 'center',
          ellipsis: true
        },
        {
          title: '状态', //角色的状态
          key: 'isEnable',
          align: 'center',
          render: (h, params) => {
            // return h('div', [h('span', params.row.isEnable === 1 ? '是' : '否')])
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
          title: '操作', //操作
          slot: 'action',
          align: 'center'
        }
      ],
      datalist: [],
      editItem: {
        appId: '',
        id: '',
        nameZh: '',
        description: '',
        isEnable: 0,
        permissions: [],
        permissionStr: '',
        startPage: 1
      },
      temp: {},
      permissionList: []
    }
  },
  components: {
    Modal,
    iButton: Button,
    iSelect: Select,
    iOption: Option,
    Radio,
    RadioGroup: RadioGroup
  },
  mounted() {
    this.currentPage = 1
    this.search()
    this.selectresources()
  },
  computed: {
    appId() {
      return this.$store.getters.appId
    }
  },
  methods: {
    initEditItem() {
      this.editItem = {
        nameZh: '',
        description: '',
        isEnable: 0,
        permissions: [],
        permissionStr: '',
        startPage: 1
      }
    },
    selectresources() {
      this.$http.post('/permission/list', { appId: this.appId }).then(response => {
        // console.log(response.data.data)
        if (response.data && response.data.data) {
          this.permissionList = response.data.data.data.children
        }
      })
    },
    showModal(data) {
      this.modalVisible = true
      this.title = data ? '修改角色' : '增加角色'
      this.option = data ? 'edit' : 'save'
      this.editItem.isEnable = 0
      this.editItem = { ...data } || {
        nameZh: '',
        description: '',
        isEnable: 0,
        permissions: [],
        permissionStr: ''
      }
    },
    confirmModal() {
      if (this.option === 'save') {
        this.create()
      } else {
        this.edit()
      }
    },
    //删除
    remove(index) {
      this.editItem = this.datalist[index]
      this.$Modal.confirm({
        title: '确定删除',
        onOk: () => {
          this.$http.post('/role/delete', { appId: this.appId, id: this.editItem.id }).then(response => {
            if (response.data.code == '200') {
              this.$Message.success('删除角色成功')
              this.search()
            }
          })
        },
        onCancel: () => {}
      })
    },
    //添加
    create() {
      this.formItem.nameZh = ''
      this.formItem.isEnable = ''
      if (!this.editItem.nameZh) {
        this.$Message.warning('角色名称不能为空')
      } else {
        this.$http.post('/role/save', { ...this.editItem, appId: this.appId }).then(response => {
          if (response.data.code == '200') {
            this.$Message.success('创建角色成功')
            this.search()
            this.initEditItem()
            this.modalVisible = false
          }
        })
      }
    },

    //修改
    edit() {
      if (!this.editItem.nameZh) {
        this.$Message.warning('角色名称不能为空')
      } else {
        Promise.all([
          this.$http.post('/role/edit', { ...this.editItem, appId: this.appId }),
          this.$http.post('/role/allocate', { appId: this.appId, roleId: this.editItem.id, permissions: this.editItem.permissions })
        ]).then(responses => {
          console.log(responses)
          if (responses[0].data.code == '200' || responses[1].data.code == '200') {
            this.$Message.success('修改角色成功')
            this.search()
            this.modalVisible = false
            this.initEditItem()
          }
        })
      }
    },
    //搜索
    search() {
      if (this.formItem.appNameZh || this.formItem.createTime) {
        if (this.currentPage) {
          this.formItem.startPage = this.currentPage
        } else {
          this.formItem.startPage = 1
        }
      } else {
        this.formItem.startPage = this.currentPage
      }
      this.$http
        .post('/role/search', {
          ...this.formItem,
          appId: this.appId
        })
        .then(response => {
          if (response.data && response.data.data) {
            let respData = response.data.data
            this.total = respData.total
            // console.log('total',respData.total)
            this.datalist = respData.list.filter(item => item.roleName.indexOf('_ADMIN') < 0)
            this.datalist.forEach(item => {
              let permissionStr = ''
              item.permissions.forEach((permission, index) => {
                permissionStr += permission.nickName + (index % 2 === 0 ? '\t' : '\r\n')
              })
              item['permissionStr'] = permissionStr
            })
          }
        })
    },
    //分页
    changePage(page) {
      this.currentPage = page
      this.search()
    }
  }
}
</script>

<style lang="scss" scoped>
.role-modal {
  .ipt {
    width: 252px;
    height: 40px;
  }
  .ipt-desc {
    width: 750px;
  }
  .ipt-casc {
    display: inline-block;
    margin-right: 10%;
  }
}
.role {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .search-form {
    padding-top: 30px;
    .ipt {
      width: 252px;
      height: 40px;
      margin-right: 20%;
    }
    .btns {
      text-align: center;
      margin: 50px 0 40px 0;
      .btn {
        margin-left: 80px;
      }
    }
  }
}
</style>