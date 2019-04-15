<template>
  <Modal
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalAddNewApi"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        Add New API
      </h5>
    </template>
    <template>
      <div class="start-with-container" v-if="isMounted">
        <div class="start-with-option">
          <div class="start-with-option-header">
            <b-form-radio v-model="startWith" value="template">Open API 3.0 Template</b-form-radio>
          </div>
          <div class="start-with-option-content" v-if="startWith === 'template'">
            <b-button variant="primary">Start</b-button>
          </div>
        </div>
        <div class="start-with-option">
          <div class="start-with-option-header">
            <b-form-radio v-model="startWith" value="upload">Upload File</b-form-radio>
          </div>
          <div class="start-with-option-content" v-if="startWith === 'upload'">
            <Dropzone
              :options="dropzoneOptions"
            />
          </div>
        </div>
        <div class="start-with-option">
          <div class="start-with-option-header">
            <b-form-radio v-model="startWith" value="url">Upload from URL </b-form-radio>
          </div>
          <div class="start-with-option-content" v-if="startWith === 'url'">
            <b-form @submit="handleSubmitStartWithURL">
              <b-input-group prepend="URL:">
                <b-form-input v-model="form.url" type="url"></b-form-input>
                <b-input-group-append>
                  <b-button variant="primary" type="submit">Start</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/shared/modals/Modal';
import Dropzone from '@/components/shared/Dropzone';

export default {
  components: {
    Modal,
    Dropzone,
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
      default() { return 'lg'; },
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isMounted: false,
      startWith: 'template',
      form: {
        url: '',
      },
      dropzoneOptions: {
        url: 'https://dev.apiportal.com:11080/post',
        method: 'post',
        uploadMultiple: false,
        maxFiles: 1,
        parallelUploads: 1,
        thumbnailWidth: 260,
        thumbnailHeight: 146,
        maxFilesize: 0.5,
        addRemoveLinks: true,
        acceptedFiles: '.txt, .json, .yaml, .wsdl, .wadl',
      },
    };
  },
  methods: {
    handleSubmitStartWithURL() {
      const { url } = this.form;
      console.log(url); // eslint-disable-line
    },
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style lang="scss">
.start-with-container {
  border: 1px solid silver;
  border-radius: .3rem;

  .start-with-option {
    border-bottom: 1px solid silver;

    &:last-child {
      border-bottom: 0;
    }

    .start-with-option-header {
      padding: .5rem 1rem;
    }

    .start-with-option-content {
      padding: 1rem;
      border-top: 1px solid silver;
    }
  }
}
</style>
