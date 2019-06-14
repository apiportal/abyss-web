<template>
  <div class="page-container page-my-policies">
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <!-- <b-nav-item :active="false" to="/app/my-licenses/my-licenses/1">
          <span class="link-text" data-qa="linkMyAllLicenses">My All Licenses</span> <b-badge pill>{{ subjectLicenses.length }}</b-badge>
        </b-nav-item> -->
        <b-nav-item :active="true">
          <span class="link-text" data-qa="linkMyPolicies">My Policies</span> <b-badge pill>{{ policies.length }}</b-badge>
        </b-nav-item>
        <b-nav-item :active="false" to="/app/policy-types/1">
          <span class="link-text" data-qa="linkPolicyTypes">Policy Types</span> <b-badge pill>{{ policyTypes.length }}</b-badge>
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
      subjectLicenses: state => state.subjectLicenses.items,
      policies: state => state.subjectPolicies.items,
      policyTypes: state => state.policyTypes.items,
    }),
  },
  mounted() {
    this.$store.commit('currentPage/setRootPath', 'my-policies');
    this.$store.dispatch('subjectPolicies/getSubjectPolicies', { uuid: this.currentUser.uuid });
    this.$store.dispatch('policyTypes/getPolicyTypes', {});
    this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid });
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('businessApis/getBusinessApis', { uuid: this.currentUser.uuid });
  },
};
</script>
