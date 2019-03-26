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
        {{ role === 'edit' ? 'Edit User' : 'Add New User' }}
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
            :invalid-feedback="firstNameInvalidFeedback"
            :state="firstNameState"
          >
            <b-form-input
              id="firstNameInput"
              type="text"
              v-model="userEditable.firstname"
              placeholder="First Name"
              :state="firstNameState"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="lastNameGroup"
            label="Last Name*:"
            label-for="lastNameInput"
            :invalid-feedback="lastNameInvalidFeedback"
            :state="lastNameState"
          >
            <b-form-input
              id="lastNameInput"
              type="text"
              v-model="userEditable.lastname"
              placeholder="Last Name"
              :state="lastNameState"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="displayNameGroup"
            label="Display Name*:"
            label-for="displayNameInput"
            :invalid-feedback="displayNameInvalidFeedback"
            :state="displayNameState"
          >
            <b-form-input
              id="displayNameInput"
              type="text"
              v-model="userEditable.displayname"
              placeholder="Display Name"
              :state="displayNameState"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="userNameGroup"
            label="User Name*:"
            label-for="userNameInput"
            :invalid-feedback="userNameInvalidFeedback"
            :state="userNameState"
          >
            <b-form-input
              id="userNameInput"
              type="text"
              v-model="userEditable.subjectname"
              placeholder="User Name"
              :state="userNameState"
              :formatter="setValidSubjectName"
              required
            >
            </b-form-input>
          </b-form-group>

          <b-form-group id="userEnabledGroup">
            <b-form-checkbox
              id="userEnabledChecks"
              v-model="userEditable.isactivated"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
          </b-form-group>

          <b-form-group
            v-if="isPasswordInputVisible"
            id="userPasswordGroup"
            label="Password*:"
            label-for="userPasswordInput"
            :invalid-feedback="passwordInvalidFeedback"
            :state="passwordState"
          >
            <b-input-group>
              <b-form-input
                id="userPasswordInput"
                :type="`${isPasswordVisible ? 'text' : 'password'}`"
                v-model="userEditable.password"
                placeholder="Password"
                :state="passwordState"
                required
              >
              </b-form-input>
              <b-input-group-append>
                <b-button variant="secondary" @click="togglePasswordVisibility">
                  <Icon :icon="`${isPasswordVisible ? 'eye-slash' : 'eye'}`" />
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <b-form-group 
            id="emailGroup"
            label="Email*:"
            label-for="emailInput"
            :invalid-feedback="emailInvalidFeedback"
            :state="emailState"
          >
            <b-form-input
              id="emailInput"
              type="email"
              v-model="userEditable.email"
              placeholder="Email"
              :state="emailState"
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
              v-model="secondaryEmail"
              placeholder="Secondary Email"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="urlGroup"
            label="URL:"
            label-for="urlInput"
            :invalid-feedback="urlInvalidFeedback"
            :state="urlState"
          >
            <b-form-input
              id="urlInput"
              type="text"
              v-model="userEditable.url"
              placeholder="URL"
              :state="urlState"
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="userOrganizationIdGroup"
            label="Organization*:"
            label-for="userOrganizationIdInput"
            :invalid-feedback="organizationIdInvalidFeedback"
            :state="organizationIdState"
          >
            <b-form-select
              id="userOrganizationIdInput"
              v-model="userEditable.organizationid" 
              :options="[
                {
                  value: null,
                  text: 'Please select',
                },
                ...organizations.map(organization => ({
                  value: organization.uuid,
                  text: organization.name,
                  disabled: organization.isdeleted,
                })),
              ]"
              :state="organizationIdState"
            />
          </b-form-group>
          <b-form-group 
            id="userDirectoryIdGroup"
            label="Directory*:"
            label-for="userDirectoryIdInput"
            :invalid-feedback="subjectDirectoryIdInvalidFeedback"
            :state="subjectDirectoryIdState"
          >
            <b-form-select
              id="userDirectoryIdInput"
              v-model="userEditable.subjectdirectoryid" 
              :options="[
                {
                  value: null,
                  text: 'Please select',
                },
                ...subjectDirectories.map(subjectDirectory => ({
                  value: subjectDirectory.uuid,
                  text: subjectDirectory.directoryname,
                  disabled: subjectDirectory.isdeleted,
                })),
              ]"
              :state="subjectDirectoryIdState"
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
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    secondaryEmail: {
      get() {
        if (this.userEditable.secondaryemail === this.userEditable.email) {
          return '';
        }
        return this.userEditable.secondaryemail;
      },
      set(value) {
        if (value === '') {
          this.userEditable.secondaryemail = this.userEditable.email;
        } else {
          this.userEditable.secondaryemail = value;
        }
      },
    },
    firstNameState() {
      const { firstname } = this.userEditable;
      return firstname.length > 0;
    },
    firstNameInvalidFeedback() {
      const { firstname } = this.userEditable;
      if (firstname.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    lastNameState() {
      const { lastname } = this.userEditable;
      return lastname.length > 0;
    },
    lastNameInvalidFeedback() {
      const { lastname } = this.userEditable;
      if (lastname.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    displayNameState() {
      const { displayname } = this.userEditable;
      return displayname.length > 0;
    },
    displayNameInvalidFeedback() {
      const { displayname } = this.userEditable;
      if (displayname.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    userNameState() {
      const { subjectname } = this.userEditable;
      return subjectname.length > 0;
    },
    userNameInvalidFeedback() {
      const { subjectname } = this.userEditable;
      if (subjectname.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    passwordState() {
      const { password } = this.userEditable;
      return password.length > 0;
    },
    passwordInvalidFeedback() {
      const { password } = this.userEditable;
      if (password.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    emailState() {
      const { email } = this.userEditable;
      return email.length > 0;
    },
    emailInvalidFeedback() {
      const { email } = this.userEditable;
      if (email.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    organizationIdState() {
      const { organizationid } = this.userEditable;
      return organizationid !== null;
    },
    organizationIdInvalidFeedback() {
      const { organizationid } = this.userEditable;
      if (organizationid === null) {
        return 'Please select organization';
      }
      return '';
    },
    subjectDirectoryIdState() {
      const { subjectdirectoryid } = this.userEditable;
      return subjectdirectoryid !== null;
    },
    subjectDirectoryIdInvalidFeedback() {
      const { subjectdirectoryid } = this.userEditable;
      if (subjectdirectoryid === null) {
        return 'Please select directory';
      }
      return '';
    },
    urlState() {
      const { url } = this.userEditable;
      const re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
      return re.test(String(url));
    },
    urlInvalidFeedback() {
      const { url } = this.userEditable;
      const re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
      if (re.test(String(url))) {
        return 'Please enter a valid url';
      }
      return '';
    },
  },
  data() {
    const { user, role } = this;
    return {
      userEditable: JSON.parse(JSON.stringify(user)),
      isPasswordInputVisible: (role === 'add'),
      isPasswordVisible: false,
    };
  },
  methods: {
    ...mapActions('users', ['putUsers', 'postUsers']),
    setValidSubjectName(value) {
      return value.replace(/ /g, '').toLowerCase();
    },
    handleSubmit(evt) {
      evt.preventDefault();

      const { userEditable, putUsers, postUsers, onUpdate, role } = this;
      const { description, url, secondaryemail,
        effectivestartdate, effectiveenddate,
        email, picture, distinguishedname, uniqueid,
        phonebusiness, phoneextension, phonehome, phonemobile,
        jobtitle, department, company } = userEditable;
      let userToUpdate = {
        ...userEditable,
        description: (description === null ? '' : description),
        url: (url === null ? '' : url),
        picture: (picture === null ? '' : picture),
        distinguishedname: (distinguishedname === null ? '' : distinguishedname),
        uniqueid: (uniqueid === null ? '' : uniqueid),
        phonebusiness: (phonebusiness === null ? '' : phonebusiness),
        phoneextension: (phoneextension === null ? '' : phoneextension),
        phonehome: (phonehome === null ? '' : phonehome),
        phonemobile: (phonemobile === null ? '' : phonemobile),
        jobtitle: (jobtitle === null ? '' : jobtitle),
        department: (department === null ? '' : department),
        company: (company === null ? '' : company),
        effectivestartdate: (effectivestartdate === null ?
          this.$moment.utc().toISOString() : effectivestartdate),
        effectiveenddate: (effectiveenddate === null ? this.$moment.utc().add(50, 'years').toISOString() : effectiveenddate),
        secondaryemail: (secondaryemail === null ? email : secondaryemail),
      };

      if (role === 'edit') {
        putUsers(userToUpdate).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid } = currentUser.props;
        const crudsubjectid = uuid;
        userToUpdate = [{
          ...userToUpdate,
          crudsubjectid,
        }];
        postUsers(userToUpdate).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      }
    },
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
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
