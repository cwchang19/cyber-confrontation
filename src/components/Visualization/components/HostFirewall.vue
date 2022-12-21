<template>
  <div class="host-firewall-container">
    <el-row>
      <el-alert title="主机间防火墙说明" type="warning" effect="light" show-icon :closable="false">
        <template>
          <div>1. 每个主机间防火墙设置由（当前主机，目标主机，阻止服务）构成，即阻止从目标主机到当前主机的特定服务。</div>
          <div>2. 当阻止服务设置为空或两个主机间不设置防火墙时，表示允许从目标主机到当前主机的任何服务。</div>
        </template>
      </el-alert>
    </el-row>
    <el-row type="flex" justify="end" style="padding: 10px 10px">
      <el-button type="success" size="small" @click="addFirewall">新增防火墙</el-button>
      <el-button type="primary" size="small" @click="saveFirewall">保存</el-button>
    </el-row>
    <el-row>
    </el-row>
    <el-table :data="firewalls" stripe>
      <el-table-column props="no" label="No" type="index">
      </el-table-column>
      <el-table-column props="source" label="当前主机">
        <template slot-scope="scope">
          <el-select v-model="scope.row.sourceSubnet" size="mini" placeholder="选择当前子网" filterable
            @change="scope.row.sourceHost = ''; scope.row.targetSubnet = ''; scope.row.targetHost = '';">
            <el-option v-for="item in sourceSubnet" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <el-select v-model="scope.row.sourceHost" size="mini" placeholder="选择当前主机" filterable>
            <el-option v-for="item in host[scope.row.sourceSubnet]" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column props="target" label="目标主机">
        <template slot-scope="scope">
          <el-select v-model="scope.row.targetSubnet" size="mini" placeholder="选择目标子网"
            :disabled="scope.row.source == ''" filterable @change="scope.row.targetHost = ''">
            <el-option v-for="item in targetSubnet[scope.row.sourceSubnet]" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
          <el-select v-model="scope.row.targetHost" size="mini" placeholder="选择目标主机" :disabled="scope.row.source == ''"
            filterable>
            <el-option v-for="item in host[scope.row.targetSubnet]" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column props="services" label="阻止服务">
        <template slot-scope="scope">
          <el-select v-model="scope.row.services" size="mini" value-key="" placeholder=""
            v-if="scope.row.source != '' && scope.row.target != ''" filterable multiple style="width: 100%">
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
  name: 'HostFirewall',
  props: {
    curHostFirewall: {
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
      host: {},
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
      if (this.curTopology) {
        for (let item in this.curTopology) {
          if(item == '0') {
            continue;
          }
          this.sourceSubnet.push({
            value: item,
            label: `子网 ${item}`,
          });
          this.targetSubnet[item] = [];
          for (let i = 0; i < this.curTopology[item].length; i++) {
            if (this.curTopology[item][i] == item || this.curTopology[item][i] == '0') continue;
            this.targetSubnet[item].push({
              value: this.curTopology[item][i],
              label: this.curTopology[item][i] == '0' ? '外网' : `子网 ${this.curTopology[item][i]}`
            });
          }
        }
      }
      if (this.curSubnet) {
        let set = new Set();
        for (let subnetKey in this.curSubnet) {
          this.host[subnetKey] = []
          for (let hostKey in this.curSubnet[subnetKey].hosts) {
            this.host[subnetKey].push({
              value: hostKey,
              label: `主机 ${hostKey}`
            })
            // console.log(this.curSubnet[subnetKey].hosts[hostKey].services);
            for (let service of this.curSubnet[subnetKey].hosts[hostKey].services) {
              set.add(service);
            }
          }
        }
        this.services = [...set];
        for (let i = 0; i < this.services.length; i++) {
          this.services[i] = {
            value: this.services[i],
            label: this.services[i]
          }
        }
        // console.log(this.services);
      }
      // console.log(this.curSubnetFirewall);
      if (this.curHostFirewall) {
        console.log(this.curHostFirewall);
        console.log(this.sourceSubnet);
        this.firewalls = deepCopy(this.curHostFirewall);
      }
    },
    addFirewall() {
      this.firewalls.push({
        sourceSubnet: '',
        sourceHost: '',
        targetSubnet: '',
        targetHost: '',
        services: [],
      })
    },
    saveFirewall() {
      const errorMsg = this.checkValidate();
      if (errorMsg == '') {
        this.$emit('watchHostFirewall', deepCopy(this.firewalls));
        // this.$message.success('保存成功');
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
      for (let i = 0; i < this.firewalls.length; i++) {
        if (this.firewalls[i].sourceSubnet == '') {
          result += `序号${i+1}：起始子网不能为空</br>`;
        } 
        if (this.firewalls[i].sourceHost == '') {
          result += `序号${i+1}：起始主机不能为空</br>`;
        } 
        if (this.firewalls[i].targetSubnet == '') {
          result += `序号${i+1}：目标子网不能为空</br>`;
        } 
        if (this.firewalls[i].targetHost == '') {
          result += `序号${i+1}：目标主机不能为空</br>`;
        }
      }
      return result;
    }
  }
}
</script>

<style scoped>

</style>