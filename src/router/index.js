import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout';
import AuthLayout from '@/layouts/AuthLayout';
// Authorization Components
import Login from '@/components/routes/auth/login';
import SignUp from '@/components/routes/auth/signup';
import ForgotPassword from '@/components/routes/auth/forgotPassword';
import ResetPassword from '@/components/routes/auth/resetPassword';
// My Profile Components
import MyProfile from '@/components/routes/mySettings/MyProfile';
import MySettings from '@/components/routes/mySettings/MySettings';
// My-APIs Routes Components
import MyApis from '@/components/routes/myApis/MyApis';
import Businesses from '@/components/routes/myApis/businesses/Businesses';
import SharedByMe from '@/components/routes/myApis/sharedByMe/SharedByMe';
import SharedWithMe from '@/components/routes/myApis/sharedWithMe/SharedWithMe';
import MyProxyApis from '@/components/routes/myApis/myProxyApis/MyProxyApis';
import MySubscriptions from '@/components/routes/myApis/mySubscriptions/MySubscriptions';
import MyApisLogs from '@/components/routes/myApis/MyApisLogs';
import EditMyApis from '@/components/routes/myApis/EditMyApis';
import AddMyApis from '@/components/routes/myApis/AddMyApis';
import EditMyApisLicense from '@/components/routes/myApis/EditMyApisLicense';
import EditMyApiLicenses from '@/components/routes/myApis/EditMyApiLicenses';
// Dashboard Routes Components
import Dashboard from '@/components/routes/dashboard/Dashboard';
// Home Routes Components
import Home from '@/components/routes/home/Home';
// Identity Managers Routes Components
import IdentityManagers from '@/components/routes/identityManagers/IdentityManagers';
import IdentityManagersLogs from '@/components/routes/identityManagers/IdentityManagersLogs';
import AddIdentityManager from '@/components/routes/identityManagers/AddIdentityManager';
import EditIdentityManager from '@/components/routes/identityManagers/EditIdentityManager';
import DeleteIdentityManager from '@/components/routes/identityManagers/DeleteIdentityManager';
// Identity Manager Types Routes Components
import IdentityManagerTypes from '@/components/routes/identityManagerTypes/IdentityManagerTypes';
import IdentityManagerTypesLogs from '@/components/routes/identityManagerTypes/IdentityManagerTypesLogs';
import AddIdentityManagerType from '@/components/routes/identityManagerTypes/AddIdentityManagerType';
import EditIdentityManagerType from '@/components/routes/identityManagerTypes/EditIdentityManagerType';
import DeleteIdentityManagerType from '@/components/routes/identityManagerTypes/DeleteIdentityManagerType';
// Administer Users Routes Components
import SubjectUsers from '@/components/routes/administerUsers/subjectUsers/SubjectUsers';
import AdministerUsers from '@/components/routes/administerUsers/AdministerUsers';
import AdministerUsersLogs from '@/components/routes/administerUsers/AdministerUsersLogs';
import AddAdministerUser from '@/components/routes/administerUsers/AddAdministerUser';
import EditAdministerUser from '@/components/routes/administerUsers/EditAdministerUser';
import EditAdministerUserGroups from '@/components/routes/administerUsers/EditAdministerUserGroups';
import EditAdministerUserOrganizations from '@/components/routes/administerUsers/EditAdministerUserOrganizations';
import DeleteAdministerUser from '@/components/routes/administerUsers/DeleteAdministerUser';
import EditAdministerUserRoles from '@/components/routes/administerUsers/EditAdministerUserRoles';
// Administer Groups Routes Components
import AdministerGroups from '@/components/routes/administerGroups/AdministerGroups';
import AdministerGroupsLogs from '@/components/routes/administerGroups/AdministerGroupsLogs';
import AddAdministerGroup from '@/components/routes/administerGroups/AddAdministerGroup';
import EditAdministerGroup from '@/components/routes/administerGroups/EditAdministerGroup';
import DeleteAdministerGroup from '@/components/routes/administerGroups/DeleteAdministerGroup';
import DeleteAdministerGroupUser from '@/components/routes/administerGroups/DeleteAdministerGroupUser';
import EditAdministerGroupUser from '@/components/routes/administerGroups/EditAdministerGroupUser';
import EditAdministerGroupUserOrganizations from '@/components/routes/administerGroups/EditAdministerGroupUserOrganizations';
import EditAdministerGroupUserGroups from '@/components/routes/administerGroups/EditAdministerGroupUserGroups';
import EditAdministerGroupUsers from '@/components/routes/administerGroups/EditAdministerGroupUsers';
// Access Managers Routes Components
import AccessManagers from '@/components/routes/accessManagers/AccessManagers';
import AccessManagersLogs from '@/components/routes/accessManagers/AccessManagersLogs';
import AddAccessManager from '@/components/routes/accessManagers/AddAccessManager';
import EditAccessManager from '@/components/routes/accessManagers/EditAccessManager';
import DeleteAccessManager from '@/components/routes/accessManagers/DeleteAccessManager';
// Roles Routes Components
import Roles from '@/components/routes/accessManagers/roles/Roles';
import RolesLogs from '@/components/routes/accessManagers/roles/RolesLogs';
import AddRole from '@/components/routes/accessManagers/roles/AddRole';
import EditRole from '@/components/routes/accessManagers/roles/EditRole';
import DeleteRole from '@/components/routes/accessManagers/roles/DeleteRole';
import EditAccessManagersRolePermissions from '@/components/routes/accessManagers/roles/EditAccessManagersRolePermissions';
import EditAccessManagersRoleUsers from '@/components/routes/accessManagers/roles/EditAccessManagersRoleUsers';
import EditAccessManagersRoleGroups from '@/components/routes/accessManagers/roles/EditAccessManagersRoleGroups';
// Access Manager Types Routes Components
import AccessManagerTypes from '@/components/routes/accessManagerTypes/AccessManagerTypes';
import AccessManagerTypesLogs from '@/components/routes/accessManagerTypes/AccessManagerTypesLogs';
import AddAccessManagerType from '@/components/routes/accessManagerTypes/AddAccessManagerType';
import EditAccessManagerType from '@/components/routes/accessManagerTypes/EditAccessManagerType';
import DeleteAccessManagerType from '@/components/routes/accessManagerTypes/DeleteAccessManagerType';
// Policy Types Routes Components
import PolicyTypes from '@/components/routes/policyTypes/PolicyTypes';
import PolicyTypesLogs from '@/components/routes/policyTypes/PolicyTypesLogs';
import AddPolicyType from '@/components/routes/policyTypes/AddPolicyType';
import EditPolicyType from '@/components/routes/policyTypes/EditPolicyType';
import DeletePolicyType from '@/components/routes/policyTypes/DeletePolicyType';
// Administer Permissions Routes Components
import AdministerPermissions from '@/components/routes/administerPermissions/AdministerPermissions';
import AdministerPermissionsLogs from '@/components/routes/administerPermissions/AdministerPermissionsLogs';
import AddAdministerPermission from '@/components/routes/administerPermissions/AddAdministerPermission';
import EditAdministerPermission from '@/components/routes/administerPermissions/EditAdministerPermission';
import DeleteAdministerPermission from '@/components/routes/administerPermissions/DeleteAdministerPermission';
// My APPs Routes
import MyApps from '@/components/routes/myApps/MyApps';
import MyAppsLogs from '@/components/routes/myApps/MyAppsLogs';
import EditMyApps from '@/components/routes/myApps/EditMyApps';
import DeleteMyApps from '@/components/routes/myApps/DeleteMyApps';
import AddMyApps from '@/components/routes/myApps/AddMyApps';
import SubjectApps from '@/components/routes/myApps/subjectApps/SubjectApps';
// My Licenses
import MyLicenses from '@/components/routes/myLicenses/MyLicenses';
import SubjectLicenses from '@/components/routes/myLicenses/subjectLicenses/SubjectLicenses';
import MyLicensesLogs from '@/components/routes/myLicenses/MyLicensesLogs';
import EditMyLicense from '@/components/routes/myLicenses/EditMyLicense';
import AddMyLicense from '@/components/routes/myLicenses/AddMyLicense';
import DeleteMyLicense from '@/components/routes/myLicenses/DeleteMyLicense';
import LicensesAttachedToApis from '@/components/routes/myLicenses/licensesAttachedToApis/LicensesAttachedToApis';
import MyLicensesUnderContracts from '@/components/routes/myLicenses/myLicensesUnderContracts/MyLicensesUnderContracts';
import EditMyLicensePolicy from '@/components/routes/myLicenses/EditMyLicensePolicy';
import DeleteMyLicensePolicy from '@/components/routes/myLicenses/DeleteMyLicensePolicy';
import EditMyLicensePolicies from '@/components/routes/myLicenses/EditMyLicensePolicies';
// My Policies
import MyPolicies from '@/components/routes/myPolicies/MyPolicies';
import SubjectPolicies from '@/components/routes/myPolicies/subjectPolicies/SubjectPolicies';
import MyPoliciesLogs from '@/components/routes/myPolicies/MyPoliciesLogs';
import EditMyPolicy from '@/components/routes/myPolicies/EditMyPolicy';
import AddMyPolicy from '@/components/routes/myPolicies/AddMyPolicy';
import DeleteMyPolicy from '@/components/routes/myPolicies/DeleteMyPolicy';

// Explore
import Explore from '@/components/routes/explore/Explore';
import ExploreModal from '@/components/routes/explore/ExploreApis';
// Organizations Routes Components
import Organizations from '@/components/routes/organizations/Organizations';
import OrganizationsLogs from '@/components/routes/organizations/OrganizationsLogs';
import AddOrganization from '@/components/routes/organizations/AddOrganization';
import EditOrganization from '@/components/routes/organizations/EditOrganization';
import DeleteOrganization from '@/components/routes/organizations/DeleteOrganization';
import DeleteOrganizationUser from '@/components/routes/organizations/DeleteOrganizationUser';
import EditOrganizationUser from '@/components/routes/organizations/EditOrganizationUser';
import EditOrganizationUserGroups from '@/components/routes/organizations/EditOrganizationUserGroups';
import EditOrganizationUserOrganizations from '@/components/routes/organizations/EditOrganizationUserOrganizations';
import EditOrganizationUsers from '@/components/routes/organizations/EditOrganizationUsers';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          component: Login,
        },
        {
          path: 'signup',
          component: SignUp,
        },
        {
          path: 'forgot-password',
          component: ForgotPassword,
        },
        {
          path: 'reset-password',
          component: ResetPassword,
        },
      ],
    },
    {
      path: '/app',
      component: DefaultLayout,
      children: [
        {
          path: 'my-profile',
          component: MyProfile,
        },
        {
          path: 'my-settings',
          component: MySettings,
        },
        {
          path: 'dashboard',
          component: Dashboard,
        },
        {
          path: 'explore',
          component: Explore,
          children: [
            {
              path: 'apis/:apiId',
              component: ExploreModal,
            },
          ],
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
                  path: 'edit-api/:apiId',
                  component: EditMyApis,
                },
                {
                  path: 'edit-license/:licenseId',
                  component: EditMyApisLicense,
                },
                {
                  path: 'add-new-api',
                  component: AddMyApis,
                },
              ],
            },
            {
              path: 'shared-by-me/:page',
              component: SharedByMe,
              children: [
                {
                  path: 'logs/:id/:logType/:logPage',
                  component: MyApisLogs,
                },
                {
                  path: 'edit-api/:apiId',
                  component: EditMyApis,
                },
                {
                  path: 'edit-license/:licenseId',
                  component: EditMyApisLicense,
                },
                {
                  path: 'add-new-api',
                  component: AddMyApis,
                },
              ],
            },
            {
              path: 'shared-with-me/:page',
              component: SharedWithMe,
              children: [
                {
                  path: 'logs/:id/:logType/:logPage',
                  component: MyApisLogs,
                },
                {
                  path: 'edit-api/:apiId',
                  component: EditMyApis,
                },
                {
                  path: 'edit-license/:licenseId',
                  component: EditMyApisLicense,
                },
                {
                  path: 'add-new-api',
                  component: AddMyApis,
                },
              ],
            },
            {
              path: 'my-proxy-apis/:page',
              component: MyProxyApis,
              children: [
                {
                  path: 'logs/:id/:logType/:logPage',
                  component: MyApisLogs,
                },
                {
                  path: 'edit-api/:apiId',
                  component: EditMyApis,
                },
                {
                  path: 'edit-license/:licenseId',
                  component: EditMyApisLicense,
                },
                {
                  path: 'edit-api-licenses/:apiId',
                  component: EditMyApiLicenses,
                },
                {
                  path: 'add-new-api',
                  component: AddMyApis,
                },
              ],
            },
            {
              path: 'my-subscriptions/:page',
              component: MySubscriptions,
              children: [
                {
                  path: 'logs/:id/:logType/:logPage',
                  component: MyApisLogs,
                },
                {
                  path: 'edit-api/:apiId',
                  component: EditMyApis,
                },
                {
                  path: 'edit-license/:licenseId',
                  component: EditMyApisLicense,
                },
                {
                  path: 'add-new-api',
                  component: AddMyApis,
                },
              ],
            },
          ],
        },
        {
          path: 'identity-managers/:page',
          component: IdentityManagers,
          children: [
            {
              path: 'logs/:id/:logType/:logPage',
              component: IdentityManagersLogs,
            },
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
              path: 'logs/:id/:logType/:logPage',
              component: IdentityManagerTypesLogs,
            },
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
          path: 'administer-users',
          component: AdministerUsers,
          children: [
            {
              path: 'users/:page',
              component: SubjectUsers,
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
                  path: 'edit-user/:id',
                  component: EditAdministerUser,
                },
                {
                  path: 'edit-user-groups/:id',
                  component: EditAdministerUserGroups,
                },
                {
                  path: 'edit-user-organizations/:id',
                  component: EditAdministerUserOrganizations,
                },
                {
                  path: 'delete-user/:id',
                  component: DeleteAdministerUser,
                },
                {
                  path: 'edit-user-roles/:id',
                  component: EditAdministerUserRoles,
                },
              ],
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
            {
              path: 'delete-user/:id',
              component: DeleteAdministerGroupUser,
            },
            {
              path: 'edit-user-groups/:id',
              component: EditAdministerGroupUserGroups,
            },
            {
              path: 'edit-group-users/:id',
              component: EditAdministerGroupUsers,
            },
            {
              path: 'edit-user-organizations/:id',
              component: EditAdministerGroupUserOrganizations,
            },
          ],
        },
        {
          path: 'access-managers/:page',
          component: AccessManagers,
          children: [
            {
              path: 'logs/:id/:logType/:logPage',
              component: AccessManagersLogs,
            },
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
          path: 'roles/:page',
          component: Roles,
          children: [
            {
              path: 'logs/:id/:logType/:logPage',
              component: RolesLogs,
            },
            {
              path: 'add-new',
              component: AddRole,
            },
            {
              path: 'edit/:id',
              component: EditRole,
            },
            {
              path: 'delete/:id',
              component: DeleteRole,
            },
            {
              path: 'edit-role-permissions/:id',
              component: EditAccessManagersRolePermissions,
            },
            {
              path: 'edit-role-users/:id',
              component: EditAccessManagersRoleUsers,
            },
            {
              path: 'edit-role-groups/:id',
              component: EditAccessManagersRoleGroups,
            },
          ],
        },
        {
          path: 'access-manager-types/:page',
          component: AccessManagerTypes,
          children: [
            {
              path: 'logs/:id/:logType/:logPage',
              component: AccessManagerTypesLogs,
            },
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
          path: 'policy-types/:page',
          component: PolicyTypes,
          children: [
            {
              path: 'logs/:id/:logType/:logPage',
              component: PolicyTypesLogs,
            },
            {
              path: 'add-new',
              component: AddPolicyType,
            },
            {
              path: 'edit/:id',
              component: EditPolicyType,
            },
            {
              path: 'delete/:id',
              component: DeletePolicyType,
            },
          ],
        },
        {
          path: 'administer-permissions/:page',
          component: AdministerPermissions,
          children: [
            {
              path: 'logs/:id/:logType/:logPage',
              component: AdministerPermissionsLogs,
            },
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
                {
                  path: 'delete/:appId',
                  component: DeleteMyApps,
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
                {
                  path: 'edit-policy/:policyId',
                  component: EditMyLicensePolicy,
                },
                {
                  path: 'delete-policy/:policyId',
                  component: DeleteMyLicensePolicy,
                },
                {
                  path: 'edit-license-policies/:licenseId',
                  component: EditMyLicensePolicies,
                },
              ],
            },
            {
              path: 'attached-to-apis/:page',
              component: LicensesAttachedToApis,
            },
            {
              path: 'under-contracts/:page',
              component: MyLicensesUnderContracts,
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
                {
                  path: 'edit-policy/:policyId',
                  component: EditMyPolicy,
                },
                {
                  path: 'add-new',
                  component: AddMyPolicy,
                },
                {
                  path: 'delete-policy/:policyId',
                  component: DeleteMyPolicy,
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
            {
              path: 'delete-user/:id',
              component: DeleteOrganizationUser,
            },
            {
              path: 'edit-user-groups/:id',
              component: EditOrganizationUserGroups,
            },
            {
              path: 'edit-user-organizations/:id',
              component: EditOrganizationUserOrganizations,
            },
            {
              path: 'edit-organization-users/:id',
              component: EditOrganizationUsers,
            },
          ],
        },
      ],
    },
  ],
});
