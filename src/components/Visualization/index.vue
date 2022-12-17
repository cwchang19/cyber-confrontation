<template>
  <div class="visualization-container">
    <el-row style="height: 100%;">
      <el-col :span="12" style="height: 100%">
        <el-row class="main-edit-container" :gutter="2">
          <el-col class="main-edit-item subnet-item" v-for="(subnet, subnetKey) in subnets" :key="subnetKey" :span="8">
            <el-card shadow="hover"
              :body-style="{ padding: '20px', height: '75%', position: 'relative', overflowY: 'auto' }">
              <div slot="header">
                <span>{{ `子网 ${subnetKey}` }}</span>
                <el-button v-if="!isTrain" style="float: right; padding: 0px 5px" type="text" plain
                  @click="deleteSubnetClick(subnetKey)">删除</el-button>
                <el-button v-if="!isTrain" style="float: right; padding: 0px 5px" type="text" plain
                  @click="openTopologyDialog(subnetKey)">连接</el-button>
              </div>
              <div v-for="(host, hostKey) in subnet.hosts" :key="hostKey" class="host-item">
                <span :style="'color:' + (host.isSensitive ? '#F56C6C' : '#67C23A')">
                  {{ `${host.isSensitive ? '敏感' : ''}主机 ${hostKey}` }}
                </span>
                <div v-if="!isTrain">
                  <el-button type="text" plain size="mini" icon="el-icon-edit" style="padding: 0;"
                    @click="openHostDialogClick(subnetKey, hostKey, 'edit')"></el-button>
                  <el-button type="text" plain size="mini" icon="el-icon-delete" style="padding: 0;"
                    @click="deleteHostClick(subnetKey, hostKey)"></el-button>
                </div>
              </div>
              <div v-if="!isTrain" class="host-item">
                <el-button type="text" plain icon="el-icon-plus" size="small" style="width: 100%;"
                  @click="openHostDialogClick(subnetKey, null, 'add')">添加主机</el-button>
              </div>
            </el-card>
          </el-col>
          <el-col v-if="!isTrain" class="main-edit-item" :span="8" style="height: 30%">
            <el-button type="primary" plain style="height: 100%; width: 100%; transform: scale(90%);"
              @click="addSubnetClick">
              <div style="font-size: 50px; padding: 10px;"><i class="el-icon-plus"></i></div>
              <div style="">添加子网</div>
            </el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12" style="height: 100%;">
        <el-row style="height: 100%">
          <div id="echarts-content"></div>
        </el-row>
      </el-col>
    </el-row>

    <div v-if="!isTrain" style="position: absolute; right: 0px; bottom: 0px">
      <el-button type="primary" style="width: 100px; height: 50px" @click="saveScenarioClick">保存</el-button>
    </div>

    <el-dialog :title="`子网 ${currentSubnet} 的主机`" v-if="hostDialog" :visible.sync="hostDialog" width="30%">
      <el-form :model="hostForm" ref="hostForm" :rules="hostFormRules" label-width="120px" size="small">
        <el-form-item v-for="item in hostFormItem" :prop="item.prop">
          <span slot="label">
            {{ item.label }}
            <el-popover v-if="item.pop" placement="top-start" trigger="hover" :ref="`popover-${item.label}`" :content="item.content">
              <i class="el-icon-info" style="color: grey" slot="reference"></i>
            </el-popover>
          </span>
          <el-input-number v-if="item.prop == 'value'" :precision="4" :step="0.1" v-model="hostForm[item.prop]"
            :label="item.label" :disabled="hostForm.isSensitive">
          </el-input-number>
          <el-radio-group v-else-if="item.prop == 'isSensitive'" v-model="hostForm[item.prop]"
            @change="isSensitiveChange">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
          <el-input-number v-else-if="item.prop == 'sensitiveVal'" v-model="hostForm[item.prop]" :label="item.label"
            :precision="4" :step="0.1" :min="0.0001" :disabled="!hostForm.isSensitive"></el-input-number>
          <el-select v-else v-model="hostForm[item.prop]" value-key="value" :placeholder="`请选择${item.label}`" @change=""
            :multiple="item.multiple" allow-create default-first-option filterable clearable>
            <el-option
              v-for="item in (item.prop == 'os' ? osOptions : (item.prop == 'services' ? serviceOptions : processOptions))"
              :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="hostDialog = false">Cancel</el-button>
        <el-button type="primary" @click="hostClick(hostDialogType)">OK</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="`子网 ${currentSubnet} 的连接状态`" v-if="topologyDialog" :visible.sync="topologyDialog" width="35%">
      <el-row type="flex" justify="center">
        <el-transfer v-model="tempTopology" :titles="['非连接子网', '连接子网']" :data="getAllSubnetKey"></el-transfer>
      </el-row>
      <span slot="footer">
        <el-button @click="topologyDialog = false">取消</el-button>
        <el-button type="primary" @click="topologyConfirmClick">确认</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { deepCopy, parseSubnets, parseTopology } from '@/utils/other';
import * as echarts from 'echarts';

export default {
  name: 'Visualization',
  components: {},
  props: {
    isTrain: {
      type: Boolean,
      default: false
    },
    recvSubnet: {
      type: Object,
      default: null,
    },
    recvTopology: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      chart: null,
      hostDialog: false,
      hostDialogType: 'add',
      topologyDialog: false,
      maxSubnetId: 1,
      subnetNum: 0,
      subnets: {},
      currentSubnet: NaN,
      currentHost: NaN,
      hostForm: {
        os: '',
        services: [],
        processes: [],
        firewall: [],
        value: 0,
        isSensitive: false,
        sensitiveVal: 0.0001,
      },
      hostFormItem: [
        { prop: 'os', label: '操作系统', multiple: false, pop: false },
        { prop: 'services', label: '服务', multiple: true, pop: false },
        { prop: 'processes', label: '进程', multiple: true, pop: false },
        { prop: 'value', label: '主机值', pop: true, content: '主机值是代理成功攻击当前主机后将获得的值，可设置为任意数值。正：奖励值。负：惩罚值。零：无奖励无惩罚。' },
        { prop: 'isSensitive', label: '敏感主机', pop: true, content: '是否为网络中代理攻击的目标主机。' },
        { prop: 'sensitiveVal', label: '敏感主机值', pop: true, content: '当前主机是敏感主机时，代理成功攻击后将获得的奖励数值' },
      ],
      hostFormRules: {
        os: [
          { required: true, message: '主机的操作系统不能为空', trigger: 'change' },
        ],
        services: [
          { required: true, message: '主机的服务不能为空', trigger: 'change' },
        ],
        processes: [
          { required: true, message: '主机的进程不能为空', trigger: 'change' },
        ],
        value: [
          { required: true, message: '主机的值不能为空', trigger: 'change' },
        ],
        isSensitive: [
          { required: true, message: '', trigger: 'change' },
        ],
        sensitiveVal: [
          { required: true, message: '敏感主机的值不能为空', trigger: 'change' },
        ],
      },
      osOptions: [
        { value: 'linux', label: 'linux' },
      ],
      serviceOptions: [
        { value: 'ssh', label: 'ssh' },
      ],
      processOptions: [
        { value: 'tomcat', label: 'tomcat' },
      ],
      topology: {},
      tempTopology: [],
      option: {
        title: {
          text: '子网拓扑结构'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: {
          type: 'graph',
          layout: 'circular',
          symbolSize: 50,
          roam: true,
          label: {
            show: true
          },
          edgeSymbolSize: [10, 10],
          edgeLabel: {
            fontSize: 20
          },
          data: [],
          links: [],
          lineStyle: {
            opacity: 0.9,
            width: 5,
            curveness: 0
          }
        }
      }
    }
  },
  computed: {
    getAllSubnetKey() {
      let keys = Object.keys(this.subnets);
      let result = [
        {
          key: '0',
          label: '外网'
        }
      ];
      keys.forEach((key) => {
        result.push({
          key,
          label: `子网 ${key}`,
          disabled: key == this.currentSubnet,
        })
      });
      return result;
    }
  },
  watch: {
    topologyDialog: function (val) {
      if (!val) {
        this.tempTopology = [];
      }
    },
    hostDialog: function (val) {
      if (!val) {
        this.$refs['hostForm'].resetFields();
      }
    },
    'option.series.data': function () {
      if (this.chart) {
        this.chart.setOption(this.option);
      }
    },
    'option.series.links': function () {
      if (this.chart) {
        this.chart.setOption(this.option);
      }
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.echartsInit();
  },
  methods: {
    fetchData() {
      this.subnets = this.recvSubnet;
      this.maxSubnetId = Object.keys(this.subnets).length + 1;
      this.topology = this.recvTopology;
      this.option.series.data = parseSubnets(this.subnets);
      this.option.series.links = parseTopology(this.topology);
    },
    echartsInit() {
      this.$nextTick(() => {
        this.chart = echarts.init(document.getElementById('echarts-content'));
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.chart.setOption(this.option);
      });
    },
    addSubnetClick() {
      this.$set(this.subnets, `${this.maxSubnetId}`, { hosts: {}, total: 0 });
      this.$set(this.topology, `${this.maxSubnetId}`, [`${this.maxSubnetId}`]);
      this.option.series.data.push({ name: `${this.maxSubnetId}`, itemStyle: { color: '#91cc75' } });
      this.maxSubnetId++;
    },
    deleteSubnetClick(key) {
      this.$delete(this.subnets, key)
      this.$delete(this.topology, key)
      let index = this.option.series.data.findIndex((curVal) => {
        return curVal.name == `${key}`;
      })
      this.option.series.data.splice(index, 1);
      for (let item in this.topology) {
        let index = this.topology[item].indexOf(key);
        if (index != -1) {
          this.topology[item].splice(index, 1);
        }
      }
      let newLinks = deepCopy(this.option.series.links);
      for (let i = 0; i < newLinks.length; i++) {
        if (newLinks[i].source == `${key}` || newLinks[i].target == `${key}`) {
          newLinks.splice(i, 1);
          i--;
        }
      }
      this.option.series.links = newLinks;
    },
    openTopologyDialog(subnetKey) {
      this.currentSubnet = subnetKey;
      this.tempTopology = [...this.topology[subnetKey]];
      this.topologyDialog = true;
    },
    openHostDialogClick(subnetKey, hostKey, type) {
      this.hostDialogType = type;
      this.currentSubnet = subnetKey;
      this.currentHost = hostKey;
      this.hostDialog = true;
      this.$nextTick(() => {
        this.$refs['hostForm'].clearValidate();
      });
      if (type == 'edit') {
        console.log(this.subnets[subnetKey].hosts[hostKey]);
        let host = this.subnets[subnetKey].hosts[hostKey];
        this.$nextTick(() => {
          this.hostForm = deepCopy(host);
        })
      }
    },
    isSensitiveChange(value) {
      if (value) {
        this.hostForm.value = 0;
      } else {
        this.hostForm.sensitiveVal = 0.0001;
      }
    },
    hostClick(type) {
      let subnet = this.subnets[this.currentSubnet];
      this.$refs['hostForm'].validate((valid) => {
        if (valid) {
          if (type == 'add') {
            this.$set(subnet.hosts, `${subnet.total++}`, deepCopy(this.hostForm));
          } else {
            this.$set(subnet.hosts, this.currentHost, deepCopy(this.hostForm));
          }
          this.hostDialog = false;
        } else {
          return false;
        }
      })
    },
    deleteHostClick(subnetKey, hostKey) {
      let subnet = this.subnets[subnetKey];
      this.$delete(subnet.hosts, `${hostKey}`);
    },
    topologyConfirmClick() {
      // 在被选择连接的子网处同步添加当前子网
      this.tempTopology.forEach((item) => {
        if (item != '0') {
          if (this.topology[item].indexOf(this.currentSubnet) == -1) {
            this.topology[item].push(this.currentSubnet);
          }
        }
      });
      // 在非被选择连接的子网处同步删除当前子网
      for (let item in this.topology) {
        if (this.tempTopology.indexOf(item) == -1) {
          let index = this.topology[item].indexOf(this.currentSubnet);
          if (index != -1) {
            this.topology[item].splice(index, 1);
          }
        }
      }
      this.topology[this.currentSubnet] = [...this.tempTopology];
      // 处理关系图
      let oldLinks = this.option.series.links;
      let newLinks = [];
      let curName = `${this.currentSubnet}`;
      // 比较旧边和新边，保留交集以及与当前子网无关的边，也就是移除所有要删除的边
      for (let i = 0; i < oldLinks.length; i++) {
        if (oldLinks[i].source == curName) {
          let index = this.tempTopology.indexOf(oldLinks[i].target);
          if (index != -1) {
            newLinks.push(oldLinks[i]);
            this.tempTopology.splice(index, 1);
          }
        } else if (oldLinks[i].target == curName) {
          let index = this.tempTopology.indexOf(oldLinks[i].source);
          if (index != -1) {
            newLinks.push(oldLinks[i]);
            this.tempTopology.splice(index, 1);
          }
        } else {
          newLinks.push(oldLinks[i]);
        }
      }
      // 添加新边
      this.tempTopology.forEach((item) => {
        if (item != '0') {
          let [x, y] = item < this.currentSubnet ? [item, this.currentSubnet] : [this.currentSubnet, item];
          newLinks.push({
            source: x,
            target: y
          })
        }
      })
      this.option.series.links = newLinks;
      this.topologyDialog = false;
    },
    saveScenarioClick() {
      this.$emit('watchSaveClick', deepCopy(this.subnets), deepCopy(this.topology));
    }
  }
}
</script>

<style scoped>
.visualization-container {
  position: relative;
  height: 100%;
  padding: 0 1rem 0 1rem;
}

/* 
.content-row {
  height: 48rem;
}

.content-col {
  height: 100%;
} */

.el-card {
  height: 100%;
}

.main-edit-container {
  height: 100%;
  overflow-y: auto;
  padding: .3125rem;
  border: 1px solid #DCDFE6;
  border-radius: .3125rem;
  background-color: #F5F7FA;
}

.main-edit-item {
  height: 30%;
  margin-bottom: 2px;
}

.host-item {
  font-size: 14px;
  margin-bottom: 18px;
  display: flex;
  justify-content: space-between;
}

#echarts-content {
  height: 100%;
  width: 100%;
}
</style>