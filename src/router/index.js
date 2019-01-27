import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout';
// My-APIs Routes Components
import MyApis from '@/components/routes/myApis/MyApis';
import Api from '@/components/routes/myApis/api/Api';
// Dashboard Routes Components
import Dashboard from '@/components/routes/dashboard/Dashboard';
// Home Routes Components
import Home from '@/components/routes/home/Home';
// Identity Managers Routes Components
import IdentityManagers from '@/components/routes/identityManagers/IdentityManagers';
import AddIdentityManager from '@/components/routes/identityManagers/AddIdentityManager';
import EditIdentityManager from '@/components/routes/identityManagers/EditIdentityManager';
import DeleteIdentityManager from '@/components/routes/identityManagers/DeleteIdentityManager';
// Administer Users Routes Components
import AdministerUsers from '@/components/routes/administerUsers/AdministerUsers';
import AdministerUsersLogs from '@/components/routes/administerUsers/AdministerUsersLogs';
import AddAdministerUser from '@/components/routes/administerUsers/AddAdministerUser';
import EditAdministerUser from '@/components/routes/administerUsers/EditAdministerUser';
import EditAdministerUserGroups from '@/components/routes/administerUsers/EditAdministerUserGroups';
import DeleteAdministerUser from '@/components/routes/administerUsers/DeleteAdministerUser';
// Access Managers Routes Components
import AccessManagers from '@/components/routes/accessManagers/AccessManagers';
import AddAccessManager from '@/components/routes/accessManagers/AddAccessManager';
import EditAccessManager from '@/components/routes/accessManagers/EditAccessManager';
import DeleteAccessManager from '@/components/routes/accessManagers/DeleteAccessManager';
// Administer Permissions Routes Components
import AdministerPermissions from '@/components/routes/administerPermissions/AdministerPermissions';
import AddAdministerPermission from '@/components/routes/administerPermissions/AddAdministerPermission';
import EditAdministerPermission from '@/components/routes/administerPermissions/EditAdministerPermission';
import DeleteAdministerPermission from '@/components/routes/administerPermissions/DeleteAdministerPermission';

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
          path: 'my-apis',
          component: MyApis,
          children: [
            {
              path: 'api/:id',
              component: Api,
            },
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
      ],
    },
  ],
});
