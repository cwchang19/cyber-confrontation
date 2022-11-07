<template>
  <div class="scenario-edit-container">
    <ScenarioDetial :is-edit="true"></ScenarioDetial>
  </div>
</template>

<script>
  import ScenarioDetial from './components/ScenarioDetail';

  export default {
    name: 'ScenarioEdit',
    components: {
      ScenarioDetial,
    }
  }
</script>

<style>
</style>