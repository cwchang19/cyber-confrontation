<template>
  <div class="user-container">
    <h1>用户列表</h1>
    <el-row :gutter="20">
      <el-card :body-style="{ padding: '20px' }" v-loading="loading">
        <el-row :gutter="20" type="flex" justify="space-between" style="padding: .625rem; padding-top: 0rem;">
          <div class="search-tool">
            <el-input v-model="tempSearchText" placeholder="请输入用户名" size="small" clearable
              style="width: 25rem; margin-right: .625rem;" @clear="searchClick">
            </el-input>
            <el-button type="primary" plain size="small" icon="el-icon-search" @click="searchClick">
              搜索
            </el-button>
          </div>
          <el-button type="success" size="small" @click="addClick">
            新增用户
          </el-button>
        </el-row>
        <el-row :gutter="20">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column v-for="(item, index) in tableColumns" :prop="item.prop" :label="item.label"
              :width="item.width" :show-overflow-tooltip="item.showOverflowTooltip || false">
              <template v-if="item.prop === 'operate'" v-slot="scope">
                <el-button type="warning" size="mini" @click="editClick(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteUserDialogVisible = true; selectedUserId = scope.row.id">
                  删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="padding-top: 1.25rem;" type="flex" justify="center">
          <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" :total="total"
            layout="total, prev, pager, next, jumper">
          </el-pagination>
        </el-row>
      </el-card>
    </el-row>

    <el-dialog :title="isEdit ? '编辑用户' : '新增用户'" v-if="formDialogVisible" :visible.sync="formDialogVisible"
      width="37.5rem">
      <el-form :model="userForm" ref="userForm" label-position="right" label-width="5rem" :rules="formRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="user_type">
          <el-select v-model="userForm.user_type" placeholder="请选择用户类型" style="width: 100%;">
            <el-option key="管理员" label="管理员" :value="0"></el-option>
            <el-option key="用户" label="用户" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogClick">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除用户" v-if="deleteUserDialogVisible" :visible.sync="deleteUserDialogVisible" width="30%">
      <div style="font-size: medium;">确认删除序号为 {{ selectedUserId }} 的用户吗？</div>
      <div style="padding-top: .625rem; color: red;">*注意：删除操作无法撤回！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteUserDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteClick">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
    
<script>
import { searchUserByCondition, addUser, alterUser, deleteUser, searchUserById } from '@/api/userM';
export default {
  name: 'User',
  components: {},
  data() {
    return {
      loading: true,
      pageSize: 10,
      page: 1,
      tempPage: 1,
      total: 0,
      searchText: '',
      tempSearchText: '',
      deleteUserDialogVisible: false,
      formDialogVisible: false,
      selectedUserId: '',
      isEdit: false,
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: '' },
        { prop: 'nickname', label: '昵称', width: '' },
        { prop: 'username', label: '用户名', width: '' },
        { prop: 'phone', label: '手机号', width: '' },
        { prop: 'algorithm', label: '算法数', width: '' },
        { prop: 'create_datetime', label: '创建时间', width: '' },
        { prop: 'user_type', label: '用户类型', width: '' },
        { prop: 'operate', label: '操作', width: '150' },
      ],
      userForm: {
        nickname: '',
        username: '',
        password: 'admin',
        avatar: '12345',
        phone: '',
        algorithm: 0,
        create_datetime: '',
        user_type: ''
      },
      formRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
        ],
        user_type: [
          { required: true, message: '用户类型不能为空', trigger: 'change' },
        ],
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.fetchData();
  },
  activated() {
    this.fetchData();
  },
  watch: {
    searchText: function () {
      this.page = 1;
      this.fetchData();
    },
    formDialogVisible: function (val) {
      if (!val) {
        this.$refs['userForm'].resetFields();
      }
    }
  },
  methods: {
    async fetchData(params) {
      this.loading = true;
      params = params || { username: this.searchText, pageSize: this.pageSize, page: this.page };
      let response = await searchUserByCondition(params)
      if (response.data.items) {
        this.tableData = response.data.items
        this.total = response.data.total
      }
      this.loading = false
    },
    searchClick() {
      this.searchText = this.tempSearchText;
    },
    addClick() {
      this.isEdit = false;
      this.formDialogVisible = true;
    },
    async editClick(row) {
      this.isEdit = true;
      this.selectedUserId = row.id;
      this.formDialogVisible = true;
      const response = await searchUserById(this.selectedUserId)
      this.userForm.nickname = response.data.nickname
      this.userForm.username = response.data.username
      this.userForm.avatar = response.data.avatar
      this.userForm.phone = response.data.phone
      this.userForm.create_datetime = response.data.create_datetime
      this.userForm.user_type = response.data.user_type
    },
    async deleteClick() {
      const response = await deleteUser(this.selectedUserId)
      this.deleteUserDialogVisible = false;
      this.fetchData();
    },
    handleCurrentChange(curPage) {
      this.page = curPage;
      this.fetchData();
    },
    dialogClick() {
      this.$refs['userForm'].validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            console.log(this.selectedUserId)
            console.log(this.userForm)
            const response = await alterUser(this.selectedUserId, this.userForm)
          } else {
            this.userForm.create_datetime = new Date()
            const response = await addUser(this.userForm)
          }
        } else {
          return false;
        }
        this.formDialogVisible = false;
        this.fetchData();
      })
    }
  }
}
</script>

<style>
.user-container {
  padding: 1.25rem;
}
</style>