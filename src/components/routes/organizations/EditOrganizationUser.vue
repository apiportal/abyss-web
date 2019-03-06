<template>
  <div>
    <EditUserModal
      v-if="
        isUsersLoaded &&
        isSubjectDirectoriesLoaded &&
        isOrganizationsLoaded &&
        isGroupsLoaded &&
        isMembershipsLoaded &&
        isUserOrganizationsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :user="users.find(item => item.uuid === userId)"
      :subjectDirectories="subjectDirectories"
      :organizations="organizations"
      :groups="groups"
      :memberships="memberships"
      :userOrganizations="userOrganizations"
      title="Organization"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import EditUserModal from '@/components/shared/modals/EditUserModal';

export default {
  components: {
    EditUserModal,
  },
  computed: {
    ...mapState({
      users: state => state.users.items,
      subjectDirectories: state => state.subjectDirectories.items,
      organizations: state => state.organizations.items,
      groups: state => state.groups.items,
      isUsersLoaded: state => state.users.lastUpdatedAt,
      isSubjectDirectoriesLoaded: state => state.subjectDirectories.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
      isGroupsLoaded: state => state.groups.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/organizations/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/organizations/${this.page}`);
    },
    getSubjectMemberships() {
      api.getSubjectMemberships(this.userId).then((response) => {
        if (response && response.data) {
          this.memberships = response.data;
        }
        this.isMembershipsLoaded = true;
      });
    },
    getOrganizationsOfUser() {
      api.getOrganizationsOfUser(this.userId).then((response) => {
        if (response && response.data) {
          this.userOrganizations = response.data;
        }
        this.isUserOrganizationsLoaded = true;
      });
    },
  },
  data() {
    return {
      userId: this.$route.params.id,
      page: this.$route.params.page,
      memberships: [],
      userOrganizations: [],
      isMembershipsLoaded: false,
      isUserOrganizationsLoaded: false,
    };
  },
  mounted() {
    this.getSubjectMemberships();
    this.getOrganizationsOfUser();
  },
};
</script>