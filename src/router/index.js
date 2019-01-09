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
// Administer Groups Routes Components
import AdministerGroups from '@/components/routes/administerGroups/AdministerGroups';
import AdministerGroupsLogs from '@/components/routes/administerGroups/AdministerGroupsLogs';
import AddAdministerGroup from '@/components/routes/administerGroups/AddAdministerGroup';
import EditAdministerGroup from '@/components/routes/administerGroups/EditAdministerGroup';
import DeleteAdministerGroup from '@/components/routes/administerGroups/DeleteAdministerGroup';
// Access Managers Routes Components
import AccessManagers from '@/components/routes/accessManagers/AccessManagers';
import AddAccessManager from '@/components/routes/accessManagers/AddAccessManager';
import EditAccessManager from '@/components/routes/accessManagers/EditAccessManager';
import DeleteAccessManager from '@/components/routes/accessManagers/DeleteAccessManager';

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
      ],
    },
  ],
});
