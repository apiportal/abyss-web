<template>
  <div>
    <EditIdentityManagerModal
      v-if="
        isSubjectDirectoryTypesLoaded &&
        isOrganizationsLoaded
      "
      role="add"
      :onClose="handleEditIdentityManagerModalClose"
      :onUpdate="handleEditIdentityManagerModalUpdate"
      :subjectDirectory="subjectDirectory"
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
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
      isSubjectDirectoryTypesLoaded: state => state.subjectDirectoryTypes.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  data() {
    return {
      subjectDirectory: {
        directoryname: '',
        description: '',
        directorypriorityorder: 1,
        isactive: true,
        istemplate: false,
        organizationid: null,
        directorytypeid: null,
      },
      page: this.$route.params.page,
    };
  },
};
</script>
