<template>
  <div>
    <EditIdentityManagerModal
      :onClose="handleEditIdentityManagerModalClose"
      :onUpdate="handleEditIdentityManagerModalUpdate"
      :subjectDirectory="subjectDirectories.find(item => item.uuid === subjectDirectoryId)"
      :subjectDirectoryTypes="subjectDirectoryTypes"
      :organizations="organizations"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditIdentityManagerModal from '@/components/shared/modals/EditIdentityManagerModal';

export default {
  components: {
    EditIdentityManagerModal,
  },
  methods: {
    handleEditIdentityManagerModalClose() {
      this.$router.push('/app/identity-managers/');
    },
    handleEditIdentityManagerModalUpdate() {
      this.$router.push('/app/identity-managers/');
    },
  },
  computed: {
    ...mapState({
      subjectDirectories: state => state.subjectDirectories.items,
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
    }),
  },
  data() {
    return {
      subjectDirectoryId: this.$route.params.id,
    };
  },
};
</script>
