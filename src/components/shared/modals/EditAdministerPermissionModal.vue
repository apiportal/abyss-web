<template>
  <Modal
    bodyClass="edit-administer-permission"
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
        {{ role === 'edit' ? 'Edit Administer Permission' : 'Add New Administer Permission' }}
      </h5>
    </template>
    <template>
      <b-form 
      >
        <div style="padding: 1rem;">
          <b-form-group
            id="permissionNameGroup"
            label="Permission Name:"
          >
          <b-form-input
            id="permissionNameInput"
            type="text"
            v-model="permissionEditable.permission"
            placeholder="Permission Name"
            required
          >
          </b-form-input>
          </b-form-group>
          <b-form-group 
          id="permissionDescriptionGroup"
          label="Description:"
          label-for="permissionDescriptionTextarea"
          >
            <b-form-textarea
              id="permissionDescriptionTextarea"
              v-model="permissionEditable.description"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group 
          id="permissionOrganizationIdGroup"
          label="Organization:"
          label-for="permissionOrganizationIdInput"
          >
          <b-form-select
              id="permissionOrganizationIdInput"
              v-model="permissionEditable.organizationid"
              :options="organizations.map(organization => ({
              value: organization.uuid,
              text: organization.name,
              }))"
          />
          </b-form-group>
          <b-form-group 
          id="permissionAccessManagerIdGroup"
          label="Access Manager:"
          label-for="permissionAccessManagerIdInput"
          >
          <b-form-select
              id="permissionAccessManagerIdInput"
              v-model="permissionEditable.accessmanagerid"
              :options="accessManagers.map(accessManager => ({
              value: accessManager.uuid,
              text: accessManager.accessmanagername,
              }))"
          />
          </b-form-group>
          <b-form-group 
          id="resourceTypeGroup"
          label="Resource Type:"
          label-for="resourceTypeInput"
          >
          <b-form-select
              id="resourceTypeInput"
              :options="resourceTypes.map(resourcetype => ({
              value: resourcetype.uuid,
              text: resourcetype.type,
              }))"
          />
          </b-form-group>
          <b-form-group 
          id="resourceGroup"
          label="Resource:"
          label-for="resourceInput"
          >
          <b-form-select
              id="resourceInput"
              v-model="permissionEditable.resourceid"
              :options="resources.map(resource => ({
              value: resource.uuid,
              text: resource.resourcename,
              }))"
          />
          </b-form-group>
          <b-form-group 
          id="resourceActionGroup"
          label="Resource Action:"
          label-for="resourceActionInput"
          >
          <b-form-select
              id="resourceActionInput"
              v-model="permissionEditable.resourceactionid"
              :options="resourceActions.map(resourceaction => ({
              value: resourceaction.uuid,
              text: resourceaction.actionname,
              }))"
          />
          </b-form-group>
          <b-form-group 
          id="subjectGroup"
          label="Subject:"
          label-for="subjectInput"
          >
          <b-form-select id="subjectInput">
            <optgroup label='GROUPS'>
              <!-- <option>{{this.groups.map(group => (group.displayname))}}</option> -->
            </optgroup>
            <optgroup label='USERS'>
              <!-- <option>{{this.users.map(user => (user.displayname))}}</option> -->
            </optgroup>
          </b-form-select>
          </b-form-group>
          <b-form-group id="permissionEnabledGroup">
          <b-form-checkbox
              id="permissionEnabledChecks"
              :value="true"
              :unchecked-value="false"
          >
              Enabled
          </b-form-checkbox>
          </b-form-group>
          <b-form-group
            id="permissionEffectiveFrom"
            label="Effective From:"
          >
          <b-form-input
            id="permissionEffectiveFromInput"
            type="datetime-local"
            required
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
            id="permissionEffectiveTo"
            label="Effective To:"
          >
          <b-form-input
            id="permissionEffectiveToInput"
            type="datetime-local"
            required
          >
          </b-form-input>
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
    permission: {
      type: Object,
      required: false,
    },
    administerPermissionTypes: {
      type: Array,
      required: false,
      default() { return []; },
    },
    organizations: {
      type: Array,
      required: false,
      default() { return []; },
    },
    accessManagers: {
      type: Array,
      required: false,
      default() { return []; },
    },
    resources: {
      type: Array,
      required: false,
      default() { return []; },
    },
    resourceTypes: {
      type: Array,
      required: false,
      default() { return []; },
    },
    resourceActions: {
      type: Array,
      required: false,
      default() { return []; },
    },
    role: {
      type: String,
      required: false,
      default() { return 'edit'; },
    },
    users: {
      type: Array,
      required: false,
      default() { return []; },
    },
    groups: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
  data() {
    return {
      permissionEditable: JSON.parse(JSON.stringify(this.permission)),
      isConfigureAdministerPermissionVisible: false,
      // options: {
      //   USERS: this.users.map(user => ({
      //     value: user.uuid,
      //     text: user.displayname,
      //   })),
      //   GROUPS: this.groups.map(group => ({
      //     value: group.uuid,
      //     text: group.displayname,
      //   })),
      // },
    };
  },
  methods: {
    ...mapActions('permissions', ['putPermissions']),
    handleSubmit(evt) {
      evt.preventDefault();
      this.putPermissions({
        ...this.permissionEditable,
      });
      this.onUpdate();
    },
    toggleConfigureAdministerPermission() {
      this.isConfigureAdministerPermissionVisible = !this.isConfigureAdministerPermissionVisible;
    },
    handleAdministerPermissionTypeChange() {
      this.isConfigureAdministerPermissionVisible = true;
    },
  },
};
</script>

<style lang="scss">
.modal-body {
  &.edit-administer-permission {
    padding: 0;
  }
}

.configure-administer-permission {
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