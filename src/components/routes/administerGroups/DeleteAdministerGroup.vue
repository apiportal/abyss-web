<template>
  <div>
    <ConfirmModal
      v-if="isGroupsLoaded"
      title="Are you sure?"
      :text="`${group.displayname} will be deleted. You can't revert your action.`"
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
    ...mapActions('groups', ['deleteGroups']),
    handleModalClose() {
      this.$router.push(`/app/administer-groups/${this.page}`);
    },
    handleModalConfirm() {
      const { deleteGroups, group } = this;
      deleteGroups({ ...group }).then(() => {
        this.$router.push(`/app/administer-groups/${this.page}`);
      });
    },
  },
  computed: {
    ...mapState({
      groups: state => state.groups.items,
      isGroupsLoaded: state => state.groups.lastUpdatedAt,
    }),
    group() {
      const { groupId, groups } = this;
      return groups.find(item => item.uuid === groupId);
    },
  },
  data() {
    return {
      groupId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
