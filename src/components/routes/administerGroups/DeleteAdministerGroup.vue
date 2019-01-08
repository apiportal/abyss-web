<template>
  <div>
    <ConfirmModal
      v-if="isGroupsLoaded"
      title="Are you sure?"
      :text="`${group.subjectname} will be deleted. You can't revert your action.`"
      :onClose="handleModalClose"
      :onConfirm="handleModalConfirm"
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
    handleModalClose() {
      this.$router.push(`/app/administer-groups/${this.page}`);
    },
    handleModalConfirm() {
      this.$router.push(`/app/administer-groups/${this.page}`);
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
