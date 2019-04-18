<template>
  <div>
    <EditRolePermissionsModal
      v-if="
        isUsersLoaded &&
        isRolePermissionsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :user="users.find(item => item.uuid === userId)"
      :permissions="permissions"
      :rolePermissions="rolePermissions"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import api from '@/api';
  import EditRolePermissionsModal from '@/components/shared/modals/EditRolePermissionsModal';

  export default {
    components: {
      EditRolePermissionsModal,
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
        permissions: state => state.permissions.items,
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
      getPermissionsOfRole() {
        api.getPermissionsOfRole(this.userId).then((response) => {
          if (response && response.data) {
            this.rolePermissions = response.data;
          }
          this.isRolePermissionsLoaded = true;
        }).catch((error) => {
          if (error.status === 404) {
            this.rolePermissions = [];
            this.isRolePermissionsLoaded = true;
          }
        });
      },
    },
    data() {
      return {
        userId: this.$route.params.id,
        page: this.$route.params.page,
        rolePermissions: [],
        isRolePermissionsLoaded: false,
      };
    },
    mounted() {
      this.getPermissionsOfRole();
      this.$store.dispatch('roles/1', {});
    },
  };
</script>
