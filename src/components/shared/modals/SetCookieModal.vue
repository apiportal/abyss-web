<template>
  <Modal
    bodyClass="p-0"
    :hideHeader="false"
    :hideFooter="true"
    :noCloseOnBackdrop="true"
    :noCloseOnEsc="true"
    :hideHeaderClose="true"
    size="lg"
    :onClose="onClose"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        Set Cookie
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div class="p-3">
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
              placeholder="abyss.principal.uuid=32c9c734-11cb-44c9-b06f-0b52e076672d;"
              :state="cookieState"
              required
            >
            </b-form-input>
          </b-form-group>
        </div>
        <footer class="modal-footer">
          <b-button
            variant="primary"
            type="submit"
            data-qa ="btnSubmit"
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

<style lang="scss" scoped>
</style>
