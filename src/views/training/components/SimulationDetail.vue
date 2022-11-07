<template>
  <div class="training-simulation-detail-container">
    <h1>仿真</h1>
    <el-row :gutter="20" class="content-row">
      <el-col :span="6" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }">
          <div slot="header" class="clearfix">
            <span>历史训练</span>
          </div>
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
      scenarioForm: {
        nodeNum: 0,
        subnetNum: 0,
        infiltrateLevel: 0,
        protectionLevel: 0,
        targetNum: 0,
        vulnerabilityNum: 0,
      },
      formItem: [
        {key: 'nodeNum', label: '节点数'},
        {key: 'subnetNum', label: '子网数'},
        {key: 'infiltrateLevel', label: '渗透级数'},
        {key: 'protectionLevel', label: '保护等级'},
        {key: 'targetNum', label: '目标节点数'},
        {key: 'vulnerabilityNum', label: '漏洞数'},
      ]
    }
  },
  created() {
    if(this.isEdit) {
      const scenarioId = this.$route.params && this.$route.params.id;
      // 根据 id 请求场景信息
      this.scenarioForm.nodeNum = scenarioId;
      this.scenarioForm.subnetNum = scenarioId;
      this.scenarioForm.infiltrateLevel = scenarioId;
      this.scenarioForm.protectionLevel = scenarioId;
      this.scenarioForm.targetNum = scenarioId;
      this.scenarioForm.vulnerabilityNum = scenarioId;
    }
    this.tempRoute = Object.assign({}, this.$route)
  }
}
</script>

<style scoped>
.scenario-detail-container {
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