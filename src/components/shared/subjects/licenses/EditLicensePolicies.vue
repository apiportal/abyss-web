<template>
  <div>
    <EditLicensePoliciesModal
      v-if="
        isPoliciesLoaded &&
        isPolicyTypesLoaded &&
        isSubjectLicensesLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :license="subjectLicenses.find(item => item.uuid === licenseId)"
      :policies="policies"
      :policyTypes="policyTypes"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditLicensePoliciesModal from '@/components/shared/modals/EditLicensePoliciesModal';

export default {
  components: {
    EditLicensePoliciesModal,
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
      policies: state => state.subjectPolicies.items,
      policyTypes: state => state.policyTypes.items,
      subjectLicenses: state => state.subjectLicenses.items,
      isPoliciesLoaded: state => state.subjectPolicies.lastUpdatedAt,
      isPolicyTypesLoaded: state => state.policyTypes.lastUpdatedAt,
      isSubjectLicensesLoaded: state => state.subjectLicenses.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid, refresh: true });
      this.$router.push(this.routePath);
    },
  },
  data() {
    return {
      licenseId: this.$route.params.licenseId,
      page: this.$route.params.page,
    };
  },
  mounted() {
    this.$store.dispatch('subjectPolicies/getSubjectPolicies', { uuid: this.currentUser.uuid });
    this.$store.dispatch('policyTypes/getPolicyTypes', {});
    this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid });
  },
};
</script>