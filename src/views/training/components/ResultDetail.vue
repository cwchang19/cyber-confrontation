<template>
  <div class="training-result-detail-container">
    <h1>结果</h1>
    <el-row :gutter="20" class="content-row">
      <el-col :span="6" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }" v-loading="loading">
          <el-row style="margin-top: 20px;">
            <span>Steps</span>
            <el-table ref="historyTable" :data="history" :height="700" size="mini" current-row-key="steps"
              @row-click="rowClick" highlight-current-row stripe>
              <el-table-column prop="steps" width="50">
              </el-table-column>
              <el-table-column prop="action">
                <template slot-scope="scope">
                  <div :ref="`step${scope.row.steps}`">{{ scope.row.action }}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          
          <!-- <Test :test-val="testVal"></Test> -->
        </el-card>
      </el-col>
      <el-col :span="18" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }" v-loading="!visualizationReady">
          <Sim v-if="visualizationReady" :debug-data="debugData" :recv-subnet="subnets" :recv-topology="topology"></Sim>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import Visualization from '@/components/Visualization/index'
import Sim from '@/components/Visualization/sim'
// import Test from '@/views/test/index'
import { searchScenarioById } from '@/api/scenario';
import { debugTraining } from '@/api/training'
import { parseScenarioJSON } from '@/utils/other'

export default {
  name: 'ResultDetail',
  components: {
    Sim,
    // Test,
  },
  data() {
    return {
      loading: true,
      training_id: '',
      scenario_id: '',
      subnets: null,
      topology: null,
      visualizationReady: false,
      tempRoute: {},
      historyId: null,
      is_begin: true,
      model_path: 'model.pt',
      debugData: null,
      debugSteps: [],
      stepMap: null,
      history: [],
      curStep: 0,
      isAutoing: false,
      isDone: false,
      isRequest: false,
      interval: null,
    }
  },
  created() {
    if (this.$route.params) {
      [this.training_id, this.scenario_id] = this.$route.params.str.split('.');
      // console.log([this.training_id, this.scenario_id]);
      this.tempRoute = Object.assign({}, this.$route);
      this.fetchScnData();
      this.fetchStepData();
    }
  },
  watch: {
    debugData: function (val) {
      this.highlightRow(val);
    }
  },
  methods: {
    async fetchScnData() {
      this.visualizationReady = false;
      const response = await searchScenarioById(this.scenario_id);
      const res = parseScenarioJSON(response.data);
      this.subnets = res.subnets;
      this.topology = res.topology;
      this.visualizationReady = true;
    },
    async fetchStepData() {
      this.stepMap = new Map();
      this.loading = true;
      let response = await debugTraining(this.training_id, { is_begin: true, model_path: this.model_path });
      while(response.data.length == 0) {
        response = await debugTraining(this.training_id, { is_begin: true, model_path: this.model_path });
      }
      this.history = response.data;
      for(let i=0; i<this.history.length; i++) {
        this.stepMap.set(this.history[i].steps, i);
        this.history[i] = this.solve(this.history[i]);
      }
      this.loading = false;
    },
    // async nextClick() {
    //   if (this.curStep == this.history.length) {
    //     this.isRequest = true;
    //     const response = await debugTraining(this.training_id, { is_begin: (this.curStep == 0), model_path: this.model_path });
    //     this.isRequest = false;
    //     this.isDone = response.data.done;
    //     if (this.isDone) {
    //       this.stopClick();
    //     }
    //     let data = response.data;
    //     let res = this.solve(data);
    //     this.debugData = res;
    //     this.history.push(res);
    //     // this.highlightRow(res);
    //   } else {
    //     this.debugData = this.history[this.curStep];
    //     // this.highlightRow(this.history[this.curStep]);
    //   }
    //   this.curStep++;
    // },
    async nextClick() {
      if (this.curStep == this.history.length) {
        this.isRequest = true;
        console.log(this.debugSteps[this.curStep]);
        const response = this.debugSteps[this.curStep];
        this.isRequest = false;
        this.isDone = response.done;
        if (this.isDone) {
          this.stopClick();
        }
        let data = response;
        let res = this.solve(data);
        this.debugData = res;
        this.history.push(res);
        // this.highlightRow(res);
      } else {
        this.debugData = this.history[this.curStep];
        this.isDone = this.debugData.done;
        // this.highlightRow(this.history[this.curStep]);
      }
      this.curStep++;
    },
    frontClick() {
      if (this.curStep >= 0) {
        this.curStep--;
        if (this.curStep == 0) {
          this.debugData = null;
          this.isDone = false;
        } else {
          this.debugData = this.history[this.curStep - 1];
          this.isDone = this.debugData.done;
        }
      }
    },
    async autoClick() {
      this.isAutoing = true;
      this.interval = setInterval(async () => {
        this.nextClick();
        // console.log('autoing');
      }, 1500)
    },
    stopClick() {
      clearInterval(this.interval);
      this.isAutoing = false;
    },
    restartClick() {
      this.stopClick()
      this.curStep = 0;
      this.debugData = null;
      this.history = [];
      this.isDone = false;
      this.isAutoing = false;
      this.fetchStepData();
    },
    solve(data) {
      let { action, steps, reward, done } = data;
      let [actionStr, actionDetail] = action.split(': ');
      if (actionStr.includes('Scan')) {
        let [subnetNum, hostNum, cost, prob, req_access] = actionDetail.match(/\d+(\.\d+)?/g);
        return { actionStr, subnetNum, hostNum, cost, prob, req_access, action, steps, reward, done }
        // this.debugData = { actionStr, subnetNum, hostNum, cost, prob, req_access, action, steps, reward, done };
        // this.history.push({ actionStr, subnetNum, hostNum, cost, prob, req_access, action, steps, reward, done });
      } else {
        let [subnetNum, hostNum, cost, prob, req_access, access] = actionDetail.match(/\d+(\.\d+)?/g);
        let temp = actionDetail.match(/os=.*,/g);
        temp = temp[0].split(',');
        let os = temp[0].split('=')[1];
        let service = temp[1].split('=')[1];
        return { actionStr, subnetNum, hostNum, cost, prob, req_access, access, os, service, action, steps, reward, done };
        // this.debugData = { actionStr, subnetNum, hostNum, cost, prob, req_access, access, os, service, action, steps, reward, done };
        // this.history.push({ actionStr, subnetNum, hostNum, cost, prob, req_access, access, os, service, action, steps, reward, done });
      }
    },
    rowClick(row, column, event) {
      this.curStep = this.stepMap.get(row.steps);
      this.debugData = this.history[this.curStep];
      console.log(this.debugData);
    },
    highlightRow(row) {
      this.$refs.historyTable.setCurrentRow(row, true);
      this.$nextTick(() => {
        let curRow = document.querySelector('.current-row');
        if(curRow)
          this.$refs.historyTable.bodyWrapper.scrollTop = curRow.offsetTop;
      })
    }
  }
}
</script>

<style scoped>
.training-result-detail-container {
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