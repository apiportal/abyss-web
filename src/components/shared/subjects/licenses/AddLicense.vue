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
  props: {
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
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
    };
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
  },
};
</script>