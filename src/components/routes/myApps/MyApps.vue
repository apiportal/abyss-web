<template>
  <div class="page-container page-my-apps">
    <div class="page-header-nested">
      <b-nav class="page-tabs" tabs>
        <b-nav-item active>
          <span class="link-text" data-qa="linkMyApps">My APPs</span> <b-badge pill>{{ subjectApps.length }}</b-badge>
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
      apps: state => state.apps.items,
      subjectApps: state => state.subjectApps.items,
      subjectResources: state => state.subjectResources.items,
      subjectPermissions: state => state.subjectPermissions.items,
    }),
  },
  created() {
    this.$store.commit('currentPage/setRootPath', 'my-apps');
    this.$store.dispatch('apps/getApps', {});
    this.$store.dispatch('subjectApps/getSubjectApps', { uuid: this.currentUser.uuid });
    this.$store.dispatch('subjectResources/getSubjectResources', { uuid: this.currentUser.uuid });
    this.$store.dispatch('subjectPermissions/getSubjectPermissions', { uuid: this.currentUser.uuid });
    this.$store.dispatch('organizations/getOrganizations', {});
    this.$store.dispatch('contractStates/getContractStates', {});
    this.$store.dispatch('apiStates/getApiStates', {});
    this.$store.dispatch('apiVisibilityTypes/getApiVisibilityTypes', {});
    this.$store.dispatch('subjectDirectories/getSubjectDirectories', {});
    this.$store.dispatch('subjectDirectoryTypes/getSubjectDirectoryTypes', {});
  },
  // watch: {
  //   apps(newVal, oldVal) {
  //     if (newVal.length !== oldVal.length) {
  //       const appIdsArray = newVal.map(item => item.uuid);
  //       this.$store.dispatch('apps/getAppContracts', { appIdsArray });
  //     }
  //   },
  // },
  data() {
    return {
    };
  },
};
</script>
