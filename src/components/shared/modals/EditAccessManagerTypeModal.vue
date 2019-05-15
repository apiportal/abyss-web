<template>
  <Modal
    bodyClass="edit-access-manager-type"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalEditAccessManagerType"
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
            id="accessManagerTypeNameGroup"
          >
            <label>
              Name:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              id="accessManagerTypeNameInput"
              type="text"
              v-model="accessManagerTypeEditable.typename"
              :state="nameState"
              placeholder="Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="accessManagerTypeDescriptionGroup"
          >
            <label>
              Description:
              <span class="text-danger">*</span>
            </label>
            <b-form-textarea
              id="accessManagerTypeDescriptionTextarea"
              v-model="accessManagerTypeEditable.description"
              :state="descriptionState"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group 
            id="accessManagerTypeOrganizationIdGroup"
          >
            <label>
              Organization:
              <span class="text-danger">*</span>
            </label>
            <b-form-select
              id="accessManagerTypeOrganizationIdInput"
              v-model="accessManagerTypeEditable.organizationid" 
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
          <b-form-group id="accessManagerTypeEnabledGroup">
            <b-form-checkbox
              id="accessManagerTypeEnabledChecks"
              v-model="accessManagerTypeEditable.isactive"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
          </b-form-group>
          <b-form-group 
            id="accessManagerTypeTemplateGroup"
          >
            <label>
              Template:
              <span class="text-danger">*</span>
            </label>
            <b-form-textarea
              id="accessManagerTypeTemplateTextarea"
              v-model="accessManagerTemplate"
              :state="attributetemplateState"
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
    accessManagerType: {
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
    attributetemplateState() {
      try {
        this.accessManagerTypeEditable.attributetemplate =
          this.validateJson(this.accessManagerTemplate);
        if (this.accessManagerTypeEditable.attributetemplate) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    nameState() {
      const { typename } = this.accessManagerTypeEditable;
      if (typename && typename.length > 0) {
        return true;
      }
      return false;
    },
    descriptionState() {
      const { description } = this.accessManagerTypeEditable;
      if (description && description.length > 0) {
        return true;
      }
      return false;
    },
    organizationIdState() {
      const { organizationid } = this.accessManagerTypeEditable;
      if (organizationid) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      accessManagerTypeEditable: JSON.parse(JSON.stringify(this.accessManagerType)),
      accessManagerTemplate: null,
    };
  },
  created() {
    this.accessManagerTemplate = JSON.stringify(this.accessManagerTypeEditable.attributetemplate, null, '\t');
  },
  methods: {
    ...mapActions('accessManagerTypes', ['putAccessManagerTypes', 'postAccessManagerTypes']),
    validateJson(obj) {
      try {
        return JSON.parse(obj);
      } catch (e) {
        return false;
      }
    },
    handleSubmit(evt) {
      evt.preventDefault();
      const { putAccessManagerTypes,
        postAccessManagerTypes,
        accessManagerTypeEditable,
        onUpdate,
        role } = this;
      if (role === 'edit') {
        putAccessManagerTypes({
          ...accessManagerTypeEditable,
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
          ...accessManagerTypeEditable,
          crudsubjectid,
        }];
        postAccessManagerTypes(accessManagerToAdd).then((response) => {
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
  &.edit-access-manager-type {
    padding: 0;
  }
}

.configure-access-manager-type {
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