<template>
  <div>
    <ConfirmModal
      v-if="arePoliciesLoaded"
      title="Are you sure?"
      :text="`${policy.name} will be deleted. You can't revert your action.`"
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
    ...mapActions('policies', ['deletePolicies']),
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalConfirm() {
      const { deletePolicies, policy } = this;
      deletePolicies({ ...policy }).then(() => {
        this.$router.push(this.routePath);
      });
    },
  },
  computed: {
    ...mapState({
      policies: state => state.subjectPolicies.items,
      arePoliciesLoaded: state => state.subjectPolicies.lastUpdatedAt,
    }),
    policy() {
      const { policyId, policies } = this;
      return policies.find(item => item.uuid === policyId);
    },
  },
  data() {
    return {
      policyId: this.$route.params.policyId,
    };
  },
};
</script>