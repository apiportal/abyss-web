import Vue from 'vue';
import Vuex from 'vuex';
import user from '@/store/modules/user';
import traffic from '@/store/modules/traffic';
import subjectDirectories from '@/store/modules/subjectDirectories';
import subjectDirectoryTypes from '@/store/modules/subjectDirectoryTypes';
import organizations from '@/store/modules/organizations';
import users from '@/store/modules/users';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    traffic,
    subjectDirectories,
    subjectDirectoryTypes,
    organizations,
    users,
  },
  debug: true,
});
