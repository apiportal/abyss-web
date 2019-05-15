<template>
  <div>
    <EditIdentityManagerModal
      v-if="
        isSubjectDirectoryTypesLoaded &&
        isOrganizationsLoaded
      "
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :subjectDirectory="subjectDirectory"
      :subjectDirectoryTypes="subjectDirectoryTypes"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment-timezone';
import EditIdentityManagerModal from '@/components/shared/modals/EditIdentityManagerModal';

export default {
  components: {
    EditIdentityManagerModal,
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/identity-managers/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/identity-managers/${this.page}`);
    },
  },
  computed: {
    ...mapState({
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
      isSubjectDirectoryTypesLoaded: state => state.subjectDirectoryTypes.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  data() {
    const now = new Date();
    return {
      subjectDirectory: {
        directoryname: '',
        description: '',
        directorypriorityorder: 1,
        isactive: true,
        istemplate: false,
        organizationid: null,
        directorytypeid: null,
        lastsyncronizationduration: 0,
        lastsyncronizedat: moment(now),
      },
      page: this.$route.params.page,
    };
  },
};
</script>
