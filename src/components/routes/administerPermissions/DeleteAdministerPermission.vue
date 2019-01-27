<template>
  <div>
    <ConfirmModal
      v-if="arePermissionsLoaded"
      title="Are you sure?"
      :text="`${permission.permission} will be deleted. You can't revert your action.`"
      :onClose="handleDeleteAdministerPermissionModalClose"
      :onConfirm="handleDeleteAdministerPermissionModalConfirm"
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
    ...mapActions('permissions', ['deletePermissions']),
    handleDeleteAdministerPermissionModalClose() {
      this.$router.push(`/app/administer-permissions/${this.page}`);
    },
    handleDeleteAdministerPermissionModalConfirm() {
      const { deletePermissions, permission } = this;
      deletePermissions({ ...permission }).then(() => {
        this.$router.push(`/app/administer-permissions/${this.page}`);
      });
    },
  },
  computed: {
    ...mapState({
      permissions: state => state.permissions.items,
      arePermissionsLoaded: state => state.permissions.lastUpdatedAt,
    }),
    permission() {
      const { permissionId, permissions } = this;
      return permissions.find(item => item.uuid === permissionId);
    },
  },
  data() {
    return {
      permissionId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
