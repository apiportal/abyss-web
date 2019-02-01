<template>
  <div>
    <ConfirmModal
      v-if="isSubjectDirectoryTypesLoaded"
      title="Are you sure?"
      :text="`${subjectDirectoryType.typename} will be deleted. You can't revert your action.`"
      :onClose="handleModalClose"
      :onConfirm="handleModalConfirm"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConfirmModal from '@/components/shared/modals/ConfirmModal';

export default {
  components: {
    ConfirmModal,
  },
  methods: {
    handleModalClose() {
      this.$router.push(`/app/identity-manager-types/${this.page}`);
    },
    handleModalConfirm() {
      this.$router.push(`/app/identity-manager-types/${this.page}`);
    },
  },
  computed: {
    ...mapState({
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      isSubjectDirectoryTypesLoaded: state => state.subjectDirectoryTypes.lastUpdatedAt,
    }),
    subjectDirectoryType() {
      const { subjectDirectoryTypeId, subjectDirectoryTypes } = this;
      return subjectDirectoryTypes.find(item => item.uuid === subjectDirectoryTypeId);
    },
  },
  data() {
    return {
      subjectDirectoryTypeId: this.$route.params.id,
      page: this.$route.params.page,
    };
  },
};
</script>
