<template>
  <div class="algorithm-add-container">
    <el-form :model="algorithmForm" ref="algorithmForm" :rules="formRules" label-width="80px" :inline="false"
      size="normal">
      <!-- 
        这里的 el-form-item 是通过遍历 formItems 实现自动创建的，但是完全可以不这么写，
        完全可以一个一个 el-form-item 去写
      -->
      <el-form-item v-for="(item, index) in formItems" :label="item.label" :prop="item.key" size="normal">
        <!-- 
          template中是自定义的表单控件，可以是el-input、el-radio等等
        -->
        <template>
          <!-- 
            可以通过 v-if 判断当前遍历到了 formItems 中的哪个 item ，然后渲染对应的表单控件
          -->
          <el-input v-if="item.key !== 'algorithm_file'" v-model="algorithmForm[item.key]"
            :type="item.key === 'algorithm_name' ? '' : 'textarea'" :placeholder="'请输入' + item.label" size="normal"
            clearable @change="">
          </el-input>
          <el-upload 
            v-else
            action=""
            :auto-upload="false"
            :on-remove="algfileRemove"
            :on-change="algfileChange"
            :file-list="fileList"
            :limit="1">
            <el-button plain :type="uploadType" icon="el-icon-plus">上传算法文件</el-button>
          </el-upload>
          <!-- <el-button v-else type="primary" plain size="normal" icon="el-icon-plus" @click="">
            点击上传算法文件
          </el-button> -->
        </template>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="formBtnClick('confirm')">
          {{ isEdit ? '编辑' : '新增' }}
        </el-button>
        <el-button @click="formBtnClick('cancel')">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { searchAlgorithmById, addAlgorithm, alterAlgorithmInfo, alterAlgorithmFile } from '@/api/algorithm'
export default {
  name: 'AddAlgorithm',
  components: {
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    algId: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      fileList: [],
      algfile: null,
      uploadType: 'primary',
      // 表单
      algorithmForm: {
        algorithm_name: '',
        algorithm_description: '',
        algorithm_file: 'temp.py',
        create_datetime: '',
      },
      // 表单每个item的基本属性，通过v-for这个数组就能简单实现表单
      formItems: [
        { key: 'algorithm_name', label: '算法名' },
        { key: 'algorithm_file', label: '算法文件' },
        { key: 'algorithm_description', label: '算法描述' },
      ],
      // 表单的每个item的验证规则
      formRules: {
        algorithm_name: [
          { required: true, message: '算法名不能为空', trigger: 'change' },
        ],
        algorithm_description: [
          { required: true, message: '算法描述不能为空', trigger: 'change' },
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.fetchData();
    }
  },
  watch: {
    algfile: function(newVal) {
      // console.log(newVal)
      if(newVal == null) {
        this.uploadType = 'danger';
      } else {
        this.uploadType = 'success';
      }
    }
  },
  methods: {
    async fetchData() {
      const id = this.algId;
      // 根据id请求数据
      let response = await searchAlgorithmById(id);
      this.algorithmForm = response.data;
    },
    // 表单的确认和取消按钮的点击事件
    formBtnClick(type) {
      // type === 'confirm' 是确认按钮点击事件，type === 'cancel' 是取消按钮点击事件
      if (type === 'confirm') {
        if(!this.isEdit && this.algfile == null) {
          this.uploadType = 'danger';
          return;
        }
        let formData = new FormData();

        // 根据formRules验证表单
        this.$refs['algorithmForm'].validate(async (valid) => {
          if (valid) {
            // 验证成功
            if (this.isEdit) {
              // 向后端请求修改算法this.algorithmForm
              const response = await alterAlgorithmInfo(this.algId, this.algorithmForm);
              // console.log(response);
              if(this.algfile) {
                formData.append('file', this.algfile.raw);
                const fresponse = await alterAlgorithmFile(this.algId, formData);
                // console.log(fresponse);
              }
            } else {
              // 否则向后端请求新增算法this.algorithmForm
              this.algorithmForm.create_datetime = new Date();
              formData.append('file', this.algfile.raw);
              formData.append('info', JSON.stringify(this.algorithmForm));
              const response = await addAlgorithm(formData);
              // console.log('新增', response);
            }
            // 通过 this.$emit('在index.vue页面中给当前这个组件绑定的监听事件名'，要返回的数据) 来触发 index.vue 中的监听事件
            this.$emit('watchClick', 'confirm');
          } else {
            return false;
          }
        })
      } else {
        this.$emit('watchClick', 'cancel');
      }
    },
    algfileRemove(file, fileList) {
      this.algfile = null;
    },
    algfileChange(file, fileList) {
      this.algfile = file;
    }
  }
}
</script>

<style>

</style>