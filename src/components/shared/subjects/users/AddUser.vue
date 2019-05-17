<template>
  <div>
    <EditAdministerUserModal
      v-if="
        isSubjectDirectoriesLoaded &&
        isOrganizationsLoaded
      "
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :user="newUser"
      :subjectDirectories="subjectDirectories"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
      subjectDirectories: state => state.subjectDirectories.items,
      organizations: state => state.organizations.items,
      isSubjectDirectoriesLoaded: state => state.subjectDirectories.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
  },
  data() {
    const now = new Date();
    return {
      newUser: {
        firstname: '',
        lastname: '',
        displayname: '',
        subjectname: '',
        isactivated: true,
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
        effectiveenddate: now,
        effectivestartdate: now,
        subjecttypeid: '21371a15-04f8-445e-a899-006ee11c0e09',
      },
      page: this.$route.params.page,
    };
  },
};
</script>