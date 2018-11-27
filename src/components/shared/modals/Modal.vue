<template>
  <b-modal
    :size="size"
    :hide-header="hideHeader"
    :hide-footer="hideFooter"
    :no-close-on-backdrop="noCloseOnBackdrop"
    :no-close-on-esc="noCloseOnEsc"
    :hide-header-close="hideHeaderClose"
    v-model="isModalVisible"
    @hide="handleClose"
  >
    <div slot="modal-header" class="w-100">
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