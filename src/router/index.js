import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout';
import Dashboard from '@/components/routes/dashboard/Dashboard';
import MyApis from '@/components/routes/myApis/MyApis';
import Api from '@/components/routes/myApis/api/Api';

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
      ],
    },
  ],
});
