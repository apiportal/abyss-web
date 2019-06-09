/*
 * Copyright 2019 Verapi Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '@/assets/scss/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  fab,
  faFacebookSquare,
  faTwitterSquare,
  faInstagram,
  faGithubSquare,
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
  faHome,
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
  faHome,
  faLock,
  faFacebookSquare,
  faTwitterSquare,
  faGithubSquare,
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
