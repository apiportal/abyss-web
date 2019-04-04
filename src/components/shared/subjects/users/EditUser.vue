<template>
  <div>
    <EditAdministerUserModal
      v-if="
        isUsersLoaded &&
        isSubjectDirectoriesLoaded &&
        isOrganizationsLoaded &&
        isGroupsLoaded &&
        isMembershipsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :user="users.find(item => item.uuid === userId)"
      :subjectDirectories="subjectDirectories"
      :organizations="organizations"
      :groups="groups"
      :memberships="memberships"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import EditAdministerUserModal from '@/components/shared/modals/EditAdministerUserModal';

export default {
  components: {
    EditAdministerUserModal,
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
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
    getSubjectMemberships() {
      api.getSubjectMemberships(this.userId).then((response) => {
        if (response && response.data) {
          this.memberships = response.data;
        }
        this.isMembershipsLoaded = true;
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
  },
};
</script>