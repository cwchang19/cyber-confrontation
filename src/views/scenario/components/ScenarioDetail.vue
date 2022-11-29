<template>
  <div class="scenario-detail-container">
    <el-row :gutter="20" class="content-row">
      <el-col :span="4" :offset="0" class="content-col">
        <el-card shadow="always" class="card" :body-style="{ padding: '20px', height: '100%' }">
          <div slot="header" class="clearfix">
            <span>场景细节</span>
          </div>
          <el-form :model="scenarioForm" status-icon ref="scenarioForm" :rules="scenarioFormRules" label-position="top"
            label-width="100px" size="small" class="scenario-form">
            <template v-for="(item, index) in formItem">
              <el-form-item v-if="item.key == 'name'" :label="item.label" :prop="item.key">
                <el-input v-model="scenarioForm[item.key]" :placeholder="'请输入' + item.label" clearable></el-input>
              </el-form-item>
              <el-form-item v-else-if="item.key == 'uniform' || item.key == 'random_goal'" :label="item.label"
                :prop="item.key">
                <el-radio-group v-model="scenarioForm[item.key]">
                  <el-radio :label="false">否</el-radio>
                  <el-radio :label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-else :label="item.label" :prop="item.key">
                <el-input :label="item.label" v-model.number="scenarioForm[item.key]">
                </el-input>
              </el-form-item>
            </template>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="20" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }" v-loading="!visualizationReady">
          <Visualization v-if="visualizationReady" :recv-subnet="subnets" :recv-topology="topology" @watchSaveClick="saveScenarioClick"></Visualization>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Visualization from '@/components/Visualization/index'
import { searchScenarioById, addScenario, alterScenario } from '@/api/scenario'
import { deepCopy, parseScenarioJSON, stringifyScenarioJSON } from '@/utils/other';

import ExampleJSON from '@/assets/json/example.json'

export default {
  name: 'ScenarioDetail',
  components: {
    Visualization,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      jsonData: '',
      tempRoute: {},
      scenario_id: '',
      directory_id: '',
      subnets: {},
      topology: {},
      visualizationReady: false,
      scenarioForm: {
        name: '',
        directory_id: '',
        service_scan_cost: 1,
        os_scan_cost: 1,
        subnet_scan_cost: 1,
        process_scan_cost: 1,
        step_limit: 1000,
      },
      formItem: [
        { key: 'name', label: '场景名' },
        { key: 'service_scan_cost', label: '服务扫描代价' },
        { key: 'os_scan_cost', label: '系统扫描代价' },
        { key: 'subnet_scan_cost', label: '子网扫描代价' },
        { key: 'process_scan_cost', label: '进程扫描代价' },
        { key: 'step_limit', label: '最大步数' },
      ],
      scenarioFormRules: {
        name: [
          { required: true, message: '请输入场景名', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      [this.scenario_id, this.directory_id] = (this.$route.params && this.$route.params.str).split('.');
      // console.log(this.scenario_id, this.directory_id);
      // 根据 id 请求场景信息
      this.fetchData();
    } else {
      this.jsonData = JSON.stringify(ExampleJSON, null, 2);
      this.scenarioForm.directory_id = this.$route.params && this.$route.params.did;
      this.scenarioForm.directory_id = parseInt(this.scenarioForm.directory_id.substring(8));
    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    async fetchData() {
      const response = await searchScenarioById(this.scenario_id);
      this.scenarioForm = Object.assign(this.scenarioForm, response.data);
      const data = deepCopy(response.data);
      Reflect.deleteProperty(data, 'name');
      Reflect.deleteProperty(data, 'id');
      this.jsonData = JSON.stringify(data, null, 2);
      const res = parseScenarioJSON(response.data);
      this.subnets = res.subnets;
      this.topology = res.topology;
      this.visualizationReady = true;
    },
    saveScenarioClick(subnets, topology) {
      this.$refs['scenarioForm'].validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            console.log(this.directory_id)
            const params = {
              name: this.scenarioForm.name,
              directory_id: parseInt(this.directory_id),
            }
            let response = await alterScenario(parseInt(this.scenario_id), params, JSON.parse(this.jsonData));
            // console.log(response);
          } else {
            const res = stringifyScenarioJSON(Object.assign(this.scenarioForm, {subnets, topology}));
            console.log(res);
            const params = {
              name: this.scenarioForm.name,
              directory_id: this.scenarioForm.directory_id
            }
            const response = await addScenario(params, res);
          }
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push("/scenario/index");
        } else {
          return false;
        }
      })
    },
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

.card {
  overflow-y: auto;
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