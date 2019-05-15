<template>
  <div>
    <EditLicenseModal
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :license="getLicense()"
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
      currentUser: state => state.user,
      visibilityTypes: state => state.apiVisibilityTypes.items,
      areLicensesLoaded: state => state.subjectLicenses.lastUpdatedAt,
      areVisibilityTypesLoaded: state => state.visibilityTypes.lastUpdatedAt,
    }),
  },
  data() {
    return {
      /* newLicense: {
        name: '',
        organizationid: null,
        subjectid: this.currentUser.props.uuid,
        version: '',
        isactive: true,
        licensedocument: {
          info: {
            description: 'API License Description',
            title: 'API License',
            version: '',
            visibility: 'public',
          },
          legal: {
            agreementType: 'signup',
            description: 'API Legal Agreement',
            documentState: 'active',
            documentText: '',
            legalDocumentID: null,
            link: 'http://example.com/legals/{LegalDocumentID}',
            name: 'API Legal Agreement',
          },
          openApiLicense: '',
          sla: {
            availability: 98,
            blackOutHoursPerYear: 36,
            description: 'Silver SLA Package',
            performance: '10Mbit/s',
            supportHours: '8x5',
            tierName: 'Silver',
          },
          termsOfService: {
            policyKey: [],
          },
        },
      }, */
    };
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
    getLicense() {
      return {
        crudsubjectid: this.currentUser.props.uuid,
        description: '',
        isactive: true,
        name: '',
        organizationid: this.currentUser.props.organizationid,
        policyinstance: {},
        subjectid: this.currentUser.props.uuid,
        typeid: null,
        version: '',
        licensedocument: {
          info: {
            description: 'API License Description',
            title: 'API License',
            version: '',
            visibility: 'public',
          },
          legal: {
            agreementType: 'signup',
            description: 'API Legal Agreement',
            documentState: 'active',
            documentText: '',
            legalDocumentID: null,
            link: 'http://example.com/legals/{LegalDocumentID}',
            name: 'API Legal Agreement',
          },
          openApiLicense: '',
          sla: {
            availability: 98,
            blackOutHoursPerYear: 36,
            description: 'Silver SLA Package',
            performance: '10Mbit/s',
            supportHours: '8x5',
            tierName: 'Silver',
          },
          termsOfService: {
            policyKey: [],
          },
        },
      };
    },
  },
};
</script>