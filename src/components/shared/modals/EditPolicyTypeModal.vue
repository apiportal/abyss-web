<template>
  <Modal
    bodyClass="edit-policy-type"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalEditPolicyType"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        {{ role === 'edit' ? 'Edit Access Manager Type' : 'Add New Access Manager Type' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="policyTypeNameGroup"
          >
            <label>
              Name:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              id="policyTypeNameInput"
              type="text"
              v-model="policyTypeEditable.name"
              :state="nameState"
              placeholder="Name"
              required
            >
            </b-form-input>
          </b-form-group>

          <b-form-group 
            id="policyTypeTypeGroup"
          >
            <label>
              Type:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              id="policyTypeTypeTextarea"
              type="text"
              v-model="policyTypeEditable.type"
              :state="typeState"
              placeholder="Type"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="policyTypeSubtypeGroup"
          >
            <label>
              Sub Type:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              id="policyTypeSubTypeTextarea"
              type="text"
              v-model="policyTypeEditable.subtype"
              :state="subtypeState"
              placeholder="Sub Type"
              required
            >
            </b-form-input>
          </b-form-group>

          <b-form-group 
            id="policyTypeDescriptionGroup"
          >
            <label>
              Description:
              <span class="text-danger">*</span>
            </label>
            <b-form-textarea
              id="policyTypeDescriptionTextarea"
              v-model="policyTypeEditable.description"
              :state="descriptionState"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group 
            id="policyTypeOrganizationIdGroup"
          >
            <label>
              Organization:
              <span class="text-danger">*</span>
            </label>
            <b-form-select
              id="policyTypeOrganizationIdInput"
              v-model="policyTypeEditable.organizationid" 
              :state="organizationIdState"
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
          <b-form-group id="policyTypeEnabledGroup">
            <b-form-checkbox
              id="policyTypeEnabledChecks"
              v-model="policyTypeEditable.isactive"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
          </b-form-group>
          <b-form-group 
            id="policyTypeTemplateGroup"
          >
            <label>
              Template:
              <span class="text-danger">*</span>
            </label>
            <b-form-textarea
              id="policyTypeTemplateTextarea"
              v-model="policyTemplate"
              :state="templateState"
              placeholder="Template"
              :rows="6"
              required
            >
            </b-form-textarea>
          </b-form-group>
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
import Modal from '@/components/shared/modals/Modal';
import Icon from '@/components/shared/Icon';

export default {
  components: {
    Modal,
    Icon,
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
    policyType: {
      type: Object,
      required: false,
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
    templateState() {
      try {
        this.policyTypeEditable.template =
          this.validateJson(this.policyTemplate);
        if (this.policyTypeEditable.template) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    nameState() {
      const { name } = this.policyTypeEditable;
      if (name && name.length > 0) {
        return true;
      }
      return false;
    },
    descriptionState() {
      const { description } = this.policyTypeEditable;
      if (description && description.length > 0) {
        return true;
      }
      return false;
    },
    typeState() {
      const { type } = this.policyTypeEditable;
      if (type && type.length > 0) {
        return true;
      }
      return false;
    },
    subtypeState() {
      const { subtype } = this.policyTypeEditable;
      if (subtype && subtype.length > 0) {
        return true;
      }
      return false;
    },
    organizationIdState() {
      const { organizationid } = this.policyTypeEditable;
      if (organizationid) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      policyTypeEditable: JSON.parse(JSON.stringify(this.policyType)),
      policyTemplate: null,
    };
  },
  created() {
    this.policyTemplate = JSON.stringify(this.policyTypeEditable.template, null, '\t');
  },
  methods: {
    ...mapActions('policyTypes', ['putPolicyTypes', 'postPolicyTypes']),
    validateJson(obj) {
      try {
        return JSON.parse(obj);
      } catch (e) {
        return false;
      }
    },
    handleSubmit(evt) {
      evt.preventDefault();
      const { putPolicyTypes,
        postPolicyTypes,
        policyTypeEditable,
        onUpdate,
        role } = this;
      if (role === 'edit') {
        putPolicyTypes({
          ...policyTypeEditable,
        }).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid } = currentUser.props;
        const crudsubjectid = uuid;
        const policyToAdd = [{
          ...policyTypeEditable,
          crudsubjectid,
        }];
        postPolicyTypes(policyToAdd).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      }
    },
  },
};
</script>

<style lang="scss">
.modal-body {
  &.edit-policy-type {
    padding: 0;
  }
}

.configure-policy-type {
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