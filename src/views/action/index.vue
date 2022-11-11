<template>
    <div class="action-container">
        <el-button type="primary" @click="uploadaction = true">新增动作</el-button>
        <el-dialog title="新增动作" :visible.sync="uploadaction">
        <el-form :model="form">
            <el-form-item label="动作名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="动作类型" :label-width="formLabelWidth">
            <el-input v-model="form.type" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="动作描述" :label-width="formLabelWidth">
            <el-input v-model="form.description" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="uploadaction = false">取 消</el-button>
            <el-button type="primary" @click="uploadaction = false">确 定</el-button>
        </div>
        </el-dialog>
        <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column fixed prop="id" label="序号">
        </el-table-column>
        <el-table-column fixed prop="action_name" label="动作名称">
        </el-table-column>
        <el-table-column prop="action_type" label="动作类型">
        </el-table-column>
        <el-table-column prop="action_description" label="动作描述">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="400">
            <template>
            <el-button type="success" size="small" @click="editaction = true">编辑</el-button>
            <el-button type="warning" size="small">删除</el-button>
            </template>
        </el-table-column>
        </el-table>
        <el-dialog title="编辑动作" :visible.sync="editaction">
        <el-form :model="form">
            <el-form-item label="动作名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="动作类型" :label-width="formLabelWidth">
            <el-input v-model="form.type" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="动作描述" :label-width="formLabelWidth">
            <el-input v-model="form.description" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="editaction = false">取 消</el-button>
            <el-button type="primary" @click="editaction = false">确 定</el-button>
        </div>
        </el-dialog>
    </div>
    </template>
    
    <script>
    export default {
      data() {
        return {
          tableData: [{
            id: '01',
            action_name: 'Software Discovery (T1518)',
            action_type: 'Discovery',
            action_description: 'Adversaries may attempt to get a listing of software...'
          }, {
            id: '02',
            action_name: 'Unsecured Credentials (T1552)',
            action_type: 'COPIED__MB__WIDGET',
            action_description: 'Adversaries may search compromised systems to find...'
          }, {
            id: '03',
            action_name: 'Process Injection (T1055)',
            action_type: 'privilege escalation',
            action_description: 'Adversaries may inject code into processes in order...'
          }, {
            id: '04',
            action_name: 'Remote Services (T1021)',
            action_type: 'lateral movement',
            action_description: 'Adversaries may use Valid Accounts to log into a...'
          }],
          uploadaction: false,
          editaction: false,
          form: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
          },
          formLabelWidth: '120px'
        }
      }
    }
    </script>