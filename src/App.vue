<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.el-table__body tr.current-row>td {
   background: #409EFF !important;
   color: white;
}
</style>