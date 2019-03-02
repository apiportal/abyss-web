<template>
  <div>
    <EditAppModal
      v-if="
        isAppsLoaded &&
        isOrganizationsLoaded &&
        isSubjectDirectoriesLoaded &&
        isSubjectDirectoryTypesLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :app="getApp(appId)"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
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
      apps: state => state.apps.items,
      organizations: state => state.organizations.items,
      subjectDirectories: state => state.subjectDirectories.items,
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      isAppsLoaded: state => (state.apps.lastUpdatedAt > 0),
      isOrganizationsLoaded: state => (state.organizations.lastUpdatedAt > 0),
      isSubjectDirectoriesLoaded: state => (state.subjectDirectories.lastUpdatedAt > 0),
      isSubjectDirectoryTypesLoaded: state => (state.subjectDirectoryTypes.lastUpdatedAt > 0),
    }),
  },
  data() {
    return {
      appId: this.$route.params.appId,
    };
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
    getApp(appId) {
      return this.apps.find(item => item.uuid === appId);
    },
  },
};
</script>