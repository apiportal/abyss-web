// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/assets/scss/style.scss';
import '@/assets/scss/main.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  fab,
  faFacebook,
  faTwitter,
  faInstagram,
  faGithub,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import {
  fas,
  faSpinner,
  faTachometerAlt,
  faSitemap,
  faEllipsisH,
  faEllipsisV,
  faCircle,
  faCube,
  faCubes,
  faCertificate,
  faFilePowerpoint,
  faGlobe,
  faSearch,
  faFilter,
  faPlusSquare,
  faMinusSquare,
  faEdit,
  faTrashAlt,
  faCheckCircle,
  faTimesCircle,
  faCog,
  faSort,
  faSortUp,
  faSortDown,
  faCaretUp,
  faCaretDown,
  faUsers,
  faListOl,
  faTimes,
  faPlus,
  faUsersCog,
  faEye,
  faEyeSlash,
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faIdCard,
  faUserTie,
  faUser,
  faUserCog,
  faRedo,
  faExclamationTriangle,
  faCode,
  faMagic,
  faColumns,
  faUndo,
  faSave,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faChartBar,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueMoment from 'vue-moment';
import moment from 'moment-timezone';
import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import App from './App';
import router from './router';
import store from './store';

library.add(
  fas,
  fab,
  faTachometerAlt,
  faSpinner,
  faSitemap,
  faEllipsisH,
  faEllipsisV,
  faCircle,
  faCube,
  faCubes,
  faCertificate,
  faFilePowerpoint,
  faGlobe,
  faSearch,
  faFilter,
  faPlusSquare,
  faMinusSquare,
  faEdit,
  faTrashAlt,
  faCheckCircle,
  faTimesCircle,
  faCog,
  faSort,
  faSortUp,
  faSortDown,
  faCaretUp,
  faCaretDown,
  faUsers,
  faListOl,
  faTimes,
  faPlus,
  faUsersCog,
  faEye,
  faEyeSlash,
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faIdCard,
  faUserTie,
  faUser,
  faUserCog,
  faRedo,
  faExclamationTriangle,
  faCode,
  faMagic,
  faColumns,
  faUndo,
  faSave,
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faChartBar,
  faLock,
  faFacebook,
  faTwitter,
  faGithub,
  faInstagram,
  faLinkedin,
);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;
Vue.use(VueMoment, {
  moment,
});
Vue.filter('booleanToText', (value) => {
  if (value) {
    return 'Yes';
  }
  return 'No';
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
