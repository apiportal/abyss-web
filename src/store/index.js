import Vue from 'vue';
import Vuex from 'vuex';
import user from '@/store/modules/user';
import subjectDirectories from '@/store/modules/subjectDirectories';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    subjectDirectories,
  },
  debug: true,
});
