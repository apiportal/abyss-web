<template>
  <div>
    <ConfirmModal
      v-if="isGroupsLoaded && isMembershipsLoaded"
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
    ...mapActions('subjectMemberships', ['deleteSubjectMemberships', 'deleteUserGroupMembership']),
    handleModalClose() {
      this.$router.push(this.navigationFrom);
    },
    handleModalConfirm() {
      const { deleteGroups, deleteSubjectMemberships, userGroupMembership,
      deleteUserGroupMembership, group, membership } = this;
      deleteGroups({ ...group }).then(() => {
        deleteSubjectMemberships({ ...membership }).then(() => {
          deleteUserGroupMembership({ ...userGroupMembership }).then(() => {
            this.$router.push(this.navigationFrom);
          });
        });
      });
    },
  },
  computed: {
    ...mapState({
      navigationFrom: state => state.traffic.navigationFrom,
      groups: state => state.groups.items,
      memberships: state => state.subjectMemberships.items,
      userGroupMemberships: state => state.subjectMemberships.userGroup,
      isMembershipsLoaded: state => state.subjectMemberships.lastUpdatedAt,
      isGroupsLoaded: state => state.groups.lastUpdatedAt,
    }),
    group() {
      const { groupId, groups } = this;
      return groups.find(item => item.uuid === groupId);
    },
    membership() {
      const { groupId, memberships } = this;
      return memberships.find(item => item.subjectgroupid === groupId);
    },
    userGroupMembership() {
      const { groupId, userGroupMemberships } = this;
      return userGroupMemberships.find(item => item.subjectgroupid === groupId);
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
