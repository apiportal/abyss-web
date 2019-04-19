<template>
  <div>
    <EditRoleGroupsModal
      v-if="
        isUsersLoaded &&
        isRoleGroupsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :user="users.find(item => item.uuid === userId)"
      :groups="groups"
      :roleGroups="roleGroups"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import api from '@/api';
  import EditRoleGroupsModal from '@/components/shared/modals/EditRoleGroupsModal';

  export default {
    components: {
      EditRoleGroupsModal,
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
        groups: state => state.groups.items,
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
      getGroupsOfRole() {
        api.getGroupsOfRole(this.userId).then((response) => {
          if (response && response.data) {
            this.roleGroups = response.data;
          }
          this.isRoleGroupsLoaded = true;
        }).catch((error) => {
          if (error.status === 404) {
            this.roleGroups = [];
            this.isRoleGroupsLoaded = true;
          }
        });
      },
    },
    data() {
      return {
        userId: this.$route.params.id,
        page: this.$route.params.page,
        roleGroups: [],
        isRoleGroupsLoaded: false,
      };
    },
    mounted() {
      this.getGroupsOfRole();
      this.$store.dispatch('roles/1', {});
    },
  };
</script>
