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
    <template>
     {{ cardItem.openapidocument.info.title }}
    </template>
    <template slot="footer">
      <b-button
        variant="secondary"
        @click="onClose"
      >
        Close
      </b-button>
    </template>
  </Modal>
</template>
<script>
import Modal from '@/components/shared/modals/Modal';
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Modal,
    Icon,
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
    cardItem: {
      type: Object,
      required: false,
    },
  },
};
</script>