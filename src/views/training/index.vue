<template>
  <div class="training-container">
    <h1>训练列表</h1>
    <el-row :gutter="10">
      <el-col :span="3">
        <el-card :body-style="{ padding: '20px' }">
          <el-tree :data="fileData" :props="treeProps" node-key="id" @node-click="handleNodeClick"></el-tree>
        </el-card>
      </el-col>
      <el-col :span="21">
        <el-card :body-style="{ padding: '20px' }" v-loading="loading">
          <el-row :gutter="20" type="flex" justify="space-between" style="padding: .625rem; padding-top: 0rem;">
            <div class="search-tool">
            </div>
            <router-link :to="'/training/add/.' + selectedFileId + '.' + randomStr">
              <el-button 
                type="success" 
                size="small"
                :disabled="selectedFileId == ''"
                @click="randomStr = getRamdomStr()">
                在当前文件夹下新增训练
              </el-button>
            </router-link>
          </el-row>
          <el-row :gutter="20">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column fixed prop="id" label="序号">
              </el-table-column>
              <el-table-column prop="training_name" label="训练名">
              </el-table-column>
              <el-table-column prop="training_state" label="训练状态">
              </el-table-column>
              <el-table-column prop="create_datetime" label="开始时间">
              </el-table-column>
              <el-table-column prop="training_duration" label="训练时长">
              </el-table-column>
              <el-table-column prop="training_position" label="运行节点">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="400">
                <template slot-scope="scope">
                  <!-- <el-button type="primary" size="small">重命名</el-button> -->
                  <el-button v-if="scope.row.training_state === '训练中'" type="success" size="small">暂停</el-button>
                  <router-link :to="'/training/simulation/' + scope.row.id">
                    <el-button v-if="scope.row.training_state === '成功'" type="success" size="small">仿真</el-button>
                  </router-link>
                  <router-link :to="'/training/simulation/' + scope.row.id">
                    <el-button v-if="scope.row.training_state === '失败'" type="success" size="small">仿真</el-button>
                  </router-link>
                  <el-button type="info" size="small" @click="deleteTrnDialogVisible=true; selectedTrnId=scope.row.id">删除</el-button>
                  <el-button v-if="scope.row.training_state === '成功'" type="warning" size="small">查看结果</el-button>
                  <el-button v-if="scope.row.training_state === '失败'" type="warning" size="small">报错信息</el-button>
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
      </el-col>
    </el-row>
    
    <el-dialog title="删除训练" v-if="deleteTrnDialogVisible" :visible.sync="deleteTrnDialogVisible" width="30%">
      <div style="font-size: medium;">确认删除序号为 {{ selectedTrnId }} 的训练吗？</div>
      <div style="padding-top: .625rem; color: red;">*注意：删除操作无法撤回！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteTrnDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteClick">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchTraining, deleteTraining } from '@/api/training'
import { searchFileById } from '@/api/file'
import { arrayToTree } from '@/utils/other'

export default {
  data() {
    return {
      loading: true,
      pageSize: 10,
      page: 1,
      tempPage: 1,
      total: 0,
      searchText: '',
      tempSearchText: '',
      deleteTrnDialogVisible: false,
      selectedTrnId: '',
      selectedTrnData: {},
      selectedFileId: '',
      randomStr: this.getRandomStr(),
      fileData: [],
      treeProps: {
        label: 'filename'
      },
      tableData: []
    }
  },
  created() {
    this.fetchFileData();
  },
  activated() {
    this.fetchTableData();
  },
  watch: {
    selectedFileId: function(val) {
      this.fetchTableData();
    }
  },
  methods: {
    async fetchFileData() {
      let params = { id: 1 };
      let response = await searchFileById(params);
      this.fileData = arrayToTree(response.data.items);
    },
    async fetchTableData() {
      this.loading = true;
      const params = { fid: this.selectedFileId, pageSize: this.pageSize, page: this.page };
      let response = await searchTraining(params);
      this.tableData = response.data.items;
      this.total = response.data.total;
      this.loading = false;
    },
    async deleteClick() {
      let response = await deleteTraining({id: this.selectedTrnId});
      this.deleteTrnDialogVisible = false;
      this.fetchTableData();
    },
    handleNodeClick(data) {
      this.page = 1;
      this.selectedFileId = data.id;
    },
    getRandomStr() {
      return Math.random().toString(36).slice(-8);
    },
    handleCurrentChange(curPage) {
      this.page = curPage;
      this.fetchTableData();
    },
  }
}
</script>

<style scoped>
.training-container {
  padding: 1.25rem;
}
</style>
