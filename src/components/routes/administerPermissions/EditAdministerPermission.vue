<template>
  <div>
    <EditAccessManagerModal
      v-if="
        isSubjectDirectoriesLoaded &&
        isSubjectDirectoryTypesLoaded &&
        isOrganizationsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :subjectDirectory="subjectDirectories.find(item => item.uuid === subjectDirectoryId)"
      :subjectDirectoryTypes="subjectDirectoryTypes"
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
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
      isSubjectDirectoriesLoaded: state => state.subjectDirectories.lastUpdatedAt,
      isSubjectDirectoryTypesLoaded: state => state.subjectDirectoryTypes.lastUpdatedAt,
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
  data() {
    return {
      userId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
