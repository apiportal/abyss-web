<template>
  <div>
    <EditRoleUsersModal
      v-if="
        isUsersLoaded &&
        isRoleUsersLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :user="users.find(item => item.uuid === userId)"
      :users="users"
      :roleUsers="roleUsers"
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
        // permissions: state => state.permissions.items,
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
      getUsersOfRole() {
        api.getUsersOfRole(this.userId).then((response) => {
          if (response && response.data) {
            this.roleUsers = response.data;
          }
          this.isRoleUsersLoaded = true;
        }).catch((error) => {
          if (error.status === 404) {
            this.roleUsers = [];
            this.isRoleUsersLoaded = true;
          }
        });
      },
    },
    data() {
      return {
        userId: this.$route.params.id,
        page: this.$route.params.page,
        roleUsers: [],
        isRoleUsersLoaded: false,
      };
    },
    mounted() {
      this.getUsersOfRole();
      this.$store.dispatch('roles/1', {});
    },
  };
</script>
