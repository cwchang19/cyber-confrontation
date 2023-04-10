<template>
  <div class="result-container">
    <ResultDetail></ResultDetail>
  </div>
</template>

<script>
  import ResultDetail from './components/ResultDetail';

  export default {
    name: 'Result',
    components: {
      ResultDetail,
    },
    data() {
      return {}
    },
  }
</script>

<style>
</style>