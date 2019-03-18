<template>
  <div class="page-container page-my-policies">
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item active>
          My Policies <b-badge pill>{{ policies.filter(item => item.subjectid === currentUser.uuid).length }}</b-badge>
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
      policies: state => state.policies.items,
    }),
  },
  mounted() {
    this.$store.commit('currentPage/setRootPath', 'my-policies');
    this.$store.dispatch('policies/getPolicies', {});
    this.$store.dispatch('policyTypes/getPolicyTypes', {});
    this.$store.dispatch('organizations/getOrganizations', {});
  },
};
</script>
