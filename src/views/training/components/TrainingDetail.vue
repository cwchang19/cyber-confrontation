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
                <el-form-item label="配置动作空间" size="normal" prop="isActionConfigSet">
                  <el-button :type="getActionConfigButtonType" size="default" icon="el-icon-edit" plain
                    @click="openActionDialog" style="width: 100%">
                    修改动作空间配置
                  </el-button>
                </el-form-item>
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
                <el-form-item label="Seed" size="normal" prop="seed">
                  <el-input-number v-model="trainingForm.seed" :min="0"></el-input-number>
                  <!-- <el-input v-model.number="trainingForm.seed" placeholder="请输入种子 seed" size="normal">
                  </el-input> -->
                </el-form-item>
                <el-form-item label="Learning Rate" size="normal" prop="learningRate">
                  <el-input-number v-model="trainingForm.learningRate" :precision="3" :step="0.01" :min="0.001"></el-input-number>
                  <!-- <el-input v-model.number="trainingForm.learningRate" placeholder="请输入学习率 learning rate" size="normal">
                  </el-input> -->
                </el-form-item>
                <el-form-item label="Batch Size" size="normal" prop="batchSize">
                  <el-input-number v-model="trainingForm.batchSize" :min="1"></el-input-number>
                  <!-- <el-input v-model.number="trainingForm.batchSize" placeholder="请输入批大小 batch size" size="normal">
                  </el-input> -->
                </el-form-item>
                <el-form-item label="Training Steps" size="normal" prop="trainingSteps">
                  <el-input-number v-model="trainingForm.trainingSteps" :min="1"></el-input-number>
                  <!-- <el-input v-model.number="trainingForm.trainingSteps" placeholder="请输入跨步 training steps" size="normal">
                  </el-input> -->
                </el-form-item>
                <el-form-item label="网络和节点可视化类型" size="normal">
                  <el-radio-group v-model="trainingForm.visualizationType">
                    <el-radio :label="0">局部可观察</el-radio>
                    <el-radio :label="1">全局可观察</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="card-content-step2" v-show="active === 2">
                <el-alert title="请确认填写的训练设置" type="warning" description="确认填写的训练设置无误，然后填写训练名以及选择保存目录，最后点击下方“开始训练”即可开启后台训练。"
                  show-icon :closable="false">
                </el-alert>
                <el-form-item label="训练名称" size="normal" prop="training_name">
                  <el-input v-model="trainingForm.training_name" placeholder="请输入训练名" size="normal" clearable
                    @change="">
                  </el-input>
                </el-form-item>

                <el-form-item label="训练目录" size="normal" prop="directory_id">
                  <el-cascader :options="directoryOptions" v-model="trainingForm.directory_id" filterable :show-all-levels="false"
                    :props="{ checkStrictly: true, value: 'id', label: 'directory_name' }" style="width: 100%">
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
        <el-card shadow="always" :body-style="{ padding: '20px', height: '100%' }" v-loading="!visualizationReady">
          <Visualization v-if="visualizationReady" :is-train="true" :recv-subnet="subnets" :recv-topology="topology"></Visualization>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="修改动作空间配置" :visible.sync="actionDialogVisible" width="25%">
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
    </el-dialog>

    <el-dialog title="训练节点自定义配置" :visible.sync="nodeDialogVisible" width="50%">
      <span>训练节点自定义配置</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nodeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="nodeDialogVisible = false; trainingForm.isTrainNodeConfigSet = true">确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Visualization from '@/components/Visualization';

import { searchScenarioAll, searchScenarioById } from '@/api/scenario';
import { searchAlgorithmAll } from '@/api/algorithm';
import { searchDirectory } from '@/api/directory';
import { addTraining } from '@/api/training'

import { arrayToTree, deepCopy, parseScenarioJSON } from '@/utils/other'

export default {
  name: 'TrainingDetail',
  components: {
    Visualization,
  },
  data() {
    return {
      visualizationReady: false,
      subnets: {},
      topology: {},
      isfromScenario: false,
      active: 0,
      actionDialogVisible: false,
      nodeDialogVisible: false,
      actionConfigButtonType: 'primary',
      trainingNodeConfigButtonType: 'primary',
      trainingForm: {
        training_name: '',
        training_params: {},
        scenario_id: '',
        algorithm_id: '',
        directory_id: '',
        action_id_list: [0],
        startNode_id: '',
        directory_parent: '',
        seed: 0,
        learningRate: 0.001,
        batchSize: 1,
        trainingSteps: 100,
        trainingNodeConfigType: 0,
        visualizationType: 0,
        isActionConfigSet: null,
        isTrainNodeConfigSet: null,
      },
      actionSpaceConfigForm: {
        discovery: null,
        credentialAccess: null,
        privilegeEscalation: null,
        lateralMovement: null,
        exfiltration: null,
        impact: null,
      },
      trainNodeConfigForm: {
      },
      scenarioOptions: [],
      algorithmOptions: [],
      directoryOptions: [],
      testOptions: [
        {
          value: 'options1',
          label: '选项1',
        },
        {
          value: 'options2',
          label: '选项2',
        },
        {
          value: 'options3',
          label: '选项3',
        },
        {
          value: 'options4',
          label: '选项4',
        },
        {
          value: 'options5',
          label: '选项5',
        },
        {
          value: 'options6',
          label: '选项6',
        },
      ],
      trainingFormRules: {
        scenario_id: [
          { required: true, message: '请选择场景', trigger: 'change' },
        ],
        algorithm_id: [
          { required: true, message: '请选择算法', trigger: 'change' },
        ],
        seed: [
          { required: true, message: '请输入种子 seed', trigger: 'change' },
        ],
        learningRate: [
          { required: true, message: '请输入学习率 learning rate', trigger: 'change' },
        ],
        batchSize: [
          { required: true, message: '请输入批大小 batch size', trigger: 'change' },
        ],
        trainingSteps: [
          { required: true, message: '请输入训练跨步 training steps', trigger: 'change' },
        ],
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
        ]
      },
      actionSpaceConfigFormRules: {
        discovery: [
          { required: true, message: '请选择 Discovery', trigger: 'change' },
        ],
        credentialAccess: [
          { required: true, message: '请选择 Credential Access', trigger: 'change' },
        ],
        privilegeEscalation: [
          { required: true, message: '请选择 Privilege Escalation', trigger: 'change' },
        ],
        lateralMovement: [
          { required: true, message: '请选择 Lateral Movement', trigger: 'change' },
        ],
        exfiltration: [
          { required: true, message: '请选择 Exfiltration', trigger: 'change' },
        ],
        impact: [
          { required: true, message: '请选择 Impact', trigger: 'change' },
        ],
      },
    }
  },
  created() {
    let str = this.$route.params && this.$route.params.str;
    str = str.split('.');
    if (str[0] != '') {
      this.isfromScenario = true;
    }
    this.trainingForm.scenario_id = parseInt(str[0]) || '';

    this.fetchScnData();
    this.fetchAlgData();
    this.fetchDirData();
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
    }
  },
  watch: {
    'trainingForm.scenario_id': async function(val) {
      if(val){
        this.visualizationReady = false;
        const response = await searchScenarioById(val);
        const res = parseScenarioJSON(response.data);
        this.subnets = res.subnets;
        this.topology = res.topology;
        this.visualizationReady = true;
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
    async fetchDirData() {
      const response = await searchDirectory({ type: '训练' });
      this.directoryOptions = arrayToTree(response.data);
    },
    frontStep() {
      if (this.active-- == 0) this.active = 0;
    },
    nextStep() {
      if (this.active === 0) {
        let stepOneValid = true;
        let stepOneField = ['scenario_id', 'algorithm_id']
        Promise.all(
          stepOneField.map((field) => {
            return new Promise((resolve, reject) => {
              this.$refs['trainingForm'].validateField(field, (errorMessage) => {
                resolve(errorMessage);
              });
            });
          })
        ).then((errorMessage) => {
          let valid = errorMessage.every((errorMessage) => {
            return errorMessage == '';
          });
          if (!this.trainingForm.isActionConfigSet) {
            this.trainingForm.isActionConfigSet = false;
            stepOneValid = false;
          }
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
        let stepTwoField = ['seed', 'learningRate', 'batchSize', 'trainingSteps'];
        Promise.all(
          stepTwoField.map((field) => {
            return new Promise((resolve, reject) => {
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
    openActionDialog() {
      this.actionDialogVisible = true;
      this.$nextTick(() => {
        this.$refs['actionSpaceConfigForm'].clearValidate();
      });
    },
    actionDialogConfirmClick() {
      this.$refs['actionSpaceConfigForm'].validate((valid) => {
        if (valid) {
          this.trainingForm.isActionConfigSet = true;
          this.actionDialogVisible = false;
        } else {
          return false;
        }
      })
    },
    async startTrainingClick() {
      this.trainingForm.action_config = this.actionSpaceConfigForm;
      let data = deepCopy(this.trainingForm);
      let keepList = ['training_name', 'training_params', 'scenario_id', 'directory_id', 'algorithm_id', 'action_id_list'];
      for(let item in data) {
        if(!keepList.includes(item)) {
          Reflect.deleteProperty(data, item);
        }
      }
      data.directory_id = data.directory_id[0];
      // console.log(data);
      let response = await addTraining(data);
      // console.log(response);
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push("/training/index");
    },
    selectStartNodeClick() {
      this.trainingForm.startNode_id = 123;
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