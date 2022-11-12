<template>
  <div class="algorithm">
    <el-button type="primary" @click="dialogFormVisible = true">新增算法</el-button>
    <el-dialog title="新增算法" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="算法名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="算法描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <div align="center">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">上传算法文件</el-button>
          </el-upload>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column fixed prop="algorithm_id" label="序号">
      </el-table-column>
      <el-table-column fixed prop="algorithm_name" label="算法名称">
      </el-table-column>
      <el-table-column prop="algorithm_description" label="算法描述">
      </el-table-column>
      <el-table-column prop="algorithm_file" label="算法对应文件">
      </el-table-column>
      <el-table-column prop="create_datetime" label="创建时间">
      </el-table-column>
      <el-table-column prop="algorithm_owner" label="拥有者">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="400">
        <template slot-scope="scope">
          <el-button v-if="scope.row.algorithm_owner === 'user'" type="success" size="small">编辑</el-button>
          <el-button v-if="scope.row.algorithm_owner === 'user'" type="warning" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        algorithm_id: '01',
        algorithm_name: 'DQN',
        algorithm_description: 'Deep Q-Learning Network',
        algorithm_file: 'dqn.py',
        create_datetime: '2022.11.10',
        algorithm_owner: 'user'
      }, {
        algorithm_id: '02',
        algorithm_name: 'DQN',
        algorithm_description: 'Deep Q-Learning Network',
        algorithm_file: 'dqn.py',
        create_datetime: '2022.11.10',
        algorithm_owner: 'user'
      }, {
        algorithm_id: '03',
        algorithm_name: 'DQN',
        algorithm_description: 'Deep Q-Learning Network',
        algorithm_file: 'dqn.py',
        create_datetime: '2022.11.10',
        algorithm_owner: 'administrator'
      }, {
        algorithm_id: '04',
        algorithm_name: 'DQN',
        algorithm_description: 'Deep Q-Learning Network',
        algorithm_file: 'dqn.py',
        create_datetime: '2022.11.10',
        algorithm_owner: 'administrator'
      }],
      dialogFormVisible: false,
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
  }
}
</script>