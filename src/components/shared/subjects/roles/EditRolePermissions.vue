<template>
  <div>
    <EditRolePermissionsModal
      v-if="
        isRolesLoaded &&
        isRolePermissionsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :selectedRole="roles.find(item => item.uuid === selectedRoleId)"
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
        roles: state => state.roles.items,
        permissions: state => state.permissions.items,
        isRolesLoaded: state => state.roles.lastUpdatedAt,
      }),
    },
    methods: {
      handleModalClose() {
        this.$router.push(this.routePath);
      },
      handleModalUpdate() {
        this.$router.push(this.routePath);
      },
      getPermissions() {
        const { selectedRoleId } = this;
        api.getSubjectPermissions(selectedRoleId).then((response) => {
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
        selectedRoleId: this.$route.params.id,
        page: this.$route.params.page,
        rolePermissions: [],
        isRolePermissionsLoaded: false,
      };
    },
    mounted() {
      this.getPermissions();
      this.$store.dispatch('roles/getRoles', {});
    },
  };
</script>
