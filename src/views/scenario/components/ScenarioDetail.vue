<template>
  <div class="scenario-detail-container">
    <el-row :gutter="20" class="content-row">
      <el-col :span="4" :offset="0" class="content-col">
        <el-card shadow="always" class="card" :body-style="{ padding: '20px' }">
          <div slot="header" class="clearfix">
            <span>场景细节</span>
          </div>
          <el-form :model="scenarioForm" status-icon ref="scenarioForm" :rules="scenarioFormRules" label-position="top"
            label-width="100px" size="small" class="scenario-form">
            <template v-for="(item, index) in formItem">
              <el-form-item v-if="item.key == 'name'" :label="item.label" :prop="item.key">
                <el-input v-model="scenarioForm[item.key]" :placeholder="'请输入' + item.label" clearable></el-input>
              </el-form-item>
              <el-form-item v-else :prop="item.key">
                <span slot="label">
                  {{ item.label }}
                  <el-popover placement="top-start" width="400" trigger="hover" :ref="`popover-${item.label}`"
                    :content="item.content">
                    <i class="el-icon-info" style="color: grey" slot="reference"></i>
                  </el-popover>
                </span>
                <el-input-number v-model="scenarioForm[item.key]" :precision="item.key == 'step_limit' ? 0 : 4"
                  label="item.label" :min="0" style="width: 100%;">
                </el-input-number>
              </el-form-item>
            </template>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="20" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }" v-loading="!visualizationReady">
          <Visualization v-if="visualizationReady" :recv-subnet="subnets" :recv-topology="topology"
            :recv-host-firewall="hostFirewall" :recv-subnet-firewall="subnetFirewall" :recv-exploits="exploits"
            :recv-privilege-escalation="privilege_escalation" @watchSaveClick="saveScenarioClick"></Visualization>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Visualization from '@/components/Visualization/index'
import { searchScenarioById, addScenario, alterScenario } from '@/api/scenario'
import { parseScenarioJSON, stringifyScenarioJSON } from '@/utils/other';
import { Notification, Message } from 'element-ui';


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
      tempRoute: {},
      scenario_id: '',
      directory_id: '',
      subnets: {},
      topology: {},
      hostFirewall: [],
      subnetFirewall: [],
      exploits: [],
      privilege_escalation: [],
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
        { key: 'service_scan_cost', label: '服务扫描代价', content: '服务扫描代价必须为非负值，并将计入代理每次执行扫描时收到的奖励中。' },
        { key: 'os_scan_cost', label: '系统扫描代价', content: '系统扫描代价必须为非负值，并将计入代理每次执行扫描时收到的奖励中。' },
        { key: 'subnet_scan_cost', label: '子网扫描代价', content: '子网扫描代价必须为非负值，并将计入代理每次执行扫描时收到的奖励中。' },
        { key: 'process_scan_cost', label: '进程扫描代价', content: '进程扫描代价必须为非负值，并将计入代理每次执行扫描时收到的奖励中。' },
        { key: 'step_limit', label: '最大步数', content: '定义了渗透测试人员在单次迭代中达到目标的最大步数限制。在模拟过程中，一旦达到步数限制，则认为情节已完成，代理未能达到目标。' },
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
      this.scenarioForm.directory_id = this.$route.params && this.$route.params.did;
      this.scenarioForm.directory_id = parseInt(this.scenarioForm.directory_id.substring(8));
      this.visualizationReady = true;

    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  activated() {
    if (this.isEdit) {
      [this.scenario_id, this.directory_id] = (this.$route.params && this.$route.params.str).split('.');
      // console.log(this.scenario_id, this.directory_id);
      // 根据 id 请求场景信息
      this.fetchData();
    } else {
      this.scenarioForm.directory_id = this.$route.params && this.$route.params.did;
      this.scenarioForm.directory_id = parseInt(this.scenarioForm.directory_id.substring(8));
      this.visualizationReady = true;
    }
    this.tempRoute = Object.assign({}, this.$route);
  },
  methods: {
    async fetchData() {
      const response = await searchScenarioById(this.scenario_id);
      // console.log('response', response);
      const res = parseScenarioJSON(response.data);
      // console.log('res', res);
      this.scenarioForm = Object.assign(this.scenarioForm, res);
      this.subnets = res.subnets;
      this.topology = res.topology;
      this.hostFirewall = res.hostFirewall;
      this.subnetFirewall = res.subnetFirewall;
      this.exploits = res.exploits;
      this.privilege_escalation = res.privilege_escalation;

      this.visualizationReady = true;
    },
    async saveScenarioClick(subnets, topology, hostFirewall, subnetFirewall, exploits, privilege_escalation) {
      const checked = await this.checkScn(topology, exploits);
      // console.log(checked);
      if (checked) {
        this.$refs['scenarioForm'].validate(async (valid) => {
          if (valid) {
            if (this.isEdit) {
              const data = stringifyScenarioJSON(Object.assign(this.scenarioForm, { subnets, topology, hostFirewall, subnetFirewall, exploits, privilege_escalation }));
              console.log(data);
              const params = {
                name: this.scenarioForm.name,
                directory_id: parseInt(this.directory_id),
              }
              const response = await alterScenario(parseInt(this.scenario_id), params, data);
            } else {
              const data = stringifyScenarioJSON(Object.assign(this.scenarioForm, { subnets, topology, hostFirewall, subnetFirewall, exploits, privilege_escalation }));
              const params = {
                name: this.scenarioForm.name,
                directory_id: this.scenarioForm.directory_id
              }
              console.log(data);
              const response = await addScenario(params, data);
            }
            this.$store.dispatch("tagsView/delView", this.$route);
            this.$router.push("/scenario/index");
          } else {
            return false;
          }
        })
      }
    },
    async checkScn(topology, exploits) {
      // console.log(topology);
      // 先检查 topology
      let isConnectivity = true;
      let hasOuter = true;
      let hasExploit = true;
      let string = '';
      for (let key in topology) {
        if (topology[key].length == 1) {
          isConnectivity = false;
          string += `非连通图：子网 ${key} 未与其他任何子网相连<br/>`;
        }
        if (!hasOuter && topology[key].includes('0')) {
          hasOuter = true;
        }
      }
      if (!hasOuter) {
        string += `非连通图：外网未与任何子网相连<br/>`;
      }
      if(exploits.length == 0) {
        string += `场景内请至少设置一个漏洞<br/>`;
        hasExploit = false;
      }
      if (!(isConnectivity && hasOuter)) {
        await Notification({
          customClass: 'notify',
          dangerouslyUseHTMLString: true,
          message: string,
          type: 'error',
          duration: 0,
          position: 'bottom-left'
        })
      }
      return isConnectivity && hasOuter && hasExploit;
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

.card {
  overflow-y: auto;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>

<style>
.notify {
  width: 25rem;
}
</style>