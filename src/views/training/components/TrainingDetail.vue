<template>
  <div class="training-detail-container">
    <h1>新增训练</h1>
    <el-row :gutter="20" class="content-row">
      <el-col :span="6" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }">
          <el-steps :active="active" finish-status="success">
            <el-step></el-step>
            <el-step></el-step>
            <el-step></el-step>
            <el-step></el-step>
          </el-steps>

          <!-- <el-button style="margin-top: 12px;" @click="next">下一步</el-button> -->
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
  name: 'TrainingDetail',
  props: {
    isFromScenario: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: 0,
    }
  },
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0;
    }
  }
}
</script>

<style>
.training-detail-container {
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

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>