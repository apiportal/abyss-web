<template>
  <div class="my-apis-container">
    <div class="my-apis-header silver-bg">
      <b-nav tabs>
        <b-nav-item
          :active="currentPage.firstChildPath === 'businesses'"
          to="/app/my-apis/businesses/1"
        >
          My Business APIs <b-badge variant="light">{{ myBusinessApis.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="currentPage.firstChildPath === 'my-proxy-apis'"
          to="/app/my-apis/my-proxy-apis/1"
        >
          My Proxy APIs <b-badge variant="light">{{ proxies.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="currentPage.firstChildPath === 'my-subscriptions'"
          to="/app/my-apis/my-subscriptions/1"
        >
          My Subscriptions <b-badge variant="light">{{ apiSubscriptions.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="currentPage.firstChildPath === 'shared-by-me'"
          to="/app/my-apis/shared-by-me/1"
        >
          APIs Shared By Me <b-badge variant="light">{{ apisSharedByUser.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="currentPage.firstChildPath === 'shared-with-me'"
          to="/app/my-apis/shared-with-me/1"
        >
          APIs Shared With Me <b-badge variant="light">{{ apisSharedWithUser.length }}</b-badge>
        </b-nav-item>
      </b-nav>
    </div>
    <div class="my-apis-content">
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
    }),
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
    this.$store.dispatch('policies/getPolicies', {});
    this.$store.dispatch('policyTypes/getPolicyTypes');
    this.$store.dispatch('licenses/getLicenses', {});
    this.$store.dispatch('resourceActions/getResourceActions', {});
  },
};
</script>

<style lang="scss" scoped>
.my-apis-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .my-apis-header {
    flex: 50px 0 0;
    padding: 1rem 1rem 0 1rem;
  }

  .my-apis-content {
    flex: 1 0 0;
    display: flex;
  }
}
</style>