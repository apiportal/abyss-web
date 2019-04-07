<template>
  <div>
    <EditOrganizationUsersModal
      v-if="
        isUsersLoaded &&
        isOrganizationUsersLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :organization="organizations.find(item => item.uuid === organizationId)"
      :users="users"
      :organizationUsers="organizationUsers"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import EditOrganizationUsersModal from '@/components/shared/modals/EditOrganizationUsersModal';

export default {
  components: {
    EditOrganizationUsersModal,
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
      organizations: state => state.organizations.items,
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
    getOrganizationsOfUser() {
      api.getUsersOfOrganizations(this.organizationId).then((response) => {
        if (response && response.data) {
          this.organizationUsers = response.data;
        }
        this.isOrganizationUsersLoaded = true;
      });
    },
  },
  data() {
    return {
      organizationId: this.$route.params.id,
      page: this.$route.params.page,
      organizationUsers: [],
      isOrganizationUsersLoaded: false,
    };
  },
  mounted() {
    this.getOrganizationsOfUser();
    this.$store.dispatch('users/getUsers', {});
  },
};
</script>