<template>
  <div class="privilege-escalation-container">
    <el-row type="flex" justify="end" style="padding: 0px 10px">
      <el-button type="text" size="small" @click="addPrivilegeEscalation">新增权限提升</el-button>
      <el-button type="text" size="small" @click="savePrivilegeEscalation">保存</el-button>
    </el-row>
    <el-row>
    </el-row>
    <el-table :data="privilegeEscalation" stripe>
      <el-table-column props="no" label="No" type="index">
      </el-table-column>
      <el-table-column props="service" label="进程">
        <template slot-scope="scope">
          <el-select v-model="scope.row.process" size="mini" placeholder="选择进程" filterable>
            <el-option v-for="item in processes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column props="os" label="操作系统">
        <template slot-scope="scope">
          <el-select v-model="scope.row.os" size="mini" placeholder="选择操作系统" filterable>
            <el-option v-for="item in os" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column props="prob" label="成功概率[0-1]">
        <template slot-scope="scope">
          <el-input v-model="scope.row.prob" placeholder="[0, 1]的小数" size="mini"></el-input>
          <!-- <el-input-number v-model="scope.row.prob" size="mini" precision="2" :min="0" :max="1"
            :controls="false" style="width: 100%;">
          </el-input-number> -->
        </template>
      </el-table-column>
      <el-table-column props="cost" label="动作成本">
        <template slot-scope="scope">
          <el-input v-model="scope.row.cost" placeholder="非负值" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column props="access" label="获取访问权限">
        <template slot-scope="scope">
          <el-select v-model="scope.row.access" size="mini" placeholder="选择可获取权限" filterable>
            <el-option key="user" label="user" value="user"></el-option>
            <el-option key="root" label="root" value="root"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="50">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-close" @click="deletePrivilegeEscalation(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deepCopy } from '@/utils/other';
import { Notification } from 'element-ui';

export default {
  name: 'PrivilegeEscalation',
  props: {
    curPrivilegeEscalation: {
      type: Array,
      default: null
    },
    curSubnet: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      os: [],
      processes: [],
      privilegeEscalation: [],
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      if (this.curSubnet) {
        let processSet = new Set();
        let osSet = new Set();
        for (let subnetKey in this.curSubnet) {
          for (let hostKey in this.curSubnet[subnetKey].hosts) {
            for (let process of this.curSubnet[subnetKey].hosts[hostKey].processes) {
              processSet.add(process);
            }
            osSet.add(this.curSubnet[subnetKey].hosts[hostKey].os);
          }
        }
        this.processes = [...processSet];
        this.os = [...osSet];
        for (let i = 0; i < this.processes.length; i++) {
          this.processes[i] = {
            value: this.processes[i],
            label: this.processes[i]
          }
        }
        for (let i = 0; i < this.os.length; i++) {
          this.os[i] = {
            value: this.os[i],
            label: this.os[i]
          }
        }
        // console.log(this.services);
      }
      // console.log(this.curSubnetFirewall);
      console.log('pe', this.curPrivilegeEscalation);
      if (this.curPrivilegeEscalation) {
        this.privilegeEscalation = deepCopy(this.curPrivilegeEscalation);
      }
    },
    addPrivilegeEscalation() {
      this.privilegeEscalation.push({
        process: '',
        os: '',
        prob: '',
        cost: '',
        access: ''
      })
    },
    savePrivilegeEscalation() {
      const errorMsg = this.checkValidate();
      if(errorMsg == '') {
        this.$emit('watchPrivilegeEscalation', deepCopy(this.privilegeEscalation));
      } else {
        Notification({
          type: 'error',
          dangerouslyUseHTMLString: true,
          message: errorMsg,
          duration: 0,
          position: 'top-left'
        })
      }
    },
    deletePrivilegeEscalation(scope) {
      this.privilegeEscalation.splice(scope.$index, 1);
    },
    checkValidate() {
      let result = '';
      for(let i=0; i<this.privilegeEscalation.length; i++) {
        // console.log()
        if(this.privilegeEscalation[i].process == '') {
          result += `序号${i+1}：进程不能为空</br>`;
        }
        if(this.privilegeEscalation[i].os == '') {
          result += `序号${i+1}：操作系统不能为空</br>`;
        }
        let prob = parseFloat(this.privilegeEscalation[i].prob);
        if(Object.is(prob, NaN) || prob > 1 || prob < 0) {
          result += `序号${i+1}：输入的成功概率不合法，应为[0, 1]间的小数</br>`;
        } else {
          this.privilegeEscalation[i].prob = prob;
        }
        let cost = parseFloat(this.privilegeEscalation[i].cost);
        if(Object.is(cost, NaN) || cost < 0) {
          result += `序号${i+1}：输入的动作成本不合法，应为非负值</br>`;
        } else {
          this.privilegeEscalation[i].cost = cost;
        }
        if(this.privilegeEscalation[i].access == '') {
          result += `序号${i+1}：可获取访问权限不能为空</br>`;
        }
      }
      return result;
    }
  }
}
</script>

<style scoped>

</style>