<template>
  <div>
    <EditRoleModal
      role="add"
      iconTitle="plus"
      :onClose="handleEditRoleModalClose"
      :onUpdate="handleEditRoleModalUpdate"
      :app="getRole()"
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
    }),
  },
  methods: {
    handleEditRoleModalClose() {
      this.$router.push(`/app/roles/${this.page}`);
    },
    handleEditRoleModalUpdate() {
      this.$router.push(`/app/roles/${this.page}`);
    },
    getRole() {
      // const now = new Date();
      // return {
      //   organizationid: null,
      //   crudsubjectid: this.currentUser.props.uuid,
      //   subjecttypeid: '',
      //   subjectname: '',
      //   firstname: '',
      //   lastname: '',
      //   displayname: '',
      //   email: this.currentUser.props.email,
      //   secondaryemail: '',
      //   effectivestartdate: now.toISOString(),
      //   effectiveenddate: '',
      //   password: 'temppassword',
      //   picture: '',
      //   subjectdirectoryid: null,
      //   islocked: false,
      //   issandbox: false,
      //   url: '',
      //   isrestrictedtoprocessing: false,
      //   description: '',
      //   distinguishedname: '',
      //   uniqueid: '',
      //   phonebusiness: '',
      //   phonehome: '',
      //   phonemobile: '',
      //   phoneextension: '',
      //   jobtitle: '',
      //   department: '',
      //   company: '',
      // };
    },
  },
  data() {
    return {
      newAccessRole: {
        displayname: '',
        description: '',
        isactive: true,
      },
      page: this.$route.params.page,
    };
  },
};
</script>
