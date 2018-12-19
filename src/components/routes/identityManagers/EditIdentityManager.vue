<template>
  <div>
    <EditIdentityManagerModal
      :onClose="handleEditIdentityManagerModalClose"
      :subjectDirectory="subjectDirectories.find(item => item.uuid === subjectDirectoryId)"
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
  },
  computed: {
    ...mapState({
      subjectDirectories: state => state.subjectDirectories.items,
    }),
  },
  data() {
    return {
      subjectDirectoryId: this.$route.params.id,
    };
  },
};
</script>
