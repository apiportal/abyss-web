<template>
  <div>
    <EditAdministerPermissionModal
      v-if="
        isSubjectDirectoriesLoaded &&
        isOrganizationsLoaded
      "
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :user="newUser"
      :subjectDirectories="subjectDirectories"
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
      subjectDirectories: state => state.subjectDirectories.items,
      organizations: state => state.organizations.items,
      isSubjectDirectoriesLoaded: state => state.subjectDirectories.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
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
  // Bu kısıma tekrar bakılacak
  data() {
    return {
      userId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
