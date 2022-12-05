<template>
  <div class="scenario-container">
    <h1>场景列表</h1>
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
            <el-tree :data="dirData" :props="treeProps" node-key="id" :highlight-current="true" @node-click="handleNodeClick">
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
            <el-tooltip content="请先在左侧选择目录" placement="top" effect="dark" :disabled="selectedDirId != ''">
              <router-link :to="selectedDirId == '' ? $route.fullPath : ('/scenario/add/' + randomStr + selectedDirId)">
                <el-button type="success" size="small" :disabled="selectedDirId == ''"
                  @click="randomStr = getRamdomStr()">
                  在选择文件夹下新增场景
                </el-button>
              </router-link>
            </el-tooltip>
          </el-row>
          <el-row :gutter="20">
            <el-table :data="tableData" empty-text="未选择目录或当前目录下无数据" style="width: 100%">
              <el-table-column fixed prop="id" label="序号" width="100">
              </el-table-column>
              <el-table-column fixed prop="scenario_name" label="场景名">
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template v-slot="scope">
                  <!-- <el-button type="primary" size="mini" @click="">重命名</el-button> -->
                  <!-- test(scope.row) -->
                  <!-- <el-button type="primary" size="mini"
                    @click="copyScnDialogVisible = true; selectedScnData = scope.row">复制
                  </el-button> -->
                  <el-button type="danger" size="mini"
                    @click="deleteScnDialogVisible = true; selectedScnId = scope.row.id">
                    删除</el-button>
                  <router-link :to="'/training/add/' + scope.row.id">
                    <el-button type="success" size="mini" style="margin-left: .625rem;">训练</el-button>
                  </router-link>
                  <router-link :to="'/scenario/edit/' + scope.row.id + '.' + selectedDirId">
                    <el-button type="warning" size="mini" style="margin-left: .625rem;" @click="">修改</el-button>
                  </router-link>
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
import { searchScenario, addScenario, deleteScenario } from '@/api/scenario'
import { searchDirectory, addDirectory, alterDirectory, deleteDirectory } from '@/api/directory'
import { arrayToTree, deepCopy } from '@/utils/other'

export default {
  data() {
    return {
      loading: false,
      pageSize: 10,
      page: 1,
      tempPage: 1,
      total: 0,
      searchText: '',
      tempSearchText: '',
      deleteScnDialogVisible: false,
      copyScnDialogVisible: false,
      parentDirId: 0,
      dirName: '',
      curDir: null,
      addRootDirDialogVisible: false,
      addDirDialogVisible: false,
      editDirDialogVisible: false,
      deleteDirDialogVisible: false,
      selectedScnId: '',
      selectedScnData: {},
      selectedDirId: '',
      randomStr: this.getRamdomStr(),
      dirData: [],
      treeProps: {
        label: 'directory_name'
      },
      tableData: []
    }
  },
  // 场景页面创建结束时触发的钩子函数
  created() {
    // 请求场景列表
    this.fetchDirData();
  },
  // 切换回场景标签时触发的钩子函数
  activated() {
    // 为了在切换回场景标签时能看到新增或修改后的数据，再次请求场景列表
    this.fetchTableData();
  },
  watch: {
    selectedDirId: function () {
      this.fetchTableData();
    },
    addRootDirDialogVisible: function (val) {
      if(!val)
        this.dirName = '';
    },
    addDirDialogVisible: function (val) {
      if(!val)
        this.dirName = '';
    },
    editDirDialogVisible: function (val) {
      if(!val)
        this.dirName = '';
    }
  },
  methods: {
    async fetchDirData() {
      let params = { type: '场景' };
      const response = await searchDirectory(params);
      // console.log('dir', response);
      this.dirData = arrayToTree(response.data);
    },
    async fetchTableData() {
      if(this.selectedDirId == '') return;
      this.loading = true;
      const params = { directory_id: this.selectedDirId, pageSize: this.pageSize, page: this.page };
      let response = await searchScenario(params);
      this.tableData = response.data.items;
      this.total = response.data.total;
      this.loading = false;
    },
    async deleteClick() {
      let response = await deleteScenario(this.selectedScnId);
      this.deleteScnDialogVisible = false;
      this.fetchTableData();
    },
    async copyClick() {
      // console.log(this.selectedScnData);
      // let response = await addScenario(this.selectedScnData);
      this.copyScnDialogVisible = false;
      this.fetchTableData();
    },
    handleNodeClick(data) {
      this.page = 1;
      this.selectedDirId = data.id;
    },
    getRamdomStr() {
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
        // console.log(this.parentDirId)
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
        directory_type: '场景',
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
      // console.log(response);
      this.editDirDialogVisible = false;
      this.fetchDirData();
    },
    async deleteDirClick() {
      let data = this.curDir;
      const response = await deleteDirectory(data.id);
      // console.log(response);
      this.deleteDirDialogVisible = false;
      this.fetchDirData();
    }

  }
}
</script>

<style scoped>
.scenario-container {
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