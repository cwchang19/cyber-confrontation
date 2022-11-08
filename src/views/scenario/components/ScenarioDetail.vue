<template>
  <div class="scenario-detail-container">
    <h1>{{ isEdit ? '修改场景 - ' + (this.$route.params && this.$route.params.id) : '新增场景' }}</h1>
    <el-row :gutter="20" class="content-row">
      <el-col :span="6" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }">
          <div slot="header" class="clearfix">
            <span>场景细节</span>
            <el-button style="float: right; padding: 3px 0" type="text">自动生成</el-button>
          </div>
          <el-form :model="scenarioForm" status-icon ref="scenarioForm" :rules="scenarioFormRules" label-width="100px" class="scenario-form">
            <template v-for="(item, index) in formItem">
              <el-form-item v-if="index === 0" :label="item.label" :prop="item.key" style="width: 93%; margin-bottom: 2.5rem;">
                <el-input v-model="scenarioForm[item.key]" placeholder="请输入场景名" clearable></el-input>
              </el-form-item>
              <el-form-item v-else :label="item.label" :prop="item.key">
                <el-input-number 
                  :label="item.label" 
                  v-model="scenarioForm[item.key]" 
                  controls-position="right"
                  :min="0"
                  size="large"
                  style="width: 90%; margin-bottom: 20px;">
                </el-input-number>
              </el-form-item>
            </template>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="18" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>可视化创建</span>
          </div>
          <el-button type="primary" size="default" @click="saveScenarioClick">保存</el-button>
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
        name: '',
        nodeNum: 0,
        subnetNum: 0,
        infiltrateLevel: 0,
        protectionLevel: 0,
        targetNum: 0,
        vulnerabilityNum: 0,
      },
      formItem: [
        {key: 'name', label: '场景名'},
        {key: 'nodeNum', label: '节点数'},
        {key: 'subnetNum', label: '子网数'},
        {key: 'infiltrateLevel', label: '渗透级数'},
        {key: 'protectionLevel', label: '保护等级'},
        {key: 'targetNum', label: '目标节点数'},
        {key: 'vulnerabilityNum', label: '漏洞数'},
      ],
      scenarioFormRules: {
        name: [
          { required: true, message: '请输入场景名', trigger: 'change' }
        ],
      }
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
  },
  methods: {
    saveScenarioClick() {
      this.$refs['scenarioForm'].validate((valid) => {
        if(valid) {
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push("/scenario/index");
        } else {
          return false;
        }
      })
    }
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