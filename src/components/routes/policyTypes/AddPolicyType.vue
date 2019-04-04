<template>
  <div>
    <EditPolicyTypeModal
      v-if="isOrganizationsLoaded"
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :policyType="policyType"
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
  methods: {
    handleModalClose() {
      this.$router.push(`/app/policy-types/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/policy-types/${this.page}`);
    },
  },
  computed: {
    ...mapState({
      organizations: state => state.organizations.items,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  data() {
    return {
      policyType: {
        type: '',
        subtype: '',
        isactive: true,
        name: '',
        description: '',
        organizationid: null,
        template: {},
      },
      page: this.$route.params.page,
    };
  },
};
</script>
