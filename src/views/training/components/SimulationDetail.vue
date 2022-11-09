<template>
  <div class="training-simulation-detail-container">
    <h1>仿真</h1>
    <el-row :gutter="20" class="content-row">
      <el-col :span="6" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }">
          <div slot="header" class="clearfix">
            <span>历史训练</span>
          </div>
          <el-select v-model="historyId" value-key="" placeholder="请选择历史训练" filterable @change="" style="width: 100%;">
          </el-select>
          
        </el-card>
      </el-col>
      <el-col :span="18" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>可视化</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'ScenarioDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tempRoute: {},
      historyId: null,
    }
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route)
  }
}
</script>

<style scoped>
.training-simulation-detail-container {
  padding: 0 1rem 0 1rem;
}

.content-row {
  height: 48rem;
}

.content-col {
  height: 100%;
}

.el-card {
  height: 100%;
}
</style>