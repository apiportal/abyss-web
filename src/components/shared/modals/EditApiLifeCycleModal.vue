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
    data-qa="modalEditProxyApiLifeCycle"
  >
    <template slot="header">
      <h5 class="modal-title">
        Change API Lifecycle
      </h5>
    </template>
    <template>
      <LifeCycle
        role="proxyApi"
        :currentApiState="computedApiState"
        @clicked="onClickLifeCycle"
      />
      <b-form
        @submit="handleSubmit"
      >
        <footer class="modal-footer">
          <b-button
            variant="link"
            @click="onClose"
          >
            Cancel
          </b-button>
          <b-button
            variant="primary"
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
import api from '@/api';
import Modal from '@/components/shared/modals/Modal';
import LifeCycle from '@/components/shared/LifeCycle';
import { mapState, mapActions } from 'vuex';

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
      apiNextState: state => state.proxies.nextStateId,
    }),
    computedApiState() {
      const { proxy, apiStates } = this;
      return apiStates.find(item => item.uuid === proxy.apistateid);
    },
  },
  data() {
    return {
      readNewState: '',
    };
  },
  methods: {
    ...mapActions('lifecycle', ['putLifecycle']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { proxy, onUpdate, apiNextState } = this;
      const lifecycleToUpdate = {
        currentstateid: proxy.apistateid,
        nextstateid: apiNextState,
      };
      api.putLifecycle(proxy.uuid, lifecycleToUpdate).then((response) => {
        if (response && response.data) {
          onUpdate();
        }
      });
    },
    onClickLifeCycle(value) {
      this.readNewState = value;
    },
  },
};
</script>