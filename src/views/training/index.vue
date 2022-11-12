<template>
  <div class="training-container">
    <h1>训练列表</h1>
    <el-row :gutter="10">
      <el-col :span="3">
        <el-card :body-style="{ padding: '20px' }">
          <el-tree :data="fileData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-card>
      </el-col>
      <el-col :span="21">
        <el-card :body-style="{ padding: '20px' }">
          <el-row type="flex" justify="space-between" style="padding: .625rem; padding-top: 0rem;">
            <div class="search-tool">
              <el-input v-model="tempSearchText" placeholder="请输入训练名" size="small" clearable
                style="width: 25rem; margin-right: .625rem;" @clear="searchClick">
              </el-input>
              <el-button type="primary" plain size="small" icon="el-icon-search" @click="searchClick">
                搜索
              </el-button>
            </div>
            <router-link :to="'/training/add/' + randomStr">
              <el-button type="success" size="small" icon="el-icon-plus" @click="randomStr = getRandomStr()">新增训练</el-button>
            </router-link>
          </el-row>
          <el-row :gutter="20">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column fixed prop="name" label="训练名">
              </el-table-column>
              <el-table-column prop="state" label="训练状态">
              </el-table-column>
              <el-table-column prop="time" label="开始时间">
              </el-table-column>
              <el-table-column prop="period" label="训练时长">
              </el-table-column>
              <el-table-column prop="run_machine" label="运行节点">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="400">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini">重命名</el-button>
                  <el-button v-if="scope.row.state === '进行中'" type="success" size="mini">暂停</el-button>
                  <router-link :to="'/training/simulation/' + scope.row.id">
                    <el-button v-if="scope.row.state === '成功'" type="success" size="mini" style="margin-left: .625rem;">仿真</el-button>
                  </router-link>
                  <router-link :to="'/training/simulation/' + scope.row.id">
                    <el-button v-if="scope.row.state === '失败'" type="success" size="mini" style="margin-left: .625rem;">仿真</el-button>
                  </router-link>
                  <el-button type="info" size="mini" style="margin-left: 10px;" @click="deleteClick(scope.row)">删除</el-button>
                  <el-button v-if="scope.row.state === '成功'" type="warning" size="mini">查看结果</el-button>
                  <el-button v-if="scope.row.state === '失败'" type="warning" size="mini">报错信息</el-button>
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
  </div>
</template>

<script>
import { searchTraining, deleteTraining } from '@/api/training'

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
      deleteActDialogVisible: false,
      formDialogVisible: false,
      selectedActId: '',
      randomStr: this.getRandomStr(),
      fileData: [{
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
      tableData: [],
    }
  },
  created() {
    this.fetchData();
  },
  activated() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      searchTraining().then(response => {
        this.tableData = response.data.items;
      })
    },
    deleteClick(row) {
      deleteTraining({id: row.id}).then(response => {
        this.fetchData();
      })
    },
    handleNodeClick(data) {
      this.tableData = [{
        id: '5',
        name: '训练B',
        state: '进行中',
        time: '2022.10.10',
        period: '1h.30m.16s',
        run_machine: 'c1,c3,c7'
      }, {
        id: '6',
        name: '训练D',
        state: '成功',
        time: '2022.10.10',
        period: '1h.30m.16s',
        run_machine: 'c1,c3,c7'
      }]
    },
    getRandomStr() {
      return Math.random().toString(36).slice(-8);
    }
  }
}
</script>

<style scoped>
.training-container {
  padding: 1.25rem;
}
</style>