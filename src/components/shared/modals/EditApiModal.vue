<template>
  <Modal
    dialogClass="modal-xl"
    bodyClass="edit-my-api"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
  >
    <template slot="header">
      <h5 class="modal-title">
        {{ role === 'edit' ? 'Edit Api' : 'Add New Api' }}
      </h5>
    </template>
    <template>
      <ApiDesigner
        :api="api"
        :height="700"
        title='Edit API'
      />
    </template>
    <template slot="footer">
      <b-button
        variant="link"
        @click="onClose"
      >
        Cancel
      </b-button>
      <b-button
        variant="primary"
        @click="onUpdate"
      >
        <Icon icon="save" /> Save
      </b-button>
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
      default() { return false; },
    },
    noCloseOnBackdrop: {
      type: Boolean,
      required: false,
      default() { return true; },
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
  methods: {
    handleSubmit(evt) {
      evt.preventDefault();
      console.log('submitted'); // eslint-disable-line
    },
  },
};
</script>

<style lang="scss">
.modal-body {
  &.edit-my-api {
    padding: 0;
  }
}
</style>
