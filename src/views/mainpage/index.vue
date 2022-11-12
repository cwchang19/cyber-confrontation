<template>
  <div class="scenario">
    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple"></div>
        <div align="center">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <div align="left">
                <span>场景数量</span>
              </div>
              <router-link :to="'/scenario/index'">
                <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
              </router-link>
            </div>
            <div class="text item">123</div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light"></div>
        <div align="center">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <div align="left">
                <span>训练数量</span>
              </div>
              <router-link :to="'/training/index'">
                <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
              </router-link>
            </div>
            <div class="text item">56</div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <div align="center">网络攻防对抗系统用户操作流程概要简介</div>
    <el-divider></el-divider>
    <div align="center">
      <el-image :src="require('@/assets/img/frontpic.png')"  fit="contain" ></el-image>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MainPage',
    components: {

    },
    data() {
      return {
        
      }
    },
  }
</script>

<style>
  .text {
    font-size: 24px;
  }

  .item {
    margin-bottom: 12px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 240px;
  }
</style>

