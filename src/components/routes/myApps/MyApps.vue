<template>
  <div class="my-apps-container">
    <div class="my-apps-header">
      <b-button variant="primary">
        My APPs <b-badge variant="light">{{ userApps.length }}</b-badge>
      </b-button>
    </div>
    <div class="my-apps-content">
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
    }),
    userApps() {
      const subjectAppsIds = this.subjectApps.map(item => item.appid);
      return this.apps.filter(item => (subjectAppsIds.indexOf(item.uuid) > -1));
    },
  },
  created() {
    this.$store.dispatch('apps/getApps');
    this.$store.dispatch('subjectApps/getSubjectApps', { uuid: this.currentUser.uuid, withContracts: true });
    this.$store.dispatch('organizations/getOrganizations');
  },
  watch: {
    userApps(newVal, oldVal) {
      if (newVal.length !== oldVal.length) {
        const appIdsArray = newVal.map(item => item.uuid);
        this.$store.dispatch('apps/getAppContracts', appIdsArray);
      }
    },
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
.my-apps-container {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;

  .my-apps-header {
    flex: 50px 0 0;
    padding: 1rem 1rem 0 1rem;
  }

  .my-apps-content {
    flex: 1 0 0;
    display: flex;
  }
}
</style>