<template>
  <div>
    <EditAccessManagerModal
      v-if="
        isAccessManagerTypesLoaded &&
        isOrganizationsLoaded
      "
      role="add"
      :onClose="handleModalClose"
      :onUpdate="handleModalUpdate"
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
    handleModalClose() {
      this.$router.push(`/app/access-managers/${this.page}`);
    },
    handleModalUpdate() {
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
      accessManager: {
        accessmanagername: '',
        description: '',
        isactive: true,
        organizationid: null,
        accessmanagertypeid: null,
      },
      page: this.$route.params.page,
    };
  },
};
</script>
