<template>
  <div class="sim-visualization-container">
    <el-row style="height: 100%;">
      <el-col :span="12" style="height: 100%">
        <el-row class="main-edit-container" :gutter="2">
          <el-col class="main-edit-item subnet-item" v-for="(subnet, subnetKey) in subnets" :key="subnetKey" :span="8">
            <el-card shadow="hover"
              :body-style="{ padding: '20px', height: '75%', position: 'relative', overflowY: 'auto' }">
              <div slot="header">
                <span>{{ `子网 ${subnetKey}` }}</span>
              </div>
              <div v-for="(host, hostKey) in subnet.hosts" :key="hostKey" class="host-item">
                <div :ref="`host${subnetKey}-${hostKey}`" :style="`color: ${host.isSensitive ? '#F56C6C' : '#67C23A'}; width: 100%; padding: 5px`">
                  {{ `${host.isSensitive ? '敏感' : ''}主机 ${hostKey}` }}
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12" style="height: 100%;">
        <el-row style="height: 100%">
          <div id="echarts-content"></div>
        </el-row>
      </el-col>
    </el-row>

    <!-- <div class="msg">
      <div style="text-align: right;">
        {{ `Step ${debugData && debugData.steps}: ${debugData && debugData.action}` }}
      </div>
      <div style="text-align: right;">
        {{ `Reward: ${debugData && debugData.reward}` }}
      </div>
      <div style="text-align: right;">
        {{ `Done: ${debugData && debugData.done}` }}
      </div>
    </div> -->

  </div>
</template>

<script>
import { deepCopy, parseSubnets, parseTopology } from '@/utils/other';
import * as echarts from 'echarts';

export default {
  name: 'Visualization',
  components: {},
  props: {
    debugData: {
      type: Object,
      default: null,
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
      lastTargetDom: null,
      chart: null,
      subnetNum: 0,
      subnets: {},
      currentSubnet: NaN,
      currentHost: NaN,
      topology: {},
      tempTopology: [],
      history: [],
      actionStr: '',
      option: {},
      originOption: {
        title: {
          text: '子网拓扑结构'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: {
          type: 'graph',
          layout: 'circular',
          // force: {
          //   initLayout: 'circular',
          //   repulsion: 1000,
          // },
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
  },
  watch: {
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
    debugData: function (val) {
      console.log(val);
      this.solve(val);
    }
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
      this.topology = this.recvTopology;
      this.originOption.series.data = parseSubnets(this.subnets);
      this.originOption.series.links = parseTopology(this.topology);
      this.option = this.originOption;
    },
    echartsInit() {
      this.$nextTick(() => {
        this.chart = echarts.init(document.getElementById('echarts-content'));
        window.addEventListener("resize", () => { this.chart.resize(); });
        this.chart.setOption(this.option);
      });
    },
    solve(data) {
      if(this.lastTargetDom){
        this.lastTargetDom.classList.remove('target-host');
      }
      if(data) {
        console.log(`host${data.subnetNum}-${data.hostNum}`);
        this.lastTargetDom = this.$refs[`host${data.subnetNum}-${data.hostNum}`][0];
        this.lastTargetDom.classList.add('target-host');
        // console.log(this.lastTargetDom);
        this.actionStr = data.action;
        let newOption = deepCopy(this.originOption);
        this.option = newOption;
        if (data.actionStr.includes('Scan')) {
          for (let i = 0; i < newOption.series.data.length; i++) {
            if (data.subnetNum == newOption.series.data[i].name) {
              newOption.series.data[i].itemStyle.color = 'red';
              newOption.series.data[i].label.color = 'black';
              newOption.series.data[i].label.formatter = `${data.actionStr}: 子网${data.subnetNum}, 主机${data.hostNum}`;
              break;
            }
          }
          for (let i = 0; i < newOption.series.links.length; i++) {
            if (data.subnetNum == newOption.series.links[i].source || data.subnetNum == newOption.series.links[i].target) {
              newOption.series.links[i].lineStyle.color = 'red';
            }
          }
        } else if(data.actionStr == 'Exploit' || data.actionStr == 'PrivilegeEscalation') {
          for (let i = 0; i < newOption.series.data.length; i++) {
            if (data.subnetNum == newOption.series.data[i].name) {
              newOption.series.data[i].itemStyle.color = 'red';
              newOption.series.data[i].label.color = 'black';
              newOption.series.data[i].label.formatter = `${data.actionStr}: 子网${data.subnetNum}, 主机${data.hostNum}`;
              break;
            }
          }
        }
      } else {
        this.option = deepCopy(this.originOption);
      }
    }
  }
}
</script>

<style scoped>
.sim-visualization-container {
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

.msg {
  position: fixed;
  top: 6.25rem;
  right: 1.25rem;
  font-size: large;
}

.target-host {
  border: 2px solid #E6A23C;
  border-radius: .3125rem;
  background-color: #e6a23c15;
}
</style>