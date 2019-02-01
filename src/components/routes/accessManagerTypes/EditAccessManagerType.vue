<template>
  <div>
    <EditAccessManagerTypeModal
      v-if="
        isAccessManagerTypesLoaded &&
        isOrganizationsLoaded
      "
      role="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :accessManagerType="accessManagerTypes.find(item => item.uuid === accessManagerTypeId)"
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
  computed: {
    ...mapState({
      accessManagerTypes: state => state.accessManagerTypes.items,
      organizations: state => state.organizations.items,
      isAccessManagerTypesLoaded: state => state.accessManagerTypes.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/access-manager-types/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/access-manager-types/${this.page}`);
    },
  },
  data() {
    return {
      accessManagerTypeId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
