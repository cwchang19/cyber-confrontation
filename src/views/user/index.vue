<template>
  <div class="user-container">
    <el-button type="primary" @click="adduser = true">新增用户</el-button>
    <el-dialog title="新增用户" :visible.sync="adduser">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adduser = false">取 消</el-button>
        <el-button type="primary" @click="adduser = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="id" label="序号">
      </el-table-column>
      <el-table-column fixed prop="nickname" label="用户名">
      </el-table-column>
      <el-table-column prop="phone" label="手机号">
      </el-table-column>
      <el-table-column prop="algorithm" label="算法数">
      </el-table-column>
      <el-table-column prop="create_datetime" label="注册时间">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="400">
        <template>
          <el-button type="success" size="small" @click="edituser = true">编辑</el-button>
          <el-button type="warning" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑用户信息" :visible.sync="edituser">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edituser = false">取 消</el-button>
        <el-button type="primary" @click="edituser = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
    
<script>
import { searchUserByCondition } from '@/api/user';

export default {
  name: 'User',
  components: {},
  data() {
    return {
      tableData: [{
        id: '01',
        nickname: 'ecnu',
        phone: '12345678900',
        algorithm: '8',
        create_datetime: '2022.11.10'
      }, {
        id: '02',
        nickname: 'ecnu',
        phone: '12345678900',
        algorithm: '8',
        create_datetime: '2022.11.10'
      }, {
        id: '03',
        nickname: 'ecnu',
        phone: '12345678900',
        algorithm: '8',
        create_datetime: '2022.11.10'
      }, {
        id: '04',
        nickname: 'ecnu',
        phone: '12345678900',
        algorithm: '8',
        create_datetime: '2022.11.10'
      }],
      adduser: false,
      edituser: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.fetchData(null);
  },
  activated() {
    this.fetchData(null);
  },
  methods: {
    async fetchData(rdata) {
      const params = rdata || { pageSize: 2, page: 1 };
      let response = await searchUserByCondition(params);
      this.tableData = (response.data && response.data.items) || {};
    }
  }
}
</script>