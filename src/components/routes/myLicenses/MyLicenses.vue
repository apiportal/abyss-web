<template>
  <div class="page-container page-my-licenses">
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="currentPage.firstChildPath === 'my-licenses'" to="/app/my-licenses/my-licenses/1">
          <span id="IdLinkMyAllLicenses" class="link-text">My All Licenses</span> <b-badge pill>{{ subjectLicenses.length }}</b-badge>
        </b-nav-item>
        <b-nav-item
          :active="false"
          to="/app/my-policies/my-policies/1"
        >
          <span id="IdLinkMyPolicies" class="link-text">My Policies</span> <b-badge pill>{{ subjectPolicies.length }}</b-badge>
        </b-nav-item>
        <!-- <b-nav-item :active="currentPage.firstChildPath === 'attached-to-apis'" to="/app/my-licenses/attached-to-apis/1">
          <span id="IdLinkMyLicensesAttachedToApis" class="link-text">My Licenses Attached to APIs</span>
        </b-nav-item>
        <b-nav-item :active="currentPage.firstChildPath === 'under-contracts'" to="/app/my-licenses/under-contracts/1">
          <span id="IdLinkMyLicensesUnderContracts" class="link-text">My Licenses Under Contracts</span>
        </b-nav-item> -->
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
      subjectPolicies: state => state.subjectPolicies.items,
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
