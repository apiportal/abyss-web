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
      licenses: state => state.licenses.items,
      areLicensesLoaded: state => state.licenses.lastUpdatedAt,
      areVisibilityTypesLoaded: state => state.apiVisibilityTypes.lastUpdatedAt,
    }),
  },
  data() {
    return {
      licenseId: this.$route.params.licenseId,
    };
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
    getLicense(licenseId) {
      return this.licenses.find(item => item.uuid === licenseId);
    },
  },
};
</script>