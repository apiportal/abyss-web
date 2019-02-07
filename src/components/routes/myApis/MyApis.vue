<template>
  <div class="my-apis-container">
    <div class="my-apis-header">
      <b-button variant="primary">
        My Business APIs <b-badge variant="light">{{ myBusinessApis.length }}</b-badge>
      </b-button>
      <b-button>
        My Proxy APIs <b-badge variant="light">{{ myProxyApis.length }}</b-badge>
      </b-button>
      <b-button>
        My Subscriptions <b-badge variant="light">{{ apiSubscriptions.length }}</b-badge>
      </b-button>
      <b-button>
        APIs Shared By Me <b-badge variant="light">{{ apisSharedByUser.length }}</b-badge>
      </b-button>
      <b-button>
        APIs Shared With Me <b-badge variant="light">{{ apisSharedWithUser.length }}</b-badge>
      </b-button>
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
      businessApis: state => state.businessApis.items,
      apiSubscriptions: state => state.apiSubscriptions.items,
      apisSharedWithUser: state => state.apisSharedWithUser.items,
      apisSharedByUser: state => state.apisSharedByUser.items,
    }),
    myBusinessApis() {
      return this.businessApis.filter(item => !item.isproxyapi);
    },
    myProxyApis() {
      return this.businessApis.filter(item => item.isproxyapi);
    },
  },
  created() {
    this.$store.dispatch('businessApis/getBusinessApis', this.currentUser.uuid);
    this.$store.dispatch('apiSubscriptions/getApiSubscriptions', this.currentUser.uuid);
    this.$store.dispatch('apisSharedWithUser/getApisSharedWithUser', this.currentUser.uuid);
    this.$store.dispatch('apisSharedByUser/getApisSharedByUser', this.currentUser.uuid);
    this.$store.dispatch('apiStates/getApiStates');
    this.$store.dispatch('apiVisibilityTypes/getApiVisibilityTypes');
    this.$store.dispatch('proxies/getProxies', this.currentUser.uuid);
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
    overflow-y: auto;
    display: flex;
  }
}
</style>