<template>
  <div class="action-container">
    <h1>动作空间列表</h1>
    <el-row :gutter="20">
      <el-card :body-style="{ padding: '20px' }">
        <el-row :gutter="20" type="flex" justify="space-between" style="padding: .625rem; padding-top: 0rem;">
          <div class="search-tool">
            <el-input v-model="tempSearchText" placeholder="请输入动作名" size="small" clearable
              style="width: 25rem; margin-right: .625rem;" @clear="searchClick">
            </el-input>
            <el-button type="primary" plain size="small" icon="el-icon-search" @click="searchClick">
              搜索
            </el-button>
          </div>
          <el-button type="success" size="small" @click="addClick">
            新增动作
          </el-button>
        </el-row>
        <el-row :gutter="20">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column v-for="(item, index) in tableColumns" :prop="item.prop" :label="item.label"
              :width="item.width" :show-overflow-tooltip="item.showOverflowTooltip || false">
              <template v-if="item.prop === 'operate'" v-slot="scope">
                <el-button type="warning" size="mini" @click="editClick(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteActDialogVisible=true; selectedActId=scope.row.id">删除</el-button>
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

    <el-dialog :title="isEdit ? '编辑动作' : '新增动作'" v-if="formDialogVisible" :visible.sync="formDialogVisible" width="37.5rem">
      <el-form :model="actionForm" ref="actionForm" label-position="right" label-width="5rem" :rules="formRules">
        <el-form-item label="动作名称" prop="action_name">
          <el-input v-model="actionForm.action_name" placeholder="请输入动作名称"></el-input>
        </el-form-item>
        <el-form-item label="动作类型" prop="action_type">
          <el-select v-model="actionForm.action_type" placeholder="请选择动作类型" style="width: 100%;">
            <el-option key="Discovery" label="Discovery" value="Discovery"></el-option>
            <el-option key="Credential Access" label="Credential Access" value="Credential Access"></el-option>
            <el-option key="Privilege Escalation" label="Privilege Escalation" value="Privilege Escalation"></el-option>
            <el-option key="Lateral Movement" label="Lateral Movement" value="Lateral Movement"></el-option>
            <el-option key="Exfiltration" label="Exfiltration" value="Exfiltration"></el-option>
            <el-option key="Impact" label="Impact" value="Impact"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="动作描述" prop="action_description">
          <el-input v-model="actionForm.action_description" placeholder="请输入动作描述" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogClick">确定</el-button>
      </div>
    </el-dialog>
    
    <!-- <el-dialog title="编辑动作" :visible.sync="editActDialogVisible">
      <el-form :model="form">
        <el-form-item label="动作名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="动作类型" :label-width="formLabelWidth">
          <el-input v-model="form.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="动作描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editActDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editActDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增动作" :visible.sync="addActDialogVisible">
      <el-form :model="form">
        <el-form-item label="动作名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="动作类型" :label-width="formLabelWidth">
          <el-input v-model="form.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="动作描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addActDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addActDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog> -->

    <el-dialog title="删除动作" v-if="deleteActDialogVisible" :visible.sync="deleteActDialogVisible" width="30%">
      <div style="font-size: medium;">确认删除序号为 {{ selectedActId }} 的动作吗？</div>
      <div style="padding-top: .625rem; color: red;">*注意：删除操作无法撤回！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteActDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteClick">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
    
<script>
import { searchActionByCondition, addAction, alterAction, deleteAction } from '@/api/action'

export default {
  name: 'Action',
  components: {},
  data() {
    return {
      pageSize: 10,
      page: 1,
      tempPage: 1,
      total: 0,
      searchText: '',
      tempSearchText: '',
      deleteActDialogVisible: false,
      formDialogVisible: false,
      selectedActId: '',
      isEdit: false,
      tableData: [],
      tableColumns: [
        { prop: 'id', label: '序号', width: '100' },
        { prop: 'action_name', label: '动作名称', width: '250' },
        { prop: 'action_type', label: '动作类型', width: '200' },
        { prop: 'action_description', label: '动作描述', width: '', showOverflowTooltip: true },
        { prop: 'operate', label: '操作', width: '150' },
      ],
      uploadaction: false,
      editaction: false,
      actionForm: {
        action_name: '',
        action_type: '',
        action_description: '',
      },
      formRules: {
        action_name: [
          { required: true, message: '动作名称不能为空', trigger: 'change' },
        ],
        action_type: [
          { required: true, message: '动作类型不能为空', trigger: 'change' },
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
    searchText: function() {
      this.page = 1;
      this.fetchData();
    },
    formDialogVisible: function(val) {
      if(!val) {
        this.$refs['actionForm'].resetFields();
      }
    }
  },
  methods: {
    async fetchData(params) {
      params = params || { action_name: this.searchText, pageSize: this.pageSize, page: this.page };
      let response = await searchActionByCondition(params);
      if (response.data.items) {
        this.tableData = response.data.items;
        this.total = response.data.total;
      }
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
      this.selectedActId = row.id;
      this.formDialogVisible = true;
      const response = await searchActionByCondition({ id: this.selectedActId });
      if(response.data.total > 0) {
        this.actionForm = response.data.items[0];
      }
    },
    async deleteClick() {
      // 根据id请求后端删除对应算法
      const response = await deleteAction({ id: this.selectedActId });
      this.deleteActDialogVisible = false;
      // 删除算法后重新请求数据
      this.fetchData();
    },
    handleCurrentChange(curPage) {
      this.page = curPage;
      this.fetchData();
    },
    dialogClick() {
      this.$refs['actionForm'].validate(async (valid) => {
        if(valid) {
          if(this.isEdit) {
            const response = await alterAction({ id: this.selectedActId } ,this.actionForm);
          } else {
            const response = await addAction(this.actionForm);
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

<style scoped>
.action-container {
  padding: 1.25rem;
}
</style>