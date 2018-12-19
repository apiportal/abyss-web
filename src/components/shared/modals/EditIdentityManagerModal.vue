<template>
  <Modal
    bodyClass="edit-identity-manager"
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
        Edit Identity Manager
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="directoryNameGroup"
            label="Name:"
            label-for="directoryNameInput"
          >
            <b-form-input
              id="directoryNameInput"
              type="text"
              v-model="subjectDirectoryEditable.directoryname"
              placeholder="Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="directoryDescriptionGroup"
            label="Description:"
            label-for="directoryDescriptionTextarea"
          >
            <b-form-textarea
              id="directoryDescriptionTextarea"
              v-model="subjectDirectoryEditable.description"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group 
            id="directoryPriorityOrderGroup"
            label="Priority Order:"
            label-for="directoryPriorityOrderInput"
          >
            <b-form-input
              id="directoryPriorityOrderInput"
              type="number"
              v-model="subjectDirectoryEditable.directorypriorityorder"
              placeholder="Priority Order"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group id="directoryEnabledGroup">
            <b-form-checkbox
              id="directoryEnabledChecks"
              v-model="subjectDirectoryEditable.isactive"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
          </b-form-group>
          <b-form-group id="directoryTemplateGroup">
            <b-form-checkbox
              id="directoryTemplateCheck"
              v-model="subjectDirectoryEditable.istemplate"
              :value="true"
              :unchecked-value="false"
            >
              Template
            </b-form-checkbox>
          </b-form-group>
          <b-form-group 
            id="directoryOrganizationIdGroup"
            label="Organization Id:"
            label-for="directoryOrganizationIdInput"
          >
            <b-form-select
              id="directoryOrganizationIdInput"
              v-model="subjectDirectoryEditable.organizationid" 
              :options="organizations.map(organization => ({
                value: organization.uuid,
                text: organization.name,
              }))"
            />
          </b-form-group>
          <b-form-group 
            id="directoryTypeGroup"
            label="Directory Type:"
            label-for="directoryTypeInput"
          >
            <b-form-select
              id="directoryTypeInput"
              v-model="subjectDirectoryEditable.directorytypeid" 
              :options="subjectDirectoryTypes.map(subjectDirectoryType => ({
                value: subjectDirectoryType.uuid,
                text: subjectDirectoryType.typename,
              }))"
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
import { mapActions } from 'vuex';
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
    subjectDirectory: {
      type: Object,
      required: false,
    },
    subjectDirectoryTypes: {
      type: Array,
      required: false,
      default() { return []; },
    },
    organizations: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
  data() {
    return {
      subjectDirectoryEditable: JSON.parse(JSON.stringify(this.subjectDirectory)),
    };
  },
  methods: {
    ...mapActions('subjectDirectories', ['putSubjectDirectories']),
    handleSubmit(evt) {
      evt.preventDefault();
      this.putSubjectDirectories(this.subjectDirectoryEditable);
      this.onUpdate();
    },
  },
};
</script>

<style lang="scss">
.modal-body {
  &.edit-identity-manager {
    padding: 0;
  }
}
</style>