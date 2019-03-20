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
      <h5 class="modal-title">{{ title }}</h5>
    </template>
    <template>
      <p v-html="withBrTags" style="text-align: justify"></p>
    </template>
    <template slot="footer">
      <b-button 
        class="float-right" 
        variant="primary" 
        size="sm" 
        @click="onConfirm"
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
    withBrTags() {
      const doc = this.text;
      return doc.replace(/(\\r)*\\n/g, '<br>');
    },
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
  },
};
</script>