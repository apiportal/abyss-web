<template>
  <div>
    <EditAccessManagerModal
      v-if="
        isAccessManagerTypesLoaded &&
        isOrganizationsLoaded
      "
      role="add"
      :onClose="handleEditAccessManagerModalClose"
      :onUpdate="handleEditAccessManagerModalUpdate"
      :accessManager="accessManager"
      :accessManagerTypes="accessManagerTypes"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditAccessManagerModal from '@/components/shared/modals/EditAccessManagerModal';

export default {
  components: {
    EditAccessManagerModal,
  },
  methods: {
    handleEditAccessManagerModalClose() {
      this.$router.push(`/app/access-managers/${this.page}`);
    },
    handleEditAccessManagerModalUpdate() {
      this.$router.push(`/app/access-managers/${this.page}`);
    },
  },
  computed: {
    ...mapState({
      accessManagerTypes: state => state.accessManagerTypes.items,
      organizations: state => state.organizations.items,
      isAccessManagerTypesLoaded: state => state.accessManagerTypes.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  data() {
    return {
      accessManager: {},
      page: this.$route.params.page,
    };
  },
};
</script>
