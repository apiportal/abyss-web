<template>
  <div>
    <EditIdentityManagerModal
      v-if="
        isSubjectDirectoriesLoaded &&
        isSubjectDirectoryTypesLoaded &&
        isOrganizationsLoaded
      "
      :onClose="handleEditIdentityManagerModalClose"
      :onUpdate="handleEditIdentityManagerModalUpdate"
      :subjectDirectory="subjectDirectories.find(item => item.uuid === subjectDirectoryId)"
      :subjectDirectoryTypes="subjectDirectoryTypes"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditIdentityManagerModal from '@/components/shared/modals/EditIdentityManagerModal';

export default {
  components: {
    EditIdentityManagerModal,
  },
  methods: {
    handleEditIdentityManagerModalClose() {
      this.$router.push(`/app/identity-managers/${this.page}`);
    },
    handleEditIdentityManagerModalUpdate() {
      this.$router.push(`/app/identity-managers/${this.page}`);
    },
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
  data() {
    return {
      subjectDirectoryId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
