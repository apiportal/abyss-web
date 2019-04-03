<template>
  <div class="page-container page-my-licenses">
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="currentPage.firstChildPath === 'my-licenses'" to="/app/my-licenses/my-licenses/1">
          <span class="link-text" data-qa="linkMyAllLicenses">My All Licenses</span> <b-badge pill>{{ subjectLicenses.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="currentPage.firstChildPath === 'attached-to-apis'" to="/app/my-licenses/attached-to-apis/1">
          <span class="link-text" data-qa="linkMyLicensesAttachedToApis">My Licenses Attached to APIs</span>
          <!-- <b-badge pill>0</b-badge> -->
        </b-nav-item>
        <b-nav-item :active="currentPage.firstChildPath === 'under-contracts'" to="/app/my-licenses/under-contracts/1">
          <span class="link-text" data-qa="linkMyLicensesUnderContracts">My Licenses Under Contracts</span>
          <!-- <b-badge pill>0</b-badge> -->
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
      subjectLicenses: state => state.subjectLicenses.items,
    }),
  },
  mounted() {
    this.$store.commit('currentPage/setRootPath', 'my-licenses');
    this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid });
    this.$store.dispatch('subjectPolicies/getSubjectPolicies', { uuid: this.currentUser.uuid });
    this.$store.dispatch('policyTypes/getPolicyTypes', {});
    this.$store.dispatch('apiVisibilityTypes/getApiVisibilityTypes', {});
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('apiStates/getApiStates', {});
    this.$store.dispatch('contractStates/getContractStates', {});
  },
};
</script>
