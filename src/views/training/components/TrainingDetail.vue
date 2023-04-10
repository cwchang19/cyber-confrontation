<template>
  <div class="training-detail-container">
    <h1>新增训练</h1>
    <el-row :gutter="20" class="content-row">
      <el-col :span="6" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }">
          <el-steps :active="active" finish-status="success">
            <el-step></el-step>
            <el-step></el-step>
            <el-step></el-step>
          </el-steps>
          <div class="card-content">
            <el-form :model="trainingForm" ref="trainingForm" :rules="trainingFormRules" :inline="false" size="normal"
              label-position="top">
              <div class="card-content-step0" v-show="active === 0">
                <el-form-item label="网络场景" size="normal" prop="scenario_id">
                  <el-select v-model="trainingForm.scenario_id" placeholder="请选择网络场景" filterable style="width: 100%"
                    :disabled="isfromScenario">
                    <el-option v-for="item in scenarioOptions" :key="item.id" :label="item.scenario_name"
                      :value="item.id">
                    </el-option>
                  </el-select>

                  <!-- <el-cascader :options="scenarioOptions" v-model="trainingForm.scenario_id" placeholder="请选择网络场景"
                    clearable filterable :show-all-levels="false" :disabled="isfromScenario" @change="" style="width: 100%">
                  </el-cascader> -->
                </el-form-item>
                <el-form-item label="配置动作空间" size="normal" prop="action_id_list">
                  <el-cascader :options="actionOptions" v-model="trainingForm.action_id_list" clearable filterable
                    :show-all-levels="false" :props="{ multiple: true }" placeholder="请选择至少一个动作" style="width: 100%">
                  </el-cascader>
                </el-form-item>

                <!-- <el-form-item label="配置动作空间" size="normal" prop="isActionConfigSet">
                  <el-button :type="getActionConfigButtonType" size="default" icon="el-icon-edit" plain
                    @click="openActionDialog" style="width: 100%">
                    修改动作空间配置
                  </el-button>
                </el-form-item> -->
                <el-form-item label="算法" size="normal" prop="algorithm_id">
                  <el-select v-model="trainingForm.algorithm_id" placeholder="请选择算法" filterable style="width: 100%">
                    <el-option v-for="item in algorithmOptions" :key="item.id" :label="item.algorithm_name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="配置训练节点" size="normal" prop="trainingNodeConfigType">
                  <el-radio-group v-model="trainingForm.trainingNodeConfigType">
                    <el-radio :label="0">后台自动配置</el-radio>
                    <el-radio :label="1">自定义配置</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="trainingForm.trainingNodeConfigType === 1" label="" size="normal"
                  prop="isTrainingNodeConfigSet">
                  <el-button :type="getTrainingNodeConfigButtonType" size="default" icon="el-icon-edit" plain
                    @click="nodeDialogVisible = true" style="width: 100%">
                    训练节点自定义配置
                  </el-button>
                </el-form-item>
              </div>
              <div class="card-content-step1" v-show="active === 1">
                <el-form-item label="Seed" size="small" prop="training_params.seed">
                  <el-input-number v-model="trainingForm.training_params.seed" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="Learning Rate" size="small" prop="training_params.lr">
                  <el-input-number v-model="trainingForm.training_params.lr" :precision="3" :step="0.01"
                    :min="0.001"></el-input-number>
                </el-form-item>
                <el-form-item label="Batch Size" size="small" prop="training_params.batch_size">
                  <el-input-number v-model="trainingForm.training_params.batch_size" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="Training Steps" size="small" prop="training_params.training_steps">
                  <el-input-number v-model="trainingForm.training_params.training_steps" :min="1"></el-input-number>
                </el-form-item>
                <!-- <el-form-item label="自定义训练参数" size="small">
                  <el-button type="text" size="small" @click="selfParamsDrawer = true">设置自定义参数</el-button>
                </el-form-item> -->
                <el-form-item label="网络和节点可视化类型" size="small">
                  <el-radio-group v-model="trainingForm.visualizationType">
                    <el-radio :label="0">局部可观察</el-radio>
                    <el-radio :label="1">全局可观察</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="card-content-step2" v-show="active === 2">
                <el-alert title="请确认填写的训练设置" type="warning"
                  description="确认填写的训练设置无误，然后填写训练名以及选择保存目录，最后点击下方“开始训练”即可开启后台训练。" show-icon :closable="false">
                </el-alert>
                <el-form-item label="训练名称" size="normal" prop="training_name">
                  <el-input v-model="trainingForm.training_name" placeholder="请输入训练名" size="normal" clearable
                    @change="">
                  </el-input>
                </el-form-item>

                <el-form-item label="训练目录" size="normal" prop="directory_id">
                  <el-cascader :options="directoryOptions" v-model="trainingForm.directory_id" filterable
                    :show-all-levels="false" placeholder="请选择训练的保存目录"
                    @visible-change="v => visibleChange(v, 'cascader', openDirBox)" ref="cascader"
                    :props="{ checkStrictly: true, value: 'id', label: 'directory_name' }" style="width: 100%">
                    <template slot-scope="{ node, data }">
                      <span>{{ data.directory_name }}</span>
                      <span style="float: right;"><el-button type="text" size="mini" icon="el-icon-plus"
                          :disabled="addDirDisabled" @click="openDirBox(data.id)"></el-button></span>
                    </template>
                  </el-cascader>
                </el-form-item>

                <el-button type="success" size="default" @click="startTrainingClick"
                  style="margin-top: 2.5rem; width: 100%;">开始训练
                </el-button>
              </div>
            </el-form>
          </div>
          <div class="card-footer-button">
            <el-button class="front-button" v-show="active > 0" @click="frontStep" icon="el-icon-arrow-left">上一步
            </el-button>
            <el-button class="next-button" v-show="active < 2" type="primary" @click="nextStep">
              下一步
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :offset="0" class="content-col">
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }">
          <Visualization v-if="visualizationReady" :key="randomStr" :is-train="true" :recv-subnet="subnets"
            :recv-topology="topology">
          </Visualization>
          <el-row v-else
            style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
            <div style="font-weight: bold; font-size: x-large; color: #909399;">请在左侧选择网络场景</div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- <el-dialog title="修改动作空间配置" :visible.sync="actionDialogVisible" width="25%">
      <el-form :model="actionSpaceConfigForm" ref="actionSpaceConfigForm" :rules="actionSpaceConfigFormRules"
        label-width="180px" :inline="false" size="normal">
        <el-form-item label="Discovery" size="normal" prop="discovery">
          <el-select v-model="actionSpaceConfigForm.discovery" value-key="" placeholder="请选择 Discovery" filterable
            multiple collapse-tags @change="" style="width: 100%">
            <el-option v-for="item in testOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Credential Access" size="normal" prop="credentialAccess">
          <el-select v-model="actionSpaceConfigForm.credentialAccess" value-key="" placeholder="请选择 Credential Access"
            filterable multiple collapse-tags @change="" style="width: 100%">
            <el-option v-for="item in testOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Privilege Escalation" size="normal" prop="privilegeEscalation">
          <el-select v-model="actionSpaceConfigForm.privilegeEscalation" value-key=""
            placeholder="请选择 Privilege Escalation" filterable multiple collapse-tags @change="" style="width: 100%">
            <el-option v-for="item in testOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Lateral Movement" size="normal" prop="lateralMovement">
          <el-select v-model="actionSpaceConfigForm.lateralMovement" value-key="" placeholder="请选择 Lateral Movement"
            filterable multiple collapse-tags @change="" style="width: 100%">
            <el-option v-for="item in testOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Exfiltration" size="normal" prop="exfiltration">
          <el-select v-model="actionSpaceConfigForm.exfiltration" value-key="" placeholder="请选择 Exfiltration" filterable
            multiple collapse-tags @change="" style="width: 100%">
            <el-option v-for="item in testOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Impact" size="normal" prop="impact">
          <el-select v-model="actionSpaceConfigForm.impact" value-key="" placeholder="请选择 Impact" filterable multiple
            collapse-tags @change="" style="width: 100%">
            <el-option v-for="item in testOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="actionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="actionDialogConfirmClick">确 定
        </el-button>
      </span>
    </el-dialog> -->

    <el-dialog title="训练节点自定义配置" :visible.sync="nodeDialogVisible" width="50%">
      <span>训练节点自定义配置</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nodeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="nodeDialogVisible = false; trainingForm.isTrainNodeConfigSet = true">确 定
        </el-button>
      </span>
    </el-dialog>

    <el-drawer title="自定义参数" v-if="selfParamsDrawer" :visible.sync="selfParamsDrawer" direction="rtl" size="50%"
      :destroy-on-close="true" :show-close="true" :wrapperClosable="true" :before-close="checkParams">
      <el-button type="success" size="small" @click="addParams">添加参数</el-button>
      <el-button type="success" size="small" @click="addParams">保存</el-button>
      <el-table :data="selfParams" stripe>
        <el-table-column label="No" type="index">
        </el-table-column>
        <el-table-column prop="name" label="参数名" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" placeholder="请输入参数名" size="mini" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="数据类型" width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="请选择数据类型" clearable size="mini"
              @change="scope.row.value = ''">
              <el-option key="Integer" label="Integer" value="Integer"></el-option>
              <el-option key="Float" label="Float" value="Float"></el-option>
              <el-option key="String" label="String" value="String"></el-option>
              <el-option key="Boolean" label="Boolean" value="Boolean"></el-option>
              <el-option key="Array" label="Array" value="Array"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="参数值" width="">
          <template v-if="scope.row.type" slot-scope="scope">
            <el-input v-if="scope.row.type != 'Boolean'" v-model="scope.row.value"
              :placeholder="getPlaceholder(scope.row.type)" size="mini" clearable></el-input>
            <el-select v-else v-model="scope.row.value" placeholder="请选择布尔值" size="mini">
              <el-option key="true" label="true" :value="true"></el-option>
              <el-option key="false" label="false" :value="false"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-close" @click="deleteParams(scope)"></el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-drawer>


  </div>
</template>

<script>
import Visualization from '@/components/Visualization';

import { searchScenarioAll, searchScenarioById } from '@/api/scenario';
import { searchActionAll } from '@/api/action'
import { searchAlgorithmAll } from '@/api/algorithm';
import { addDirectory, searchDirectory } from '@/api/directory';
import { addTraining } from '@/api/training';
import { Notification } from 'element-ui';

import { arrayToTree, deepCopy, parseScenarioJSON } from '@/utils/other'

export default {
  name: 'TrainingDetail',
  components: {
    Visualization,
  },
  data() {
    return {
      selfParamsDrawer: false,
      addDirDisabled: false,
      visualizationReady: false,
      subnets: {},
      topology: {},
      isfromScenario: false,
      active: 0,
      // actionDialogVisible: false,
      nodeDialogVisible: false,
      actionConfigButtonType: 'primary',
      trainingNodeConfigButtonType: 'primary',
      randomStr: '',
      trainingForm: {
        training_name: '',
        training_params: {
          seed: 0,
          lr: 0.001,
          batch_size: 32,
          training_steps: 20000,
          // replay_size: 100000,
          final_epsilon: 0.5,
          exploration_steps: 10000,
          gamma: 0.9,
          // hidden_size: [64, 64],
          // target_update_freq: 1000,
          // verbose: true,
          // render_eval: true,
          // partially_obs: true,
          // init_epsilon: 1,
          // quite: true
        },
        scenario_id: '',
        algorithm_id: '',
        directory_id: [],
        action_id_list: [],
        startNode_id: '',
        directory_parent: '',
        // seed: 0,
        // lr: 0.001,
        // batch_size: 1,
        // training_steps: 100,
        trainingNodeConfigType: 0,
        visualizationType: 0,
        isActionConfigSet: null,
        isTrainNodeConfigSet: null,
      },
      trainNodeConfigForm: {
      },
      scenarioOptions: [],
      algorithmOptions: [],
      directoryOptions: [],
      actionOptions: [
        {
          value: 'Discovery',
          label: 'Discovery',
          children: [],
        },
        {
          value: 'Credential Access',
          label: 'Credential Access',
          children: [],
        },
        {
          value: 'Privilege Escalation',
          label: 'Privilege Escalation',
          children: [],
        },
        {
          value: 'Lateral Movement',
          label: 'Lateral Movement',
          children: [],
        },
        {
          value: 'Exfiltration',
          label: 'Exfiltration',
          children: [],
        },
        {
          value: 'Impact',
          label: 'Impact',
          children: [],
        },
      ],
      trainingFormRules: {
        scenario_id: [
          { required: true, message: '请选择场景', trigger: 'change' },
        ],
        algorithm_id: [
          { required: true, message: '请选择算法', trigger: 'change' },
        ],
        training_params: {
          seed: [
            { required: true, message: '请输入种子 seed', trigger: 'change' },
          ],
          lr: [
            { required: true, message: '请输入学习率 learning rate', trigger: 'change' },
          ],
          batch_size: [
            { required: true, message: '请输入批大小 batch size', trigger: 'change' },
          ],
          training_steps: [
            { required: true, message: '请输入训练跨步 training steps', trigger: 'change' },
          ],
        },
        isActionConfigSet: [
          { type: 'enum', enum: [true], required: true, message: '请配置动作空间', trigger: 'change' },
        ],
        isTrainNodeConfigSet: [
          { type: 'enum', enum: [true], required: true, message: '请配置训练节点', trigger: 'change' },
        ],
        training_name: [
          { required: true, message: '训练名称不能为空', trigger: 'change' },
        ],
        directory_id: [
          { required: true, message: '训练目录不能为空', trigger: 'change' },
        ],
        action_id_list: [
          { required: true, message: '请至少选择一个动作', trigger: 'change' },
        ]
      },
      selfParams: [],
    }
  },
  created() {
    let str = this.$route.params && this.$route.params.str;
    str = str.split('.');
    if (str[0] != '') {
      this.isfromScenario = true;
    }
    this.trainingForm.scenario_id = parseInt(str[0]) || '';
    this.trainingForm.directory_id = [parseInt(str[1])];
    // console.log(this.trainingForm.directory_id);

    this.fetchScnData();
    this.fetchActData();
    this.fetchAlgData();
    this.fetchDirData();
  },
  activated() {
    this.fetchScnData();
    this.fetchActData();
    this.fetchAlgData();
    this.fetchDirData();
    this.sendScnToVisualization(this.trainingForm.scenario_id);
  },
  computed: {
    getActionConfigButtonType() {
      switch (this.trainingForm.isActionConfigSet) {
        case false:
          return 'danger';
        case true:
          return 'success';
        default:
          return 'primary';
      }
    },
    getTrainingNodeConfigButtonType() {
      switch (this.trainingForm.isTrainNodeConfigSet) {
        case false:
          return 'danger';
        case true:
          return 'success';
        default:
          return 'primary';
      }
    },
  },
  watch: {
    'trainingForm.scenario_id': function (val) {
      if (val) {
        this.sendScnToVisualization(val);
      }
    }
  },
  methods: {
    async fetchScnData() {
      const response = await searchScenarioAll();
      this.scenarioOptions = response.data;
    },
    async fetchAlgData() {
      const response = await searchAlgorithmAll();
      this.algorithmOptions = response.data;
    },
    async fetchActData() {
      const response = await searchActionAll();
      this.parseAction(response.data);
    },
    async fetchDirData() {
      const response = await searchDirectory({ type: '训练' });
      if (this.trainingForm.directory_id.length > 0) {
        let map = new Map();
        let target = null;
        for (let i = 0; i < response.data.length; i++) {
          map.set(response.data[i].id, i);
          if (response.data[i].id == this.trainingForm.directory_id[0]) {
            target = response.data[i];
          }
        }
        if (target) {
          let pid = parseInt(target.directory_parent_id);
          while (pid > 0) {
            this.trainingForm.directory_id.unshift(pid);
            pid = parseInt(response.data[map.get(pid)].directory_parent_id);
          }
        }
      }
      this.directoryOptions = arrayToTree(response.data);
    },
    frontStep() {
      if (this.active-- == 0) this.active = 0;
    },
    nextStep() {
      if (this.active === 0) {
        let stepOneValid = true;
        let stepOneField = ['scenario_id', 'algorithm_id', 'action_id_list']
        Promise.all(
          stepOneField.map((field) => {
            return new Promise((resolve) => {
              this.$refs['trainingForm'].validateField(field, (errorMessage) => {
                resolve(errorMessage);
              });
            });
          })
        ).then((errorMessage) => {
          let valid = errorMessage.every((errorMessage) => {
            return errorMessage == '';
          });
          if (this.trainingForm.trainingNodeConfigType === 1) {
            if (!this.trainingForm.isTrainNodeConfigSet) {
              this.trainingForm.isTrainNodeConfigSet = false;
              stepOneValid = false;
            }
          }
          if (valid && stepOneValid) {
            this.active++;
          } else {
            return false;
          }
        });
      } else if (this.active === 1) {
        let stepTwoField = ['training_params.seed', 'training_params.lr', 'training_params.batch_size', 'training_params.training_steps'] //['seed', 'lr', 'batch_size', 'training_steps'];
        Promise.all(
          stepTwoField.map((field) => {
            return new Promise((resolve) => {
              this.$refs['trainingForm'].validateField(field, (errorMessage) => {
                resolve(errorMessage);
              });
            });
          })
        ).then((errorMessage) => {
          let valid = errorMessage.every((errorMessage) => {
            return errorMessage == '';
          });
          if (valid) {
            this.active++;
          } else {
            return false;
          }
        });
      }
    },
    async startTrainingClick() {
      this.trainingForm.action_config = this.actionSpaceConfigForm;
      let data = deepCopy(this.trainingForm);
      let keepList = ['training_name', 'training_params', 'scenario_id', 'directory_id', 'algorithm_id', 'action_id_list'];
      for (let item in data) {
        if (!keepList.includes(item)) {
          Reflect.deleteProperty(data, item);
        }
      }
      data.directory_id = data.directory_id[data.directory_id.length - 1];
      for (let i = 0; i < data.action_id_list.length; i++) {
        data.action_id_list[i] = data.action_id_list[i][1];
      }
      // data.training_params['scenario_id'] = data.scenario_id;
      let fields = ['training_name', 'directory_id'];
      Promise.all(
        fields.map((field) => {
          return new Promise((resolve) => {
            this.$refs['trainingForm'].validateField(field, (errorMessage) => {
              resolve(errorMessage);
            });
          });
        })
      ).then(async (errorMessage) => {
        let valid = errorMessage.every((errorMessage) => {
          return errorMessage == '';
        });
        if (valid) {
          let response = await addTraining(data);
          this.$store.dispatch("tagsView/delView", this.$route);
          this.$router.push("/training/index");
        } else {
          return false;
        }
      });

    },
    parseAction(data) {
      const map = {
        'Discovery': 0,
        'Credential Access': 1,
        'Privilege Escalation': 2,
        'Lateral Movement': 3,
        'Exfiltration': 4,
        'Impact': 5
      };
      data.forEach(item => {
        let idx = map[item.action_type];
        if (idx >= 0) {
          this.actionOptions[idx].children.push({
            value: item.id,
            label: item.action_name,
          })
        }
      })
    },
    visibleChange(visible, refName, onClick) {
      if (visible) {
        const ref = this.$refs[refName];
        let popper = ref.$refs.popper;
        if (popper.$el) popper = popper.$el;
        if (!Array.from(popper.children).some(v => v.className === 'el-cascader-menu__list')) {
          const el = document.createElement('ul');
          el.className = 'el-cascader-menu__list';
          el.style = 'border-top: solid 1px #E4E7ED; padding:0; color: #606266;';
          el.innerHTML = `<li class="el-cascader-node" style="height:38px;line-height: 38px">
<i class="el-icon-plus"></i>
<span class="el-cascader-node__label">新增一级目录</span>
</li>`;
          popper.appendChild(el);
          el.onclick = () => {
            // 底部按钮的点击事件 点击后想触发的逻辑也可以直接写在这
            onClick && onClick(0);
            // 以下代码实现点击后弹层隐藏 不需要可以删掉
            if (ref.toggleDropDownVisible) {
              ref.toggleDropDownVisible(false);
            } else {
              ref.visible = false;
            }
          };
        }
      }
    },
    openDirBox(pid) {
      this.addDirDisabled = true;
      this.$prompt('请输入目录名', '新建目录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '目录名不能为空',
      }).then(async ({ value }) => {
        let data = {
          directory_name: value,
          directory_type: '训练',
          directory_parent_id: parseInt(pid),
        };
        const response = await addDirectory(data);
        this.fetchDirData();
        this.addDirDisabled = false;
      }).catch(() => {
        this.addDirDisabled = false;
        this.$message({
          type: 'info',
          message: '取消新建目录'
        })
      })
    },
    async sendScnToVisualization(val) {
      this.visualizationReady = false;
      const response = await searchScenarioById(val);
      const res = parseScenarioJSON(response.data);
      this.subnets = res.subnets;
      this.topology = res.topology;
      this.visualizationReady = true;
    },
    getPlaceholder(type) {
      switch (type) {
        case 'Integer':
          return '请输入整数值';
        case 'Float':
          return '请输入浮点数值';
        case 'String':
          return '请输入字符串';
        case 'Array':
          return '请依次输入数组元素，数组元素间以","分隔，可输入混合类型数组';
      }
    },
    addParams() {
      this.selfParams.push({
        name: '',
        type: '',
        value: ''
      })
    },
    deleteParams(scope) {
      this.selfParams.splice(scope.$index, 1);
    },
    checkParams(done) {
      let result = '';
      let paramSet = new Set();
      for (let i = 0; i < this.selfParams.length; i++) {
        if (this.selfParams[i].name == '') {
          result += `序号${i + 1}：参数名不能为空<br/>`;
        } else {
          if (paramSet.has(this.selfParams[i].name)) {
            result += `序号${i + 1}：参数名${this.selfParams[i].name}重复<br/>`;
          } else {
            paramSet.add(this.selfParams[i].name);
          }
        }
        if (this.selfParams[i].type == '') {
          result += `序号${i + 1}：数据类型不能为空<br/>`;
        }
        if (this.selfParams[i].value == '') {
          result += `序号${i + 1}：参数值不能为空<br/>`;
        } else {
          let errTypeStr = this.checkType(this.selfParams[i].type, this.selfParams[i].value);
          if(errTypeStr != '') {
            result += `序号${i + 1}：${errTypeStr}<br/>`;
          }
        }
      }
      if(result == '') {
        done();
      } else {
        Notification({
          type: 'error',
          message: result,
          dangerouslyUseHTMLString: true,
          duration: 0,
          position: 'top-left'
        })
      }
    },
    checkType(type, value) {
      switch(type) {
        case 'Integer':
          if((/^(\+|-)?\d+$/).test(value)) {
            return '';
          } else {
            return '输入的参数值不是整数类型';
          }
        case 'Float':
          if((/^(\+|-)?\d*(\.(\d+)?)?$/).test(value)) {
            return '';
          } else {
            return '输入的参数值不是浮点数类型';
          }
        case 'String':
          return '';
        case 'Boolean':
          return '';
        case 'Array':
          try {
            JSON.parse(`[${value}]`);
          } catch(err) {
            return '输入的参数值与数组类型不符，请参考说明中的数组格式';
          }
          return '';
      }
    }
  }
}
</script>

<style>
.training-detail-container {
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

.el-card__body {
  position: relative;
  box-sizing: border-box;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.card-content {
  margin-top: 1.875rem;
}

.card-footer-button {
  display: flex;
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
  bottom: 1.25rem;
}

.front-button {
  position: absolute;
  bottom: 0rem;
  left: 0rem;
}

.next-button {
  position: absolute;
  bottom: 0rem;
  right: 0rem;
}
</style>