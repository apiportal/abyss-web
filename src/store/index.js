import Vue from 'vue';
import Vuex from 'vuex';
import user from '@/store/modules/user';
import traffic from '@/store/modules/traffic';
import organizations from '@/store/modules/organizations';
import subjectDirectories from '@/store/modules/subjectDirectories';
import subjectDirectoryTypes from '@/store/modules/subjectDirectoryTypes';
import users from '@/store/modules/users';
import accessManagers from '@/store/modules/accessManagers';
import accessManagerTypes from '@/store/modules/accessManagerTypes';
import groups from '@/store/modules/groups';
import permissions from '@/store/modules/permissions';
import resourceTypes from '@/store/modules/resourceTypes';
import resourceActions from '@/store/modules/resourceActions';
import resources from '@/store/modules/resources';
import subjectTypes from '@/store/modules/subjectTypes';
import apps from '@/store/modules/apps';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    traffic,
    organizations,
    subjectDirectories,
    subjectDirectoryTypes,
    users,
    accessManagers,
    accessManagerTypes,
    groups,
    permissions,
    resourceTypes,
    resourceActions,
    resources,
    subjectTypes,
    apps,
  },
  debug: true,
});
