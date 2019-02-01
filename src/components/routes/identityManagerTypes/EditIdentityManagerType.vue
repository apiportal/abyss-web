<template>
  <div>
    <EditIdentityManagerTypeModal
      v-if="
        isSubjectDirectoryTypesLoaded &&
        isOrganizationsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :subjectDirectoryType="subjectDirectoryTypes.find(item => item.uuid === subjectDirectoryTypeId)"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditIdentityManagerTypeModal from '@/components/shared/modals/EditIdentityManagerTypeModal';

export default {
  components: {
    EditIdentityManagerTypeModal,
  },
  computed: {
    ...mapState({
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
      isSubjectDirectoryTypesLoaded: state => state.subjectDirectoryTypes.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/identity-manager-types/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/identity-manager-types/${this.page}`);
    },
  },
  data() {
    return {
      subjectDirectoryTypeId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
