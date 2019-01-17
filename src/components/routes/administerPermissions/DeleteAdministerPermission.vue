<template>
  <div>
    <ConfirmModal
      v-if="isAdministerPermissionsLoaded"
      title="Are you sure?"
      :text="`${administerPermission.administerpermissionname} will be deleted. You can't revert your action.`"
      :onClose="handleDeleteAdministerPermissionModalClose"
      :onConfirm="handleDeleteAdministerPermissionModalConfirm"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import ConfirmModal from '@/components/shared/modals/ConfirmModal';

export default {
  components: {
    ConfirmModal,
  },
  methods: {
    handleDeleteAdministerPermissionModalClose() {
      this.$router.push(`/app/administer-permissions/${this.page}`);
    },
    handleDeleteAdministerPermissionModalConfirm() {
      this.$router.push(`/app/administer-permissions/${this.page}`);
    },
  },
  computed: {
    ...mapState({
      administerPermissions: state => state.administerPermissions.items,
      isAdministerPermissionsLoaded: state => state.administerPermissions.lastUpdatedAt,
    }),
    administerPermission() {
      const { administerPermissionId, administerPermissions } = this;
      return administerPermissions.find(item => item.uuid === administerPermissionId);
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
