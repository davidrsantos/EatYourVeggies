import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#66BB6A',
        secondary: '#795548',
        accent: '#A5D6A7',
        error: '#f44336',
        info: '#1e88e5',
        success: '#4CAF50',
        warning: '#ff9800',
        confirm: '#009688'
      },
    },
  },
});
