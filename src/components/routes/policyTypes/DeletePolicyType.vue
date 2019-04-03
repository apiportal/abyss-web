<template>
  <div>
    <ConfirmModal
      v-if="isPolicyTypesLoaded"
      title="Are you sure?"
      :text="`${policyType.typename} will be deleted. You can't revert your action.`"
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
  methods: {
    ...mapActions('policyTypes', ['deletePolicyTypes']),
    handleModalClose() {
      this.$router.push(`/app/policy-types/${this.page}`);
    },
    handleModalConfirm() {
      const { deletePolicyTypes, policyType } = this;
      deletePolicyTypes({ ...policyType }).then(() => {
        this.$router.push(`/app/policy-types/${this.page}`);
      });
    },
  },
  computed: {
    ...mapState({
      policyTypes: state => state.policyTypes.items,
      isPolicyTypesLoaded: state => state.policyTypes.lastUpdatedAt,
    }),
    policyType() {
      const { policyTypeId, policyTypes } = this;
      return policyTypes.find(item => item.uuid === policyTypeId);
    },
  },
  data() {
    return {
      policyTypeId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
