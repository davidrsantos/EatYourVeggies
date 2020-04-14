require('./bootstrap');
const api = require('./services/api')
const transactions =require('./services/transactions')
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate'


import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

Vue.use(Vuelidate)

new Vue({
  api,
  transactions,
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
