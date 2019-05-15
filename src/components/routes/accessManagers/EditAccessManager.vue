<template>
  <div>
    <EditAccessManagerModal
      v-if="
        isAccessManagersLoaded &&
        isAccessManagerTypesLoaded &&
        isOrganizationsLoaded
      "
      role="edit"
      iconTitle="edit"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
      :accessManager="accessManagers.find(item => item.uuid === accessManagerId)"
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
    handleModalClose() {
      this.$router.push(`/app/access-managers/${this.page}`);
    },
    handleModalUpdate() {
      this.$router.push(`/app/access-managers/${this.page}`);
    },
  },
  computed: {
    ...mapState({
      accessManagers: state => state.accessManagers.items,
      accessManagerTypes: state => state.accessManagerTypes.items,
      organizations: state => state.organizations.items,
      isAccessManagersLoaded: state => state.accessManagers.lastUpdatedAt,
      isAccessManagerTypesLoaded: state => state.accessManagerTypes.lastUpdatedAt,
      isOrganizationsLoaded: state => state.organizations.lastUpdatedAt,
    }),
  },
  data() {
    return {
      accessManagerId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
