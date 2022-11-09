<template>
  <div class="scenario">
    <el-row>
      <el-col :span="3">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="20">
        <router-link :to="'/scenario/add/' + randomStr">
          <el-button type="primary" @click="randomStr = getRamdomStr()">新增场景</el-button>
        </router-link>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column fixed prop="scenario" label="场景名">
          </el-table-column>
          <el-table-column prop="number" label="训练数量">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template v-slot="scope">
              <el-button type="primary" size="small" @click="test(scope.row)">重命名</el-button>
              <el-button type="success" size="small" @click="copyClick(scope.row)">复制</el-button>
              <el-button type="info" size="small" @click="deleteClick(scope.row)">删除</el-button>
              <router-link :to="'/training/add/' + scope.row.id">
                <el-button type="warning" size="small" style="margin-left: .625rem;">训练</el-button>
              </router-link>
              <router-link :to="'/scenario/edit/' + scope.row.id">
                <el-button type="danger" size="small" style="margin-left: .625rem;">修改</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { searchScenario, addScenario, deleteScenario } from '@/api/scenario'

export default {
  data() {
    return {
      randomStr: this.getRamdomStr(),
      data: [{
        label: '文件夹A',
        children: [{
          label: '文件夹A1'
        }]
      }, {
        label: '文件夹B',
        children: [{
          label: '文件夹B1'
        }, {
          label: '文件夹B2'
        }]
      }, {
        label: '文件夹C',
        children: [{
          label: '文件夹C1'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: []
    }
  },
  // 场景页面创建结束时触发的钩子函数
  created() {
    // 请求场景列表
    this.fetchTableData();
  },
  // 切换回场景标签时触发的钩子函数
  activated() {
    // 为了在切换回场景标签时能看到新增或修改后的数据，再次请求场景列表
    this.fetchTableData();
  },
  methods: {
    fetchTableData() {
      searchScenario().then(response => {
        this.tableData = response.data.items;
      })
    },
    deleteClick(row) {
      deleteScenario({id: row.id}).then(response => {
        this.fetchTableData();
      })
    },
    copyClick(row) {
      row.id = (Math.floor(Math.random() * (100 - 10 + 1)) + 10) + '';
      addScenario(row).then(response => {
        this.fetchTableData();
      })
    },
    handleNodeClick(data, a, b) {
      this.requestTable()
      this.tableData = [{
        id: '5',
        scenario: '场景E',
        number: '7'
      }, {
        id: '6',
        scenario: '场景F',
        number: '8'
      }]
    },
    requestTable(fileid) {
      //
    },
    getRamdomStr() {
      return Math.random().toString(36).slice(-8);
    }
  }
}
</script>
