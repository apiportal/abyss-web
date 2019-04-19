<template>
  <b-modal
    :size="size"
    :scrollable="scrollable"
    :hide-header="hideHeader"
    :hide-footer="hideFooter"
    :no-close-on-backdrop="noCloseOnBackdrop"
    :no-close-on-esc="noCloseOnEsc"
    :hide-header-close="hideHeaderClose"
    :modal-class="modalClass"
    :dialog-class="dialogClass"
    :body-class="bodyClass"
    :header-class="headerClass"
    :footer-class="footerClass"
    v-model="isModalVisible"
    @hide="handleClose"
  >
    <div class="d-flex w-100 align--items-center" slot="modal-header">
      <slot name="header"></slot>
      <button type="button" aria-label="Close" v-if="!hideHeaderClose" class="close align-items-center d-flex justify-content-center" @click="onClose" data-qa="btnClose">×</button>
    </div>
    <div>
      <main>
        <slot></slot>
      </main>
    </div>
    <div slot="modal-footer">
      <slot name="footer"></slot>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    scrollable: {
      type: Boolean,
      required: false,
      default() { return true; },
    },
    modalClass: {
      type: [Array, String],
      required: false,
      default() { return ''; },
    },
    dialogClass: {
      type: [Array, String],
      required: false,
      default() { return ''; },
    },
    bodyClass: {
      type: [Array, String],
      required: false,
      default() { return ''; },
    },
    headerClass: {
      type: [Array, String],
      required: false,
      default() { return ''; },
    },
    footerClass: {
      type: [Array, String],
      required: false,
      default() { return ''; },
    },
    hideHeader: {
      type: Boolean,
      required: true,
    },
    hideFooter: {
      type: Boolean,
      required: true,
    },
    noCloseOnBackdrop: {
      type: Boolean,
      required: true,
    },
    noCloseOnEsc: {
      type: Boolean,
      required: true,
    },
    hideHeaderClose: {
      type: Boolean,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isModalVisible: true,
    };
  },
  methods: {
    handleClose(evt) {
      evt.preventDefault();
      this.onClose();
    },
  },
};
</script>

<style lang="scss">
.modal-xl {
  @media (min-width: 992px) {
    max-width: 1200px;
  }
}

.modal-xxl {
  @media (min-width: 992px) {
    max-width: 1800px;
  }
}
</style>