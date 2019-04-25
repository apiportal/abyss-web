<template>
  <div>
    <EditRoleUsersModal
      v-if="
        isRolesLoaded &&
        isUsersLoaded &&
        isMembershipsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :selectedRole="roles.find(item => item.uuid === selectedRoleId)"
      :users="users"
      :memberships="memberships"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import api from '@/api';
  import EditRoleUsersModal from '@/components/shared/modals/EditRoleUsersModal';

  export default {
    components: {
      EditRoleUsersModal,
    },
    props: {
      routePath: {
        type: String,
        required: false,
        default() { return ''; },
      },
    },
    computed: {
      ...mapState({
        users: state => state.users.items,
        roles: state => state.roles.items,
        isRolesLoaded: state => state.roles.lastUpdatedAt,
        isUsersLoaded: state => state.users.lastUpdatedAt,
      }),
    },
    methods: {
      handleModalClose() {
        this.$router.push(this.routePath);
      },
      handleModalUpdate() {
        this.$router.push(this.routePath);
      },
      getAllRoleMemberships() {
        api.getAllRoleMemberships().then((response) => {
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
        selectedRoleId: this.$route.params.id,
        page: this.$route.params.page,
        memberships: [],
        isMembershipsLoaded: false,
      };
    },
    mounted() {
      this.getAllRoleMemberships();
      this.$store.dispatch('roles/getRoles', {});
      this.$store.dispatch('roleMemberships/getAllRoleMemberships', {});
    },
  };
</script>
