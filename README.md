# 网络对抗
## Build Setup

```bash
# 建议用ssh克隆项目，用 https://github.com/cwchang19/cyber-confrontation.git 克隆推送不稳定
# 克隆主分支 main
git clone git@github.com:cwchang19/cyber-confrontation.git
# 或克隆前台分支 front
git clone -b front git@github.com:cwchang19/cyber-confrontation.git
# 或克隆后台分支 back
git clone -b back git@github.com:cwchang19/cyber-confrontation.git

# 进入项目目录
cd cyber-confrontation

# 安装依赖，四选一，一个安装不了就换另一个
npm install
npm install --registry=https://registry.npm.taobao.org
cnpm install
pnpm install

# 启动服务
npm run dev

# 可能会出现缺少 core-js，单独安装就行 cnpm i core-js -D
```

浏览器访问 [http://localhost:9528](http://localhost:9528)

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```