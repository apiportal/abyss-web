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
    data-qa="modalEditPolicy"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        {{ role === 'edit' ? 'Edit Policy' : 'Add New Policy' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
      <div class="p-3">
        <b-form-group
          id="policyNameGroup"
          label="Policy Name*:"
          :invalid-feedback="policyNameInvalidFeedback"
          :state="policyNameState"
        >
          <b-form-input
            id="policyNameInput"
            type="text"
            v-model="policyEditable.name"
            placeholder="Policy Name"
            :state="policyNameState"
            required
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="descriptionGroup"
          label="Description*:"
          :invalid-feedback="policyDescriptionInvalidFeedback"
          :state="policyDescriptionState"
        >
          <b-form-textarea
            id="descriptionTextarea"
            type="text"
            v-model="policyEditable.description"
            placeholder="Description"
            :state="policyDescriptionState"
            :rows="3"
            required
          >
          </b-form-textarea>
        </b-form-group>
        <b-form-group id="policyEnabledGroup">
          <b-form-checkbox
              id="policyEnabledChecks"
              v-model="policyEditable.isactive"
              :value="true"
              :unchecked-value="false"
          >
              Is Active?
          </b-form-checkbox>
        </b-form-group>
        <b-form-group id="policyTypeGroup">
          <label for="directoryTypeInput">Policy Type: <span class="text-danger">*</span></label>
          <b-input-group>
            <b-input-group-prepend>
              <b-button
                :variant="`${isConfigurePolicyVisible ? 'primary' : 'secondary'}`"
                v-b-tooltip.hover
                title="Configure Policy"
                @click="toggleConfigurePolicy"
                :disabled="!policyEditable.typeid"
              >
                <Icon icon="cog" />
              </b-button>
            </b-input-group-prepend>
            <b-form-select
              id="policyTypeInput"
              v-model="policyEditable.typeid"
              :state="policyTypeState"
              :options="[
                { value: null, text: 'Please Select'},
                ...policyTypes.map(policyType => ({
                  value: policyType.uuid,
                  text: policyType.name,
                }))
              ]"
              @change="(val) => handlePolicyTypeChange(val)"
              required
            />
          </b-input-group>
        </b-form-group>
        <div
          v-if="policyEditable.typeid"
          :class="`${isConfigurePolicyVisible ? 'd-block' : 'd-none'}`"
        >
          <h6 class="text-primary font-weight-bold mb-3">Configure Policy</h6>
          <DynamicForm
            :formTemplate="policyConfigurationTemplate"
            :formData="{ configuration: policyEditable.policyinstance }"
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
          @click="handleSubmit"
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
    policy: {
      type: Object,
      required: false,
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
      policyTypes: state => state.policyTypes.items,
    }),
    policyNameState() {
      const { name } = this.policyEditable;
      return name.length > 0;
    },
    policyNameInvalidFeedback() {
      const { name } = this.policyEditable;
      if (name.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    policyDescriptionState() {
      const { description } = this.policyEditable;
      return description.length > 0;
    },
    policyDescriptionInvalidFeedback() {
      const { description } = this.policyEditable;
      if (description.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    policyTypeState() {
      const { typeid } = this.policyEditable;
      if (typeid) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      policyEditable: JSON.parse(JSON.stringify(this.policy)),
      isConfigurePolicyVisible: false,
      policyConfigurationTemplate: {},
      policyInfo: {},
    };
  },
  methods: {
    ...mapActions('subjectPolicies', ['putPolicies', 'postPolicies']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { policyEditable, putPolicies, postPolicies, onUpdate, role } = this;
      if (role === 'edit') {
        putPolicies(policyEditable).then(() => {
          onUpdate();
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid } = currentUser.props;
        const crudsubjectid = uuid;
        const policyToUpdate = [{
          ...policyEditable,
          crudsubjectid,
        }];
        postPolicies(policyToUpdate).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      }
    },
    toggleConfigurePolicy() {
      this.isConfigurePolicyVisible = !this.isConfigurePolicyVisible;
    },
    handlePolicyTypeChange(newPolicyTypeId) {
      this.isConfigurePolicyVisible = true;
      this.setPolicyConfigurationTemplate({ typeid: newPolicyTypeId });
      const { policyTypes } = this;
      const policyType = policyTypes
        .find(item => item.uuid === newPolicyTypeId);
      const formTemplate = JSON.parse(JSON.stringify(policyType.template.components.schemas)); // eslint-disable-line
      const newTypeConfiguration = {};
      const { openApiObjectToFlatObject } = Helpers;
      openApiObjectToFlatObject(formTemplate, newTypeConfiguration);
      this.handleConfigurationUpdate(newTypeConfiguration);
    },
    handleConfigurationUpdate(newTypeConfiguration) {
      const { policyEditable } = this;
      this.policyEditable = {
        ...policyEditable,
        policyinstance: {
          ...newTypeConfiguration.configuration,
          info: {
            type: this.policyInfo['x-type'],
            subType: this.policyInfo['x-subType'],
          },
        },
      };
    },
    setPolicyConfigurationTemplate(newPolicyTypeId) {
      const { typeid } = newPolicyTypeId || this.policyEditable;
      if (typeid) {
        const { policyTypes } = this;
        this.policyConfigurationTemplate =
          policyTypes
          .find(item => item.uuid === typeid)
          .template
          .components
          .schemas;
        this.policyInfo =
          policyTypes
          .find(item => item.uuid === typeid)
          .template
          .info;
      }
    },
  },
  mounted() {
    this.setPolicyConfigurationTemplate();
  },
};

</script>

<style lang="scss" scoped>
</style>