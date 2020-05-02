import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import Dashboard from '../views/Dashboard.vue'
import drawer from '../components/Drawer.vue'
import singup from '../components/Singup_form.vue'
import login from '../components/Login_form'
import addProduct from '../views/AddProduct'
import managerProducts from '../views/ManagerProducts'
import editProduct from '../views/EditProduct'
import welcome from '../views/welcome.vue'
import profile from '../views/profile'

Vue.component('drawer', drawer);

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        alias: '/welcome',
        name: 'welcome',
        component: welcome,

    },
    {
        path: '/myProfile',
        name: 'MyProfile',
        component: profile,

    },
    {
        path: '/addProduct',
        name: 'addProduct',
        component: addProduct
    },
    {
        path: '/managerProducts',
        name: 'managerProducts',
        component: managerProducts
    },
    {
        path: '/editProduct/:recordId',
        name: 'editProduct',
        component: editProduct
    },
    {
        path: '/login',
        name: 'login',
        component: login
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
];

const router = new VueRouter({
    routes

});

router.beforeEach((to, from, next) => {


    if (from.name == to.name) {
        next(false);
        return;
    }


    console.log("to: " + to.name + " from: " + from.name + " next: " + next.name)
    if ((to.name !== 'welcome' && to.name !== 'login' && to.name !== 'Singup') && !store.state.user) next({name: 'welcome'})
    else next()
    return;


});

export default router
