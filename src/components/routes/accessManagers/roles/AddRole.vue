<template>
  <div>
    <EditRoleModal
      v-if="
        isSubjectDirectoriesLoaded &&
        isOrganizationsLoaded
      "
      role="add"
      iconTitle="plus"
      :onClose="handleEditRoleModalClose"
      :onUpdate="handleEditRoleModalUpdate"
      :subjectDirectories="subjectDirectories"
      :organizations="organizations"
      :accessRole='newAccessRole'
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditRoleModal from '@/components/shared/modals/EditRoleModal';

export default {
  components: {
    EditRoleModal,
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      subjectDirectories: state => state.subjectDirectories.items,
      organizations: state => state.organizations.items,
      isSubjectDirectoriesLoaded: state => state.subjectDirectories.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  methods: {
    handleEditRoleModalClose() {
      this.$router.push(`/app/roles/${this.page}`);
    },
    handleEditRoleModalUpdate() {
      this.$router.push(`/app/roles/${this.page}`);
    },
  },
  data() {
    const now = new Date();
    const end = new Date();
    const endDate = new Date(end.setFullYear(end.getFullYear() + 50));
    return {
      newAccessRole: {
        firstname: '',
        lastname: '',
        displayname: '',
        isactivated: true,
        subjectname: '',
        password: '',
        email: '',
        url: '',
        description: '',
        organizationid: null,
        subjectdirectoryid: null,
        islocked: false,
        isrestrictedtoprocessing: false,
        issandbox: false,
        picture: '',
        effectiveenddate: endDate.toISOString(),
        effectivestartdate: now.toISOString(),
        subjecttypeid: 'bb76f638-632d-41f8-9511-9865091701f9',
      },
      page: this.$route.params.page,
    };
  },
};
</script>
