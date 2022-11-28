<template>
  <div class="visualization-container">
    <h1>可视化</h1>
    <el-row :gutter="20" class="content-row">
      <el-col :span="4" class="content-col">
        123
      </el-col>
      <el-col :span="20" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }">
          <el-row style="height: 100%;">
            <el-col :span="12" style="height: 100%">
              <el-row class="main-edit-container" :gutter="2">
                <el-col class="main-edit-item subnet-item" v-for="(subnet, subnetKey) in subnets" :key="subnetKey"
                  :span="12">
                  <el-card shadow="hover"
                    :body-style="{ padding: '20px', height: '75%', position: 'relative', overflowY: 'auto' }">
                    <div slot="header">
                      <span>{{ `子网 ${subnetKey}` }}</span>
                      <el-button style="float: right; padding: 0px 5px" type="text" plain
                        @click="deleteSubnetClick(subnetKey)">删除</el-button>
                      <el-button style="float: right; padding: 0px 5px" type="text" plain @click="">连接</el-button>
                    </div>
                    <div v-for="(host, hostKey) in subnet.hosts" :key="hostKey" class="host-item">
                      <span :style="'color:' + (host.isSensitive ? '#F56C6C' : '#67C23A')">
                        {{ `${host.isSensitive ? '敏感' : ''}主机 ${hostKey}` }}
                      </span>
                      <div>
                        <el-button type="text" plain size="mini" icon="el-icon-edit" style="padding: 0;"
                          @click="openHostDialogClick(subnetKey, hostKey, 'edit')"></el-button>
                        <el-button type="text" plain size="mini" icon="el-icon-delete" style="padding: 0;"
                          @click="deleteHostClick(subnetKey, hostKey)"></el-button>
                      </div>
                    </div>
                    <div class="host-item">
                      <el-button type="text" plain icon="el-icon-plus" size="small" style="width: 100%;"
                        @click="openHostDialogClick(subnetKey, null, 'add')">添加主机</el-button>
                    </div>
                  </el-card>
                </el-col>
                <el-col class="main-edit-item" :span="12" style="height: 30%">
                  <el-button type="primary" plain style="height: 100%; width: 100%; transform: scale(90%);"
                    @click="addSubnetClick">
                    <div style="font-size: 50px; padding: 10px;"><i class="el-icon-plus"></i></div>
                    <div style="">添加子网</div>
                  </el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" style="height: 100%;">
              <el-row style="height: 50%">
              </el-row>
              <el-row style="height: 50%">
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="`子网 ${currentSubnet} 的主机`" v-if="hostDialog" :visible.sync="hostDialog" width="30%">
      <el-form :model="hostForm" ref="hostForm" :rules="hostFormRules" :inline="false" label-width="120px" size="small">
        <el-form-item v-for="item in hostFormItem" :label="item.label" :prop="item.prop">
          <el-input-number v-if="item.prop == 'value'" v-model="hostForm[item.prop]" :label="item.label" :min="0">
          </el-input-number>
          <el-radio-group v-else-if="item.prop == 'isSensitive'" v-model="hostForm[item.prop]"
            @change="isSensitiveChange">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
          <el-input-number v-else-if="item.prop == 'sensitiveVal'" v-model="hostForm[item.prop]" :label="item.label"
            :precision="2" :step="0.1" :min="0" :disabled="!hostForm.isSensitive"></el-input-number>
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

    <el-dialog :title="`子网 ${currentSubnet} 的连接状态`" v-if="topologyDialog" :visible.sync="topologyDialog" width="30%">
      <el-transfer v-model="value" :data="data"></el-transfer>
      <span slot="footer">
        <el-button @click="topologyDialog = false">Cancel</el-button>
        <el-button type="primary" @click="">OK</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { deepCopy } from '@/utils/other'

export default {
  name: 'Visualization',
  components: {},
  data() {
    return {
      hostDialog: false,
      hostDialogType: 'add',
      topologyDialog: false,
      maxSubnetId: 0,
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
        sensitiveVal: 0,
      },
      hostFormItem: [
        { prop: 'os', label: '操作系统', multiple: false },
        { prop: 'services', label: '服务', multiple: true },
        { prop: 'processes', label: '进程', multiple: true },
        { prop: 'value', label: '主机值' },
        { prop: 'isSensitive', label: '敏感主机' },
        { prop: 'sensitiveVal', label: '敏感主机值' },
        // { prop: 'firewall', label: '防火墙 (firewall)' },
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
      topology: {}
    }
  },
  watch: {
    hostDialog: function (val) {
      if (!val) {
        this.$refs['hostForm'].resetFields();
      }
    }
  },
  methods: {
    addSubnetClick() {
      this.$set(this.subnets, `${this.maxSubnetId}`, { hosts: {}, total: 0 });
      this.$set(this.topology, `${this.maxSubnetId}`, [`${this.maxSubnetId}`]);
      this.maxSubnetId++;
    },
    deleteSubnetClick(key) {
      this.$delete(this.subnets, key)
      this.$delete(this.topology, key)
    },
    openHostDialogClick(subnetKey, hostKey, type) {
      this.hostDialogType = type;
      this.currentSubnet = subnetKey;
      this.currentHost = hostKey;
      this.hostDialog = true;
      if (type == 'edit') {
        let host = this.subnets[subnetKey].hosts[hostKey];
        this.$nextTick(() => {
          this.hostForm = deepCopy(host);
        })
      }
    },
    isSensitiveChange(value) {
      if (!value) {
        this.hostForm.sensitiveVal = 0;
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
    }
  }
}
</script>

<style scoped>
.visualization-container {
  padding: 0 1rem 0 1rem;
}

.content-row {
  height: 48rem;
}

.content-col {
  height: 100%;
}

.el-card {
  height: 100%;
}

.card {
  overflow-y: auto;
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
</style>