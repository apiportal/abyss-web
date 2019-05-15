<template>
  <div>
    <EditIdentityManagerTypeModal
      v-if="isOrganizationsLoaded"
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :subjectDirectoryType="subjectDirectoryType"
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
  methods: {
    handleModalClose() {
      this.$router.push(`/app/identity-manager-types/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/identity-manager-types/${this.page}`);
    },
  },
  computed: {
    ...mapState({
      organizations: state => state.organizations.items,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  data() {
    return {
      subjectDirectoryType: {
        typename: '',
        description: '',
        organizationid: null,
        attributetemplate: {},
      },
      page: this.$route.params.page,
    };
  },
};
</script>
