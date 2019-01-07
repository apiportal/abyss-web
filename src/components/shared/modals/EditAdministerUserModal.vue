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
            label="First Name:"
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
            label="Last Name:"
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
            id="userNameGroup"
            label="User Name:"
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
            id="displayNameGroup"
            label="Display Name:"
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
            id="emailGroup"
            label="Email:"
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
              required
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
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="userOrganizationIdGroup"
            label="Organization:"
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
            label="Directory:"
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
              required
            >
            </b-form-textarea>
          </b-form-group>
          <div>
            <Chips
              :chips="computedMemberships"
              :autocompleteOptions="this.groups.map((item) => ({
                text: item.subjectname,
                value: item.uuid,
              }))"
              :onDeleteChip="handleDeleteMembership"
              :onAddChip="handleAddMembership"
              label="User Groups"
            />
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
import Modal from '@/components/shared/modals/Modal';
import Icon from '@/components/shared/Icon';
import Chips from '@/components/shared/Chips';

export default {
  components: {
    Modal,
    Icon,
    Chips,
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
    groups: {
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
      const { groupsEditable } = this;
      return groupsEditable
      .filter(group => group.isMembership)
      .sort((a, b) => b.sortTime - a.sortTime)
      .map(group => ({
        value: group.uuid,
        text: group.subjectname,
      }));
    },
  },
  data() {
    const { user, groups, memberships } = this;
    return {
      userEditable: JSON.parse(JSON.stringify(user)),
      groupsEditable: [...JSON.parse(JSON.stringify(groups))].map((group) => {
        const isMembership =
          Boolean(memberships.find(membership => membership.subjectgroupid === group.uuid));
        const sortTime = (new Date()).getTime();
        return {
          ...group,
          isMembership,
          sortTime,
        };
      }),
    };
  },
  methods: {
    handleSubmit(evt) {
      evt.preventDefault();
      // console.log(this.userEditable);
    },
    handleDeleteMembership({ uuid }) {
      const { groupsEditable } = this;
      this.groupsEditable = groupsEditable.map((group) => {
        const isMembership = group.uuid === uuid ? false : group.isMembership;
        return {
          ...group,
          isMembership,
        };
      });
    },
    handleAddMembership({ uuid }) {
      const { groupsEditable } = this;
      this.groupsEditable = groupsEditable.map((group) => {
        const isMembership = group.uuid === uuid ? true : group.isMembership;
        const sortTime = (new Date()).getTime();
        return {
          ...group,
          isMembership,
          sortTime,
        };
      });
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
