<template>
  <div>
    <EditPolicyModal
      v-if="
        isPoliciesLoaded && isPolicyTypesLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :policy="getPolicy(policyId)"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import EditPolicyModal from '@/components/shared/modals/EditPolicyModal';

export default {
  components: {
    EditPolicyModal,
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
      policies: state => state.policies.items,
      policyTypes: state => state.policyTypes.items,
      isPoliciesLoaded: state => (state.policies.lastUpdatedAt > 0),
      isPolicyTypesLoaded: state => (state.policyTypes.lastUpdatedAt > 0),
    }),
  },
  data() {
    return {
      policyId: this.$route.params.policyId,
    };
  },
  methods: {
    handleModalClose() {
      this.$router.push(this.routePath);
    },
    handleModalUpdate() {
      this.$router.push(this.routePath);
    },
    getPolicy(policyId) {
      return this.policies.find(item => item.uuid === policyId);
    },
  },
};
</script>