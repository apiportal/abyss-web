<template>
  <div class="my-licenses-container">
    <div class="my-licenses-header silver-bg">
      <b-nav tabs>
        <b-nav-item :active="currentPage.firstChildPath === 'my-licenses'" to="/app/my-licenses/my-licenses/1">
          My All Licenses <b-badge variant="light">{{ licenses.filter(item => item.subjectid === currentUser.uuid).length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="currentPage.firstChildPath === 'attached-to-apis'" to="/app/my-licenses/attached-to-apis/1">
          My Licenses Attached to APIs <b-badge variant="light">0</b-badge>
        </b-nav-item>
        <b-nav-item :active="currentPage.firstChildPath === 'under-contracts'" to="/app/my-licenses/under-contracts/1">
          My Licenses Under Contracts <b-badge variant="light">0</b-badge>
        </b-nav-item>
      </b-nav>
    </div>
    <div class="my-licenses-content">
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
      licenses: state => state.licenses.items,
    }),
  },
  mounted() {
    this.$store.commit('currentPage/setRootPath', 'my-licenses');
    this.$store.dispatch('licenses/getLicenses', {});
    this.$store.dispatch('policies/getPolicies', {});
    this.$store.dispatch('policyTypes/getPolicyTypes', {});
    this.$store.dispatch('apiVisibilityTypes/getApiVisibilityTypes', {});
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('apiStates/getApiStates', {});
    this.$store.dispatch('contractStates/getContractStates', {});
  },
};
</script>

<style lang="scss" scoped>
.my-licenses-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .my-licenses-header {
    flex: 50px 0 0;
    padding: 1rem 1rem 0 1rem;
  }

  .my-licenses-content {
    flex: 1 0 0;
    display: flex;
  }
}
</style>