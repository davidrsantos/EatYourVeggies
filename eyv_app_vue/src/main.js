require('./bootstrap');
import api from './services/api'
import transactions from './services/transactions'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import vuetify from './plugins/vuetify';
import vuelidate from 'vuelidate'



import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

Vue.use(vuelidate)

import VueSocketio from 'vue-socket.io';
Vue.use(new VueSocketio({
  debug: true,
  connection: 'http://localhost'+ ':8020'
}));


new Vue({
  vuelidate,
  api,
  transactions,
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
