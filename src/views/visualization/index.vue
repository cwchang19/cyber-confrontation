<template>
  <div class="container">
    <div v-for="subnet in subnets">
      子网 {{ subnet.id }}
      <div v-for="host in subnet.hosts">
        主机 {{ host.id }}
      </div>
    </div>
    <el-button type="primary" size="default" @click="deleteHost">删除</el-button>
  </div>
</template>

<script>
import scenarioExample from '@/assets/json/example.json'
import { parseScenarioJSON } from '@/utils/other'

export default {
  data() {
    return {
      subnets: {},
    }
  },
  created() {
    let scenario = parseScenarioJSON(scenarioExample)
    this.subnets = scenario.subnets;
    console.log(JSON.stringify(this.subnets, null, 2));
  },
  methods: {
    deleteHost() {
      this.$set(this.subnets['1'].hosts, '1', {});
      this.$delete(this.subnets['3'].hosts, '0');
    }
  }
}
</script>

<style>

</style>