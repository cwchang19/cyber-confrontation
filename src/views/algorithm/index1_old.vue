<template>
  <div class="algorithm-container">
    <h1>算法列表</h1>
    <el-row :gutter="20">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <el-row :gutter="20" type="flex" justify="end" style="padding: .625rem; padding-top: 0rem;">
          <!-- <el-input 
            v-model="searchText" 
            placeholder="请输入算法名或算法描述" 
            size="small" 
            clearable 
            style="width: 25rem;"
            @change="">
          </el-input> -->
          <el-button type="success" size="small" @click="addClick">
            新增算法
          </el-button>
        </el-row>
        <el-row :gutter="20">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column 
              v-for="(item, index) in tableColumn" 
              :prop="item.prop" 
              :label="item.label"
              :width="item.width">
              <template v-if="item.prop === 'operate'" v-slot="scope">
                <el-button type="warning" size="mini" @click="editClick(scope.row)" style="margin-right: .625rem;">编辑</el-button>
                <el-popover
                  placement="top"
                  width="200"
                  v-model="deleteCheckVisible">
                  <p>确定要删除选中的算法吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="deleteCheckVisible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteClick(scope.row)">确定</el-button>
                  </div>
                  <el-button type="danger" size="mini" slot="reference">删除</el-button>
                </el-popover>
                <!-- <el-button type="danger" size="mini" @click="">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
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
    <el-dialog
      title="新增算法"
      v-if="addAlgDialogVisible"
      :visible.sync="addAlgDialogVisible"
      width="30%">
      <!-- 新增算法时只需要给AlgorithmDetail组件绑个监听函数dialogClick就行 -->
      <!-- 其中的watchClick可以是任何字符串，ababababa也行，只要在AlgorithmDetail组件里$emit时写对就行 -->
      <AlgorithmDetail @watchClick="dialogClick"></AlgorithmDetail>
    </el-dialog>
    
    <!-- 修改算法的对话框 -->
    <el-dialog
      title="修改算法"
      v-if="editAlgDialogVisible"
      :visible.sync="editAlgDialogVisible"
      width="30%">
      <!-- 修改算法时还需要给AlgorithmDetail组件传递isEdit标识和算法id -->
      <!-- 其中isEdit和algId可以是任意字符串，只要和组件AlgorithmDetail里的props属性对应上就行 -->
      <AlgorithmDetail :isEdit="true" :algId="selectedAlgId" @watchClick="dialogClick"></AlgorithmDetail>
    </el-dialog>
    
  </div>
</template>

<script>
  import AlgorithmDetail from './components/AlgorithmDetail.vue';
  export default {
    name: 'Algorithm',
    components: {
      AlgorithmDetail,
    },
    data() {
      return {
        searchText: '',
        addAlgDialogVisible: false,
        editAlgDialogVisible: false,
        deleteCheckVisible: false,
        selectedAlgId: '',
        tableColumn: [
          { prop: 'id', label: '序号', width: '' },
          { prop: 'algorithm_name', label: '算法名', width: '' },
          { prop: 'algorithm_description', label: '算法描述', width: '' },
          { prop: 'algorithm_file', label: '算法文件', width: '' },
          { prop: 'create_datetime', label: '创建时间', width: '' },
          { prop: 'operate', label: '操作', width: '' },
        ],
        tableData: [
          {
            id: '1',
            algorithm_name: '算法1',
            algorithm_description: '算法描述1',
            algorithm_file: '算法文件1',
            create_datetime: '2022-1-1',
          }
        ]
      }
    },
    created() {
      // 页面创建结束后请求并绑定数据
      this.fetchData();
    },
    methods: {
      fetchData() {
        // 请求算法列表，this.tableData = 请求到的数据
      },
      addClick() {
        this.addAlgDialogVisible = true;
      },
      editClick(row) {
        this.selectedAlgId = row.id;
        this.editAlgDialogVisible = true;
      },
      deleteClick(row) {
        const algId = row.id;
        // 根据id请求后端删除对应算法

        // 删除算法后重新请求数据
        this.fetchData();
      },
      dialogClick(data) {
        // console.log(data);
        if(data === 'confirm') {
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