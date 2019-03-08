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
      <div>{{ text }}</div>
    </template>
    <template slot="footer">
      <b-button
        variant="secondary"
        @click="onClose"
      >
        Cancel
      </b-button>
      <b-button
        variant="primary"
        @click="onConfirm"
      >
        {{ confirm }}
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
      required: true,
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
    confirm: {
      type: String,
      required: false,
      default() { return 'Delete'; },
    },
  },
};
</script>