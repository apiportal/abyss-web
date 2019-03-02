import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout';
// My-APIs Routes Components
import MyApis from '@/components/routes/myApis/MyApis';
import Businesses from '@/components/routes/myApis/businesses/Businesses';
// import Api from '@/components/routes/myApis/api/Api';
import MyApisLogs from '@/components/routes/myApis/MyApisLogs';
import EditMyApisLicense from '@/components/routes/myApis/EditMyApisLicense';
// Dashboard Routes Components
import Dashboard from '@/components/routes/dashboard/Dashboard';
// Home Routes Components
import Home from '@/components/routes/home/Home';
// Identity Managers Routes Components
import IdentityManagers from '@/components/routes/identityManagers/IdentityManagers';
import AddIdentityManager from '@/components/routes/identityManagers/AddIdentityManager';
import EditIdentityManager from '@/components/routes/identityManagers/EditIdentityManager';
import DeleteIdentityManager from '@/components/routes/identityManagers/DeleteIdentityManager';
// Identity Manager Types Routes Components
import IdentityManagerTypes from '@/components/routes/identityManagerTypes/IdentityManagerTypes';
import AddIdentityManagerType from '@/components/routes/identityManagerTypes/AddIdentityManagerType';
import EditIdentityManagerType from '@/components/routes/identityManagerTypes/EditIdentityManagerType';
import DeleteIdentityManagerType from '@/components/routes/identityManagerTypes/DeleteIdentityManagerType';
// Administer Users Routes Components
import AdministerUsers from '@/components/routes/administerUsers/AdministerUsers';
import AdministerUsersLogs from '@/components/routes/administerUsers/AdministerUsersLogs';
import AddAdministerUser from '@/components/routes/administerUsers/AddAdministerUser';
import EditAdministerUser from '@/components/routes/administerUsers/EditAdministerUser';
import EditAdministerUserGroups from '@/components/routes/administerUsers/EditAdministerUserGroups';
import DeleteAdministerUser from '@/components/routes/administerUsers/DeleteAdministerUser';
// Administer Groups Routes Components
import AdministerGroups from '@/components/routes/administerGroups/AdministerGroups';
import AdministerGroupsLogs from '@/components/routes/administerGroups/AdministerGroupsLogs';
import AddAdministerGroup from '@/components/routes/administerGroups/AddAdministerGroup';
import EditAdministerGroup from '@/components/routes/administerGroups/EditAdministerGroup';
import DeleteAdministerGroup from '@/components/routes/administerGroups/DeleteAdministerGroup';
import EditAdministerGroupUser from '@/components/routes/administerGroups/EditAdministerGroupUser';
// Access Managers Routes Components
import AccessManagers from '@/components/routes/accessManagers/AccessManagers';
import AddAccessManager from '@/components/routes/accessManagers/AddAccessManager';
import EditAccessManager from '@/components/routes/accessManagers/EditAccessManager';
import DeleteAccessManager from '@/components/routes/accessManagers/DeleteAccessManager';
// Access Manager Types Routes Components
import AccessManagerTypes from '@/components/routes/accessManagerTypes/AccessManagerTypes';
import AddAccessManagerType from '@/components/routes/accessManagerTypes/AddAccessManagerType';
import EditAccessManagerType from '@/components/routes/accessManagerTypes/EditAccessManagerType';
import DeleteAccessManagerType from '@/components/routes/accessManagerTypes/DeleteAccessManagerType';
// Administer Permissions Routes Components
import AdministerPermissions from '@/components/routes/administerPermissions/AdministerPermissions';
import AddAdministerPermission from '@/components/routes/administerPermissions/AddAdministerPermission';
import EditAdministerPermission from '@/components/routes/administerPermissions/EditAdministerPermission';
import DeleteAdministerPermission from '@/components/routes/administerPermissions/DeleteAdministerPermission';
// My APPs Routes
import MyApps from '@/components/routes/myApps/MyApps';
import SubjectApps from '@/components/routes/myApps/subjectApps/SubjectApps';
import MyAppsLogs from '@/components/routes/myApps/MyAppsLogs';
import EditMyApps from '@/components/routes/myApps/EditMyApps';
import AddMyApps from '@/components/routes/myApps/AddMyApps';
// My Licenses
import MyLicenses from '@/components/routes/myLicenses/MyLicenses';
import SubjectLicenses from '@/components/routes/myLicenses/subjectLicenses/SubjectLicenses';
import MyLicensesLogs from '@/components/routes/myLicenses/MyLicensesLogs';
import EditMyLicense from '@/components/routes/myLicenses/EditMyLicense';
import AddMyLicense from '@/components/routes/myLicenses/AddMyLicense';
import DeleteMyLicense from '@/components/routes/myLicenses/DeleteMyLicense';
// My Policies
import MyPolicies from '@/components/routes/myPolicies/MyPolicies';
import SubjectPolicies from '@/components/routes/myPolicies/subjectPolicies/SubjectPolicies';
import MyPoliciesLogs from '@/components/routes/myPolicies/MyPoliciesLogs';
// Explore
import Explore from '@/components/routes/explore/Explore';
// Organizations Routes Components
import Organizations from '@/components/routes/organizations/Organizations';
import OrganizationsLogs from '@/components/routes/organizations/OrganizationsLogs';
import AddOrganization from '@/components/routes/organizations/AddOrganization';
import EditOrganization from '@/components/routes/organizations/EditOrganization';
import DeleteOrganization from '@/components/routes/organizations/DeleteOrganization';
import EditOrganizationUser from '@/components/routes/organizations/EditOrganizationUser';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/app',
      component: DefaultLayout,
      children: [
        {
          path: 'dashboard',
          component: Dashboard,
        },
        {
          path: 'explore',
          component: Explore,
        },
        {
          path: 'my-apis',
          component: MyApis,
          children: [
            {
              path: 'businesses/:page',
              component: Businesses,
              children: [
                {
                  path: 'logs/:id/:logType/:logPage',
                  component: MyApisLogs,
                },
                {
                  path: 'edit-license/:licenseId',
                  component: EditMyApisLicense,
                },
              ],
            },
            // {
            //   path: 'api/:id',
            //   component: Api,
            // },
          ],
        },
        {
          path: 'identity-managers/:page',
          component: IdentityManagers,
          children: [
            {
              path: 'add-new',
              component: AddIdentityManager,
            },
            {
              path: 'edit/:id',
              component: EditIdentityManager,
            },
            {
              path: 'delete/:id',
              component: DeleteIdentityManager,
            },
          ],
        },
        {
          path: 'identity-manager-types/:page',
          component: IdentityManagerTypes,
          children: [
            {
              path: 'add-new',
              component: AddIdentityManagerType,
            },
            {
              path: 'edit/:id',
              component: EditIdentityManagerType,
            },
            {
              path: 'delete/:id',
              component: DeleteIdentityManagerType,
            },
          ],
        },
        {
          path: 'administer-users/:page',
          component: AdministerUsers,
          children: [
            {
              path: 'logs/:id/:logType/:logPage',
              component: AdministerUsersLogs,
            },
            {
              path: 'add-new',
              component: AddAdministerUser,
            },
            {
              path: 'edit/:id',
              component: EditAdministerUser,
            },
            {
              path: 'edit-groups/:id',
              component: EditAdministerUserGroups,
            },
            {
              path: 'delete/:id',
              component: DeleteAdministerUser,
            },
          ],
        },
        {
          path: 'administer-groups/:page',
          component: AdministerGroups,
          children: [
            {
              path: 'logs/:id/:logType/:logPage',
              component: AdministerGroupsLogs,
            },
            {
              path: 'add-new',
              component: AddAdministerGroup,
            },
            {
              path: 'edit/:id',
              component: EditAdministerGroup,
            },
            {
              path: 'delete/:id',
              component: DeleteAdministerGroup,
            },
            {
              path: 'edit-user/:id',
              component: EditAdministerGroupUser,
            },
          ],
        },
        {
          path: 'access-managers/:page',
          component: AccessManagers,
          children: [
            {
              path: 'add-new',
              component: AddAccessManager,
            },
            {
              path: 'edit/:id',
              component: EditAccessManager,
            },
            {
              path: 'delete/:id',
              component: DeleteAccessManager,
            },
          ],
        },
        {
          path: 'access-manager-types/:page',
          component: AccessManagerTypes,
          children: [
            {
              path: 'add-new',
              component: AddAccessManagerType,
            },
            {
              path: 'edit/:id',
              component: EditAccessManagerType,
            },
            {
              path: 'delete/:id',
              component: DeleteAccessManagerType,
            },
          ],
        },
        {
          path: 'administer-permissions/:page',
          component: AdministerPermissions,
          children: [
            {
              path: 'add-new',
              component: AddAdministerPermission,
            },
            {
              path: 'edit/:id',
              component: EditAdministerPermission,
            },
            {
              path: 'delete/:id',
              component: DeleteAdministerPermission,
            },
          ],
        },
        {
          path: 'my-apps',
          component: MyApps,
          children: [
            {
              path: 'my-apps/:page',
              component: SubjectApps,
              children: [
                {
                  path: 'logs/:id/:logType/:logPage',
                  component: MyAppsLogs,
                },
                {
                  path: 'edit-app/:appId',
                  component: EditMyApps,
                },
                {
                  path: 'add-new',
                  component: AddMyApps,
                },
              ],
            },
          ],
        },
        {
          path: 'my-licenses',
          component: MyLicenses,
          children: [
            {
              path: 'my-licenses/:page',
              component: SubjectLicenses,
              children: [
                {
                  path: 'logs/:id/:logType/:logPage',
                  component: MyLicensesLogs,
                },
                {
                  path: 'edit-license/:licenseId',
                  component: EditMyLicense,
                },
                {
                  path: 'add-new',
                  component: AddMyLicense,
                },
                {
                  path: 'delete-license/:licenseId',
                  component: DeleteMyLicense,
                },
              ],
            },
          ],
        },
        {
          path: 'my-policies',
          component: MyPolicies,
          children: [
            {
              path: 'my-policies/:page',
              component: SubjectPolicies,
              children: [
                {
                  path: 'logs/:id/:logType/:logPage',
                  component: MyPoliciesLogs,
                },
              ],
            },
          ],
        },
        {
          path: 'organizations/:page',
          component: Organizations,
          children: [
            {
              path: 'logs/:id/:logType/:logPage',
              component: OrganizationsLogs,
            },
            {
              path: 'add-new',
              component: AddOrganization,
            },
            {
              path: 'edit/:id',
              component: EditOrganization,
            },
            {
              path: 'delete/:id',
              component: DeleteOrganization,
            },
            {
              path: 'edit-user/:id',
              component: EditOrganizationUser,
            },
          ],
        },
      ],
    },
  ],
});
