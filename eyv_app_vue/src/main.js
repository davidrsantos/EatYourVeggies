require('./bootstrap');
import api from './services/api'
import transactions from './services/transactions'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import vuetify from './plugins/vuetify';
import vuelidate from 'vuelidate'
import * as VueGoogleMaps from "vue2-google-maps";



import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

Vue.use(vuelidate)
  Vue.use(VueGoogleMaps, {
    load: {
      key: "AIzaSyBgpXMalTcvy7twU8AqpLNIPw818uy1KfM",
      libraries: "places" // necessary for places input
    }
  });

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
