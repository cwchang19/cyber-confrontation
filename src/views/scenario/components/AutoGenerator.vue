<template>
  <div class="auto-generator-container">
    <el-row :gutter="20" class="content-row">
      <el-form :model="scenarioForm" status-icon ref="scenarioForm" :rules="scenarioFormRules" label-position="right"
        :inline="true" size="small" class="scenario-form">
        <template v-for="(item, index) in formItem">
          <el-form-item v-if="item.key == 'name'" :label="`[ ${item.label} ]`" :prop="item.key" style="width: 30%;">
            <el-input v-model="scenarioForm[item.key]" :placeholder="'请输入' + item.label" clearable></el-input>
          </el-form-item>
          <el-form-item v-else-if="item.key == 'uniform' || item.key == 'random_goal'" :label="`[ ${item.label} ]`" style="width: 30%;"
            :prop="item.key">
            <el-radio-group v-model="scenarioForm[item.key]">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-else :label="`[ ${item.label} ]`" :prop="item.key" style="width: 30%;">
            <el-input :label="item.label" :disabled="(item.key == 'alpha_H' || item.key == 'alpha_V' || item.key == 'lambda_V') && !scenarioForm.uniform" v-model.number="scenarioForm[item.key]">
            </el-input>
          </el-form-item>
        </template>
        <div>
          <el-button type="primary" style="width: 100%" @click="saveScenarioClick">自动生成</el-button>
        </div>

      </el-form>
    </el-row>
  </div>
</template>

<script>
import { searchScenarioById, generateScenario } from '@/api/scenario'
import ExampleJSON from '@/assets/json/example.json'
import { deepCopy } from '@/utils/other';

export default {
  name: 'ScenarioDetail',
  data() {
    return {
      jsonData: '',
      tempRoute: {},
      scenario_id: '',
      directory_id: '',
      scenarioForm: {
        name: '',
        directory_id: '',
        num_hosts: 3,
        num_services: 1,
        num_os: 2,
        num_processes: 2,
        num_exploits: 1,
        num_privescs: 1,
        r_sensitive: 10,
        r_user: 10,
        exploit_cost: 1,
        exploit_probs: 1,
        privesc_cost: 1,
        privesc_probs: 1,
        service_scan_cost: 1,
        os_scan_cost: 1,
        subnet_scan_cost: 1,
        process_scan_cost: 1,
        uniform: false,
        alpha_H: 2,
        alpha_V: 2,
        lambda_V: 1,
        restrictiveness: 5,
        random_goal: false,
        base_host_value: 1,
        host_discovery_value: 1,
        seed: 1,
        step_limit: 1000,
      },
      formItem: [
        { key: 'name', label: '场景名' },
        { key: 'num_hosts', label: '主机数量', min: 3 },
        { key: 'num_services', label: '服务数量', min: 1 },
        { key: 'num_os', label: '系统数量', min: 1 },
        { key: 'num_processes', label: '进程数量', min: 1 },
        { key: 'num_exploits', label: '漏洞数量', min: 1 },
        { key: 'num_privescs', label: '权限升级操作数', min: 1 },
        { key: 'r_sensitive', label: '敏感子网奖励' },
        { key: 'r_user', label: '用户子网奖励' },
        { key: 'exploit_cost', label: '攻击代价' },
        { key: 'exploit_probs', label: '攻击成功概率' },
        { key: 'privesc_cost', label: '权限提升代价' },
        { key: 'privesc_probs', label: '权限提升成功概率' },
        { key: 'service_scan_cost', label: '服务扫描代价' },
        { key: 'os_scan_cost', label: '系统扫描代价' },
        { key: 'subnet_scan_cost', label: '子网扫描代价' },
        { key: 'process_scan_cost', label: '进程扫描代价' },
        { key: 'uniform', label: '是使用统一分布' },
        { key: 'alpha_H', label: '主机配置之间相关性的缩放浓度参数', min: 0 },
        { key: 'alpha_V', label: '控制跨主机配置的服务之间的关联', min: 0 },
        { key: 'lambda_V', label: '控制每个主机配置运行的平均服务数的参数', min: 0 },
        { key: 'restrictiveness', label: '允许通过区域间防火墙的最大服务数' },
        { key: 'random_goal', label: '是否随机分配目标用户主机' },
        { key: 'base_host_value', label: '非敏感主机的值' },
        { key: 'host_discovery_value', label: '首次发现主机价值' },
        { key: 'seed', label: '随机种子' },
        { key: 'step_limit', label: '最大步数' },
      ],
      scenarioFormRules: {
        name: [
          { required: true, message: '请输入场景名', trigger: 'change' }
        ],
        num_hosts: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        num_services: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
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
      let response = await searchScenarioById(this.scenario_id);
      this.scenarioForm = Object.assign(this.scenarioForm, response.data);
      let data = deepCopy(response.data);
      Reflect.deleteProperty(data, 'name');
      Reflect.deleteProperty(data, 'id');
      this.jsonData = JSON.stringify(data, null, 2);
    },
    saveScenarioClick() {
      this.$refs['scenarioForm'].validate(async (valid) => {
        if (valid) {
          const response = await generateScenario(this.scenarioForm);
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push("/scenario/index");
        } else {
          return false;
        }
      })
    },
    async generateClick() {

    }
  }
}
</script>

<style scoped>
.auto-generator-container {
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