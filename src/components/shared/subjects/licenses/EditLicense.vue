<template>
  <div>
    <EditLicenseModal
      v-if="
        areLicensesLoaded && areVisibilityTypesLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :license="getLicense(licenseId)"
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
      subjectLicenses: state => state.subjectLicenses.items,
      areLicensesLoaded: state => state.subjectLicenses.lastUpdatedAt,
      areVisibilityTypesLoaded: state => state.apiVisibilityTypes.lastUpdatedAt,
    }),
  },
  data() {
    return {
      licenseId: this.$route.params.licenseId,
    };
  },
  mounted() {
    this.$store.dispatch('subjectLicenses/getSubjectLicenses', { uuid: this.currentUser.uuid });
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
    getLicense(licenseId) {
      return this.subjectLicenses.find(item => item.uuid === licenseId);
    },
  },
};
</script>