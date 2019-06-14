<template>
  <div>
    <EditAdministerUserModal
      v-if="
        isUsersLoaded &&
        isSubjectDirectoriesLoaded &&
        isOrganizationsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :user="users.find(item => item.uuid === userId)"
      :subjectDirectories="subjectDirectories"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditAdministerUserModal from '@/components/shared/modals/EditAdministerUserModal';

export default {
  components: {
    EditAdministerUserModal,
  },
  computed: {
    ...mapState({
      navigationFrom: state => state.traffic.navigationFrom,
      users: state => state.users.items,
      subjectDirectories: state => state.subjectDirectories.items,
      organizations: state => state.organizations.items,
      isUsersLoaded: state => state.users.lastUpdatedAt,
      isSubjectDirectoriesLoaded: state => state.subjectDirectories.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.navigationFrom);
    },
    handleModalUpdate() {
      this.$router.push(this.navigationFrom);
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