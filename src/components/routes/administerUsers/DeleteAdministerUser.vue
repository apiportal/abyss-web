<template>
  <div>
    <ConfirmModal
      v-if="isUsersLoaded"
      title="Are you sure?"
      :text="`${user.subjectname} will be deleted. You can't revert your action.`"
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
      this.$router.push(`/app/administer-users/${this.page}`);
    },
    handleModalConfirm() {
      this.$router.push(`/app/administer-users/${this.page}`);
    },
  },
  computed: {
    ...mapState({
      users: state => state.users.items,
      isUsersLoaded: state => state.users.lastUpdatedAt,
    }),
    user() {
      const { userId, users } = this;
      return users.find(item => item.uuid === userId);
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
