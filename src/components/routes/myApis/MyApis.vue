<template>
  <div class="page-container page-my-apis">
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item
          :active="currentPage.firstChildPath === 'my-proxy-apis'"
          to="/app/my-apis/my-proxy-apis/1"
        >
          <span class="link-text" data-qa="linkMyProxyApis">My Proxy APIs</span> <b-badge pill>{{ proxies.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="currentPage.firstChildPath === 'businesses'"
          to="/app/my-apis/businesses/1"
        >
          <span class="link-text" data-qa="linkMyBusinessApis">My Business APIs</span> <b-badge pill>{{ myBusinessApis.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="currentPage.firstChildPath === 'my-subscriptions'"
          to="/app/my-apis/my-subscriptions/1"
        >
          <span class="link-text" data-qa="linkMySubscriptions">My Contracted APIs</span> <b-badge pill>{{ myApiSubscriptions.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="currentPage.firstChildPath === 'shared-by-me'"
          to="/app/my-apis/shared-by-me/1"
        >
          <span class="link-text" data-qa="linkApisSharedByMe">APIs Shared By Me</span> <b-badge pill>{{ apisSharedByUser.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="currentPage.firstChildPath === 'shared-with-me'"
          to="/app/my-apis/shared-with-me/1"
        >
          <span class="link-text" data-qa="linkApisSharedWithMe">APIs Shared With Me</span> <b-badge pill>{{ apisSharedWithUser.length }}</b-badge>
        </b-nav-item>
      </b-nav>
    </div>
    <div class="page-content-nested">
      <router-view></router-view>
    </div>
  </div> 
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      currentUser: state => state.user,
      currentPage: state => state.currentPage,
      businessApis: state => state.businessApis.items,
      apiSubscriptions: state => state.apiSubscriptions.items,
      apisSharedWithUser: state => state.apisSharedWithUser.items,
      apisSharedByUser: state => state.apisSharedByUser.items,
      proxies: state => state.proxies.items,
      users: state => state.users.items,
    }),
    myApiSubscriptions() {
      return this.apiSubscriptions.filter(item => item.resourceactionid === 'c5639f00-94c9-4cc9-8ad9-df76f9d162a8' && !item.isdeleted);
    },
    myBusinessApis() {
      return this.businessApis.filter(item => !item.isproxyapi);
    },
    myProxyApis() {
      return this.businessApis.filter(item => item.isproxyapi);
    },
  },
  mounted() {
    this.$store.commit('currentPage/setRootPath', 'my-apis');
    this.$store.dispatch('businessApis/getBusinessApis', { uuid: this.currentUser.uuid });
    this.$store.dispatch('apiSubscriptions/getApiSubscriptions', { uuid: this.currentUser.uuid });
    this.$store.dispatch('apisSharedWithUser/getApisSharedWithUser', { uuid: this.currentUser.uuid });
    this.$store.dispatch('apisSharedByUser/getApisSharedByUser', { uuid: this.currentUser.uuid });
    this.$store.dispatch('apiStates/getApiStates', {});
    this.$store.dispatch('apiVisibilityTypes/getApiVisibilityTypes', {});
    this.$store.dispatch('proxies/getProxies', { uuid: this.currentUser.uuid });
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('subjectPolicies/getSubjectPolicies', { uuid: this.currentUser.uuid });
    this.$store.dispatch('policyTypes/getPolicyTypes', {});
    this.$store.dispatch('resourceActions/getResourceActions', {});
    this.$store.dispatch('users/getUsers', {});
  },
};
</script>
