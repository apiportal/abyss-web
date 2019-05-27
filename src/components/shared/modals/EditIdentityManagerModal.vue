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
    data-qa="modalEditIdentityManager"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        {{ role === 'edit' ? 'Edit Identity Manager' : 'Add New Identity Manager' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group
            id="directoryNameGroup"
          >
            <label>
              Name:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              id="directoryNameInput"
              type="text"
              v-model="subjectDirectoryEditable.directoryname"
              :state="directoryNameState"
              placeholder="Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="directoryDescriptionGroup"
          >
            <label>
              Description:
              <span class="text-danger">*</span>
            </label>
            <b-form-textarea
              id="directoryDescriptionTextarea"
              v-model="subjectDirectoryEditable.description"
              :state="descriptionState"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group
            id="directoryPriorityOrderGroup"
          >
            <label>
              Priority Order:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              id="directoryPriorityOrderInput"
              type="number"
              v-model="subjectDirectoryEditable.directorypriorityorder"
              :state="directoryPriorityOrderState"
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
          >
            <label>
              Organization:
              <span class="text-danger">*</span>
            </label>
            <b-form-select
              id="directoryOrganizationIdInput"
              v-model="subjectDirectoryEditable.organizationid"
              :state="directoryOrganizationIdState"
              :options="[
                { value: null, text: 'Please Select'},
                ...organizations.map(organization => ({
                  value: organization.uuid,
                  text: organization.name,
                  disabled: organization.isdeleted,
                }))
              ]"
              required
            />
          </b-form-group>
          <div class="row">
            <div class="col-12">
              <label for="directoryTypeInput">Directory Type: <span class="text-danger">*</span></label>
            </div>
            <div class="col-10">
              <b-form-group
                id="directoryTypeGroup"
              >
                <b-form-select
                  id="directoryTypeInput"
                  v-model="subjectDirectoryEditable.directorytypeid"
                  :state="directoryTypeState"
                  :options="[
                    { value: null, text: 'Please Select'},
                    ...subjectDirectoryTypes.map(subjectDirectoryType => ({
                      value: subjectDirectoryType.uuid,
                      text: subjectDirectoryType.typename,
                      disabled: subjectDirectoryType.isdeleted,
                    }))
                  ]"
                  @change="(val) => handleDirectoryTypeChange(val)"
                  required
                />
              </b-form-group>
            </div>
            <div class="col-2">
              <b-button
                variant="primary"
                block
                v-b-tooltip.hover
                title="Configure Directory"
                @click="toggleConfigureDirectory"
                :disabled="!subjectDirectoryEditable.directorytypeid"
                data-qa="btnConfigure"
              >
                <Icon icon="cog" />
              </b-button>
            </div>
          </div>
          <div
            v-if="subjectDirectoryEditable.directorytypeid"
            :class="`configure-directory ${isConfigureDirectoryVisible ? 'd-block' : 'd-none'}`"
          >
            <h6>Configure Directory</h6>
            <DynamicForm
              :formTemplate="directoryConfigurationTemplate"
              :formData="{ configuration: subjectDirectoryEditable.directoryattributes }"
              :onUpdate="handleConfigurationUpdate"
            />
          </div>
        </div>
        <footer class="modal-footer">
          <b-button
            variant="secondary"
            @click="onClose"
            data-qa="btnCancel"
          >
            Cancel
          </b-button>
          <b-button
            variant="success"
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
import Helpers from '@/helpers';
import Modal from '@/components/shared/modals/Modal';
import Icon from '@/components/shared/Icon';
import DynamicForm from '@/components/shared/dynamicForm/DynamicForm';

export default {
  components: {
    Modal,
    Icon,
    DynamicForm,
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
    role: {
      type: String,
      required: false,
      default() { return 'edit'; },
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    directoryNameState() {
      const { directoryname } = this.subjectDirectoryEditable;

      if (directoryname && directoryname.length > 0) {
        return true;
      }

      return false;
    },
    descriptionState() {
      const { description } = this.subjectDirectoryEditable;

      if (description && description.length > 0) {
        return true;
      }

      return false;
    },
    directoryPriorityOrderState() {
      const { directorypriorityorder } = this.subjectDirectoryEditable;

      if (directorypriorityorder) {
        return true;
      }

      return false;
    },
    directoryOrganizationIdState() {
      const { organizationid } = this.subjectDirectoryEditable;

      if (organizationid) {
        return true;
      }

      return false;
    },
    directoryTypeState() {
      const { directorytypeid } = this.subjectDirectoryEditable;

      if (directorytypeid) {
        return true;
      }

      return false;
    },
  },
  data() {
    return {
      subjectDirectoryEditable: JSON.parse(JSON.stringify(this.subjectDirectory)),
      isConfigureDirectoryVisible: false,
      directoryConfigurationTemplate: {},
    };
  },
  methods: {
    ...mapActions('subjectDirectories', ['putSubjectDirectories', 'postSubjectDirectories']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { putSubjectDirectories, postSubjectDirectories,
        subjectDirectoryEditable, onUpdate, role } = this;
      if (role === 'edit') {
        putSubjectDirectories({
          ...subjectDirectoryEditable,
          directorypriorityorder: parseInt(subjectDirectoryEditable.directorypriorityorder, 10),
        }).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid } = currentUser.props;
        const crudsubjectid = uuid;
        const subjectDirectoryToAdd = [{
          ...subjectDirectoryEditable,
          crudsubjectid,
          directorypriorityorder: parseInt(subjectDirectoryEditable.directorypriorityorder, 10),
        }];
        postSubjectDirectories(subjectDirectoryToAdd).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      }
    },
    toggleConfigureDirectory() {
      this.isConfigureDirectoryVisible = !this.isConfigureDirectoryVisible;
    },
    handleDirectoryTypeChange(newDirectoryTypeId) {
      this.isConfigureDirectoryVisible = true;
      this.setDirectoryConfigurationTemplate({ directorytypeid: newDirectoryTypeId });
      const { subjectDirectoryTypes } = this;
      const subjectDirectoryType = subjectDirectoryTypes
        .find(item => item.uuid === newDirectoryTypeId);
      const formTemplate = JSON.parse(JSON.stringify(subjectDirectoryType.attributetemplate.components.schemas)); // eslint-disable-line
      const newDirecoryConfiguration = {};
      const { openApiObjectToFlatObject } = Helpers;
      openApiObjectToFlatObject(formTemplate, newDirecoryConfiguration);
      this.handleConfigurationUpdate(newDirecoryConfiguration);
    },
    handleConfigurationUpdate(newDirecoryConfiguration) {
      const { subjectDirectoryEditable } = this;
      this.subjectDirectoryEditable = {
        ...subjectDirectoryEditable,
        directoryattributes: {
          ...newDirecoryConfiguration.configuration,
        },
      };
    },
    setDirectoryConfigurationTemplate(newDirectoryTypeId) {
      const { directorytypeid } = newDirectoryTypeId || this.subjectDirectoryEditable;
      if (directorytypeid) {
        const { subjectDirectoryTypes } = this;
        this.directoryConfigurationTemplate =
          subjectDirectoryTypes
          .find(item => item.uuid === directorytypeid)
          .attributetemplate
          .components
          .schemas;
      }
    },
  },
  mounted() {
    this.setDirectoryConfigurationTemplate();
  },
};
</script>

<style lang="scss">
.modal-body {
  &.edit-identity-manager {
    padding: 0;
  }
}

.configure-directory {
  border: 1px solid #e9ecef;
  border-radius: .3rem;
  padding: 1rem;
  position: relative;

  &:before {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(233, 236, 239, 0);
    border-bottom-color: #e9ecef;
    border-width: 11px;
    margin-left: -11px;
  }
}
</style>