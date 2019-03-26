<template>
  <Modal
    bodyClass="edit-identity-manager-type"
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
        {{ role === 'edit' ? 'Edit Identity Manager Type' : 'Add New Identity Manager Type' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="directoryTypeNameGroup"
          >
            <label>
              Name:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              id="directoryTypeNameInput"
              type="text"
              v-model="subjectDirectoryTypeEditable.typename"
              :state="nameState"
              placeholder="Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="directoryTypeDescriptionGroup"
          >
            <label>
              Description:
              <span class="text-danger">*</span>
            </label>
            <b-form-textarea
              id="directoryTypeDescriptionTextarea"
              v-model="subjectDirectoryTypeEditable.description"
              :state="descriptionState"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group 
            id="directoryTypeOrganizationIdGroup"
          >
            <label>
              Organization:
              <span class="text-danger">*</span>
            </label>
            <b-form-select
              id="directoryTypeOrganizationIdInput"
              v-model="subjectDirectoryTypeEditable.organizationid" 
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
          <b-form-group id="directoryTypeEnabledGroup">
            <b-form-checkbox
              id="directoryTypeEnabledChecks"
              v-model="subjectDirectoryTypeEditable.isactive"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
          </b-form-group>
          <b-form-group 
            id="directoryTypeTemplateGroup"
          >
            <label>
              Template:
              <span class="text-danger">*</span>
            </label>
            <b-form-textarea
              id="directoryTypeTemplateTextarea"
              v-model="identityTemplate"
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
            id="IdBtnCancel"
            variant="secondary"
            @click="onClose"
          >
            Cancel
          </b-button>
          <b-button
            id="IdBtnSave"
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
    subjectDirectoryType: {
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
        this.subjectDirectoryTypeEditable.attributetemplate =
          this.validateJson(this.identityTemplate);
        if (this.subjectDirectoryTypeEditable.attributetemplate) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
    nameState() {
      const { typename } = this.subjectDirectoryTypeEditable;
      if (typename && typename.length > 0) {
        return true;
      }
      return false;
    },
    descriptionState() {
      const { description } = this.subjectDirectoryTypeEditable;
      if (description && description.length > 0) {
        return true;
      }
      return false;
    },
    organizationIdState() {
      const { organizationid } = this.subjectDirectoryTypeEditable;
      if (organizationid) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      subjectDirectoryTypeEditable: JSON.parse(JSON.stringify(this.subjectDirectoryType)),
      identityTemplate: null,
    };
  },
  created() {
    this.identityTemplate = JSON.stringify(this.subjectDirectoryTypeEditable.attributetemplate, null, '\t');
  },
  methods: {
    ...mapActions('subjectDirectoryTypes', ['putSubjectDirectoryTypes', 'postSubjectDirectoryTypes']),
    validateJson(obj) {
      try {
        return JSON.parse(obj);
      } catch (e) {
        return false;
      }
    },
    handleSubmit(evt) {
      evt.preventDefault();
      const { putSubjectDirectoryTypes,
        postSubjectDirectoryTypes,
        subjectDirectoryTypeEditable,
        onUpdate,
        role } = this;
      if (role === 'edit') {
        putSubjectDirectoryTypes({
          ...subjectDirectoryTypeEditable,
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
          ...subjectDirectoryTypeEditable,
          crudsubjectid,
        }];
        postSubjectDirectoryTypes(subjectDirectoryToAdd).then((response) => {
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
  &.edit-identity-manager-type {
    padding: 0;
  }
}

.configure-directory-type {
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