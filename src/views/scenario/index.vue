<template>
  <div class="scenario-container">

    <router-link :to="'/scenario/add/1'">
      <el-button type="success" size="small">
        新增1
      </el-button>
    </router-link>
    <router-link :to="'/scenario/add/2'">
      <el-button type="success" size="small">
        新增2
      </el-button>
    </router-link>
    <router-link :to="'/scenario/edit/1'">
      <el-button type="primary" size="small">
        修改1
      </el-button>
    </router-link>
    <router-link :to="'/scenario/edit/2'">
      <el-button type="primary" size="small">
        修改2
      </el-button>
    </router-link>
    <router-link :to="'/training/add/1'">
      <el-button type="warning" size="small">
        训练1
      </el-button>
    </router-link>
    <router-link :to="'/training/add/2'">
      <el-button type="warning" size="small">
        训练2
      </el-button>
    </router-link>
    <!-- <el-button type="primary" size="default" @click="jump">
      新建
    </el-button> -->
  </div>
</template>

<script>
export default {
  name: 'Scenario',
  components: {},
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style>

</style>