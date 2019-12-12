<template>
  <div class="application">
    <!-- 应用管理 -->
    <div class="title">应用管理</div>
    <!-- 内容部分 -->
    <div class="content">
      <!-- 搜索表单 -->
      <div class="search-form">
        <label class="form-label">名称</label>
        <i-input class="ipt" v-model="formItem.appNameZh" :maxlength="10" />
        <label class="form-label">创建日期</label>
        <DatePicker
          class="ipt"
          type="date"
          format="yyyy-MM-dd"
          placeholder="全部日期"
          v-model="formItem.createTime"
        ></DatePicker>
        <div class="btns">
          <i-button class="btn" type="primary" @click="search">确认</i-button>
          <i-button class="btn btn_add" @click="showModal(null)">新增应用</i-button>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="list">
        <Table :columns="tabletitle" :data="datalist">
          <template slot-scope="{ row }" slot="appNameZh">
            <span>{{ row.appNameZh }}</span>
          </template>
          <template slot-scope="{ row }" slot="appUrl">
            <Poptip
              word-wrap
              width="280"
              transfer
              trigger="hover"
              placement="right-end"
              :content="row.appUrl"
            >
              <span>{{ row.appUrl }}</span>
            </Poptip>
          </template>
          <template slot-scope="{ row }" slot="action">
            <svg-icon icon-class="alter" class-name="alter" @on-click="showModal(row)"></svg-icon>
          </template>
        </Table>
        <div class="page">
          <Page
            :total="total"
            :page-size="7"
            show-elevator
            :current="currentPage"
            @on-change="changePage"
          />
        </div>
      </div>
    </div>
    <Modal v-model="modalVisible" :title="title" class="modal app-modal" footer-hide>
      <p>
        <label class="form-label">应用名称</label>
        <i-input
          v-model="editItem.appNameZh"
          class="ipt"
          style="margin-right:180px;"
          :maxlength="10"
        />
        <label class="form-label">管理员</label>
        <i-input v-model="editItem.userName" class="ipt" :maxlength="15" />
      </p>
      <p>
        <label class="form-label">应用地址</label>
        <i-input class="ipt-addr" type="url" v-model="editItem.appUrl" :maxlength="100" />
      </p>
      <div class="btns">
        <i-button class="btn" type="primary" @click="confirmModal">确认</i-button>
      </div>
    </Modal>
  </div>
</template>
<script>
const name = 'applications'
const reg = /^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w-.,@?^=%&:/~+#]*[\w-@?^=%&/~+#])?$/
export default {
  name: 'Applications',
  data() {
    return {
      option: 'save',
      modalVisible: false,
      tabletitle: [
        {
          title: '名称', //名称
          slot: 'appNameZh',
          align: 'center'
        },
        {
          title: '管理员', //管理员
          key: 'userName',
          align: 'center'
        },
        {
          title: '地址', //地址
          // key: 'appUrl',
          slot: 'appUrl',
          align: 'left',
          ellipsis: true
        },
        {
          title: '创建日期', //创建日期
          key: 'createTime',
          align: 'center'
        },
        {
          title: '操作', //操作
          slot: 'action',
          align: 'center'
        }
      ],
      /* 当前页 */
      currentPage: 1,
      total: 0,
      /* 查询app数据列表 */
      datalist: [],
      formItem: {
        appNameZh: '',
        createTime: '',
        startPage: 1
      },
      editItem: {
        appNameZh: '',
        appUrl: '',
        userName: ''
      },
      title: ''
    }
  },
  mounted() {
    this.currentPage = 1
    this.search()
  },
  methods: {
    initEditItem() {
      this.editItem = {
        appNameZh: '',
        appUrl: '',
        userName: '',
        createTime: '',
        startPage: 1
      }
    },
    showModal(data) {
      this.modalVisible = true
      this.title = data ? '修改应用' : '增加应用'
      this.option = data ? 'edit' : 'save'
      this.editItem = { ...data } || {
        appNameZh: '',
        appUrl: '',
        userName: ''
      }
    },
    confirmModal() {
      if (this.option === 'save') {
        this.create()
      } else {
        this.edit()
      }
    },
    //添加
    create() {
      this.formItem.appNameZh = ''
      this.formItem.createTime = ''
      var result = reg.test(this.editItem.appUrl)
      if (!this.editItem.appNameZh || !this.editItem.appUrl || !this.editItem.userName) {
        this.$Message.warning('应用名称，应用地址，管理员名称均不能为空')
      } else if (!result) {
        this.$Message.warning('你输入的应用地址不正确')
      } else {
        this.$http.post('/user/searchUserName', { appId: sessionStorage.getItem('appId'), userName: this.editItem.userName }).then(response => {
          if (response.data.data) {
            this.$Message.warning('管理员名称已存在')
            return false
          } else {
            this.$http.post('/app/save', this.editItem).then(response => {
              if (response.data.code == '200') {
                this.$Message.success('添加应用成功')
                this.search()
                this.initEditItem()
                this.modalVisible = false
              }
            })
          }
        })
      }
    },
    //修改
    edit() {
      var result = reg.test(this.editItem.appUrl)
      if (!this.editItem.userName || !this.editItem.appUrl || !this.editItem.appNameZh) {
        this.$Message.warning('管理员名称,应用地址,应用名称均不能为空')
      } else if (!result) {
        this.$Message.warning('你修改后的的应用地址不正确')
      } else {
        this.$http.post('/app/edit', this.editItem).then(response => {
          if (response.data.code == '200') {
            this.$Message.success('修改应用成功')
            this.search()
            this.modalVisible = false
            this.initEditItem()
          }
        })
      }
    },
    //分页
    changePage(page) {
      this.currentPage = page
      this.search()
    },
    //搜索
    search() {
      if (this.formItem.createTime !== '') {
        this.formItem.createTime = new Date(this.formItem.createTime).toLocaleDateString()
      }
      if (this.formItem.appNameZh || this.formItem.createTime) {
        if (this.currentPage) {
          this.formItem.startPage = this.currentPage
        } else {
          this.formItem.startPage = 1
        }
      } else {
        this.formItem.startPage = this.currentPage
      }
      // console.log(this.formItem.startPage)
      this.$http.post('/app/search', { ...this.formItem }).then(response => {
        if (response.data && response.data.data) {
          let respData = response.data.data
          this.total = respData.total
          this.datalist = respData.list
           this.initEditItem()
        }
      })
    }
  }
}
</script>
<style lang="scss">
.application {
  .list .ivu-table .ivu-table-header th {
    text-align: center;
  }
}
</style>
<style lang="scss" scoped>
.application {
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
.app-modal {
  .ipt {
    width: 252px;
    height: 40px;
  }
  .ipt-addr {
    width: 750px;
  }
}
</style>
