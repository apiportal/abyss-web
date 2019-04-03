<template>
  <div>
    <EditRoleModal
      v-if="
        isAccessManagerTypesLoaded &&
        isOrganizationsLoaded
      "
      role="add"
      :onClose="handleEditRoleModalClose"
      :onUpdate="handleEditRoleModalUpdate"
      :accessManager="accessManager"
      :accessManagerTypes="accessManagerTypes"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditRoleModal from '@/components/shared/modals/EditRoleModal';

export default {
  components: {
    EditRoleModal,
  },
  methods: {
    handleEditRoleModalClose() {
      this.$router.push(`/app/access-managers/${this.page}`);
    },
    handleEditRoleModalUpdate() {
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
