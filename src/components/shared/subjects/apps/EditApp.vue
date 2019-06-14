<template>
  <div>
    <EditAppModal
      v-if="
        app &&
        isAppsLoaded &&
        isOrganizationsLoaded &&
        isSubjectDirectoriesLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :app="app"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import api from '@/api';
import EditAppModal from '@/components/shared/modals/EditAppModal';

export default {
  components: {
    EditAppModal,
  },
  props: {
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  computed: {
    ...mapState({
      userApps: state => state.userApps.items,
      organizations: state => state.organizations.items,
      subjectDirectories: state => state.subjectDirectories.items,
      isAppsLoaded: state => (state.userApps.lastUpdatedAt > 0),
      isOrganizationsLoaded: state => (state.organizations.lastUpdatedAt > 0),
      isSubjectDirectoriesLoaded: state => (state.subjectDirectories.lastUpdatedAt > 0),
    }),
  },
  data() {
    return {
      appId: this.$route.params.appId,
      app: null,
    };
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
    getApp() {
      // return this.userApps.find(item => item.uuid === appId);
      api.getSubject(this.appId).then((response) => {
        this.app = response.data[0];
        if (!this.app) {
          this.$router.push(this.routePath);
        }
      })
      .catch((error) => {
        console.log('error.status: ', error.status); // eslint-disable-line
        this.$router.push(this.routePath);
      });
    },
  },
  created() {
    this.getApp();
  },
};
</script>