<template>
  <div>
    <EditAdministerGroupModal
      v-if="
        isGroupsLoaded &&
        isSubjectDirectoriesLoaded &&
        isOrganizationsLoaded &&
        isGroupsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :group="groups.find(item => item.uuid === groupId)"
      :subjectDirectories="subjectDirectories"
      :organizations="organizations"
      :users="users"
      :memberships="memberships"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditAdministerGroupModal from '@/components/shared/modals/EditAdministerGroupModal';

export default {
  components: {
    EditAdministerGroupModal,
  },
  computed: {
    ...mapState({
      groups: state => state.groups.items,
      subjectDirectories: state => state.subjectDirectories.items,
      organizations: state => state.organizations.items,
      users: state => state.users.items,
      memberships: state => state.subjectMemberships.items,
      isGroupsLoaded: state => state.groups.lastUpdatedAt,
      isSubjectDirectoriesLoaded: state => state.subjectDirectories.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
      isUsersLoaded: state => state.users.lastUpdatedAt,
      isMembershipsLoaded: state => state.subjectMemberships.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/administer-groups/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/administer-groups/${this.page}`);
    },
  },
  data() {
    return {
      groupId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>