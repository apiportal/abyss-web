import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout';
import Dashboard from '@/components/routes/dashboard/Dashboard';
import MyApis from '@/components/routes/myApis/MyApis';
import Api from '@/components/routes/myApis/api/Api';
import IdentityManagers from '@/components/routes/identityManagers/IdentityManagers';
import EditIdentityManager from '@/components/routes/identityManagers/EditIdentityManager';

Vue.use(Router);

export default new Router({
  routes: [
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
          path: 'identity-managers',
          component: IdentityManagers,
          children: [
            {
              path: 'edit/:id',
              component: EditIdentityManager,
            },
          ],
        },
      ],
    },
  ],
});
