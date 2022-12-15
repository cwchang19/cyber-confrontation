<template>
  <div class="auto-generator-container">
    <el-row :gutter="20" class="content-row">
      <el-form :model="scenarioForm" status-icon ref="scenarioForm" :rules="scenarioFormRules" label-position="right"
        :inline="true" size="small" class="scenario-form">
        <template v-for="(item, index) in formItem">
          <el-form-item v-if="item.key == 'name'" :label="`[ ${item.label} ]`" :prop="item.key" style="width: 30%;">
            <el-input v-model="scenarioForm[item.key]" :placeholder="'请输入' + item.label" clearable></el-input>
          </el-form-item>
          <el-form-item v-else-if="item.key == 'uniform' || item.key == 'random_goal'" style="width: 30%;"
            :prop="item.key">
            <span slot="label">
              {{ `[ ${item.label} ]` }}
              <el-popover placement="top-start" trigger="hover" :ref="`popover-${item.label}`"
                :content="item.content">
                <i class="el-icon-info" style="color: grey" slot="reference"></i>
              </el-popover>
            </span>
            <el-radio-group v-model="scenarioForm[item.key]">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-else :label="`[ ${item.label} ]`" :prop="item.key" style="width: 30%;">
            <span slot="label">
              {{ `[ ${item.label} ]` }}
              <el-popover placement="top-start" trigger="hover" :ref="`popover-${item.label}`"
                :content="item.content">
                <i class="el-icon-info" style="color: grey" slot="reference"></i>
              </el-popover>
            </span>
            <el-input :label="item.label"
              :disabled="(item.key == 'alpha_H' || item.key == 'alpha_V' || item.key == 'lambda_V') && !scenarioForm.uniform"
              v-model.number="scenarioForm[item.key]">
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
        { key: 'num_hosts', label: '主机数量', min: 3, content: '要包含在网络中的主机数（最小值为 3）' },
        { key: 'num_services', label: '服务数量', min: 1, content: '网络上运行的服务数（最小值为 1）' },
        { key: 'num_os', label: '系统数量', min: 1, content: '网络上运行的操作系统数（最小值为 1）' },
        { key: 'num_processes', label: '进程数量', min: 1, content: '网络上主机上运行的进程数（最小值为 1）' },
        { key: 'num_exploits', label: '漏洞数量', min: 1, content: '要使用的漏洞利用数（最小值为 1，省略则使用服务数量）' },
        { key: 'num_privescs', label: '权限升级操作数', min: 1, content: '要使用的权限提升操作数（最小值为 1，省略则使用进程数量）' },
        { key: 'r_sensitive', label: '敏感子网奖励', content: '敏感子网的奖励数值' },
        { key: 'r_user', label: '用户子网奖励', content: '用户子网的奖励数值' },
        { key: 'exploit_cost', label: '漏洞成本', content: '漏洞的成本' },
        { key: 'exploit_probs', label: '漏洞成功概率', content: '漏洞的成功概率' },
        { key: 'privesc_cost', label: '权限提升代价', content: '权限提升的代价' },
        { key: 'privesc_probs', label: '权限提升成功概率', content: '权限提升的成功概率' },
        { key: 'service_scan_cost', label: '服务扫描代价', content: '服务的扫描成本' },
        { key: 'os_scan_cost', label: '系统扫描代价', content: '系统的扫描成本' },
        { key: 'subnet_scan_cost', label: '子网扫描代价', content: '子网的扫描成本' },
        { key: 'process_scan_cost', label: '进程扫描代价', content: '进程的扫描成本' },
        { key: 'uniform', label: '是否使用均匀分布', content: '是否使用均匀分布或相关的主机配置' },
        { key: 'alpha_H', label: 'alpha_H', min: 0, content: '用于控制主机配置之间的核心关系的参数（仅在均匀分布下启用）' },
        { key: 'alpha_V', label: 'alpha_V', min: 0, content: '用于控制不同主机配置之间的服务核心关系的参数（仅在均匀分布下启用）' },
        { key: 'lambda_V', label: 'lambda_V', min: 0, content: '用于控制每个主机配置中运行的服务的平均数量的参数（仅在均匀分布下启用）' },
        { key: 'restrictiveness', label: '防火墙限制数', content: '允许通过区间防火墙的最大服务数' },
        { key: 'random_goal', label: '随机目标', content: '是否随机分配目标用户主机' },
        { key: 'base_host_value', label: '一般主机值', content: '非敏感主机的 奖励/惩罚 值' },
        { key: 'host_discovery_value', label: '发现主机值', content: '首次发现主机时获得的值' },
        { key: 'seed', label: '随机种子', content: '随机数生成器的种子' },
        { key: 'step_limit', label: '最大步数', content: '单个情节中允许的最大步数（省略则无限制）' },
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