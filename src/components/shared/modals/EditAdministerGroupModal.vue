<template>
  <Modal
    bodyClass="edit-administer-group"
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
        {{ role === 'edit' ? 'Edit Administer Group' : 'Add New Administer Group' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="groupNameGroup"
            label="Group Name:"
            label-for="groupNameInput"
          >
            <b-form-input
              id="groupNameInput"
              type="text"
              v-model="groupEditable.subjectname"
              placeholder="Group Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="displayNameGroup"
            label="Display Name:"
            label-for="displayNameInput"
          >
            <b-form-input
              id="displayNameInput"
              type="text"
              v-model="groupEditable.displayname"
              placeholder="Display Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group id="groupEnabledGroup">
            <b-form-checkbox
              id="groupEnabledChecks"
              v-model="groupEditable.isactivated"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
          </b-form-group>
          
          <b-form-group 
            id="urlGroup"
            label="URL:"
            label-for="urlInput"
          >
            <b-form-input
              id="urlInput"
              type="text"
              v-model="groupEditable.url"
              placeholder="URL"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="groupOrganizationIdGroup"
            label="Organization:"
            label-for="groupOrganizationIdInput"
          >
            <b-form-select
              id="groupOrganizationIdInput"
              v-model="groupEditable.organizationid" 
              :options="organizations.map(organization => ({
                value: organization.uuid,
                text: organization.name,
              }))"
            />
          </b-form-group>
          <b-form-group 
            id="groupDirectoryIdGroup"
            label="Directory:"
            label-for="groupDirectoryIdInput"
          >
            <b-form-select
              id="groupDirectoryIdInput"
              v-model="groupEditable.subjectdirectoryid" 
              :options="subjectDirectories.map(subjectDirectory => ({
                value: subjectDirectory.uuid,
                text: subjectDirectory.directoryname,
              }))"
            />
          </b-form-group>
          <b-form-group 
            id="groupDescriptionGroup"
            label="Description:"
            label-for="groupDescriptionTextarea"
          >
            <b-form-textarea
              id="groupDescriptionTextarea"
              v-model="groupEditable.description"
              placeholder="Description"
              :rows="3"
              required
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
    group: {
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
    users: {
      type: Array,
      required: false,
      default() { return []; },
    },
    memberships: {
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
    computedMemberships() {
      return this.memberships.map((item) => {
        const itemUser = this.users.find(user => user.uuid === item.subjectid);
        return {
          value: itemUser.uuid,
          text: (itemUser ? itemUser.displayname : itemUser.uuid),
        };
      });
    },
  },
  data() {
    return {
      groupEditable: JSON.parse(JSON.stringify(this.group)),
    };
  },
  methods: {
    ...mapActions('groups', ['putGroups']),
    handleSubmit(evt) {
      evt.preventDefault();
      this.putGroups({
        ...this.groupEditable,
        firstname: this.groupEditable.displayname,
        lastname: this.groupEditable.displayname,
        email: `${this.groupEditable.subjectname}@verapi.com`,
        secondaryemail: `${this.groupEditable.subjectname}@verapi.com`,
      });
      this.onUpdate();
    },
  },
};
</script>

<style lang="scss">
.modal-body {
  &.edit-administer-group {
    padding: 0;
  }
}
</style>
