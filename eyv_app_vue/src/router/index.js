import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import drawer from '../components/Drawer.vue'
import singup from '../components/Singup_form.vue'
import login from '../components/Login_form'

Vue.component('drawer', drawer);

Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    name:'login',
    component : login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/singup',
    name: 'Singup',
    component: singup
  },
  {
    path: '/about',
    name: 'About',
  // se for preciso
  }
]

const router = new VueRouter({
  routes
})

export default router
