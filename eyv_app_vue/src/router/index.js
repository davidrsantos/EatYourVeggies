import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import Dashboard from '../views/Dashboard.vue'
import drawer from '../components/Drawer.vue'
import signup from '../components/Signup_form.vue'
import login from '../components/Login_form'
import addProduct from '../views/AddProduct'
import editProduct from '../views/EditProduct'
import welcome from '../views/welcome.vue'
import profile from '../views/profile'
import errorDialog from "../components/errorDialog";
import listUsers from "../components/listUsers";
import userDetails from "../components/UserDetails";
import proposals from "../components/Proposals";
import propertyDetails from "../components/PropertyDetails";
import materialNotification from '../components/materialNotification'
import UserDetailsView from '../views/admin/UserDetailsView'
import requestPassword from '../components/requestPassword'
import googleMap from "../components/GoogleMap"
import DivideProduct from '../components/DivideProduct'
import ManagerProducts from '../views/ManagerProducts'

Vue.component('manager-products', ManagerProducts),
Vue.component('user-details',userDetails)
Vue.component('errorDialog', errorDialog)
Vue.component('drawer', drawer);
Vue.component('listUsers', listUsers);
Vue.component('proposals', proposals);
Vue.component('propertyDetails', propertyDetails);
Vue.component('requestPassword',requestPassword)
Vue.component('googleMap', googleMap);
Vue.component('material-notification',materialNotification)
Vue.component('divide-product', DivideProduct)

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
        path: '/products/new',
        name: 'addProduct',
        component: addProduct
    },
    {
        path: '/products',
        name: 'ManagerProducts',
        component: ManagerProducts
    },
    {
        path: '/products/:recordId/property/:name',
        name: 'propertyDetails',
        component: propertyDetails, props: true
    },
    {
        path: '/products/:recordId',
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
        path: '/user/:publicKey',
        name: 'userDetails',
        component: UserDetailsView
    },
    {
        path: '/signup',
        name: 'signup',
        component: signup
    },

];

const router = new VueRouter({
    routes

});

router.beforeEach((to, from, next) => {
    console.log("to: " + to.name + " from: " + from.name + " next: " + next.name)

    if (from.name === to.name) {
        next(false);
        return;
    }

    if(to.name === 'welcome' && store.state.user){
        next('dashboard')
    }



    if ((to.name !== 'welcome' && to.name !== 'login' && to.name !== 'signup' && to.name !=='ManagerProducts' && to.name !=='userDetails' ) && !store.state.user) next({name: 'welcome'})
    else next()



});


router.onError(error => {
    console.error(error)
});



export default router
