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
    data-qa="modalEditPermissions"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        {{ role === 'edit' ? 'Edit Permission' : 'Add New Permission' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div class="p-3">
          <b-form-group
            id="permissionNameGroup"
            label="Permission Name*:"
            :invalid-feedback="permissionNameInvalidFeedback"
            :state="permissionNameState"
          >
          <b-form-input
            id="permissionNameInput"
            type="text"
            v-model="permissionEditable.permission"
            placeholder="Permission Name"
            :state="permissionNameState"
            required
          >
          </b-form-input>
          </b-form-group>
          <b-form-group
          id="permissionDescriptionGroup"
          label="Description*:"
          label-for="permissionDescriptionTextarea"
          :invalid-feedback="descriptionInvalidFeedback"
          :state="descriptionState"
          >
            <b-form-textarea
              id="permissionDescriptionTextarea"
              v-model="permissionEditable.description"
              placeholder="Description"
              :rows="3"
              :state="descriptionState"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group
          id="permissionOrganizationIdGroup"
          label="Organization*:"
          label-for="permissionOrganizationIdInput"
          :invalid-feedback="organizationIdInvalidFeedback"
          :state="organizationIdState"
          >
          <b-form-select
              id="permissionOrganizationIdInput"
              v-model="permissionEditable.organizationid"
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
          id="permissionAccessManagerIdGroup"
          label="Access Manager*:"
          label-for="permissionAccessManagerIdInput"
          :invalid-feedback="accessManagerIdInvalidFeedback"
          :state="accessManagerIdState"
          >
          <b-form-select
              id="permissionAccessManagerIdInput"
              v-model="permissionEditable.accessmanagerid"
              :options="[
              {
                value: null,
                text: 'Please select',
              },
              ...accessManagers.map(accessManager => ({
                value: accessManager.uuid,
                text: accessManager.accessmanagername,
                disabled: accessManager.isdeleted,
              })),
              ]"
              :state="accessManagerIdState"
          />
          </b-form-group>
          <b-form-group
          id="resourceTypeGroup"
          label="Resource Type*:"
          label-for="resourceTypeInput"
          :invalid-feedback="resourceTypeIdInvalidFeedback"
          :state="resourceTypeIdState"
          >
          <b-form-select
              id="resourceTypeInput"
              v-model="resourceTypeIdEditable"
              :options="[
              {
                value: null,
                text: 'Please select',
              },
              ...resourceTypes.map(resourcetype => ({
              value: resourcetype.uuid,
              text: resourcetype.type,
              })),
              ]"
              :state="resourceTypeIdState"
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
              :options="[
              {
                value: null,
                text: 'Please select',
              },
              ...resources
              .filter(resource => resource.resourcetypeid === resourceTypeIdEditable)
              .map(resource => ({
                value: resource.uuid,
                text: resource.resourcename,
                disabled: resource.isdeleted,
              })),
              ]"
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
              :options="[
              {
                value: null,
                text: 'Please Select',
              },
              ...resourceActions
              .filter(resource => resource.resourcetypeid === resourceTypeIdEditable)
              .map(resourceaction => ({
              value: resourceaction.uuid,
              text: resourceaction.actionname,
              })),
              ]"
          />
          </b-form-group>
          <b-form-group
          id="subjectGroup"
          label="Subject:"
          label-for="subjectInput"
          >
          <b-form-select
            id="subjectInput"
            v-model="permissionEditable.subjectid"
          >
            <optgroup label="ROLES">
              <option
                v-for="(option, index) in roles"
                v-bind:key="index"
                :value="option.uuid"
              >
                {{ option.displayname }}
              </option>
            </optgroup>
            <optgroup label="GROUPS">
              <option
                v-for="(option, index) in groups"
                v-bind:key="index"
                :value="option.uuid"
              >
                {{ option.displayname }}
              </option>
            </optgroup>
            <optgroup label="USERS">
              <option
                v-for="(option, index) in users"
                v-bind:key="index"
                :value="option.uuid"
              >
                {{ option.displayname }}
              </option>
            </optgroup>
            <!-- <optgroup label="APPS">
              <option
                v-for="(option, index) in apps"
                v-bind:key="index"
                :value="option.uuid"
              >
                {{ option.displayname }}
              </option>
            </optgroup> -->

          </b-form-select>
          </b-form-group>
          <b-form-group id="permissionEnabledGroup">
          <b-form-checkbox
              id="permissionEnabledChecks"
              v-model="permissionEditable.isactive"
              :value="true"
              :unchecked-value="false"
          >
              Enabled
          </b-form-checkbox>
          </b-form-group>
          <b-form-group
            id="effectiveStartDateGroup"
            label="Effective Start Date:"
            label-for="effectiveStartDateInput"
            :invalid-feedback="effectiveStartDateInvalidFeedback"
            :state="effectiveStartDateState"
          >
            <b-form-input
              id="effectiveStartDateInput"
              type="date"
              v-model="effectiveStartDate"
              placeholder="Effective Start Date"
              :state="effectiveStartDateState"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="effectiveEndDateGroup"
            label="Effective End Date:"
            label-for="effectiveEndDateInput"
            :invalid-feedback="effectiveEndDateInvalidFeedback"
            :state="effectiveEndDateState"
          >
            <b-form-input
              id="effectiveEndDateInput"
              type="date"
              v-model="effectiveEndDate"
              placeholder="Effective End Date"
              :state="effectiveEndDateState"
              required
            >
            </b-form-input>
          </b-form-group>
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
    apps: {
      type: Array,
      required: false,
      default() { return []; },
    },
    resourceTypeId: {
      type: String,
      required: false,
    },
    roles: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    effectiveStartDate: {
      get() {
        return this.permissionEditable.effectivestartdate.substring(0, 10);
      },
      set(value) {
        const date = new Date(value);
        this.permissionEditable.effectivestartdate = date.toISOString();
      },
    },
    effectiveEndDate: {
      get() {
        return this.permissionEditable.effectiveenddate.substring(0, 10);
      },
      set(value) {
        const date = new Date(value);
        this.permissionEditable.effectiveenddate = date.toISOString();
      },
    },
    effectiveStartDateState() {
      const { effectivestartdate } = this.permissionEditable;
      return effectivestartdate.length > 0;
    },
    // effectiveStartDateInvalidFeedback() {
    //   const { effectivestartdate } = this.permissionEditable;
    //   if (effectivestartdate.length === 0) {
    //     return 'Please enter something';
    //   }
    //   return '';
    // },
    effectiveEndDateState() {
      const { effectiveenddate } = this.permissionEditable;
      return effectiveenddate.length > 0;
    },
    // effectiveEndDateInvalidFeedback() {
    //   const { effectiveenddate } = this.permissionEditable;
    //   if (effectiveenddate.length === 0) {
    //     return 'Please enter something';
    //   }
    //   return '';
    // },
    permissionNameState() {
      const { permission } = this.permissionEditable;
      return permission.length > 0;
    },
    // permissionNameInvalidFeedback() {
    //   const { permission } = this.permissionEditable;
    //   if (permission.length === 0) {
    //     return 'Please enter something';
    //   }
    //   return '';
    // },
    descriptionState() {
      const { description } = this.permissionEditable;
      return description.length > 0;
    },
    // descriptionInvalidFeedback() {
    //   const { description } = this.permissionEditable;
    //   if (description.length === 0) {
    //     return 'Please enter something';
    //   }
    //   return '';
    // },
    organizationIdState() {
      const { organizationid } = this.permissionEditable;
      return organizationid !== null;
    },
    // organizationIdInvalidFeedback() {
    //   const { organizationid } = this.permissionEditable;
    //   if (organizationid === null) {
    //     return 'Please select organization';
    //   }
    //   return '';
    // },
    accessManagerIdState() {
      const { accessmanagerid } = this.permissionEditable;
      return accessmanagerid !== null;
    },
    // accessManagerIdInvalidFeedback() {
    //   const { accessmanagerid } = this.permissionEditable;
    //   if (accessmanagerid === null) {
    //     return 'Please select Access Manager';
    //   }
    //   return '';
    // },
    resourceTypeIdState() {
      return this.resourceTypeIdEditable !== null;
    },
    // resourceTypeIdInvalidFeedback() {
    //   if (this.resourceTypeIdEditable === null) {
    //     return 'Please select Resource Type';
    //   }
    //   return '';
    // },
  },
  data() {
    const { permission } = this;
    const permissionEditable = JSON.parse(JSON.stringify(permission));

    return {
      permissionEditable: {
        ...permissionEditable,
      },
      isConfigureAdministerPermissionVisible: false,
      resourceTypeIdEditable: this.resourceTypeId,
    };
  },
  methods: {
    ...mapActions('permissions', ['putPermissions', 'postPermissions']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { permissionEditable, putPermissions, postPermissions, onUpdate, role } = this;
      if (role === 'edit') {
        putPermissions(permissionEditable)
        .then(() => {
          onUpdate();
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid } = currentUser.props;
        const crudsubjectid = uuid;
        const permissionToUpdate = [{
          ...permissionEditable,
          crudsubjectid,
        }];
        postPermissions(permissionToUpdate)
          .then(() => {
            onUpdate();
          });
      }
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

<style lang="scss" scoped>
</style>