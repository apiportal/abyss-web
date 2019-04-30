<template>
  <Modal
    bodyClass="p-0"
    :scrollable="false"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalEditApiLifeCycle"
  >
    <template slot="header">
      <h5 class="modal-title">
        Edit API Lifecycle
      </h5>
    </template>
    <template>
      <LifeCycle
        :currentApiState="computedApiState"
      />
      <b-form
        @submit="handleSubmit"
      >
        <footer class="modal-footer">
          <b-button
            variant="secondary"
            @click="onClose"
          >
            Cancel
          </b-button>
          <b-button
            variant="success"
            type="submit"
          >
            Save
          </b-button>
        </footer>
      </b-form>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/shared/modals/Modal';
import LifeCycle from '@/components/shared/LifeCycle';
import { mapState } from 'vuex';

export default {
  components: {
    Modal,
    LifeCycle,
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
      default() { return true; },
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
    onUpdate: {
      type: Function,
      required: true,
    },
    proxy: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState({
      apiStates: state => state.apiStates.items,
    }),
    computedApiState() {
      const { proxy, apiStates } = this;
      return apiStates.find(item => item.uuid === proxy.apistateid);
    },
  },
  methods: {
    handleSubmit(evt) {
      evt.preventDefault();
    },
  },
};
</script>