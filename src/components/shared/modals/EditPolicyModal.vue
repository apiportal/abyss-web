<template>
  <Modal
    bodyClass="edit-policy"
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
        {{ role === 'edit' ? 'Edit Policy' : 'Add New Policy' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
      <div style="padding: 1rem;">
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
        <div class="row">
          <div class="col-12">
            <label for="directoryTypeInput">Policy Type: <span class="text-danger">*</span></label>
          </div>
          <div class="col-10">
            <b-form-group 
              id="policyTypeGroup"
            >
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
            </b-form-group>
          </div>
          <div class="col-2">
            <b-button
              variant="primary"
              block
              v-b-tooltip.hover
              title="Configure Policy"
              @click="toggleConfigurePolicy"
              :disabled="!policyEditable.typeid"
            >
              <Icon icon="cog" />
            </b-button>
          </div>
        </div>
        <div
          v-if="policyEditable.typeid"
          :class="`configure-directory ${isConfigurePolicyVisible ? 'd-block' : 'd-none'}`"
        >
          <h6>Configure Policy</h6>
          <DynamicForm
            :formTemplate="policyConfigurationTemplate"
            :formData="{ AuthorizationConfiguration: policyEditable.policyInstance }"
            :onUpdate="handleConfigurationUpdate"
          />
        </div>
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
          @click="handleSubmit"
          >
          Save
        </b-button>
      </footer>
      </b-form>
    </template>
  </Modal>
</template>

<script>
import { mapState } from 'vuex';
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
      const { name } = this.policyEditable;
      return name.length > 0;
    },
    policyDescriptionInvalidFeedback() {
      const { name } = this.policyEditable;
      if (name.length === 0) {
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
    const { policy } = this;

    return {
      policyEditable: JSON.parse(JSON.stringify(policy)),
      isConfigurePolicyVisible: false,
      policyConfigurationTemplate: {},
    };
  },
  methods: {
    handleSubmit(event) {
      event.preventDefault();
      console.log('submitted'); // eslint-disable-line
    },
    toggleConfigurePolicy() {
      this.isConfigurePolicyVisible = !this.isConfigurePolicyVisible;
    },
    handleDirectoryTypeChange(newPolicyTypeId) {
      this.isConfigurePolicyVisible = true;
      this.setPolicyConfigurationTemplate({ typeid: newPolicyTypeId });
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
      }
    },
    handleConfigurationUpdate(newTypeConfiguration) {
      const { policyEditable } = this;
      this.policyEditable = {
        ...policyEditable,
        policyInstance: {
          ...newTypeConfiguration.AuthorizationConfiguration,
        },
      };
    },
    handlePolicyTypeChange(newPolicyTypeId) {
      this.isConfigurePolicyVisible = true;
      this.setPolicyConfigurationTemplate({ typeid: newPolicyTypeId });
    },
  },
  mounted() {
    this.setPolicyConfigurationTemplate();
  },
};

</script>

<style lang="scss">
.modal-body {
  &.edit-policy {
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