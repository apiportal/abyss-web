<template>
  <div>
    <EditUserOrganizationsModal
      v-if="
        isUsersLoaded &&
        isUserOrganizationsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :user="users.find(item => item.uuid === userId)"
      :organizations="organizations"
      :userOrganizations="userOrganizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import EditUserOrganizationsModal from '@/components/shared/modals/EditUserOrganizationsModal';

export default {
  components: {
    EditUserOrganizationsModal,
  },
  computed: {
    ...mapState({
      navigationFrom: state => state.traffic.navigationFrom,
      users: state => state.users.items,
      organizations: state => state.organizations.items,
      isUsersLoaded: state => state.users.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.navigationFrom);
    },
    handleModalUpdate() {
      this.$router.push(this.navigationFrom);
    },
    getOrganizationsOfUser() {
      api.getOrganizationsOfUser(this.userId).then((response) => {
        if (response && response.data) {
          this.userOrganizations = response.data.filter(item => !item.isdeleted);
        }
        this.isUserOrganizationsLoaded = true;
      }).catch((error) => {
        if (error.status === 404) {
          this.userOrganizations = [];
          this.isUserOrganizationsLoaded = true;
        }
      });
    },
  },
  data() {
    return {
      userId: this.$route.params.id,
      page: this.$route.params.page,
      userOrganizations: [],
      isUserOrganizationsLoaded: false,
    };
  },
  mounted() {
    this.getOrganizationsOfUser();
    this.$store.dispatch('users/getUsers', {});
  },
};
</script>