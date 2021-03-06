##  电商后台管理系统(前端项目） 
### 后端API接口源码  https://github.com/GA20-zgh/cms-api.git).  [接口API](./api接口文档.md)

### 功能

> 用于管理用户账号，商品分类，商品信息，订单，数据统计等业务功能


### 开发模式

> 电商后台管理系统整体采用前后端分离的开发模式,其中前端项目是基于Vue技术栈的SPA项目

#### 前端项目技术栈

- Vue
- Vue-router
- Element-UI
- Axios
- Echarts

#### 后端项目技术栈

- Node.js

- Express

- Jwt

- Mysql

- Sequelize


#### 前端项目初始化步骤

1. 安装 Vue 脚手架
2. 通过 Vue-Cli 创建项目
3. 配置 Vue-router
4. 配置 Element-UI 组件库
5. 配置 Axios 库
6. 初始化 git 远程仓库

#### 后端项目的环境安装配置

1. 安装MySQL数据库
2. 安装Node.js环境
3. 配置项目相关信息
4. 启动项目
   1. 使用phpstudy导入数据库并运行
   2. npm init 后端项目
   3. node ./app.js
5. 使用Postman测试后台项目接口是否正常

### 登录概述

#### 登录业务流程

1. 在登录页面输入用户名和密码
2. 调用后台接口进行验证
3. 通过验证之后,根据后台的响应状态跳转到项目主页

#### 登录业务相关技术点

1. http是无状态的
2. 通过cookie在客户端记录状态
3. 通过sesion在服务器端记录状态
4. 通过token维持状态(不允许跨域使用)

通过Element-UI组件实现布局

- el-form
- el-form-item
- el-input
- el-button
- 字体图标


##### 路由导航守卫控制访问权限

> 如果用户没有登录,但是直接通过URL访问特定页面,需要重新导航到登录页面

```js
//为路由对象,添加beforeEach导航守卫
router.beforeEach((to,from,next) => {
    //如果用户访问的登录页,直接放行
    if (to.path === 'login') return next()
    //从sessionStorage中获取到保存的token值
    const tokenStr = window.sessionStorage.getItem('token')
    //如果么有token,强制跳转到登录页
    if(!tokenStr) return next('/login')
    next()
})
```

### 主页布局

#### 通过接口获取菜单数据

> 通过axios请求拦截器添加token,保证拥有获取数据的权限

```js
// axios请求拦截
axios.interceptors.request.use(config => {
    // 为请求头对象,添加token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
```

### 权限管理

#### 权限管理业务分析

> 通过权限管理模块控制不同的用户可以进行哪些操作,具体可以通过角色的方式进行控制,即每个用户分配一个特定的角色,角色包括不同的功能权限

### 项目所用依赖

1. 运行依赖

- axios => 发送请求
- echarts => 图表
- element-ui => element ui组件
- lodash => js工具库,该项目用到深拷贝与对象合并
- moment => 时间处理工具库
- nprogress => 进度条库
- v-viewer => 图片预览工具库
- vue-quill-editor => 富文本编辑器
- vue-table-with-tree-grid => 树形菜单/表格

2. 开发依赖

- babel => es6+语法转换
- eslint/babel-eslint => 语法检查
- less/less-loader => less语法
- babel-plugin-transform-remove-console => 移除console插件

### 项目优化

### 项目优化策略

- 生成打包报告

  - 通过命令行参数形式生成报告=>vue-cli-service build --report
  - 通过可视化ui面板直接查看报告(通过控制台和分析面板)

- 通过vue.config.js修改webpack的默认配置

  > 通过vue-cli 3.0工具生成的项目,默认隐藏了所有webpack的配置项,目的是为了屏蔽项目的配置过程,让开发人员把工作的   重心,放在具体功能和业务逻辑的实现上

- 为开发模式与发布模式指定不同的打包入口

  > 默认情况下,vue项目的开发与发布模式,共用同一个打包的入口文件(即src/main.js),为了将项目的开发过程与发布过程分离,可以为两种模式,各自指定打包的入口文件,即:
  >
  > 1. 开发模式入口文件 src/main-dev.js
  > 2. 发布模式入口文件 src/main-prod.js
  >
  > 方案：configureWebpack(通过链式编程形式)和chainWebpack(通过操作对象形式)
  >
  > 在vue.config.js导出的配置文件中,新增configureWebpack或chainWebpack节点,来自定义webpack的打包配置

  ```js
  // 代码示例
  module.exports = {
      chainWebpack: config => {
          // 发布模式
          config.when(process.env.NODE_ENV === 'production', config => {
              config.entry('app').clear().add('./src/main-prod.js')
          })
          // 开发模式
          config.when(process.env.NODE_ENV === 'development', config => {
              config.entry('app').clear().add('./src/main-dev.js')
          })
      }
  }
  ```

- 第三方库启用CDN

  - 通过externals加载外部cdn资源

  > 默认情况下,通过import语法导入的第三方依赖包,最终会打包合并到同一个文件中,从而导致打包成功后,单文件体积过大的问题 => **chunk-vendors**体积过大
  >
  > 为了解决上述问题,可以通过webpack的externals节点,来配置加载外部的cdn资源,凡是声明在externals中的第三方依赖包,都不会被打包

  1. 步骤1

  ```js
  module.exports = {
      chainWebpack: config => {
          config.when(process.env.NODE_ENV === 'production', config => {
              config.entry('app').clear().add('./src/main-prod.js')
              // 在vue.config.js如下配置
              config.set('externals', {
                  vue: 'Vue',
                  'vue-router': 'VueRouter',
                  axios: 'axios',
                  lodash: '_',
                  echarts: 'echarts',
                  nporgress: 'NProgress',
                  'vue-quill-editor': 'VueQuillEditor'
              })
          })
          config.when(process.env.NODE_ENV === 'development', config => {
              config.entry('app').clear().add('./src/main-dev.js')
          })
      }
  }
  ```

  2. 步骤2

  > 在public/index.html文件头部,将main-prod中的已经进行配置的import(<code>样式表</code>)删除替换为cdn引入
```css
<link href="https://cdn.bootcss.com/viewerjs/1.3.7/viewer.min.css" rel="stylesheet">

<link href="https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.bubble.min.css" rel="stylesheet">

​<link href="https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.core.min.css" rel="stylesheet">

<link href="https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.snow.min.css" rel="stylesheet">

<link href="https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css" rel="stylesheet">

<link href="https://cdn.bootcss.com/element-ui/2.12.0/theme-chalk/index.css" rel="stylesheet">
```
  3. 步骤3

  > 在public/index.html文件头部,将main-prod中的已经进行配置的import(<code>js文件</code>)删除替换为cdn引入
```css
 <script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>
 
 <script src="https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js"></script>

<script src="https://cdn.bootcss.com/axios/0.19.0/axios.min.js"></script>

<script src="https://cdn.bootcss.com/lodash.js/4.17.15/lodash.min.js"></script>

<script src="https://cdn.bootcss.com/echarts/4.4.0-rc.1/echarts.min.js"></script>

<script src="https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js"></script>

<script src="https://cdn.bootcss.com/quill/2.0.0-dev.3/quill.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/vue-quill-editor@3.0.4/dist/vue-quill-editor.js"></script>

<script src="https://cdn.bootcss.com/viewerjs/1.3.7/viewer.min.js"></script>

<script src="https://cdn.bootcss.com/moment.js/2.24.0/moment.min.js"></script>
```
