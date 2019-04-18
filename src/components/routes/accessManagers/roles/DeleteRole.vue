<template>
  <div>
    <ConfirmModal
      v-if="isRolesLoaded"
      title="Are you sure?"
      :text="`${role.displayname} will be deleted. You can't revert your action.`"
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
    ...mapActions('roles', ['deleteRoles']),
    handleModalClose() {
      this.$router.push(`/app/administer-groups/${this.page}`);
    },
    handleModalConfirm() {
      const { deleteRoles, role } = this;
      deleteRoles({ ...role }).then(() => {
        this.$router.push(`/app/roles/${this.page}`);
      });
    },
  },
  computed: {
    ...mapState({
      roles: state => state.roles.items,
      isRolesLoaded: state => state.roles.lastUpdatedAt,
    }),
    role() {
      const { roleId, roles } = this;
      return roles.find(item => item.uuid === roleId);
    },
  },
  data() {
    return {
      roleId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
