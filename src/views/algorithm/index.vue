<template>
  <div class="algorithm-container">
    <h1>算法列表</h1>
    <el-row :gutter="20">
      <el-card :body-style="{ padding: '20px' }" v-loading="loading">
        <el-row :gutter="20" type="flex" justify="space-between" style="padding: .625rem; padding-top: 0rem;">
          <div class="search-tool">
            <el-input v-model="tempSearchText" placeholder="请输入算法名" size="small" clearable
              style="width: 25rem; margin-right: .625rem;" @clear="searchClick">
            </el-input>
            <el-button type="primary" plain size="small" icon="el-icon-search" @click="searchClick">
              搜索
            </el-button>
          </div>
          <el-button type="success" size="small" @click="addClick">
            新增算法
          </el-button>
        </el-row>
        <el-row :gutter="20">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column v-for="(item, index) in tableColumns" :prop="item.prop" :label="item.label"
              :width="item.width" :show-overflow-tooltip="item.showOverflowTooltip || false">
              <template v-if="item.prop === 'operate'" v-slot="scope">
                <div v-if="item.prop === 'operate'">
                  <el-button type="warning" size="mini" @click="editClick(scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="deleteAlgDialogVisible=true; selectedAlgId=scope.row.id">删除</el-button>
                </div>
                <!-- <el-link v-else type="primary" :href="'http://101.43.40.128/'+scope.row.algorithm_file">点击下载</el-link> -->
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

    <!-- 
      这里新增算法和修改算法的表单是通过加载AlgorithmDetail组件实现，但是完全可以不这么写，
      完全可以在el-dialog里加上个el-form，如下：
        <el-dialog .....>
          <el-form .....>
            .....
          </el-form>
        </el-dialog>
      但是这个vue文件会变很长，而且会有很多重复的代码
    -->

    <!-- 新增算法的对话框 -->
    <el-dialog title="新增算法" v-if="addAlgDialogVisible" :visible.sync="addAlgDialogVisible" width="30%">
      <!-- 新增算法时只需要给AlgorithmDetail组件绑个监听函数dialogClick就行 -->
      <!-- 其中的watchClick可以是任何字符串，ababababa也行，只要在AlgorithmDetail组件里$emit时写对就行 -->
      <AlgorithmDetail @watchClick="dialogClick"></AlgorithmDetail>
    </el-dialog>

    <!-- 修改算法的对话框 -->
    <el-dialog title="编辑算法" v-if="editAlgDialogVisible" :visible.sync="editAlgDialogVisible" width="30%">
      <!-- 修改算法时还需要给AlgorithmDetail组件传递isEdit标识和算法id -->
      <!-- 其中isEdit和algId可以是任意字符串，只要和组件AlgorithmDetail里的props属性对应上就行 -->
      <AlgorithmDetail :isEdit="true" :algId="selectedAlgId" @watchClick="dialogClick"></AlgorithmDetail>
    </el-dialog>

    <!-- 确认删除的对话框 -->
    <el-dialog title="删除算法" v-if="deleteAlgDialogVisible" :visible.sync="deleteAlgDialogVisible" width="30%">
      <div style="font-size: medium;">确认删除序号为 {{ selectedAlgId }} 的算法吗？</div>
      <div style="padding-top: .625rem; color: red;">*注意：删除操作无法撤回！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteAlgDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteClick">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import AlgorithmDetail from './components/AlgorithmDetail.vue';
import { searchAlgorithmByCondition, deleteAlgorithm } from '@/api/algorithm'

export default {
  name: 'Algorithm',
  components: {
    AlgorithmDetail,
  },
  data() {
    return {
      loading: true,
      pageSize: 10,
      page: 1,
      tempPage: 1,
      total: 0,
      searchText: '',
      tempSearchText: '',
      addAlgDialogVisible: false,
      editAlgDialogVisible: false,
      deleteAlgDialogVisible: false,
      selectedAlgId: '',
      tableColumns: [
        { prop: 'id', label: '序号', width: '100' },
        { prop: 'algorithm_name', label: '算法名', width: '250' },
        { prop: 'algorithm_description', label: '算法描述', width: '', showOverflowTooltip: true },
        { prop: 'algorithm_file', label: '算法文件', width: '150', showOverflowTooltip: true },
        { prop: 'algorithm_type', label: '算法类型', width: '100' },
        { prop: 'algorithm_owner', label: '拥有者', width: '150' },
        { prop: 'create_datetime', label: '创建时间', width: '200' },
        { prop: 'operate', label: '操作', width: '150' },
      ],
      tableData: []
    }
  },
  created() {
    // 页面创建结束后请求并绑定数据
    this.fetchData();
  },
  activated() {
    this.fetchData();
  },
  watch: {
    searchText: function () {
      this.page = 1;
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      this.loading = true;
      // 请求算法列表，this.tableData = 请求到的数据
      let params = { algorithm_name: this.searchText, pageSize: this.pageSize, page: this.page };
      let response = await searchAlgorithmByCondition(params);
      if (response.data.items) {
        this.tableData = response.data.items;
        this.total = response.data.total;
      }
      this.loading = false;
    },
    searchClick() {
      this.searchText = this.tempSearchText;
    },
    addClick() {
      this.addAlgDialogVisible = true;
    },
    editClick(row) {
      console.log(row);
      this.selectedAlgId = row.id;
      this.editAlgDialogVisible = true;
    },
    async deleteClick() {
      // 根据id请求后端删除对应算法
      const response = await deleteAlgorithm(this.selectedAlgId);
      this.deleteAlgDialogVisible = false;
      // 删除算法后重新请求数据
      this.fetchData();
    },
    handleCurrentChange(curPage) {
      this.page = curPage;
      this.fetchData();
    },
    dialogClick(data) {
      console.log(data);
      if (data === 'confirm') {
        // 如果返回'confirm'，表示有数据被新增或修改了，为了实时显示新增或修改后的数据，重新请求数据
        this.fetchData();
      }
      this.addAlgDialogVisible = false;
      this.editAlgDialogVisible = false;
    },
  }
}
</script>

<style scoped>
.algorithm-container {
  padding: 1.25rem;
}
</style>