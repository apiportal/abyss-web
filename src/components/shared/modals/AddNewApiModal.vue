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
      <div class="row flex-column" v-if="isMounted">

        <div class="col">
          <b-form-group
            id="apiNameGroup"
            label="API Name*:"
            :invalid-feedback="apiNameInvalidFeedback"
            :state="apiNameState"
            class="position-relative"
          >
            <b-form-input
              id="apiNameInput"
              type="text"
              v-if="oas.info"
              v-model="oas.info.title"
              placeholder="API Name"
              :state="apiNameState"
              class="position-absolute"
              required
            >
            </b-form-input>
            <input type="text" class="form-control" disabled="">
          </b-form-group>
        </div>

        <div class="col p-0">
          <div class="p-3 border-bottom">
            <b-form-radio v-model="startWith" value="template" @change="handleChange">Open API 3.0 Petstore Template</b-form-radio>
          </div>
        </div>
        <div class="col p-0">
          <div class="p-3 border-bottom">
            <b-form-radio v-model="startWith" value="upload" @change="handleChange">Upload File</b-form-radio>
          </div>
          <div class="p-3 border-bottom"" v-if="startWith === 'upload'">
            <input type="file" id="text-upload" ref="fileInput" @change="onFileSelected" accept="text/*, .txt, .json, .yaml, .wsdl, .wadl">
          </div>
        </div>
        <div class="col p-0">
          <div class="p-3">
            <b-form-radio v-model="startWith" value="url" @change="handleChange">Upload from URL </b-form-radio>
          </div>
          <div class="p-3 border-top"" v-if="startWith === 'url'">
            <b-form @submit="handleSubmitStartWithURL">
              <b-input-group prepend="URL:">
                <b-form-input v-model="url" type="url"></b-form-input>
                <b-input-group-append>
                  <b-button variant="primary" type="submit">Start</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form>
          </div>
        </div>
        <!-- <textarea class="w-100" rows="5">{{oas}}</textarea>
        <textarea class="w-100" rows="5">{{templateObject}}</textarea>
        <textarea class="w-100" rows="10">{{apiToAdd}}</textarea> -->
      </div>

      <b-alert class="alert-vivid alert-t-r" v-model="alert.show" :variant="alert.variant" dismissible>
        <h5>{{ alert.title }}</h5>
        {{ alert.message }}
      </b-alert>
    </template>
    <template slot="footer">
      <b-button
        variant="secondary"
        @click="onClose"
        data-qa="btnCancel"
      >
        Cancel
      </b-button>
      <b-button variant="primary" @click="handleStart">Start</b-button>
    </template>
  </Modal>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import api from '@/api';
import yaml from 'js-yaml';
import Modal from '@/components/shared/modals/Modal';
import Pet3 from '@/assets/pet3.json';

export default {
  components: {
    Modal,
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
      default() { return 'lg'; },
    },
    onClose: {
      type: Function,
      required: true,
    },
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    apiNameState() {
      if (this.validateName) {
        const { title } = this.oas.info;
        return title.length > 0;
      }
      return true;
    },
    apiNameInvalidFeedback() {
      if (this.validateName) {
        const { title } = this.oas.info;
        if (title.length === 0) {
          return 'Please enter something';
        }
        return '';
      }
      return '';
    },
    apiToAdd() {
      return {
        openapidocument: this.oas,
        apioriginid: '2741ce5d-0fcb-4de3-a517-405c0ceffbbe',
        apiparentid: '2741ce5d-0fcb-4de3-a517-405c0ceffbbe',
        apistateid: 'dccb1796-9338-4ae8-a0d9-02654d1e2c6d',
        apivisibilityid: '043d4827-cff4-43f9-9d5b-782d1f83b3f0',
        changelog: '',
        color: '#006699',
        crudsubjectid: this.currentUser.uuid,
        deployed: this.$moment.utc().toISOString(),
        extendeddocument: {},
        image: '',
        isdefaultversion: true,
        islatestversion: true,
        islive: false,
        issandbox: true,
        isproxyapi: false,
        languageformat: 1,
        languagename: 'OpenAPI',
        languageversion: '3.0.0',
        organizationid: this.currentUser.organizationid,
        originaldocument: 'openapi: 3.0.0↵servers:↵  - description: SwaggerHu',
        subjectid: this.currentUser.uuid,
        version: '1.0.0',
      };
    },
  },
  data() {
    return {
      isMounted: false,
      validateName: true,
      templateObject: JSON.parse(JSON.stringify(Pet3)),
      oas: JSON.parse(JSON.stringify(Pet3)),
      startWith: 'template',
      url: null,
      alert: {
        show: false,
        title: '',
        message: '',
        variant: 'danger',
      },
      miniOas: {
        info: {
          title: 'API',
          version: '1.0.0',
        },
        paths: {},
        openapi: '3.0.0',
      },
    };
  },
  methods: {
    ...mapActions('businessApis', ['postBusinessApis']),
    ...mapActions('resources', ['postResources']),
    ...mapActions('permissions', ['postPermissions']),
    handleChange(val) {
      if (val === 'template') {
        this.oas = JSON.parse(JSON.stringify(Pet3));
      }
    },
    handleSubmitStartWithURL() {
      api.getExternalData(this.url).then((response) => {
        if (response && response.data) {
          this.templateObject = JSON.stringify(response.data, null, '\t');
          this.loadSchema();
        }
      })
      .catch((error) => {
        this.showAlert(error);
      });
    },
    onFileSelected(event) {
      event.preventDefault();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.templateObject = reader.result;
        this.loadSchema();
      };
      reader.readAsText(file);
    },
    showAlert(title, text, variant) {
      this.alert.show = true;
      this.alert.title = title;
      this.alert.message = text;
      this.alert.variant = variant;
      // setTimeout(() => {
      //   this.alert.show = false;
      //   this.alert.message = text;
      //   this.alert.variant = 'danger';
      // }, 3000);
    },
    loadSchema() {
      this.validateName = false;
      this.oas = {};
      let text = ''; // eslint-disable-line
      try {
        this.oas = JSON.parse(this.templateObject);
        // this.showAlert('JSON definition parsed successfully', 'success');
        text = 'JSON definition parsed successfully';
      } catch (e) {
        try {
          this.oas = yaml.safeLoad(this.templateObject, { json: true });
          // this.showAlert('YAML definition parsed successfully', 'success');
          text = 'YAML definition parsed successfully';
        } catch (ex) {
          this.showAlert('Error', 'The definition could not be parsed', 'danger');
        }
      }
      if (this.oas.openapi && this.oas.openapi.startsWith('3.0.')) {
        this.showAlert('Success1', text, 'success');
        this.validateName = true;
      } else if (this.oas.swagger && this.oas.swagger === '2.0') {
        api.swaggerToOas(this.oas).then((response) => {
          if (response && response.data) {
            // this.showAlert('Definition successfully converted', 'success');
            text = 'Definition successfully converted';
            this.showAlert('Success2', text, 'success');
            this.validateName = true;
          }
        })
        .catch((error) => {
          this.showAlert('Error', error, 'danger');
        });
      } else {
        this.showAlert('Error', 'OpenAPI version must be 2.0 or 3.0.x', 'warning');
      }
    },
    handleStart() {
      this.$store.commit('apis/setTemporaryApi', this.apiToAdd);
      this.$router.push(`${this.routePath}/edit-api/new-api`);
    },
  },
  mounted() {
    this.isMounted = true;
    this.$store.commit('apis/setTemporaryApi', null);
  },
};
</script>
