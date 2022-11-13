<template>
  <div class="scenario-container">
    <h1>场景列表</h1>
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
            <router-link :to="'/scenario/add/' + randomStr + selectedFileId">
              <el-button 
                type="success" 
                size="small"
                :disabled="selectedFileId == ''"
                @click="randomStr = getRamdomStr()">
                在当前文件夹下新增场景
              </el-button>
            </router-link>
          </el-row>
          <el-row :gutter="20">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column fixed prop="id" label="序号" width="100">
              </el-table-column>
              <el-table-column fixed prop="scenario_name" label="场景名">
              </el-table-column>
              <el-table-column prop="training_num" label="训练数量">
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template v-slot="scope">
                  <!-- <el-button type="primary" size="mini" @click="">重命名</el-button> -->
                  <!-- test(scope.row) -->
                  <el-button type="primary" size="mini" @click="copyScnDialogVisible=true; selectedScnData=scope.row">复制</el-button>
                  <el-button type="danger" size="mini" @click="deleteScnDialogVisible=true; selectedScnId=scope.row.id">删除</el-button>
                  <router-link :to="'/training/add/' + scope.row.id + '.' + selectedFileId">
                    <el-button type="success" size="mini" style="margin-left: .625rem;">训练</el-button>
                  </router-link>
                  <router-link :to="'/scenario/edit/' + scope.row.id">
                    <el-button type="warning" size="mini" style="margin-left: .625rem;" @click="">修改</el-button>
                  </router-link>
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
    
    <el-dialog title="复制场景" v-if="copyScnDialogVisible" :visible.sync="copyScnDialogVisible" width="30%">
      <div style="font-size: medium;">确认复制序号为 {{ selectedScnData.id }} 的场景吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyScnDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="copyClick">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除场景" v-if="deleteScnDialogVisible" :visible.sync="deleteScnDialogVisible" width="30%">
      <div style="font-size: medium;">确认删除序号为 {{ selectedScnId }} 的场景吗？</div>
      <div style="padding-top: .625rem; color: red;">*注意：删除操作无法撤回！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteScnDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteClick">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchScenario, addScenario, deleteScenario } from '@/api/scenario'
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
      deleteScnDialogVisible: false,
      copyScnDialogVisible: false,
      selectedScnId: '',
      selectedScnData: {},
      selectedFileId: '',
      randomStr: this.getRamdomStr(),
      fileData: [],
      treeProps: {
        label: 'filename'
      },
      tableData: []
    }
  },
  // 场景页面创建结束时触发的钩子函数
  created() {
    // 请求场景列表
    this.fetchFileData();
  },
  // 切换回场景标签时触发的钩子函数
  activated() {
    // 为了在切换回场景标签时能看到新增或修改后的数据，再次请求场景列表
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
      let response = await searchScenario(params);
      this.tableData = response.data.items;
      this.total = response.data.total;
      this.loading = false;
    },
    async deleteClick() {
      let response = await deleteScenario({id: this.selectedScnId});
      this.deleteScnDialogVisible = false;
      this.fetchTableData();
    },
    async copyClick() {
      let response = await addScenario(this.selectedScnData);
      this.copyScnDialogVisible = false;
      this.fetchTableData();
    },
    handleNodeClick(data) {
      this.page = 1;
      this.selectedFileId = data.id;
    },
    getRamdomStr() {
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
.scenario-container {
  padding: 1.25rem;
}
</style>