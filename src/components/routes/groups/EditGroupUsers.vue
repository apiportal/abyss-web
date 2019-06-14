<template>
  <div>
    <EditAdministerGroupUsersModal
      v-if="
        isUsersLoaded &&
        isGroupsLoaded &&
        isMembershipsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :group="groups.find(item => item.uuid === groupId)"
      :users="users"
      :memberships="memberships"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import EditAdministerGroupUsersModal from '@/components/shared/modals/EditAdministerGroupUsersModal';

export default {
  components: {
    EditAdministerGroupUsersModal,
  },
  computed: {
    ...mapState({
      navigationFrom: state => state.traffic.navigationFrom,
      users: state => state.users.items,
      groups: state => state.groups.items,
      isUsersLoaded: state => state.users.lastUpdatedAt,
      isGroupsLoaded: state => state.groups.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.navigationFrom);
    },
    handleModalUpdate() {
      this.$router.push(this.navigationFrom);
    },
    getGroupMemberships() {
      api.getGroupMemberships(this.groupId).then((response) => {
        if (response && response.data) {
          this.memberships = response.data.filter(item => !item.isdeleted);
        }
        this.isMembershipsLoaded = true;
      }).catch((error) => {
        if (error.status === 404) {
          this.memberships = [];
          this.isMembershipsLoaded = true;
        }
      });
    },
  },
  data() {
    return {
      groupId: this.$route.params.id,
      page: this.$route.params.page,
      memberships: [],
      isMembershipsLoaded: false,
    };
  },
  mounted() {
    this.getGroupMemberships();
  },
};
</script>