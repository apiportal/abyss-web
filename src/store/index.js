import Vue from 'vue';
import Vuex from 'vuex';
import user from '@/store/modules/user';
import subjectDirectories from '@/store/modules/subjectDirectories';
import subjectDirectoryTypes from '@/store/modules/subjectDirectoryTypes';
import organizations from '@/store/modules/organizations';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    subjectDirectories,
    subjectDirectoryTypes,
    organizations,
  },
  debug: true,
});
