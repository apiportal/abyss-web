<template>
  <Modal
    bodyClass="p-0"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    size="xxl"
    :onClose="onClose"
    data-qa="modalEditApiModal"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        {{ role === 'edit' ? 'Edit Api' : 'Add New Api' }}
      </h5>
    </template>
    <template>
      <ApiDesigner
        :api="api"
        :title="api.openapidocument.info.title"
        :onClose="onClose"
        :role="role"
        :onUpdate="onUpdate"
      />
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/shared/modals/Modal';
import ApiDesigner from '@/components/shared/apiDesigner/ApiDesigner';
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Modal,
    ApiDesigner,
    Icon,
  },
  props: {
    hideHeader: {
      type: Boolean,
      required: false,
      default() { return true; },
    },
    hideFooter: {
      type: Boolean,
      required: false,
      default() { return true; },
    },
    noCloseOnBackdrop: {
      type: Boolean,
      required: false,
      default() { return true; },
    },
    noCloseOnEsc: {
      type: Boolean,
      required: false,
      default() { return true; },
    },
    hideHeaderClose: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    size: {
      type: String,
      required: false,
      default() { return 'lg'; },
    },
    onClose: {
      type: Function,
      required: true,
    },
    onUpdate: {
      type: Function,
      required: true,
    },
    role: {
      type: String,
      required: false,
      default() { return 'edit'; },
    },
    api: {
      type: Object,
      required: false,
      default() { return {}; },
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
