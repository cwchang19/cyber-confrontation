<template>
  <div class="test-container">
    {{ testVal }}
  </div>
</template>

<script>
export default {
  name: 'Test',
  props: {
    testVal: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {}
  }
}
</script>

<style>
</style>