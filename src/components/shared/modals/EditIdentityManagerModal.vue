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
      {{ subjectDirectoryEditable }}
    </template>
    <template slot="footer">
      footer actions
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
      required: true,
    },
    subjectDirectory: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      subjectDirectoryEditable: JSON.parse(JSON.stringify(this.subjectDirectory)),
    };
  },
  mounted() {
    console.log(this.subjectDirectory);
  },
};
</script>