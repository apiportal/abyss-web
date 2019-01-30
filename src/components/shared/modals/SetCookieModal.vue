<template>
  <Modal
    bodyClass="set-token"
    :hideHeader="false"
    :hideFooter="true"
    :noCloseOnBackdrop="true"
    :noCloseOnEsc="true"
    :hideHeaderClose="true"
    size="lg"
    :onClose="onClose"
  >
    <template slot="header">
      <h5 class="modal-title">
        Set Cookie
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <p>Currently, you don't have a valid token.</p>
          <b-form-group 
            id="cookieGroup"
            label="Cookie:"
            label-for="cookieInput"
            :invalid-feedback="cookieInvalidFeedback"
            :state="cookieState"
          >
            <b-form-input
              id="cookieInput"
              type="text"
              v-model="cookie"
              placeholder="Cookie"
              :state="cookieState"
              required
            >
            </b-form-input>
          </b-form-group>
        </div>
        <footer class="modal-footer">
          <b-button
            variant="success"
            type="submit"
          >
            Set Cookie
          </b-button>
        </footer>
      </b-form>
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
    cookieState() {
      const { cookie } = this;
      return cookie.length > 0;
    },
    cookieInvalidFeedback() {
      const { cookie } = this;
      if (cookie.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
  },
  data() {
    return {
      cookie: '',
    };
  },
  methods: {
    handleSubmit() {
      const { cookie } = this;
      document.cookie = cookie;
      setTimeout(() => { location.reload(); }, 500);
    },
    onClose(evt) {
      evt.preventDefault();
    },
  },
};
</script>

<style lang="scss">
.modal-body {
  &.set-token {
    padding: 0;
  }
}
</style>
