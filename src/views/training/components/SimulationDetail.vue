<template>
  <div class="training-simulation-detail-container">
    <h1>仿真</h1>
    <el-row :gutter="20" class="content-row">
      <el-col :span="6" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }">
          <!-- <div slot="header" class="clearfix">
            <span>历史训练</span>
          </div>
          <el-select v-model="historyId" value-key="" placeholder="请选择历史训练" filterable @change="" style="width: 100%;">
          </el-select> -->
          <el-button type="primary" size="default" plain @click="debugClick">单步调试</el-button>
          <!-- <Test :test-val="testVal"></Test> -->
        </el-card>
      </el-col>
      <el-col :span="18" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }" v-loading="!visualizationReady">
          <Visualization v-if="visualizationReady" :is-train="true" :recv-subnet="subnets" :recv-topology="topology"></Visualization>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Visualization from '@/components/Visualization/index'
// import Test from '@/views/test/index'
import { searchScenarioById } from '@/api/scenario';
import { debugTraining } from  '@/api/training'
import { arrayToTree, deepCopy, parseScenarioJSON } from '@/utils/other'

export default {
  name: 'SimulationDetail',
  components: {
    Visualization,
    // Test,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // testVal: 4,
      training_id: '',
      scenario_id: '',
      subnets: null,
      topology: null,
      visualizationReady: false,
      tempRoute: {},
      historyId: null,
      is_begin: true,
      model_path: 'model.pt',
    }
  },
  created() {
    if(this.$route.params) {
      [this.training_id, this.scenario_id] = this.$route.params.str.split('.');
      console.log([this.training_id, this.scenario_id]);
      this.tempRoute = Object.assign({}, this.$route);
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      this.visualizationReady = false;
      const response = await searchScenarioById(this.scenario_id);
      const res = parseScenarioJSON(response.data);
      this.subnets = res.subnets;
      this.topology = res.topology;
      this.visualizationReady = true;
    },
    async debugClick() {
      const response = await debugTraining(this.training_id, { is_begin: this.is_begin, model_path: this.model_path });
      this.is_begin = response.data.done;
      console.log(response);
    }
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