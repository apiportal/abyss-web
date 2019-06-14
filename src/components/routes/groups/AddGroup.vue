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
      navigationFrom: state => state.traffic.navigationFrom,
      subjectDirectories: state => state.subjectDirectories.items,
      organizations: state => state.organizations.items,
      isSubjectDirectoriesLoaded: state => state.subjectDirectories.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.navigationFrom);
    },
    handleModalUpdate() {
      this.$router.push(this.navigationFrom);
    },
  },
  data() {
    return {
      newGroup: {
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
        effectiveenddate: this.$moment.utc().add(1, 'years').toISOString(),
        effectivestartdate: this.$moment.utc().toISOString(),
        subjecttypeid: 'c5ef2da7-b55e-4dec-8be3-96bf30255781',
      },
      page: this.$route.params.page,
    };
  },
};
</script>