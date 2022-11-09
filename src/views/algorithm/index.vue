<template>
  <div class="algorithm-container">
    <h1>算法列表</h1>
    <el-row :gutter="20">
      <el-card shadow="always" :body-style="{ padding: '20px' }">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column 
            v-for="(item, index) in tableColumn" 
            :prop="item.prop" 
            :label="item.label"
            :width="item.width">
            <template v-if="item.prop === 'operate'" v-slot="scope">
              <el-button type="warning" size="mini" @click="">编辑</el-button>
              <el-button type="danger" size="mini" @click="">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
    <el-row>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'Algorithm',
    components: {

    },
    data() {
      return {
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
            create_datetime: '创建时间',
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .algorithm-container {
    padding: 1.25rem;
  }
</style>