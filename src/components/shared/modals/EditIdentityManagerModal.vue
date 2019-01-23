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
  >
    <template slot="header">
      <h5 class="modal-title">
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
            label="Name:"
            label-for="directoryNameInput"
          >
            <b-form-input
              id="directoryNameInput"
              type="text"
              v-model="subjectDirectoryEditable.directoryname"
              placeholder="Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="directoryDescriptionGroup"
            label="Description:"
            label-for="directoryDescriptionTextarea"
          >
            <b-form-textarea
              id="directoryDescriptionTextarea"
              v-model="subjectDirectoryEditable.description"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group 
            id="directoryPriorityOrderGroup"
            label="Priority Order:"
            label-for="directoryPriorityOrderInput"
          >
            <b-form-input
              id="directoryPriorityOrderInput"
              type="number"
              v-model="subjectDirectoryEditable.directorypriorityorder"
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
            label="Organization:"
            label-for="directoryOrganizationIdInput"
          >
            <b-form-select
              id="directoryOrganizationIdInput"
              v-model="subjectDirectoryEditable.organizationid" 
              :options="organizations.map(organization => ({
                value: organization.uuid,
                text: organization.name,
              }))"
            />
          </b-form-group>
          <div class="row">
            <div class="col-12">
              <label for="directoryTypeInput">Directory Type:</label>
            </div>
            <div class="col-10">
              <b-form-group 
                id="directoryTypeGroup"
              >
                <b-form-select
                  id="directoryTypeInput"
                  v-model="subjectDirectoryEditable.directorytypeid" 
                  :options="subjectDirectoryTypes.map(subjectDirectoryType => ({
                    value: subjectDirectoryType.uuid,
                    text: subjectDirectoryType.typename,
                  }))"
                  @change="(val) => handleDirectoryTypeChange(val)"
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
              >
                <Icon icon="cog" />
              </b-button>
            </div>
          </div>
          <div 
            v-if="subjectDirectoryEditable.directorytypeid"
            :class="`configure-directory ${isConfigureDirectoryVisible ? 'd-block' : 'd-nonen'}`"
          >
            <h6>Configure Directory</h6>
            <!-- TODO generate form from attributes -->

            <DynamicForm 
              :formData="directoryConfiguration" 
            />
            
            <!-- <b-form-group 
              id="directoryLdapUrlGroup"
              label="Ldap Connection Url - Host and Port:"
              label-for="directoryLdapUrlInput"
            >
              <b-form-input
                id="directoryLdapUrlInput"
                type="text"
                v-model="subjectDirectoryEditable.directoryattributes['ldap.url']"
                placeholder="Ldap Connection Url - Host and Port"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group 
              id="directoryLdapBaseDnGroup"
              label="Base DN:"
              label-for="directoryLdapBaseDnInput"
            >
              <b-form-input
                id="directoryLdapBaseDnInput"
                type="text"
                v-model="subjectDirectoryEditable.directoryattributes['ldap.basedn']"
                placeholder="Base DN"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group id="directoryLdapSecureGroup">
              <b-form-checkbox
                id="directoryLdapSecureCheck"
                v-model="subjectDirectoryEditable.directoryattributes['ldap.secure']"
                :value="true"
                :unchecked-value="false"
              >
                Use SSL
              </b-form-checkbox>
            </b-form-group>
            <b-form-group 
              id="directoryLdapUserDnGroup"
              label="Ldap User DN:"
              label-for="directoryLdapUserDnInput"
            >
              <b-form-input
                id="directoryLdapUserDnInput"
                type="text"
                v-model="subjectDirectoryEditable.directoryattributes['ldap.userdn']"
                placeholder="Ldap User DN"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group 
              id="directoryLdapPasswordGroup"
              label="Ldap Password:"
              label-for="directoryLdapPasswordInput"
            >
              <b-form-input
                id="directoryLdapPasswordInput"
                type="password"
                v-model="subjectDirectoryEditable.directoryattributes['ldap.password']"
                placeholder="Ldap Password"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group 
              id="directoryLdapUserFilterGroup"
              label="User Object Filter:"
              label-for="directoryLdapUserFilterInput"
            >
              <b-form-input
                id="directoryLdapUserObjectFilterInput"
                type="text"
                v-model="subjectDirectoryEditable.directoryattributes['ldap.user.filter']"
                placeholder="User Object Filter"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group 
              id="directoryLdapReadTimeoutGroup"
              label="LDAP Read Timeout:"
              label-for="directoryLdapReadTimeoutInput"
            >
              <b-form-input
                id="directoryLdapReadTimeoutInput"
                type="number"
                v-model="subjectDirectoryEditable.directoryattributes['ldap.read.timeout']"
                placeholder="LDAP Read Timeout"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group 
              id="directoryLdapUserNameGroup"
              label="User Name Field Name:"
              label-for="directoryLdapUserNameInput"
            >
              <b-form-input
                id="directoryLdapUserNameInput"
                type="text"
                v-model="subjectDirectoryEditable.directoryattributes['ldap.user.username']"
                placeholder="User Name Field Name"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group 
              id="directoryLdapUserFirstNameGroup"
              label="User First Name Field Name:"
              label-for="directoryLdapUserFirstNameInput"
            >
              <b-form-input
                id="directoryLdapUserFirstNameInput"
                type="text"
                v-model="subjectDirectoryEditable.directoryattributes['ldap.user.firstname']"
                placeholder="User First Name Field Name"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group 
              id="directoryLdapUserLastNameGroup"
              label="User Last Name Field Name:"
              label-for="directoryLdapUserLastNameInput"
            >
              <b-form-input
                id="directoryLdapUserLastNameInput"
                type="text"
                v-model="subjectDirectoryEditable.directoryattributes['ldap.user.lastname']"
                placeholder="User Last Name Field Name"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group 
              id="directoryLdapUserPasswordGroup"
              label="User Password Field Name:"
              label-for="directoryLdapUserPasswordInput"
            >
              <b-form-input
                id="directoryLdapUserPasswordInput"
                type="text"
                v-model="subjectDirectoryEditable.directoryattributes['ldap.user.password']"
                placeholder="User Password Field Name"
              >
              </b-form-input>
            </b-form-group>
            <b-form-group 
              id="directoryLdapUserObjectClassGroup"
              label="User Object Class:"
              label-for="directoryLdapUserObjectClassInput"
            >
              <b-form-input
                id="directoryLdapUserObjectClassInput"
                type="text"
                v-model="subjectDirectoryEditable.directoryattributes['ldap.user.objectclass']"
                placeholder="User Object Class"
              >
              </b-form-input>
            </b-form-group> -->
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
  data() {
    return {
      subjectDirectoryEditable: JSON.parse(JSON.stringify(this.subjectDirectory)),
      isConfigureDirectoryVisible: false,
      directoryConfiguration: {},
    };
  },
  methods: {
    ...mapActions('subjectDirectories', ['putSubjectDirectories']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { putSubjectDirectories, subjectDirectoryEditable, onUpdate } = this;
      putSubjectDirectories({
        ...subjectDirectoryEditable,
        directorypriorityorder: parseInt(subjectDirectoryEditable.directorypriorityorder, 10),
      }).then((response) => {
        if (response && response.data) {
          onUpdate();
        }
      });
    },
    toggleConfigureDirectory() {
      this.isConfigureDirectoryVisible = !this.isConfigureDirectoryVisible;
    },
    handleDirectoryTypeChange(selectedDirectoryId) {
      this.isConfigureDirectoryVisible = true;
      const { subjectDirectoryTypes } = this;
      const directory = subjectDirectoryTypes.find(item => item.uuid === selectedDirectoryId);
      const directoryConfiguration = directory.attributetemplate.components.schemas;
      this.directoryConfiguration = directoryConfiguration;
    },
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