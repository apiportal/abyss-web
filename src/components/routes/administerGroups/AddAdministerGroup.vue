<template>
  <div>
    <EditAdministerGroupModal
      v-if="
        isSubjectDirectoriesLoaded &&
        isOrganizationsLoaded
      "
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :group="newGroup"
      :subjectDirectories="subjectDirectories"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditAdministerGroupModal from '@/components/shared/modals/EditAdministerGroupModal';

export default {
  components: {
    EditAdministerGroupModal,
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
      this.$router.push(`/app/administer-groups/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/administer-groups/${this.page}`);
    },
  },
  data() {
    const now = new Date();
    return {
      newGroup: {
        firstname: '',
        lastname: '',
        displayname: '',
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
        effectiveenddate: now,
        effectivestartdate: now,
      },
      page: this.$route.params.page,
    };
  },
};
</script>