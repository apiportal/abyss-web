<template>
  <div>
    <EditLicenseModal
      v-if="
        areLicensesLoaded
      "
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :license="newLicense"
      :visibilityTypes="visibilityTypes"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import EditLicenseModal from '@/components/shared/modals/EditLicenseModal';

export default {
  components: {
    EditLicenseModal,
  },
  computed: {
    ...mapState({
      visibilityTypes: state => state.apiVisibilityTypes.items,
      areLicensesLoaded: state => state.licenses.lastUpdatedAt,
      areVisibilityTypesLoaded: state => state.visibilityTypes.lastUpdatedAt,
    }),
  },
  data() {
    return {
      newLicense: {
        name: '',
        organizationid: null,
        subjectid: null,
        version: '',
        licensedocument: {
          info: {
            description: '',
            title: '',
            version: '',
            visibility: '',
          },
          legal: {
            agreementType: '',
            description: '',
            documentState: '',
            documentText: '',
            legalDocumentID: null,
            link: '',
            name: '',
          },
          openApiLicense: '',
          sla: {
            availability: null,
            blackOutHoursPerYear: null,
            description: '',
            performance: '',
            supportHours: '',
            tierName: '',
          },
          termsOfService: {
            policyKey: [],
          },
        },
      },
      page: this.$route.params.page,
    };
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/my-licenses/my-licenses/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/my-licenses/my-licenses/${this.page}`);
    },
  },
};
</script>