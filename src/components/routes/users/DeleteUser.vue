<template>
  <div>
    <ConfirmModal
      v-if="isUsersLoaded"
      title="Are you sure?"
      :text="`${user.displayname} will be deleted. You can't revert your action.`"
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
    ...mapActions('users', ['deleteUsers']),
    handleModalClose() {
      this.$router.push(this.navigationFrom);
    },
    handleModalConfirm() {
      const { deleteUsers, user } = this;
      deleteUsers({ ...user }).then(() => {
        this.$router.push(this.navigationFrom);
      });
    },
  },
  computed: {
    ...mapState({
      navigationFrom: state => state.traffic.navigationFrom,
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