<template>
  <div>
    <EditOrganizationModal
      v-if="
        isOrganizationsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :organization="organizations.find(item => item.uuid === organizationId)"
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
  computed: {
    ...mapState({
      organizations: state => state.organizations.items,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/organizations/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/organizations/${this.page}`);
    },
  },
  data() {
    return {
      organizationId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
