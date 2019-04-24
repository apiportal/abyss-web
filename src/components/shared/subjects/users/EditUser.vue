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
  props: {
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  computed: {
    ...mapState({
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
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
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