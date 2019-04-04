<template>
  <div>
    <EditPolicyTypeModal
      v-if="
        isPolicyTypesLoaded &&
        isOrganizationsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :policyType="policyTypes.find(item => item.uuid === policyTypeId)"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditPolicyTypeModal from '@/components/shared/modals/EditPolicyTypeModal';

export default {
  components: {
    EditPolicyTypeModal,
  },
  computed: {
    ...mapState({
      policyTypes: state => state.policyTypes.items,
      organizations: state => state.organizations.items,
      isPolicyTypesLoaded: state => state.policyTypes.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/policy-types/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/policy-types/${this.page}`);
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
