<template>
  <div class="training">
    <el-row>
      <el-col :span="3">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="20">
        <router-link :to="'/training/add/' + randomStr">
          <el-button type="primary" @click="randomStr = getRandomStr()">新增训练</el-button>
        </router-link>
        <el-table :data="tableData" border style="width: 100%">
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
              <el-button type="primary" size="small">重命名</el-button>
              <el-button v-if="scope.row.state === '进行中'" type="success" size="small">暂停</el-button>
              <router-link :to="'/training/simulation/' + scope.row.id">
                <el-button v-if="scope.row.state === '成功'" type="success" size="small" style="margin-left: .625rem;">仿真</el-button>
              </router-link>
              <router-link :to="'/training/simulation/' + scope.row.id">
                <el-button v-if="scope.row.state === '失败'" type="success" size="small" style="margin-left: .625rem;">仿真</el-button>
              </router-link>
              <el-button type="info" size="small" style="margin-left: 10px;">删除</el-button>
              <el-button v-if="scope.row.state === '成功'" type="warning" size="small">查看结果</el-button>
              <el-button v-if="scope.row.state === '失败'" type="warning" size="small">报错信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      randomStr: this.getRandomStr(),
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
      tableData: [{
        id: '1',
        name: '训练A',
        state: '进行中',
        time: '2022.10.10',
        period: '1h.30m.16s',
        run_machine: 'c1,c3,c7'
      }, {
        id: '2',
        name: '训练B',
        state: '进行中',
        time: '2022.10.10',
        period: '1h.30m.16s',
        run_machine: 'c1,c3,c7'
      }, {
        id: '3',
        name: '训练C',
        state: '失败',
        time: '2022.10.10',
        period: '1h.30m.16s',
        run_machine: 'c1,c3,c7'
      }, {
        id: '4',
        name: '训练D',
        state: '成功',
        time: '2022.10.10',
        period: '1h.30m.16s',
        run_machine: 'c1,c3,c7'
      }]
    }
  },
  created() {
    console.log('created');
  },
  activated() {
    console.log('activated');
  },
  deactivated() {
    console.log('deactivated');
  },
  methods: {
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
