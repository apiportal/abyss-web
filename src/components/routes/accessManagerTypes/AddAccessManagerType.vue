<template>
  <div>
    <EditAccessManagerTypeModal
      v-if="isOrganizationsLoaded"
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :accessManagerType="accessManagerType"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditAccessManagerTypeModal from '@/components/shared/modals/EditAccessManagerTypeModal';

export default {
  components: {
    EditAccessManagerTypeModal,
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/access-manager-types/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/access-manager-types/${this.page}`);
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
      accessManagerType: {
        typename: '',
        description: '',
        organizationid: null,
        attributetemplate: {},
      },
      page: this.$route.params.page,
    };
  },
};
</script>
