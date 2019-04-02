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
      <!-- {{userApps}} -->
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
    userApps() {
      const subjectAppsIds = this.subjectApps.map(item => item.appid);
      // return this.apps.filter(item => (subjectAppsIds.indexOf(item.uuid) > -1));
      const getSubjectApp = (appId) => {
        const subjectapp = this.subjectApps.find(item => item.appid === appId);
        return subjectapp;
      };
      const getSubjectPermissions = (resource) => {
        const subjectpermissions = this.subjectPermissions.find(
          item => item.resourceid === resource.uuid);
        return subjectpermissions;
      };
      const getSubjectResource = (app) => {
        const subjectresource = this.subjectResources.find(item => item.resourcerefid === app.uuid);
        if (subjectresource) {
          subjectresource.permission = getSubjectPermissions(subjectresource);
        }
        return subjectresource;
      };
      return this.apps
        .filter(item => (
          subjectAppsIds.indexOf(item.uuid) > -1),
        )
        .map(item => ({
          ...item,
          subjectapp: getSubjectApp(item.uuid),
          resource: getSubjectResource(item),
          // permission: getSubjectPermissions(item),
        }),
      );
    },
  },
  /* methods: {
    getSubjectApp(appId) => {
      const subjectapp = this.subjectApps.find(item => item.appid === appId);
      return subjectapp;
    },
    getSubjectPermissions(resource) => {
      const subjectpermissions = this.subjectPermissions.find(
        item => item.resourceid === resource.uuid);
      return subjectpermissions;
    },
    getSubjectResource(app) => {
      const subjectresource = this.subjectResources.find(item => item.resourcerefid === app.uuid);
      if (subjectresource) {
        // console.log('app.uuid, subjectresource: ', app.uuid, subjectresource);
        subjectresource.permission = getSubjectPermissions(subjectresource);
      }
      return subjectresource;
    },
  }, */
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
  watch: {
    userApps(newVal, oldVal) {
      if (newVal.length !== oldVal.length) {
        const appIdsArray = newVal.map(item => item.uuid);
        this.$store.dispatch('apps/getAppContracts', { appIdsArray });
      }
    },
  },
  data() {
    return {
    };
  },
};
</script>
