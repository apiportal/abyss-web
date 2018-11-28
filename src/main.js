// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faSpinner,
  faTachometerAlt,
  faSitemap,
  faEllipsisH,
  faEllipsisV,
  faCube,
  faCubes,
  faCertificate,
  faFilePowerpoint,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import App from './App';
import router from './router';

library.add(
  faTachometerAlt,
  faSpinner,
  faSitemap,
  faEllipsisH,
  faEllipsisV,
  faCube,
  faCubes,
  faCertificate,
  faFilePowerpoint,
  faGlobe,
);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
