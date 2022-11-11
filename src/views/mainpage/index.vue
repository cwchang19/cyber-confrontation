<template>
    <div class="mainpage-container">
      <el-row>
        <el-col :span="8"><div class="grid-content bg-purple"></div>
          <div align="center">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <div align="left">
                  <span>算法数量</span>
                </div>
                <router-link :to="'algorithm/index'">
                  <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
                </router-link>
              </div>
              <div class="text item">660</div>
            </el-card>
          </div>
        </el-col>
  
        <el-col :span="8"><div class="grid-content bg-purple"></div>
          <div align="center">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <div align="left">
                  <span>动作数量</span>
                </div>
                <router-link :to="'action/index'">
                  <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
                </router-link>
              </div>
              <div class="text item">660</div>
            </el-card>
          </div>
        </el-col>
  
        <el-col :span="8"><div class="grid-content bg-purple-light"></div>
          <div align="center">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <div align="left">
                  <span>用户数量</span>
                </div>
                <router-link :to="'user/index'">
                  <el-button style="float: right; padding: 3px 0" type="text">查看详情</el-button>
                </router-link>
              </div>
              <div class="text item">660</div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </template>
    <style>
      .text {
        font-size: 24px;
      }
      .item {
        margin-bottom: 12px;
      }
      .clearfix:before,
      .clearfix:after {
        display: table;
        content: "";
      }
      .clearfix:after {
        clear: both
      }
      .box-card {
        width: 240px;
      }
  </style>