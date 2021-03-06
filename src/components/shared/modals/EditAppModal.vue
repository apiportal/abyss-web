<template>
  <Modal
    bodyClass="p-0"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalEditApp"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        {{ role === 'edit' ? 'Edit App' : 'Add New App' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div class="p-3">
          <b-row align-v="center">
            <b-col>
              <b-form-group
                id="appNameGroup"
                label="App Name*:"
                :invalid-feedback="appNameInvalidFeedback"
                :state="appNameState"
              >
                <b-form-input
                  id="appNameInput"
                  type="text"
                  v-model="appEditable.displayname"
                  placeholder="App Name"
                  :state="appNameState"
                  required
                >
                </b-form-input>
              </b-form-group>
              <b-form-group
                id="descriptionGroup"
                label="Description*:"
                :invalid-feedback="appDescriptionInvalidFeedback"
                :state="appDescriptionState"
              >
                <b-form-textarea
                  id="descriptionTextarea"
                  type="text"
                  v-model="appEditable.description"
                  placeholder="Description"
                  :state="appDescriptionState"
                  :rows="3"
                  required
                >
                </b-form-textarea>
              </b-form-group>
            </b-col>
            <b-col cols="auto">
              <div class="thumb-picture square bg-secondary" style="width: 200px;">
                <img
                  v-if="appEditable.picture"
                  :src="appEditable.picture"
                  :alt="appEditable.displayname"
                  style="width: 200px;"
                  v-b-tooltip.hover
                  title="Click to change picture"
                  @click="$refs.fileInput.click()"
                >
                <img
                  v-if="!appEditable.picture"
                  src="/static/avatar.png"
                  :alt="appEditable.displayname"
                  style="width: 200px;"
                  v-b-tooltip.hover
                  title="Click to change picture"
                  @click="$refs.fileInput.click()" />
                <input type="file" class="image-upload" ref="fileInput" @change="onFileSelected" accept="image/*"/>
              </div>
            </b-col>
          </b-row>
          <b-form-group id="appActiveGroup">
            <b-form-checkbox
              id="appActiveCheckbox"
              v-model="appEditable.isactivated"
              :value="true"
              :unchecked-value="false"
            >
              Is Active
            </b-form-checkbox>
          </b-form-group>
          <b-form-group
            id="appURLGroup"
            label="URL:"
          >
            <b-form-input
              id="appURLInput"
              type="text"
              v-model="appEditable.url"
              placeholder="URL"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group id="appSandboxGroup">
            <b-form-checkbox
              id="appSandboxCheckbox"
              v-model="appEditable.issandbox"
              :value="true"
              :unchecked-value="false"
            >
              Is Sandbox
            </b-form-checkbox>
          </b-form-group>
          <!-- <b-form-group
            id="organizationGroup"
            label="Organization*"
            label-for="organizationInput"
            :invalid-feedback="organizationInvalidFeedback"
            :state="organizationState"
          >
            <b-form-select
              id="organizationInput"
              v-model="appEditable.organizationid"
              :state="organizationState"
              :options="[
                {
                  value: null,
                  text: 'Please select',
                },
                ...organizations.map(item => ({
                  value: item.uuid,
                  text: item.name,
                })),
              ]"
            />
          </b-form-group> -->
          <b-form-group
            id="directoryGroup"
            label="Directory*"
            label-for="directoryInput"
            :invalid-feedback="directoryInvalidFeedback"
            :state="directoryState"
          >
            <b-form-select
              id="directoryInput"
              v-model="appEditable.subjectdirectoryid"
              :options="[
                {
                  value: null,
                  text: 'Please select',
                },
                ...subjectDirectories.map(item => ({
                  value: item.uuid,
                  text: item.directoryname,
                })),
              ]"
              :state="directoryState"
              required
            />
          </b-form-group>
        </div>
        <footer class="modal-footer">
          <b-button
            variant="link"
            @click="onClose"
            data-qa="btnCancel"
          >
            Cancel
          </b-button>
          <b-button
            variant="primary"
            type="submit"
            data-qa="btnSave"
          >
            Save
          </b-button>
        </footer>
      </b-form>
    </template>
  </Modal>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Modal from '@/components/shared/modals/Modal';

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
    onUpdate: {
      type: Function,
      required: true,
    },
    role: {
      type: String,
      required: false,
      default() { return 'edit'; },
    },
    app: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState({
      subjectDirectories: state => state.subjectDirectories.items,
      subjectDirectoryTypes: state => state.subjectDirectoryTypes.items,
      organizations: state => state.organizations.items,
    }),
    appNameState() {
      const { displayname } = this.appEditable;
      return displayname.length > 0;
    },
    appNameInvalidFeedback() {
      const { displayname } = this.appEditable;
      if (displayname.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    appDescriptionState() {
      const { description } = this.appEditable;
      return description.length > 0;
    },
    appDescriptionInvalidFeedback() {
      const { description } = this.appEditable;
      if (description.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    // organizationState() {
    //   const { organizationid } = this.appEditable;
    //   return organizationid !== null;
    // },
    // organizationInvalidFeedback() {
    //   const { organizationid } = this.appEditable;
    //   if (organizationid === null) {
    //     return 'Please select';
    //   }
    //   return '';
    // },
    directoryState() {
      const { subjectdirectoryid } = this.appEditable;
      return subjectdirectoryid !== null;
    },
    directoryInvalidFeedback() {
      const { subjectdirectoryid } = this.appEditable;
      if (subjectdirectoryid === null) {
        return 'Please select';
      }
      return '';
    },
  },
  data() {
    const { app } = this;

    return {
      appEditable: JSON.parse(JSON.stringify(app)),
    };
  },
  methods: {
    ...mapActions('userApps', ['putApps', 'postApps']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { appEditable, putApps, postApps, onUpdate, role } = this;
      const { description, url,
        effectivestartdate, effectiveenddate,
        email, picture, distinguishedname, uniqueid,
        phonebusiness, phoneextension, phonehome, phonemobile,
        jobtitle, department, company } = appEditable;
      let appToUpdate = {
        ...appEditable,
        description: (description === null ? '' : description),
        url: (url === null ? '' : url),
        picture: (picture === null ? '' : picture),
        distinguishedname: (distinguishedname === null ? '' : distinguishedname),
        uniqueid: (uniqueid === null ? '' : uniqueid),
        phonebusiness: (phonebusiness === null ? '' : phonebusiness),
        phoneextension: (phoneextension === null ? '' : phoneextension),
        phonehome: (phonehome === null ? '' : phonehome),
        phonemobile: (phonemobile === null ? '' : phonemobile),
        jobtitle: (jobtitle === null ? '' : jobtitle),
        department: (department === null ? '' : department),
        company: (company === null ? '' : company),
        effectivestartdate: (effectivestartdate === null ?
          this.$moment.utc().toISOString() : effectivestartdate),
        effectiveenddate: (effectiveenddate === null ? this.$moment.utc().add(50, 'years').toISOString() : effectiveenddate),
        secondaryemail: email,
      };
      if (role === 'edit') {
        putApps(appToUpdate).then(() => {
          onUpdate();
        });
      } else if (role === 'add') {
        appToUpdate = {
          ...appToUpdate,
          subjectname: appToUpdate.displayname.replace(/ /g, '').toLowerCase(),
          firstname: appToUpdate.displayname,
          lastname: appToUpdate.displayname,
        };
        postApps([appToUpdate]).then(() => {
          onUpdate();
        });
      }
    },
    onFileSelected(event) {
      event.preventDefault();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.appEditable.picture = reader.result;
      };
      reader.readAsDataURL(file);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>