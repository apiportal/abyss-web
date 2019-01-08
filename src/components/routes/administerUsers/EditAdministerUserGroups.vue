<template>
  <div>
    <EditAdministerUserGroupsModal
      v-if="
        isUsersLoaded &&
        isGroupsLoaded &&
        isMembershipsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :user="users.find(item => item.uuid === userId)"
      :groups="groups"
      :memberships="memberships"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import EditAdministerUserGroupsModal from '@/components/shared/modals/EditAdministerUserGroupsModal';

export default {
  components: {
    EditAdministerUserGroupsModal,
  },
  computed: {
    ...mapState({
      users: state => state.users.items,
      groups: state => state.groups.items,
      isUsersLoaded: state => state.users.lastUpdatedAt,
      isGroupsLoaded: state => state.groups.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/administer-users/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/administer-users/${this.page}`);
    },
    getSubjectMemberships() {
      api.getSubjectMemberships(this.userId).then((response) => {
        if (response && response.data) {
          this.memberships = response.data;
        }
        this.isMembershipsLoaded = true;
      });
    },
  },
  data() {
    return {
      userId: this.$route.params.id,
      page: this.$route.params.page,
      memberships: [],
      isMembershipsLoaded: false,
    };
  },
  mounted() {
    this.getSubjectMemberships();
  },
};
</script>