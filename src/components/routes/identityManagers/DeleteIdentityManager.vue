<template>
  <div>
    <ConfirmModal
      v-if="isSubjectDirectoriesLoaded"
      title="Are you sure?"
      :text="`${subjectDirectory.directoryname} will be deleted. You can't revert your action.`"
      :onClose="handleModalClose"
      :onConfirm="handleModalConfirm"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ConfirmModal from '@/components/shared/modals/ConfirmModal';

export default {
  components: {
    ConfirmModal,
  },
  methods: {
    ...mapActions('subjectDirectories', ['deleteSubjectDirectories']),
    handleModalClose() {
      this.$router.push(`/app/identity-managers/${this.page}`);
    },
    handleModalConfirm() {
      const { deleteSubjectDirectories, subjectDirectory } = this;
      deleteSubjectDirectories({ ...subjectDirectory }).then(() => {
        this.$router.push(`/app/identity-managers/${this.page}`);
      });
    },
  },
  computed: {
    ...mapState({
      subjectDirectories: state => state.subjectDirectories.items,
      isSubjectDirectoriesLoaded: state => state.subjectDirectories.lastUpdatedAt,
    }),
    subjectDirectory() {
      const { subjectDirectoryId, subjectDirectories } = this;
      return subjectDirectories.find(item => item.uuid === subjectDirectoryId);
    },
  },
  data() {
    return {
      subjectDirectoryId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
