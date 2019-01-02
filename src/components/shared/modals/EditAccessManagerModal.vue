<template>
  <Modal
    bodyClass="edit-access-manager"
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
        {{ role === 'edit' ? 'Edit Access Manager' : 'Add New Access Manager' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="accessManagerNameGroup"
            label="Name:"
            label-for="accessManagerNameInput"
          >
            <b-form-input
              id="accessManagerNameInput"
              type="text"
              v-model="accessManagerEditable.accessmanagername"
              placeholder="Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="accessManagerDescriptionGroup"
            label="Description:"
            label-for="accessManagerDescriptionTextarea"
          >
            <b-form-textarea
              id="accessManagerDescriptionTextarea"
              v-model="accessManagerEditable.description"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group 
            id="accessManagerPriorityOrderGroup"
            label="Priority Order:"
            label-for="accessManagerPriorityOrderInput"
          >
            <b-form-input
              id="accessManagerPriorityOrderInput"
              type="number"
              v-model="accessManagerEditable.accessManagerpriorityorder"
              placeholder="Priority Order"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group id="accessManagerEnabledGroup">
            <b-form-checkbox
              id="accessManagerEnabledChecks"
              v-model="accessManagerEditable.isactive"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
          </b-form-group>
          <b-form-group 
            id="accessManagerOrganizationIdGroup"
            label="Organization:"
            label-for="accessManagerOrganizationIdInput"
          >
            <b-form-select
              id="accessManagerOrganizationIdInput"
              v-model="accessManagerEditable.organizationid" 
              :options="organizations.map(organization => ({
                value: organization.uuid,
                text: organization.name,
              }))"
            />
          </b-form-group>
          <div class="row">
            <div class="col-12">
              <label for="accessManagerTypeInput">AccessManager Type:</label>
            </div>
            <div class="col-10">
              <b-form-group 
                id="accessManagerTypeGroup"
              >
                <b-form-select
                  id="accessManagerTypeInput"
                  v-model="accessManagerEditable.accessmanagertypeid" 
                  :options="accessManagerTypes.map(accessManagerType => ({
                    value: accessManagerType.uuid,
                    text: accessManagerType.typename,
                  }))"
                  @change="handleAccessManagerTypeChange"
                />
              </b-form-group>
            </div>
            <div class="col-2">
              <b-button
                variant="primary"
                block
                v-b-tooltip.hover
                title="Configure AccessManager"
                @click="toggleConfigureAccessManager"
                :disabled="!accessManagerEditable.accessmanagertypeid"
              >
                <Icon icon="cog" />
              </b-button>
            </div>
          </div>
          <div 
            v-if="accessManagerEditable.accessmanagertypeid"
            :class="`configure-access-manager ${isConfigureAccessManagerVisible ? 'd-block' : 'd-none'}`"
          >
            <h6>Configure Access Manager</h6>
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
    accessManager: {
      type: Object,
      required: false,
    },
    accessManagerTypes: {
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
      accessManagerEditable: JSON.parse(JSON.stringify(this.accessManager)),
      isConfigureAccessManagerVisible: false,
    };
  },
  methods: {
    ...mapActions('accessManagers', ['putAccessManagers']),
    handleSubmit(evt) {
      evt.preventDefault();
      this.putAccessManagers({
        ...this.accessManagerEditable,
        accessmanagerpriorityorder: parseInt(
          this.accessManagerEditable.accessmanagerpriorityorder,
          10,
        ),
      });
      this.onUpdate();
    },
    toggleConfigureAccessManager() {
      this.isConfigureAccessManagerVisible = !this.isConfigureAccessManagerVisible;
    },
    handleAccessManagerTypeChange() {
      this.isConfigureAccessManagerVisible = true;
    },
  },
};
</script>

<style lang="scss">
.modal-body {
  &.edit-access-manager {
    padding: 0;
  }
}

.configure-access-manager {
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