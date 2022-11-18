<template>
  <div class="training-container">
    <h1>训练列表</h1>
    <el-row :gutter="10">
      <el-col :span="4">
        <el-card :body-style="{ padding: '20px' }">
          <div slot="header">
            <span>目录</span>
            <el-popover placement="right" width="160" v-model="addRootDirDialogVisible">
              <el-row style="padding-bottom: .3125rem;">
                <el-input v-model="dirName" placeholder="请输入目录名" size="mini"></el-input>
              </el-row>
              <el-row style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="addRootDirDialogVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="addDirClick(0)">确定</el-button>
              </el-row>
              <el-button type="text" size="mini" icon="el-icon-plus" style="float: right; padding: 3px 0"
                slot="reference">
                新建一级目录</el-button>
            </el-popover>
          </div>
          <el-row>
            <el-tree :data="dirData" :props="treeProps" node-key="id" @node-click="handleNodeClick"
              :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button type="text" size="mini" icon="el-icon-plus" slot="reference"
                    @click.stop="showDirDialog('add', data)">
                  </el-button>
                  <el-button type="text" size="mini" icon="el-icon-edit" slot="reference"
                    @click.stop="showDirDialog('edit', data)">
                  </el-button>
                  <el-button type="text" size="mini" icon="el-icon-delete" slot="reference"
                    @click.stop="showDirDialog('delete', data)">
                  </el-button>
                </span>
              </span>
            </el-tree>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card :body-style="{ padding: '20px' }" v-loading="loading">
          <el-row :gutter="20" type="flex" justify="space-between" style="padding: .625rem; padding-top: 0rem;">
            <div class="search-tool">
            </div>
            <router-link
              :to="selectedDirId == '' ? $route.fullPath : ('/training/add/.' + selectedDirId + '.' + randomStr)">
              <el-button type="success" size="small" :disabled="selectedDirId == ''"
                @click="randomStr = getRandomStr()">
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
                  <el-button v-if="scope.row.training_state === '训练中'" type="success" size="small"
                    @click="pauseClick(scope.row.id)">暂停</el-button>
                  <el-button v-else-if="scope.row.training_state === '暂停中'" type="success" size="small"
                    @click="continueClick(scope.row.id)">继续</el-button>
                  <router-link v-else :to="'/training/simulation/' + scope.row.id" style="padding-right: .625rem;">
                    <el-button type="success" size="small">仿真</el-button>
                  </router-link>
                  <!-- <router-link :to="'/training/simulation/' + scope.row.id">
                    <el-button v-if="scope.row.training_state === '运行异常'" type="success" size="small">仿真</el-button>
                  </router-link> -->
                  <el-button type="info" size="small"
                    @click="deleteTrnDialogVisible = true; selectedTrnId = scope.row.id">
                    删除</el-button>
                  <el-button v-if="scope.row.training_state === '已完成'" type="warning" size="small" @click="downloadClick(scope.row, 'training_result')">查看结果</el-button>
                  <el-button v-if="scope.row.training_state === '运行异常'" type="warning" size="small" @click="downloadClick(scope.row, 'training_log')">报错信息</el-button>
                  <el-button v-if="scope.row.training_state === '已完成' || scope.row.training_state === '运行异常'" type=""
                    size="small" @click="restartClick(scope.row.id)">重新训练</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row style="padding-top: 1.25rem;" type="flex" justify="center">
            <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize"
              :total="total" layout="total, prev, pager, next, jumper">
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

    <el-dialog title="新建目录" v-if="addDirDialogVisible" :visible.sync="addDirDialogVisible" width="30%">
      <el-input v-model="dirName" placeholder="请输入目录名" size="small"></el-input>
      <span slot="footer">
        <el-button @click="addDirDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addDirClick">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改目录" v-if="editDirDialogVisible" :visible.sync="editDirDialogVisible" width="30%">
      <el-input v-model="dirName" placeholder="请输入目录名" size="small"></el-input>
      <span slot="footer">
        <el-button @click="editDirDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editDirClick">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog title="刪除目录" v-if="deleteDirDialogVisible" :visible.sync="deleteDirDialogVisible" width="30%">
      <span style="color: red;">确认删除“{{ curDir.directory_name }}”目录吗？</span>
      <span slot="footer">
        <el-button @click="deleteDirDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteDirClick">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchTraining,
  deleteTraining,
  downloadTraining,
  pauseTraining,
  continueTraining,
  restartTraining,
  renameTraining
} from '@/api/training'
import { searchDirectory, addDirectory, alterDirectory, deleteDirectory } from '@/api/directory'
import { arrayToTree, deepCopy } from '@/utils/other'
import { continueStatement } from '@babel/types'

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
      parentDirId: 0,
      dirName: '',
      curDir: null,
      addRootDirDialogVisible: false,
      addDirDialogVisible: false,
      editDirDialogVisible: false,
      deleteDirDialogVisible: false,
      selectedTrnId: '',
      selectedTrnData: {},
      selectedDirId: '',
      newTrainingName: '',
      randomStr: this.getRandomStr(),
      dirData: [],
      treeProps: {
        label: 'directory_name'
      },
      tableData: []
    }
  },
  created() {
    this.fetchDirData();
  },
  activated() {
    this.fetchTableData();
  },
  watch: {
    selectedDirId: function () {
      this.fetchTableData();
    },
    addRootDirDialogVisible: function (val) {
      if (!val)
        this.dirName = '';
    },
    addDirDialogVisible: function (val) {
      if (!val)
        this.dirName = '';
    },
    editDirDialogVisible: function (val) {
      if (!val)
        this.dirName = '';
    }
  },
  methods: {
    async fetchDirData() {
      let params = { type: '训练' };
      const response = await searchDirectory(params);
      console.log(response);
      this.dirData = arrayToTree(response.data);
    },
    async fetchTableData() {
      this.loading = true;
      const params = { directory_id: this.selectedDirId, pageSize: this.pageSize, page: this.page };
      let response = await searchTraining(params);
      this.tableData = response.data.items;
      this.total = response.data.total;
      this.loading = false;
    },
    async deleteClick() {
      let response = await deleteTraining(this.selectedTrnId);
      this.deleteTrnDialogVisible = false;
      this.fetchTableData();
    },
    handleNodeClick(data) {
      this.page = 1;
      this.selectedDirId = data.id;
    },
    getRandomStr() {
      return Math.random().toString(36).slice(-8);
    },
    handleCurrentChange(curPage) {
      this.page = curPage;
      this.fetchTableData();
    },
    showDirDialog(type, data) {
      if (type == 'add') {
        this.addDirDialogVisible = true;
        this.parentDirId = data.id;
      } else if (type == 'edit') {
        this.editDirDialogVisible = true;
        this.curDir = data;
        this.dirName = data.directory_name;
      } else {
        this.deleteDirDialogVisible = true;
        this.curDir = data;
      }
    },
    async addDirClick() {
      let pid = this.parentDirId;
      if (this.dirName == '') {
        this.$message.error('目录名不能为空');
        return;
      }
      let data = {
        directory_name: this.dirName,
        directory_type: '训练',
        directory_parent_id: parseInt(pid),
      }
      const response = await addDirectory(data);
      this.addDirDialogVisible = false;
      this.addRootDirDialogVisible = false;
      this.fetchDirData();
      this.parentDirId = 0;
    },
    async editDirClick() {
      if (this.dirName == '') {
        this.$message.error('目录名不能为空');
        return;
      }
      let data = deepCopy(this.curDir);
      data.directory_name = this.dirName;
      const response = await alterDirectory(data.id, data);
      console.log(response);
      this.editDirDialogVisible = false;
      this.fetchDirData();
    },
    async deleteDirClick() {
      let data = this.curDir;
      const response = await deleteDirectory(data.id);
      console.log(response);
      this.deleteDirDialogVisible = false;
      this.fetchDirData();
    },
    async downloadClick(row, type) {
      const params = {
        // file_path: row.training_path + row[type],
        file_path: row.training_path + row[type],
      };
      console.log(params);
      const response = await downloadTraining(params);
      const blob = new Blob([response]);
      const filename = row[type];
      const elink = document.createElement('a');
      elink.download = filename;
      elink.style.display = 'none';
      elink.target = '_blank';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
      console.log(response);
    },
    async pauseClick(id) {
      const response = await pauseTraining(id);
      this.fetchTableData();
    },
    async continueClick(id) {
      const response = await continueTraining(id);
      this.fetchTableData();
    },
    async restartClick(id) {
      const response = await restartTraining(id);
      this.fetchTableData();
    },
    async renameClick(id) {
      const response = await renameTraining(id, { training_name: this.newTrainingName });
      this.fetchTableData();
    },
  }
}
</script>

<style scoped>
.training-container {
  padding: 1.25rem;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
