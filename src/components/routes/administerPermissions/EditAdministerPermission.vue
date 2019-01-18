<template>
  <div>
    <EditAccessManagerModal
      v-if="
        areAccessManagersLoaded &&
        areOrganizationsLoaded && 
        arePermissionsLoaded &&
        areResourcesLoaded &&
        areResourceTypesLoaded &&
        areResourceActionsLoaded &&
        areSubjectTypesLoaded &&
        areUsersLoaded &&
        areGroupsLoaded &&
        areAppsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditAdministerPermissionModal from '@/components/shared/modals/EditAdministerPermissionModal';

export default {
  components: {
    EditAdministerPermissionModal,
  },
  computed: {
    ...mapState({
      organizations: state => state.organizations.items,
      areAccessManagersLoaded: state => state.accessManagers.lastUpdatedAt,
      areOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
      arePermissionsLoaded: state => state.permissions.lastUpdatedAt,
      areResourcesLoaded: state => state.resources.lastUpdatedAt,
      areResourceTypesLoaded: state => state.resourceTypes.lastUpdatedAt,
      areResourceActionsLoaded: state => state.resourceActions.lastUpdatedAt,
      areSubjectTypesLoaded: state => state.subjectTypes.lastUpdatedAt,
      areUsersLoaded: state => state.users.lastUpdatedAt,
      areGroupsLoaded: state => state.groups.lastUpdatedAt,
      areAppsLoaded: state => state.apps.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/administer-permission/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/administer-permission/${this.page}`);
    },
  },
  data() {
    return {
      userId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
