<template>
  <Modal
    bodyClass="edit-administer-user"
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
        {{ role === 'edit' ? 'Edit Administer User' : 'Add New Administer User' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="firstNameGroup"
            label="First Name*:"
            label-for="firstNameInput"
          >
            <b-form-input
              id="firstNameInput"
              type="text"
              v-model="userEditable.firstname"
              placeholder="First Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="lastNameGroup"
            label="Last Name*:"
            label-for="lastNameInput"
          >
            <b-form-input
              id="lastNameInput"
              type="text"
              v-model="userEditable.lastname"
              placeholder="Last Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="displayNameGroup"
            label="Display Name*:"
            label-for="displayNameInput"
          >
            <b-form-input
              id="displayNameInput"
              type="text"
              v-model="userEditable.displayname"
              placeholder="Display Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="userNameGroup"
            label="User Name*:"
            label-for="userNameInput"
          >
            <b-form-input
              id="userNameInput"
              type="text"
              v-model="userEditable.subjectname"
              placeholder="User Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            v-if="isPasswordInputVisible"
            id="userPasswordGroup"
            label="Password*:"
            label-for="userPasswordInput"
          >
            <b-input-group>
              <b-form-input
                id="userPasswordInput"
                type="text"
                v-model="userEditable.password"
                placeholder="Password"
                required
              >
              </b-form-input>
              <b-input-group-append>
                <b-button variant="secondary"><Icon icon="eye" /></b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group 
            id="emailGroup"
            label="Email*:"
            label-for="emailInput"
          >
            <b-form-input
              id="emailInput"
              type="email"
              v-model="userEditable.email"
              placeholder="Email"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="secondaryEmailGroup"
            label="Secondary Email:"
            label-for="secondaryEmailInput"
          >
            <b-form-input
              id="secondaryEmailInput"
              type="email"
              v-model="userEditable.secondaryemail"
              placeholder="Secondary Email"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="urlGroup"
            label="URL:"
            label-for="urlInput"
          >
            <b-form-input
              id="urlInput"
              type="text"
              v-model="userEditable.url"
              placeholder="URL"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="userOrganizationIdGroup"
            label="Organization*:"
            label-for="userOrganizationIdInput"
          >
            <b-form-select
              id="userOrganizationIdInput"
              v-model="userEditable.organizationid" 
              :options="organizations.map(organization => ({
                value: organization.uuid,
                text: organization.name,
              }))"
            />
          </b-form-group>
          <b-form-group 
            id="userDirectoryIdGroup"
            label="Directory*:"
            label-for="userDirectoryIdInput"
          >
            <b-form-select
              id="userDirectoryIdInput"
              v-model="userEditable.subjectdirectoryid" 
              :options="subjectDirectories.map(subjectDirectory => ({
                value: subjectDirectory.uuid,
                text: subjectDirectory.directoryname,
              }))"
            />
          </b-form-group>
          <b-form-group 
            id="userDescriptionGroup"
            label="Description:"
            label-for="userDescriptionTextarea"
          >
            <b-form-textarea
              id="userDescriptionTextarea"
              v-model="userEditable.description"
              placeholder="Description"
              :rows="3"
            >
            </b-form-textarea>
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
import { mapActions } from 'vuex';
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
    user: {
      type: Object,
      required: false,
    },
    subjectDirectories: {
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
  data() {
    const { user, role } = this;
    return {
      userEditable: JSON.parse(JSON.stringify(user)),
      isPasswordInputVisible: (role === 'add'),
    };
  },
  methods: {
    ...mapActions('users', ['putUsers', 'postUsers']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { userEditable, putUsers, onUpdate, role } = this;
      const { description, url, effectiveenddate, secondaryemail, email } = userEditable;
      const userToUpdate = {
        ...userEditable,
        description: (description === null ? '' : description),
        url: (url === null ? '' : url),
        effectiveenddate: (effectiveenddate === null ? '' : effectiveenddate),
        secondaryemail: (secondaryemail === null ? '' : email),
      };

      if (role === 'edit') {
        putUsers(userToUpdate).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        putUsers(userToUpdate).then((response) => {
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
  &.edit-administer-user {
    padding: 0;
  }
}
</style>
