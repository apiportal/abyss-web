<template>
  <div>
    <EditOrganizationModal
      v-if="isOrganizationsLoaded"
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :organization="organization"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditOrganizationModal from '@/components/shared/modals/EditOrganizationModal';

export default {
  components: {
    EditOrganizationModal,
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/organizations/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/organizations/${this.page}`);
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
      organization: {
        name: '',
        description: '',
        organizationid: null,
        url: null,
      },
      page: this.$route.params.page,
    };
  },
};
</script>
