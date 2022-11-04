## Build Setup

```bash
# 用ssh克隆项目，用 https://github.com/cwchang19/cyber-confrontation-user.git 克隆的话推送不稳定，常常会超时
git clone git@github.com:cwchang19/cyber-confrontation-user.git

# 进入项目目录
cd cyber-confrontation-user

# 安装依赖，三选一，一个安装不了就换另一个
npm install
npm install --registry=https://registry.npm.taobao.org
cnpm install

# 启动服务
npm run dev
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