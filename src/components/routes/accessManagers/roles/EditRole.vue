<template>
  <div>
    <EditRoleModal
      v-if="
        isAccessManagersLoaded &&
        isAccessManagerTypesLoaded &&
        isSubjectDirectoriesLoaded &&
        isOrganizationsLoaded
      "
      role="edit"
      iconTitle="edit"
      :onClose="handleEditAccessManagerModalClose"
      :onUpdate="handleEditAccessManagerModalUpdate"
      :accessManagerTypes="accessManagerTypes"
      :organizations="organizations"
      :subjectDirectories="subjectDirectories"
      :accessRole="roles.find(item => item.uuid === roleId)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditRoleModal from '@/components/shared/modals/EditRoleModal';

export default {
  components: {
    EditRoleModal,
  },
  methods: {
    handleEditAccessManagerModalClose() {
      this.$router.push(`/app/roles/${this.page}`);
    },
    handleEditAccessManagerModalUpdate() {
      this.$router.push(`/app/roles/${this.page}`);
    },
  },
  computed: {
    ...mapState({
      accessManagers: state => state.accessManagers.items,
      accessManagerTypes: state => state.accessManagerTypes.items,
      subjectDirectories: state => state.subjectDirectories.items,
      organizations: state => state.organizations.items,
      isAccessManagersLoaded: state => state.accessManagers.lastUpdatedAt,
      isAccessManagerTypesLoaded: state => state.accessManagerTypes.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
      isSubjectDirectoriesLoaded: state => state.subjectDirectories.lastUpdatedAt,
      roles: state => state.roles.items,
    }),
  },
  data() {
    return {
      roleId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
