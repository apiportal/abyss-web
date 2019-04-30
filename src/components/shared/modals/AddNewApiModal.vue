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
            <b-button variant="primary" @click="handleStartWithTemplate">Start</b-button>
          </div>
        </div>
        <div class="start-with-option">
          <div class="start-with-option-header">
            <b-form-radio v-model="startWith" value="upload" :disabled="true">Upload File</b-form-radio>
          </div>
          <div class="start-with-option-content" v-if="startWith === 'upload'">
            <!-- <Dropzone
              :options="dropzoneOptions"
            /> -->
          </div>
        </div>
        <div class="start-with-option">
          <div class="start-with-option-header">
            <b-form-radio v-model="startWith" value="url" :disabled="true">Upload from URL </b-form-radio>
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
import { mapState, mapActions } from 'vuex';
import moment from 'moment-timezone';
import Modal from '@/components/shared/modals/Modal';
// import Dropzone from '@/components/shared/Dropzone';
import Pet3 from '@/assets/pet3.json';

export default {
  components: {
    Modal,
    // Dropzone,
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
  computed: {
    ...mapState({
      currentUser: state => state.user,
      apiStates: state => state.apiStates.items,
      visibilityTypes: state => state.apiVisibilityTypes.items,
    }),
  },
  data() {
    return {
      isMounted: false,
      templateObject: Pet3,
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
    ...mapActions('apis', ['postApis']),
    ...mapActions('resources', ['postResources']),
    ...mapActions('permissions', ['postPermissions']),
    handleSubmitStartWithURL() {
      const { url } = this.form;
      console.log(url); // eslint-disable-line
    },
    handleStartWithTemplate() {
      const now = new Date();
      const { templateObject, postApis, postResources, postPermissions, currentUser } = this;
      const { organizationid, uuid } = currentUser;
      const { apiStates, visibilityTypes } = this;
      const apistate = apiStates.find(item => item.name === 'Draft');
      const visibilityType = visibilityTypes.find(item => item.name === 'Private');
      const api = {
        apioriginid: '2741ce5d-0fcb-4de3-a517-405c0ceffbbe',
        apiparentid: '2741ce5d-0fcb-4de3-a517-405c0ceffbbe',
        apistateid: apistate.uuid,
        apivisibilityid: visibilityType.uuid,
        changelog: '',
        color: '#006699',
        crudsubjectid: uuid,
        deployed: moment(now),
        extendeddocument: {},
        image: '',
        isdefaultversion: true,
        islatestversion: true,
        islive: false,
        isproxyapi: false,
        issandbox: false,
        languageformat: 1,
        languagename: 'OpenAPI',
        languageversion: '3.0.0',
        openapidocument: templateObject,
        organizationid,
        originaldocument: 'openapi: 3.0.0↵servers:↵  - description: SwaggerHu',
        subjectid: uuid,
        version: '1.0.0',
      };
      postApis([api]).then((response) => {
        if (response && response.data) {
          const createdApi = response.data[0].response;
          /* // !!! replace after cascade
          this.$store.dispatch('businessApis/getBusinessApis', {
            uuid: currentUser.uuid,
            refresh: true,
          });
          this.$router.push(`/app/my-apis/businesses/1/edit-api/${createdApi.uuid}`);
          // !!! */
          const resourceToAdd = [{
            organizationid: createdApi.organizationid,
            crudsubjectid: createdApi.crudsubjectid,
            resourcetypeid: 'e2c446ad-f947-4a56-aed4-397534376aeb',
            resourcename: `${createdApi.openapidocument.info.title} ${createdApi.openapidocument.info.version} BUSINESS API`,
            description: createdApi.openapidocument.info.description,
            resourcerefid: createdApi.uuid,
            isactive: true,
          }];
          postResources(resourceToAdd).then((responseResource) => {
            if (responseResource && responseResource.data) {
              const createdResource = responseResource.data[0].response;
              const permissionToAdd = [{
                organizationid: createdApi.organizationid,
                crudsubjectid: createdApi.crudsubjectid,
                permission: `Ownership of ${createdApi.openapidocument.info.title} BUSINESS API by ${currentUser.props.displayname}`,
                description: `Ownership of ${createdApi.openapidocument.info.title} BUSINESS API by ${currentUser.props.displayname}`,
                effectivestartdate: this.$moment.utc().toISOString(),
                effectiveenddate: this.$moment.utc().add(50, 'years').toISOString(),
                subjectid: createdApi.subjectid,
                resourceid: createdResource.uuid,
                resourceactionid: 'be55e687-8495-481f-a953-b450bb185f17', // ALL_BUSINESS_API_ACTION
                accessmanagerid: '6223ebbe-b30f-4976-bcf9-364003142379', // Abyss Access Manager
                isactive: true,
              }];
              postPermissions(permissionToAdd).then((responsePermission) => {
                if (responsePermission && responsePermission.data) {
                  this.$store.dispatch('businessApis/getBusinessApis', {
                    uuid: currentUser.uuid,
                    refresh: true,
                  });
                  this.$router.push(`/app/my-apis/businesses/1/edit-api/${createdApi.uuid}`);
                }
              });
            }
          });
          // !!!
        }
      });
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
