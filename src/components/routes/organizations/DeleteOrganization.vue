<template>
  <div>
    <ConfirmModal
      v-if="isOrganizationsLoaded"
      title="Are you sure?"
      :text="`${organization.name} will be deleted. You can't revert your action.`"
      :onClose="handleModalClose"
      :onConfirm="handleModalConfirm"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ConfirmModal from '@/components/shared/modals/ConfirmModal';

export default {
  components: {
    ConfirmModal,
  },
  methods: {
    ...mapActions('organizations', ['deleteOrganizations']),
    handleModalClose() {
      this.$router.push(`/app/organizations/${this.page}`);
    },
    handleModalConfirm() {
      const { deleteOrganizations, organization } = this;
      deleteOrganizations({ ...organization }).then(() => {
        this.$router.push(`/app/organizations/${this.page}`);
      });
    },
  },
  computed: {
    ...mapState({
      organizations: state => state.organizations.items,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
    organization() {
      const { organizationId, organizations } = this;
      return organizations.find(item => item.uuid === organizationId);
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
