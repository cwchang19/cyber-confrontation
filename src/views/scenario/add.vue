<template>
  <div class="scenario-add-container">
    <el-tabs type="border-card">
      <el-tab-pane label="可视化生成">
        <ScenarioDetial></ScenarioDetial>
      </el-tab-pane>
      <el-tab-pane label="自动生成">
        <AutoGenerator></AutoGenerator>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ScenarioDetial from './components/ScenarioDetail';
import AutoGenerator from './components/AutoGenerator';

export default {
  name: 'ScenarioAdd',
  components: {
    ScenarioDetial,
    AutoGenerator,
  }
}
</script>

<style>

</style>