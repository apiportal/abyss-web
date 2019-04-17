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
import apis from '@/store/modules/apis';
import subjectMemberships from '@/store/modules/subjectMemberships';
import businessApis from '@/store/modules/businessApis';
import apiSubscriptions from '@/store/modules/apiSubscriptions';
import apisSharedWithUser from '@/store/modules/apisSharedWithUser';
import apisSharedByUser from '@/store/modules/apisSharedByUser';
import apiStates from '@/store/modules/apiStates';
import apiVisibilityTypes from '@/store/modules/apiVisibilityTypes';
import proxies from '@/store/modules/proxies';
import policies from '@/store/modules/policies';
import policyTypes from '@/store/modules/policyTypes';
import subjectApps from '@/store/modules/subjectApps';
import subjectLicenses from '@/store/modules/subjectLicenses';
import licenses from '@/store/modules/licenses';
import currentPage from '@/store/modules/currentPage';
import contractStates from '@/store/modules/contractStates';
import subjectOrganizations from '@/store/modules/subjectOrganizations';
import subjectResources from '@/store/modules/subjectResources';
import subjectPermissions from '@/store/modules/subjectPermissions';
import subjectPolicies from '@/store/modules/subjectPolicies';
import apiLicenses from '@/store/modules/apiLicenses';
import userContracts from '@/store/modules/userContracts';

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
    apis,
    subjectMemberships,
    businessApis,
    apiSubscriptions,
    apisSharedWithUser,
    apisSharedByUser,
    apiStates,
    apiVisibilityTypes,
    proxies,
    policies,
    policyTypes,
    subjectApps,
    subjectLicenses,
    licenses,
    currentPage,
    contractStates,
    subjectOrganizations,
    subjectResources,
    subjectPermissions,
    subjectPolicies,
    apiLicenses,
    userContracts,
  },
  debug: true,
});
