import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from '../components/login.vue'
import Home from '../components/home.vue'

Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { // 定义路由规则
    path: '/login', component: Login
  },
  {
    // 定义路由规则
    path: '/home', component: Home
  }
]
const router = new VueRouter({
  routes
})
// 挂载路由导航守卫, 没登陆则跳到登录页
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径来
  // next 是一个函数， 表示放行， next() 放行 next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router