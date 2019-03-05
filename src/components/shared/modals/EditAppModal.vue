<template>
  <Modal
    bodyClass="edit-my-app"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
  >
    <template slot="header">
      <h5 class="modal-title">
        {{ role === 'edit' ? 'Edit App' : 'Add New App' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group
            id="appNameGroup"
            label="App Name*:"
            :invalid-feedback="appNameInvalidFeedback"
            :state="appNameState"
          >
            <b-form-input
              id="appNameInput"
              type="text"
              v-model="appEditable.subjectname"
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
          <b-form-group
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
          </b-form-group>
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
              :state="directoryState"
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
            />
          </b-form-group>
        </div>
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
      const { subjectname } = this.appEditable;
      return subjectname.length > 0;
    },
    appNameInvalidFeedback() {
      const { subjectname } = this.appEditable;
      if (subjectname.length === 0) {
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
    organizationState() {
      const { organizationid } = this.appEditable;
      return organizationid !== null;
    },
    organizationInvalidFeedback() {
      const { organizationid } = this.appEditable;
      if (organizationid === null) {
        return 'Please select';
      }
      return '';
    },
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
    ...mapActions('apps', ['putApps', 'postApps']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { appEditable, putApps, postApps, onUpdate, role } = this;

      if (role === 'edit') {
        putApps(appEditable).then(() => {
          onUpdate();
        });
      } else if (role === 'add') {
        const appToAdd = {
          ...appEditable,
          displayname: appEditable.subjectname,
          firstname: appEditable.subjectname,
          lastname: appEditable.subjectname,
        };
        postApps([appToAdd]).then(() => {
          onUpdate();
        });
      }
    },
  },
};
</script>

<style lang="scss">
.modal-body {
  &.edit-my-app {
    padding: 0;
  }
}
</style>