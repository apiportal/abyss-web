<template>
  <div class="page-container page-my-apps">
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item active>
          <span class="link-text" data-qa="linkMyApps">My APPs</span> <b-badge pill>{{ userApps.length }}</b-badge>
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
      userApps: state => state.userApps.items,
    }),
  },
  created() {
    this.$store.commit('currentPage/setRootPath', 'my-apps');
    this.$store.dispatch('userApps/getApps', { uuid: this.currentUser.uuid });
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('contractStates/getContractStates', {});
    this.$store.dispatch('apiStates/getApiStates', {});
    this.$store.dispatch('apiVisibilityTypes/getApiVisibilityTypes', {});
    this.$store.dispatch('subjectDirectories/getSubjectDirectories', {});
    this.$store.dispatch('subjectDirectoryTypes/getSubjectDirectoryTypes', {});
  },
  data() {
    return {
    };
  },
};
</script>
