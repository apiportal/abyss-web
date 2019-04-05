<template>
  <Modal
    bodyClass="edit-organization"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalEditOrganization"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        {{ role === 'edit' ? 'Edit Organization' : 'Add New Organization' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="organizationNameGroup"
          >
            <label>
              Name:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              id="organizationNameInput"
              type="text"
              v-model="organizationEditable.name"
              :state="nameState"
              placeholder="Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="organizationDescriptionGroup"
          >
            <label>
              Description:
              <span class="text-danger">*</span>
            </label>
            <b-form-textarea
              id="organizationDescriptionTextarea"
              v-model="organizationEditable.description"
              :state="descriptionState"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group 
            id="organizationOrganizationIdGroup"
          >
            <label>
              Parent Organization:
              <span class="text-danger">*</span>
            </label>
            <b-form-select
              id="organizationOrganizationIdInput"
              v-model="organizationEditable.organizationid" 
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
          <b-form-group 
            id="organizationUrlGroup"
          >
            <label>
              Url:
            </label>
            <b-form-input
              id="organizationUrlInput"
              type="text"
              v-model="organizationEditable.url"
              placeholder="Url"
            >
            </b-form-input>
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
    organization: {
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
    nameState() {
      const { name } = this.organizationEditable;
      if (name && name.length > 0) {
        return true;
      }
      return false;
    },
    descriptionState() {
      const { description } = this.organizationEditable;
      if (description && description.length > 0) {
        return true;
      }
      return false;
    },
    organizationIdState() {
      const { organizationid } = this.organizationEditable;
      if (organizationid) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      organizationEditable: JSON.parse(JSON.stringify(this.organization)),
    };
  },
  created() { },
  methods: {
    ...mapActions('organizations', ['putOrganizations', 'postOrganizations']),
    validateJson(obj) {
      try {
        return JSON.parse(obj);
      } catch (e) {
        return false;
      }
    },
    handleSubmit(evt) {
      evt.preventDefault();
      const { putOrganizations,
        postOrganizations,
        organizationEditable,
        onUpdate,
        role } = this;
      const { picture } = organizationEditable;
      let organizationToUpdate = {
        ...organizationEditable,
        picture: (picture === null ? '' : picture),
      };
      if (role === 'edit') {
        putOrganizations(organizationToUpdate).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid } = currentUser.props;
        const crudsubjectid = uuid;
        organizationToUpdate = [{
          ...organizationToUpdate,
          crudsubjectid,
        }];
        postOrganizations(organizationToUpdate).then((response) => {
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
  &.edit-organization {
    padding: 0;
  }
}

.configure-organization {
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