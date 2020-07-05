require('./bootstrap')
import api from './services/api'
import transactions from './services/transactions'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import vuetify from './plugins/vuetify'
import vuelidate from 'vuelidate'
import VueSocketio from 'vue-socket.io'
import Snotify, { SnotifyPosition } from 'vue-snotify'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

Vue.use(vuelidate)

Vue.use(Snotify, {
  toast: {
    position: SnotifyPosition.rightBottom
  }
})

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBgpXMalTcvy7twU8AqpLNIPw818uy1KfM',
    libraries: 'places' // necessary for places input
  }
})

const socket = io('http://127.0.0.1:8020')
Vue.use(VueSocketIOExt, socket)

const app = new Vue({
  vuelidate,
  api,
  transactions,
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')

export default app