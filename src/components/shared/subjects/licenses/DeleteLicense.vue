<template>
  <div>
    <ConfirmModal
      v-if="areLicensesLoaded"
      title="Are you sure?"
      :text="`${license.name} will be deleted. You can't revert your action.`"
      :onClose="handleModalClose"
      :onConfirm="handleModalConfirm"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import ConfirmModal from '@/components/shared/modals/ConfirmModal';

export default {
  components: {
    ConfirmModal,
  },
  props: {
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  methods: {
    ...mapActions('licenses', ['deleteLicenses']),
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalConfirm() {
      const { deleteLicenses, license } = this;
      deleteLicenses({ ...license }).then(() => {
        this.$router.push(this.routePath);
      });
    },
  },
  computed: {
    ...mapState({
      licenses: state => state.subjectLicenses.items,
      areLicensesLoaded: state => state.subjectLicenses.lastUpdatedAt,
    }),
    license() {
      const { licenseId, licenses } = this;
      return licenses.find(item => item.uuid === licenseId);
    },
  },
  data() {
    return {
      licenseId: this.$route.params.licenseId,
    };
  },
};
</script>