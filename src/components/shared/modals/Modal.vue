<template>
  <b-modal
    :size="size"
    :hide-header="hideHeader"
    :hide-footer="hideFooter"
    :no-close-on-backdrop="noCloseOnBackdrop"
    :no-close-on-esc="noCloseOnEsc"
    :hide-header-close="hideHeaderClose"
    :body-class="bodyClass"
    v-model="isModalVisible"
    @hide="handleClose"
  >
    <div slot="modal-header">
      <header>
        <slot name="header"></slot>
      </header>
    </div>
    <div>
      <main>
        <slot></slot>
      </main>
    </div>
    <div slot="modal-footer" class="w-100">
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    bodyClass: {
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