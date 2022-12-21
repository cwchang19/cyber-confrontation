<template>
  <div class="subnet-firewall-container">
    <el-row type="flex" justify="end" style="padding: 0px 10px">
      <el-button type="text" size="small" @click="addFirewall">新增防火墙</el-button>
      <el-button type="text" size="small" @click="saveFirewall">保存</el-button>
    </el-row>
    <el-row>
    </el-row>
    <el-table :data="firewalls" stripe>
      <el-table-column props="no" label="No" type="index">
      </el-table-column>
      <el-table-column props="source" label="起始子网">
        <template slot-scope="scope">
          <el-select v-model="scope.row.source" size="mini" placeholder="选择起始子网" filterable @change="scope.row.target = ''">
            <el-option v-for="item in sourceSubnet" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column props="target" label="目标子网">
        <template slot-scope="scope">
          <el-select v-model="scope.row.target" size="mini" placeholder="选择目标子网" :disabled="scope.row.source == ''" filterable>
            <el-option v-for="item in targetSubnet[scope.row.source]" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column props="services" label="允许服务">
        <template slot-scope="scope">
          <el-select v-model="scope.row.services" size="mini" value-key="" placeholder="" filterable multiple style="width: 100%">
            <el-option v-for="item in services" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column width="50">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-close" @click="deleteFirewall(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deepCopy } from '@/utils/other';
import { Notification } from 'element-ui';

export default {
  name: 'SubnetFirewall',
  props: {
    curSubnetFirewall: {
      type: Array,
      default: null
    },
    curSubnet: {
      type: Object,
      default: null
    },
    curTopology: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      sourceSubnet: [],
      targetSubnet: {},
      services: [],
      firewalls: [],
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      if(this.curTopology){
        for(let item in this.curTopology) {
          this.sourceSubnet.push({
            value: item,
            label: item == '0' ? '外网' : `子网 ${item}`
          });
          this.targetSubnet[item] = [];
          for(let i=0; i<this.curTopology[item].length; i++) {
            if(this.curTopology[item][i] != '0' && this.curTopology[item][i] == item) continue;
            this.targetSubnet[item].push({
              value: this.curTopology[item][i],
              label: this.curTopology[item][i] == '0' ? '外网' : `子网 ${this.curTopology[item][i]}`
            });
          }
        }
      }
      if(this.curSubnet) {
        let set = new Set();
        for(let subnetKey in this.curSubnet) {
          for(let hostKey in this.curSubnet[subnetKey].hosts) {
            console.log(this.curSubnet[subnetKey].hosts[hostKey].services);
            for(let service of this.curSubnet[subnetKey].hosts[hostKey].services) {
              set.add(service);
            }
          }
        }
        this.services = [...set];
        for(let i=0; i<this.services.length; i++) {
          this.services[i] = {
            value: this.services[i],
            label: this.services[i]
          }
        }
        // console.log(this.services);
      }
      // console.log(this.curSubnetFirewall);
      if(this.curSubnetFirewall) {
        this.firewalls = deepCopy(this.curSubnetFirewall);
      }
    },
    addFirewall() {
      this.firewalls.push({
        source: '',
        target: '',
        services: [],
      })
    },
    saveFirewall() {
      const errorMsg = this.checkValidate();
      if(errorMsg == '') {
        this.$emit('watchSubnetFirewall', deepCopy(this.firewalls));
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
    deleteFirewall(scope) {
      this.firewalls.splice(scope.$index, 1);
    },
    checkValidate() {
      let result = '';
      for(let i=0; i<this.firewalls.length; i++) {
        if(this.firewalls[i].source == '') {
          result += `序号${i+1}：起始子网不能为空</br>`;
        } 
        if(this.firewalls[i].target == '') {
          result += `序号${i+1}：目标子网不能为空</br>`;
        }
      }
      return result;
    }
  }
}
</script>

<style scoped>

</style>