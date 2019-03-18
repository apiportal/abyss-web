<template>
  <div>
    <ConfirmModal
      v-if="isAccessManagersLoaded"
      title="Are you sure?"
      :text="`${accessManager.accessmanagername} will be deleted. You can't revert your action.`"
      :onClose="handleDeleteAccessManagerModalClose"
      :onConfirm="handleDeleteAccessManagerModalConfirm"
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
    ...mapActions('accessManagers', ['deleteAccessManagers']),
    handleDeleteAccessManagerModalClose() {
      this.$router.push(`/app/access-managers/${this.page}`);
    },
    handleDeleteAccessManagerModalConfirm() {
      this.$router.push(`/app/access-managers/${this.page}`);
    },
    handleModalConfirm() {
      const { deleteAccessManagers, accessManager } = this;
      deleteAccessManagers({ ...accessManager }).then(() => {
        this.$router.push(`/app/access-managers/${this.page}`);
      });
    },
  },
  computed: {
    ...mapState({
      accessManagers: state => state.accessManagers.items,
      isAccessManagersLoaded: state => state.accessManagers.lastUpdatedAt,
    }),
    accessManager() {
      const { accessManagerId, accessManagers } = this;
      return accessManagers.find(item => item.uuid === accessManagerId);
    },
  },
  data() {
    return {
      accessManagerId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
