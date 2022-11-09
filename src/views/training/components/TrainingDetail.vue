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
                <el-form-item label="网络场景" size="normal" prop="scenarioId">
                  <el-cascader :options="scenarioOptions" v-model="trainingForm.scenarioId" placeholder="请选择网络场景"
                    clearable filterable :show-all-levels="false" @change="" style="width: 100%">
                  </el-cascader>
                </el-form-item>
                <el-form-item label="初始节点" size="normal" prop="startNodeId">
                  <el-input v-model="trainingForm.startNodeId" placeholder="请在右侧可视化界面选择" size="normal" disabled>
                  </el-input>
                </el-form-item>
                <el-form-item label="配置动作空间" size="normal" prop="isActionConfigSet">
                  <el-button :type="getActionConfigButtonType" size="default" icon="el-icon-edit" plain
                    @click="openActionDialog" style="width: 100%">
                    修改动作空间配置
                  </el-button>
                </el-form-item>
                <el-form-item label="算法" size="normal" prop="algorithmId">
                  <el-cascader :options="algorithmOptions" v-model="trainingForm.algorithmId" placeholder="请选择算法"
                    clearable filterable :show-all-levels="false" @change="" style="width: 100%">
                  </el-cascader>
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
                  <el-input v-model="trainingForm.seed" placeholder="请输入种子 seed" size="normal">
                  </el-input>
                </el-form-item>
                <el-form-item label="Learning Rate" size="normal" prop="learningRate">
                  <el-input v-model="trainingForm.learningRate" placeholder="请输入学习率 learning rate" size="normal">
                  </el-input>
                </el-form-item>
                <el-form-item label="Batch Size" size="normal" prop="batchSize">
                  <el-input v-model="trainingForm.batchSize" placeholder="请输入批大小 batch size" size="normal">
                  </el-input>
                </el-form-item>
                <el-form-item label="Training Steps" size="normal" prop="trainingSteps">
                  <el-input v-model="trainingForm.trainingSteps" placeholder="请输入跨步 training steps" size="normal">
                  </el-input>
                </el-form-item>
                <el-form-item label="网络和节点可视化类型" size="normal">
                  <el-radio-group v-model="trainingForm.visualizationType">
                    <el-radio :label="0">局部可观察</el-radio>
                    <el-radio :label="1">全局可观察</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="card-content-step2" v-show="active === 2">
                <el-alert title="请确认填写的训练设置" type="warning" description="确认填写的训练设置无误后点击下方“开始训练”即可开启后台训练。" show-icon
                  :closable="false">
                </el-alert>
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
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <div slot="header">
            <span>可视化</span>
          </div>
          <el-button type="primary" size="default" @click="selectStartNodeClick">
            选择初始节点
          </el-button>
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
import { searchTraining, addTraining, alterTraining } from '@/api/training'

export default {
  name: 'TrainingDetail',
  props: {
    fromScenarioId: {
      type: Number,
      default: NaN
    }
  },
  data() {
    return {
      active: 0,
      actionDialogVisible: false,
      nodeDialogVisible: false,
      actionConfigButtonType: 'primary',
      trainingNodeConfigButtonType: 'primary',
      trainingForm: {
        scenarioId: '',
        startNodeId: '',
        algorithmId: '',
        seed: '',
        learningRate: '',
        batchSize: '',
        trainingSteps: '',
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
      scenarioOptions: [
        {
          value: 'fileA',
          label: '文件夹A',
          children: [
            {
              value: 'fileA1',
              label: '文件夹A1',
              children: [
                {
                  value: 'sa1',
                  label: '场景a1',
                },
              ]
            },
            {
              value: 's1',
              label: '场景1',
            },
            {
              value: 's2',
              label: '场景2',
            },
            {
              value: 's3',
              label: '场景3',
            },
          ],
        },
        {
          value: 'fileB',
          label: '文件夹B',
          children: [],
        },
      ],
      algorithmOptions: [
        {
          value: 'fileA',
          label: '文件夹A',
          children: [
            {
              value: 'fileA1',
              label: '文件夹A1',
              children: [
                {
                  value: 'alga1',
                  label: '算法a1',
                },
              ]
            },
            {
              value: 'alg1',
              label: '算法1',
            },
            {
              value: 'alg2',
              label: '算法2',
            },
            {
              value: 'alg3',
              label: '算法3',
            },
          ],
        },
        {
          value: 'fileB',
          label: '文件夹B',
          children: [],
        },
      ],
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
        scenarioId: [
          { required: true, message: '请选择场景', trigger: 'change' },
        ],
        startNodeId: [
          { required: true, message: '请选择初始节点', trigger: 'change' },
        ],
        algorithmId: [
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
    if (this.fromScenarioId) {
      this.trainingForm.scenarioId = fromScenarioId;
    }
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
  methods: {
    frontStep() {
      if (this.active-- == 0) this.active = 0;
    },
    nextStep() {
      if (this.active === 0) {
        let stepOneValid = true;
        let stepOneField = ['scenarioId', 'startNodeId', 'algorithmId']
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
    startTrainingClick() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push("/training/index");
    },
    selectStartNodeClick() {
      this.trainingForm.startNodeId = 123;
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
  height: 100%;
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