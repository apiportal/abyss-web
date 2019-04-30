<template>
  <div>
    <EditAdministerPermissionModal
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
        areAppsLoaded &&
        areRolesLoaded
      "
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :organizations="organizations"
      :accessManagers="accessManagers"
      :resourceTypes="resourceTypes"
      :resourceActions="resourceActions"
      :resources="resources"
      :users="users"
      :groups="groups"
      :apps="apps"
      :permission="newPermission"
      :resourceTypeId="null"
      :roles="roles"
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
      accessManagers: state => state.accessManagers.items,
      resourceTypes: state => state.resourceTypes.items,
      resources: state => state.resources.items,
      resourceActions: state => state.resourceActions.items,
      users: state => state.users.items,
      groups: state => state.groups.items,
      apps: state => state.apps.items,
      roles: state => state.roles.items,
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
      areRolesLoaded: state => state.roles.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/administer-permissions/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/administer-permissions/${this.page}`);
    },
  },
  data() {
    const now = new Date();
    return {
      newPermission: {
        permission: '',
        description: '',
        organizationid: null,
        accessmanagerid: null,
        resourceid: null,
        resourceactionid: null,
        subjectid: null,
        isactive: true,
        effectiveenddate: now,
        effectivestartdate: now,
      },
      page: this.$route.params.page,
    };
  },
};
</script>
