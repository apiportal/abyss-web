<template>
  <div class="page-container page-my-licenses">
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="currentPage.firstChildPath === 'my-licenses'" to="/app/my-licenses/my-licenses/1">
          <span class="link-text" data-qa="linkMyAllLicenses">My All Licenses</span> <b-badge pill>{{ subjectLicenses.length }}</b-badge>
        </b-nav-item>
        <!-- <b-nav-item
          :active="false"
          to="/app/my-policies/my-policies/1"
        >
          <span data-qa="linkMyPolicies" class="link-text">My Policies</span> <b-badge pill>{{ subjectPolicies.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="false" to="/app/policy-types/1">
          <span class="link-text" data-qa="linkPolicyTypes">Policy Types</span> <b-badge pill>{{ policyTypes.length }}</b-badge>
        </b-nav-item> -->
        <!-- <b-nav-item :active="currentPage.firstChildPath === 'attached-to-apis'" to="/app/my-licenses/attached-to-apis/1">
          <span class="link-text" data-qa="linkMyLicensesAttachedToApis">My Licenses Attached to APIs</span>
        </b-nav-item>
        <b-nav-item :active="currentPage.firstChildPath === 'under-contracts'" to="/app/my-licenses/under-contracts/1">
          <span class="link-text" data-qa="linkMyLicensesUnderContracts">My Licenses Under Contracts</span>
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
      policyTypes: state => state.policyTypes.items,
    }),
  },
  mounted() {
    this.$store.commit('currentPage/setRootPath', 'my-licenses');
    this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid });
    this.$store.dispatch('subjectPolicies/getSubjectPolicies', { uuid: this.currentUser.uuid });
    this.$store.dispatch('policyTypes/getPolicyTypes', {});
  },
};
</script>
