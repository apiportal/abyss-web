<template>
  <div>
    <ConfirmModal
      v-if="isAccessManagerTypesLoaded"
      title="Are you sure?"
      :text="`${accessManagerType.typename} will be deleted. You can't revert your action.`"
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
    ...mapActions('accessManagerTypes', ['deleteAccessManagerTypes']),
    handleModalClose() {
      this.$router.push(`/app/access-manager-types/${this.page}`);
    },
    handleModalConfirm() {
      const { deleteAccessManagerTypes, accessManagerType } = this;
      deleteAccessManagerTypes({ ...accessManagerType }).then(() => {
        this.$router.push(`/app/access-manager-types/${this.page}`);
      });
    },
  },
  computed: {
    ...mapState({
      accessManagerTypes: state => state.accessManagerTypes.items,
      isAccessManagerTypesLoaded: state => state.accessManagerTypes.lastUpdatedAt,
    }),
    accessManagerType() {
      const { accessManagerTypeId, accessManagerTypes } = this;
      return accessManagerTypes.find(item => item.uuid === accessManagerTypeId);
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
