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
    data-qa="modalEditAccessManager"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        {{ role === 'edit' ? this.accessManagerEditable.accessmanagername : 'New Access Manager' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div class="p-3">
          <b-form-group
            id="accessManagerNameGroup"
          >
            <label>
              Name:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              id="accessManagerNameInput"
              type="text"
              v-model="accessManagerEditable.accessmanagername"
              :state="accessManagerNameState"
              placeholder="Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="accessManagerDescriptionGroup"
          >
            <label>
              Description:
              <span class="text-danger">*</span>
            </label>
            <b-form-textarea
              id="accessManagerDescriptionTextarea"
              v-model="accessManagerEditable.description"
              :state="descriptionState"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group id="accessManagerEnabledGroup">
            <b-form-checkbox
              id="accessManagerEnabledChecks"
              v-model="accessManagerEditable.isactive"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
          </b-form-group>
          <b-form-group
            id="accessManagerOrganizationIdGroup"
          >
            <label>
              Organization:
              <span class="text-danger">*</span>
            </label>
            <b-form-select
              id="accessManagerOrganizationIdInput"
              v-model="accessManagerEditable.organizationid"
              :state="accessManagerOrganizationIdState"
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
          <b-form-group id="accessManagerTypeGroup">
            <label for="accessManagerTypeInput">Access Manager Type: <span class="text-danger">*</span></label>
            <b-input-group>
              <b-input-group-prepend>
                <b-button
                  :variant="`${isConfigureAccessManagerVisible ? 'primary' : 'secondary'}`"
                  v-b-tooltip.hover
                  title="Configure AccessManager"
                  @click="toggleConfigureAccessManager"
                  :disabled="!accessManagerEditable.accessmanagertypeid"
                  data-qa="btnConfigure"
                >
                  <Icon icon="cog" />
                </b-button>
              </b-input-group-prepend>
              <b-form-select
                id="accessManagerTypeInput"
                v-model="accessManagerEditable.accessmanagertypeid"
                :state="accessManagerTypeState"
                :options="[
                  { value: null, text: 'Please Select'},
                  ...accessManagerTypes.map(accessManagerType => ({
                    value: accessManagerType.uuid,
                    text: accessManagerType.typename,
                    disabled: accessManagerType.isdeleted,
                  }))
                ]"
                @change="(val) => handleAccessManagerTypeChange(val)"
                required
              />
            </b-input-group>
          </b-form-group>
          <div
            v-if="accessManagerEditable.accessmanagertypeid"
            :class="`${isConfigureAccessManagerVisible ? 'd-block' : 'd-none'}`"
          >
            <h6 class="text-primary font-weight-bold mb-3">Configure Access Manager</h6>
            <DynamicForm
              :formTemplate="accessManagerConfigurationTemplate"
              :formData="{ configuration: accessManagerEditable.accessmanagerattributes }"
              :onUpdate="handleConfigurationUpdate"
            />
          </div>
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
    accessManager: {
      type: Object,
      required: false,
    },
    accessManagerTypes: {
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
    iconTitle: {
      type: String,
      required: false,
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    accessManagerNameState() {
      const { accessmanagername } = this.accessManagerEditable;

      if (accessmanagername && accessmanagername.length > 0) {
        return true;
      }

      return false;
    },
    descriptionState() {
      const { description } = this.accessManagerEditable;

      if (description && description.length > 0) {
        return true;
      }

      return false;
    },
    accessManagerOrganizationIdState() {
      const { organizationid } = this.accessManagerEditable;

      if (organizationid) {
        return true;
      }

      return false;
    },
    accessManagerTypeState() {
      const { accessmanagertypeid } = this.accessManagerEditable;

      if (accessmanagertypeid) {
        return true;
      }

      return false;
    },
  },
  data() {
    return {
      accessManagerEditable: JSON.parse(JSON.stringify(this.accessManager)),
      isConfigureAccessManagerVisible: false,
      accessManagerConfigurationTemplate: {},
    };
  },
  methods: {
    ...mapActions('accessManagers', ['putAccessManagers', 'postAccessManagers']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { putAccessManagers, postAccessManagers, accessManagerEditable, onUpdate, role } = this;
      if (role === 'edit') {
        putAccessManagers({
          ...accessManagerEditable,
        }).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid } = currentUser.props;
        const crudsubjectid = uuid;
        const accessManagerToAdd = [{
          ...accessManagerEditable,
          crudsubjectid,
        }];
        postAccessManagers(accessManagerToAdd).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      }
    },
    toggleConfigureAccessManager() {
      this.isConfigureAccessManagerVisible = !this.isConfigureAccessManagerVisible;
    },
    handleAccessManagerTypeChange(newAccessManagerTypeId) {
      this.isConfigureAccessManagerVisible = true;
      this.setAccessManagerConfigurationTemplate({ accessmanagertypeid: newAccessManagerTypeId });
      const { accessManagerTypes } = this;
      const accessManagerType = accessManagerTypes
        .find(item => item.uuid === newAccessManagerTypeId);
      const formTemplate = JSON.parse(JSON.stringify(accessManagerType.attributetemplate.components.schemas)); // eslint-disable-line
      const newDirecoryConfiguration = {};
      const { openApiObjectToFlatObject } = Helpers;
      openApiObjectToFlatObject(formTemplate, newDirecoryConfiguration);
      this.handleConfigurationUpdate(newDirecoryConfiguration);
    },
    handleConfigurationUpdate(newDirecoryConfiguration) {
      const { accessManagerEditable } = this;
      this.accessManagerEditable = {
        ...accessManagerEditable,
        accessmanagerattributes: {
          ...newDirecoryConfiguration.configuration,
        },
      };
    },
    setAccessManagerConfigurationTemplate(newAccessManagerTypeId) {
      const { accessmanagertypeid } = newAccessManagerTypeId || this.accessManagerEditable;
      if (accessmanagertypeid) {
        const { accessManagerTypes } = this;
        this.accessManagerConfigurationTemplate =
          accessManagerTypes
          .find(item => item.uuid === accessmanagertypeid)
          .attributetemplate
          .components
          .schemas;
      }
    },
  },
  mounted() {
    this.setAccessManagerConfigurationTemplate();
  },
};
</script>

<style lang="scss" scoped>
</style>