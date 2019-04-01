<template>
  <div class="page-container page-my-policies">
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item :active="false" to="/app/my-licenses/my-licenses/1">
          <span id="IdLinkMyAllLicenses" class="link-text">My All Licenses</span> <b-badge pill>{{ subjectLicenses.length }}</b-badge>
        </b-nav-item>
        <b-nav-item active>
          <span id="IdLinkMyPolicies" class="link-text">My Policies</span> <b-badge pill>{{ policies.length }}</b-badge>
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
    }),
  },
  mounted() {
    this.$store.commit('currentPage/setRootPath', 'my-policies');
    this.$store.dispatch('subjectPolicies/getSubjectPolicies', { uuid: this.currentUser.uuid });
    this.$store.dispatch('policyTypes/getPolicyTypes', {});
    this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid });
    this.$store.dispatch('organizations/getOrganizations', {});
  },
};
</script>
