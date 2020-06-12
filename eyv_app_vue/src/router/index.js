import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import Dashboard from '../views/Dashboard.vue'
import drawer from '../components/Drawer.vue'
import signup from '../components/Signup_form.vue'
import login from '../components/Login_form'
import addProduct from '../views/AddProduct'
import managerProducts from '../views/ManagerProducts'
import editProduct from '../views/EditProduct'
import welcome from '../views/welcome.vue'
import profile from '../views/profile'
import errorDialog from "../components/errorDialog";
import listUsers from "../components/listUsers";
import userDetails from "../components/UserDetails";
import proposals from "../components/Proposals";
import materialNotification from '../components/materialNotification'

Vue.component('user-details',userDetails)
Vue.component('errorDialog', errorDialog)
Vue.component('drawer', drawer);
Vue.component('listUsers', listUsers);
Vue.component('proposals', proposals);

Vue.component('material-notification',materialNotification)

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
        path: '/signup',
        name: 'Signup',
        component: signup
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
    if ((to.name !== 'welcome' && to.name !== 'login' && to.name !== 'Signup') && !store.state.user) next({name: 'welcome'})
    else next()



});

export default router
