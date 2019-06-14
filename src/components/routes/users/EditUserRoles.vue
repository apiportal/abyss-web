<template>
  <div>
    <EditAdministerUserRolesModal
      v-if="
        isUsersLoaded &&
        isRolesLoaded &&
        isMembershipsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :user="users.find(item => item.uuid === userId)"
      :roles="roles"
      :memberships="memberships"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import EditAdministerUserRolesModal from '@/components/shared/modals/EditAdministerUserRolesModal';

export default {
  components: {
    EditAdministerUserRolesModal,
  },
  computed: {
    ...mapState({
      navigationFrom: state => state.traffic.navigationFrom,
      users: state => state.users.items,
      roles: state => state.roles.items,
      isUsersLoaded: state => state.users.lastUpdatedAt,
      isRolesLoaded: state => state.roles.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.navigationFrom);
    },
    handleModalUpdate() {
      this.$router.push(this.navigationFrom);
    },
    getSubjectMemberships() {
      api.getSubjectMemberships(this.userId).then((response) => {
        if (response && response.data) {
          this.memberships = response.data;
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
      userId: this.$route.params.id,
      page: this.$route.params.page,
      memberships: [],
      isMembershipsLoaded: false,
    };
  },
  mounted() {
    this.getSubjectMemberships();
    this.$store.dispatch('users/getUsers', {});
    this.$store.dispatch('roles/getRoles', {});
  },
};
</script>