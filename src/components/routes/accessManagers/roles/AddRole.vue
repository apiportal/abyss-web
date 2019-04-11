<template>
  <div>
    <EditRoleModal
      role="add"
      iconTitle="plus"
      :onClose="handleEditRoleModalClose"
      :onUpdate="handleEditRoleModalUpdate"
    />
  </div>
</template>

<script>
import EditRoleModal from '@/components/shared/modals/EditRoleModal';

export default {
  components: {
    EditRoleModal,
  },
  methods: {
    handleEditRoleModalClose() {
      this.$router.push(`/app/roles/${this.page}`);
    },
    handleEditRoleModalUpdate() {
      this.$router.push(`/app/roles/${this.page}`);
    },
    getRole() {
      const now = new Date();
      return {
        organizationid: null,
        crudsubjectid: this.currentUser.props.uuid,
        subjecttypeid: '',
        subjectname: '',
        firstname: '',
        lastname: '',
        displayname: '',
        email: this.currentUser.props.email,
        secondaryemail: '',
        effectivestartdate: now.toISOString(),
        effectiveenddate: '',
        password: 'temppassword',
        picture: '',
        subjectdirectoryid: null,
        islocked: false,
        issandbox: false,
        url: '',
        isrestrictedtoprocessing: false,
        description: '',
        distinguishedname: '',
        uniqueid: '',
        phonebusiness: '',
        phonehome: '',
        phonemobile: '',
        phoneextension: '',
        jobtitle: '',
        department: '',
        company: '',
      };
    },
  },
  data() {
  },
};
</script>
