<template>
  <Modal
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">Legal Agreement</h5>
    </template>
    <template>
      <p v-html="modifiedText" style="text-align: justify"></p>
    </template>
    <template slot="footer">
      <b-button
        variant="primary"
        @click="onConfirm"
        data-qa ="btnConfirm"
      >
        OK
      </b-button>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/shared/modals/Modal';

export default {
  components: {
    Modal,
  },
  computed: {
    modifiedText() {
      const { documentText } = this.item.licensedocument.legal;
      return documentText
        .replace(/(\\r)*\\n/g, '<br>')
        .replace(/(https?:\/\/[^\s]+)/g, url => `<a href="${url}" target="_blank">${url}</a>`);
    },
  },
  props: {
    hideHeader: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    hideFooter: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    noCloseOnBackdrop: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    noCloseOnEsc: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    hideHeaderClose: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    size: {
      type: String,
      required: false,
      default() { return 'md'; },
    },
    onClose: {
      type: Function,
      required: false,
    },
    onConfirm: {
      type: Function,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>