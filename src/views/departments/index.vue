<template>
  <div class="department">
    <div class="title">部门管理</div>
    <div class="content">
      <div class="search-form">
        <label class="form-label">部门名称</label>
        <i-input  class="ipt_name form-input" placeholder="全部部门" v-model="searchName" :maxlength="maxlength" @keyup.enter.native="search()"/>
        <label class="form-label">状态</label>
        <i-select class="ipt_state" placeholder="全部状态" v-model="searchState" clearable @keyup.enter.native="search()">
          <i-option
            v-for="(item, index) in state"
            :key="index"
            :value="item.value"
          >{{ item.label }}</i-option>
        </i-select>
        <div class="btns">
          <i-button class="btn" type="primary" @click="search()">确认</i-button>
          <i-button class="btn  btn_add" @click="showModal(null)">新增部门</i-button>
        </div>
      </div>
      <div class="list">
        <Table class="departmentstable" :columns="tabletitle" :data="departmentsdata" v-if="departmentsdata.parentId !== null">
        <template slot-scope="{ row }" slot="name">
          <span>{{ row.name }}</span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <svg-icon v-if="row.parentId !== null" icon-class="alter" class-name="alter" @on-click="showModal(row)"></svg-icon>
          <svg-icon v-if="row.parentId !== null" icon-class="delete" class-name="delete" @on-click="remove(row)"></svg-icon>
        </template>
        </Table>
        <div class="page">
          <Page :total="total" :page-size="7" show-elevator :current="currentPage" @on-change="changePage"/>
        </div>
      </div>
      <Modal class="modal dpt-modal" v-model="modalVisible" :title="title" footer-hide>
        <p>
        <label class="form-label">部门名称</label>
        <i-input type="text" v-model="editdata.name" class="ipt" autocomplete="off" :maxlength="maxlength"/>
        <label class="form-label">父级部门</label>
        <Cascader class="ipt-cascader"
          :data="parentDepartment"
          change-on-select
          :placeholder="editdata.parentName"
          v-model="editdata.parentId"
        ></Cascader>
        </p>
        <p>
        <label class="form-label">编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码</label>
        <i-input type="text" v-model="editdata.code" class="ipt" autocomplete="off" :maxlength="maxlength"/>
        <label class="form-label">状态启用</label>
        <template>
          <Radio-group type="button" v-model="editdata.isEnable">
            <Radio :label="1" value="是">是</Radio>
            <Radio :label="0" value="否">否</Radio>
          </Radio-group>
        </template>
        </p>
        <div class="btns">
          <i-button class="btn" type="primary" @click="confirmModal">确认</i-button>
        </div>
      </Modal>
    </div>
   
  </div>
</template>
<script>
const reg = /^[0-9]*$/
export default {
  name: 'Department',
  data() {
    return {
      maxlength: 30,
      searchName: '',
      searchState: '',
      radio: 'on',
      total: 0,
      modalVisible: false,
      options: true,
      state: [
        {
          value: '1',
          label: '启用'
        },
        {
          value: '0',
          label: '禁用'
        }
      ],
      tabletitle: [
        {
          title: '部门',
          align: 'center',
          slot: 'name'
        },
        {
          title: '父级部门',
          align: 'center',
          key: 'parentName'
        },
        {
          title: '编码',
          align: 'center',
          key: 'code'
        },
        {
          title: '状态',
          align: 'center',
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
          align: 'center'
        }
      ],
      departmentsdata: [
        {
          pid: '',
          name: '',
          userNum: '',
          appId: sessionStorage.getItem('appId'),
          parentName: '',
          parentId: '',
          code: '',
          isEnable: '',
          startPage: this.currentPage
        }
      ],
      editdata: {},
      parentDepartment: [],
      currentPage: 1,
      title: ''
    }
  },
 /*  computed: {
    appId() {
      return sessionStorage.getItem('appId')
    }
  }, */
  mounted: function() {
    this.listTree()
    this.search()
  },
  methods: {
    search() {
      if (this.searchName || this.searchState) {
        if(this.currentPage){
          this.currentPage = this.currentPage
        }else{
          this.currentPage = 1
        }
      } else {
        this.currentPage = this.currentPage
      }
      this.$http
        .post('/department/search', {
          isEnable: this.searchState,
          name: this.searchName,
          startPage: this.currentPage,
          appId: sessionStorage.getItem('appId')
        })
        .then(response => {
          if (response.data && response.data.data){
            let respData = response.data.data
            this.total = respData.total
            this.departmentsdata = respData.list.filter(item => !!item.parentId )
          }
        })
    },
    listTree() {
      this.parentDepartment = [{ label: '', value: '', children: [] }]
      this.$http.post('/department/listTree', { appId: sessionStorage.getItem('appId') }).then(response => {
        if (response.data && response.data.data) {
          let listTreeData = response.data.data
          this.parentDepartment[0].label = listTreeData.name
          this.parentDepartment[0].value = listTreeData.pid
          let resourceslist = Object.values(response.data.data.children)
          resourceslist.forEach(cascadervalue => {
          this.parentDepartment[0].children.push({ label: cascadervalue.name, value: cascadervalue.pid })
          })
        } 
      })
    },
    selectparentDepartment() {
      let appId = sessionStorage.getItem('appId')
      this.$http.post('/permission/list', { appId: appId }).then(response => {
        if (response.data && response.data.data) {
          this.resourcesdata = response.data.data.data
        }
      })
    },
    showModal(data) {
      this.modalVisible = true
      this.title = data ? '修改部门' : '增加部门'
      this.options = data ? false : true
      this.editdata = {...data} || {
        name: '',
        parentName: '',
        code: '',
        isEnable: 0,
        parentId: ''
      }
      if(data !== null){
        data.appId = sessionStorage.getItem('appId')     
      }else{
        this.editdata.isEnable = 0
      }
    },
    confirmModal() {
      if (this.options === true) {
        this.create()
      } else {
        this.edit()
      }
    },
    create() {
      var result = reg.test(this.editdata.code)
      if(!this.editdata.name|| !this.editdata.code|| this.editdata.parentId === undefined || this.editdata.isEnable === undefined ){
        this.$Message.warning('部门名称，父级部门，编码，启用状态均不能为空')
      }else if(!result){
        this.$Message.warning('你输入的编码不正确,编码必须由数字组成')
      }else{
        if(this.editdata.parentId.length == 0){
          this.$Message.warning('部门名称，父级部门，编码，启用状态均不能为空')
        }else{
          this.editdata.parentId = this.editdata.parentId[this.editdata.parentId.length - 1]
          this.$http
          .post('/department/save', {
            appId: sessionStorage.getItem('appId'),
            name: this.editdata.name,
            parentId: this.editdata.parentId,
            isEnable: this.editdata.isEnable,
            code: this.editdata.code
          })
          .then(response => {
            this.search()
            this.listTree()
            this.editdata = { name: '', parentName: '', code: '', isEnable: '', parentId: '' }
            this.modalVisible = false
            this.$Message.success('添加成功');
          })
        }
      }
     
    },
    edit() {
      var result = reg.test(this.editdata.code)
      if(!this.editdata.name|| !this.editdata.parentId|| !this.editdata.code|| this.editdata.isEnable === undefined || !this.editdata.parentName){
        this.$Message.warning('部门名称，父级部门，编码，启用状态均不能为空')
      }else{
        if(this.editdata.parentId.length <= 2){
          this.editdata.parentId = this.editdata.parentId[this.editdata.parentId.length - 1]
        }else if(!result){
        this.$Message.warning('你输入的编码不正确,编码必须由数字组成')
        }else{
          this.editdata.parentId = this.editdata.parentId
          this.editdata.appId = sessionStorage.getItem('appId')
          console.log(this.editdata)
          this.$http.post('/department/edit', this.editdata ).then(response => {
            console.log(JSON.stringify(response.data))
            this.search()
            this.listTree()
            this.editdata = { name: '', parentName: '', code: '', isEnable: '', parentId: '' }
            this.modalVisible = false
            this.$Message.success('修改成功');
          })
        }
        
      }
    },
    remove(index) {
     this.$Modal.confirm({
       title: '确定删除',
       onOk: () => {
        this.$http.post('/department/delete', { pid: index.pid, appId: sessionStorage.getItem('appId') }).then(response => {
          this.search()
          this.listTree()
          this.$Message.success('删除成功');
        })
       }
      })
    },
    changePage(page) {
      this.currentPage = page
      this.search()
    }
  }
}
</script>
<style lang="scss" scoped>
.department {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .search-form {
    padding-top: 30px;
    .ipt_name {
      width: 252px;
      height: 40px;
      margin-right: 20%;
    }
    .ipt_state{
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
  .list {
    svg{
      margin: 0 13px;
    }
    
  }
}
.dpt-modal{
  .ipt{
    width:253px;
    height: 40px;
    margin-right: 160px;
   }
  .ipt-cascader{
    width:253px;
    height: 40px;
    display: inline-block;
  }
}

</style>