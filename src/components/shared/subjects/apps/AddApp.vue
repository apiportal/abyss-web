<template>
  <div>
    <EditAppModal
      v-if="
        isAppsLoaded &&
        isOrganizationsLoaded &&
        isSubjectDirectoriesLoaded &&
        isSubjectDirectoryTypesLoaded
      "
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :app="getApp()"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import EditAppModal from '@/components/shared/modals/EditAppModal';

export default {
  components: {
    EditAppModal,
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
      currentUser: state => state.user,
      apps: state => state.apps.items,
      organizations: state => state.organizations.items,
      subjectDirectories: state => state.subjectDirectories.items,
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      isAppsLoaded: state => (state.apps.lastUpdatedAt > 0),
      isOrganizationsLoaded: state => (state.organizations.lastUpdatedAt > 0),
      isSubjectDirectoriesLoaded: state => (state.subjectDirectories.lastUpdatedAt > 0),
      isSubjectDirectoryTypesLoaded: state => (state.subjectDirectoryTypes.lastUpdatedAt > 0),
    }),
  },
  data() {
    return {
    };
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
    getApp() {
      const now = new Date();
      const end = new Date();
      const endDate = new Date(end.setFullYear(end.getFullYear() + 50));
      return {
        crudsubjectid: this.currentUser.props.uuid,
        description: '',
        displayname: '',
        effectiveenddate: endDate.toISOString(),
        effectivestartdate: now.toISOString(),
        email: this.currentUser.props.email,
        firstname: '',
        isactivated: false,
        islocked: false,
        isrestrictedtoprocessing: false,
        issandbox: false,
        lastname: '',
        organizationid: this.currentUser.props.organizationid,
        password: 'temppassword',
        picture: '',
        secondaryemail: this.currentUser.props.email,
        subjectdirectoryid: null,
        subjectname: '',
        subjecttypeid: 'ca80dd37-7484-46d3-b4a1-a8af93b2d3c6',
        url: '',
      };
    },
  },
};
</script>