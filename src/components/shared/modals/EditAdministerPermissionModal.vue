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
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="administerPermissionNameGroup"
            label="Name:"
            label-for="administerPermissionNameInput"
          >
            <b-form-input
              id="administerPermissionNameInput"
              type="text"
              v-model="administerPermissionEditable.administerpermissionname"
              placeholder="Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="administerPermissionDescriptionGroup"
            label="Description:"
            label-for="administerPermissionDescriptionTextarea"
          >
            <b-form-textarea
              id="administerPermissionDescriptionTextarea"
              v-model="administerPermissionEditable.description"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group 
            id="administerPermissionPriorityOrderGroup"
            label="Priority Order:"
            label-for="administerPermissionPriorityOrderInput"
          >
            <b-form-input
              id="administerPermissionPriorityOrderInput"
              type="number"
              v-model="administerPermissionEditable.administerPermissionpriorityorder"
              placeholder="Priority Order"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group id="administerPermissionEnabledGroup">
            <b-form-checkbox
              id="administerPermissionEnabledChecks"
              v-model="administerPermissionEditable.isactive"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
          </b-form-group>
          <b-form-group 
            id="administerPermissionOrganizationIdGroup"
            label="Organization:"
            label-for="administerPermissionOrganizationIdInput"
          >
            <b-form-select
              id="administerPermissionOrganizationIdInput"
              v-model="administerPermissionEditable.organizationid" 
              :options="organizations.map(organization => ({
                value: organization.uuid,
                text: organization.name,
              }))"
            />
          </b-form-group>
          <div class="row">
            <div class="col-12">
              <label for="administerPermissionTypeInput">AdministerPermission Type:</label>
            </div>
            <div class="col-10">
              <b-form-group 
                id="administerPermissionTypeGroup"
              >
                <b-form-select
                  id="administerPermissionTypeInput"
                  v-model="administerPermissionEditable.administerpermissiontypeid" 
                  :options="administerPermissionTypes.map(administerPermissionType => ({
                    value: administerPermissionType.uuid,
                    text: administerPermissionType.typename,
                  }))"
                  @change="handleAdministerPermissionTypeChange"
                />
              </b-form-group>
            </div>
            <div class="col-2">
              <b-button
                variant="primary"
                block
                v-b-tooltip.hover
                title="Configure AdministerPermission"
                @click="toggleConfigureAdministerPermission"
                :disabled="!administerPermissionEditable.administerpermissiontypeid"
              >
                <Icon icon="cog" />
              </b-button>
            </div>
          </div>
          <div 
            v-if="administerPermissionEditable.administerpermissiontypeid"
            :class="`configure-administer-permission ${isConfigureAdministerPermissionVisible ? 'd-block' : 'd-none'}`"
          >
            <h6>Configure Administer Permission</h6>
            <!-- TODO generate form from attributes -->
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
    administerPermission: {
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
    role: {
      type: String,
      required: false,
      default() { return 'edit'; },
    },
  },
  data() {
    return {
      administerPermissionEditable: JSON.parse(JSON.stringify(this.administerPermission)),
      isConfigureAdministerPermissionVisible: false,
    };
  },
  methods: {
    ...mapActions('administerPermissions', ['putAdministerPermissions']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { putAdministerPermissions, administerPermissionEditable, onUpdate } = this;
      putAdministerPermissions({
        ...administerPermissionEditable,
        administerpermissionpriorityorder: parseInt(
          administerPermissionEditable.administerpermissionpriorityorder,
          10),
      }).then((response) => {
        if (response && response.data) {
          onUpdate();
        }
      });
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