<template>
  <div>
    <EditRoleGroupsModal
      v-if="
        isRolesLoaded &&
        isGroupsLoaded &&
        isMembershipsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :selectedRole="roles.find(item => item.uuid === selectedRoleId)"
      :groups="groups"
      :memberships="memberships"
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
        groups: state => state.groups.items,
        roles: state => state.roles.items,
        isRolesLoaded: state => state.roles.lastUpdatedAt,
        isGroupsLoaded: state => state.groups.lastUpdatedAt,
      }),
    },
    methods: {
      handleModalClose() {
        this.$router.push(this.routePath);
      },
      handleModalUpdate() {
        this.$router.push(this.routePath);
      },
      getAllGroupRoleMemberships() {
        api.getAllGroupRoleMemberships().then((response) => {
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
      this.getAllGroupRoleMemberships();
      this.$store.dispatch('roles/getRoles', {});
      this.$store.dispatch('groupRoleMemberships/getAllGroupRoleMemberships', {});
    },
  };
</script>
