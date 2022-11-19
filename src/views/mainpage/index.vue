<template>
  <div class="mainpage-container">
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple"></div>
        <div align="center">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <div align="left">
                <span>算法数量</span>
              </div>
              <router-link :to="'algorithm/index'">
                <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
              </router-link>
            </div>
            <div class="text item">{{ algNum }}</div>
          </el-card>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="grid-content bg-purple"></div>
        <div align="center">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <div align="left">
                <span>动作数量</span>
              </div>
              <router-link :to="'action/index'">
                <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
              </router-link>
            </div>
            <div class="text item">{{ actNum }}</div>
          </el-card>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="grid-content bg-purple-light"></div>
        <div align="center">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <div align="left">
                <span>用户数量</span>
              </div>
              <router-link :to="'user/index'">
                <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
              </router-link>
            </div>
            <div class="text item">{{ userNum }}</div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { searchAlgorithmByCondition } from '@/api/algorithm'
import { searchUserByCondition } from '@/api/user'
import { searchActionByCondition } from '@/api/action'
export default {
  name: 'Mainpage',
  components: {},
  data() {
    return {
      algNum: 0,
      actNum: 0,
      userNum: 0
    }
  },
  created() {
    this.fetchData()
  },
  activated() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      let algparams = {
        algorithm_name: '',
        pageSize: 999999,
        page: 1
      }
      let actparams = {
        action_name: '',
        pageSize: 999999,
        page: 1
      }
      let userparams = {
        user_name: '',
        pageSize: 999999,
        page: 1
      }
      const actresponse = await searchActionByCondition(actparams)
      console.log(actresponse)
      const algresponse = await searchAlgorithmByCondition(algparams)
      console.log(algresponse)
      const userresponse = await searchUserByCondition(userparams)
      console.log(userresponse)
      this.actNum = actresponse.data.total
      this.algNum = algresponse.data.total
      this.userNum = userresponse.data.total
    }
  }
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