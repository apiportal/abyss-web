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
        Edit Organization Users of {{organization.name}}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="organizationOwnerGroup"
          >
            <label>
              Owner:
              <span class="text-danger">*</span>
              <!-- {{computedOrganizationOwner}}
              <hr>
              {{organizationOwner}} -->
            </label>
            <b-form-select
              id="organizationOwnerInput"
              v-model="computedOrganizationOwner" 
              :options="[
                { value: null, text: 'Please Select'},
                ...computedOrganizationUsers.map(user => ({
                  value: user,
                  text: user.text,
                  disabled: user.isdeleted,
                }))
              ]"
              required
            />
          </b-form-group>
          <div class="form-group">
            <!-- {{computedOrganizationUsers}} -->
            <Chips
              :chips="computedOrganizationUsers"
              :autocompleteOptions="organizationUsersEditable"
              :onDeleteChip="handleDeleteOrganizationUser"
              :onAddChip="handleAddOrganizationUser"
              label="Organization Users"
            />
            <!-- <Chips
              :chips="computedOrganizationUsers"
              :autocompleteOptions="this.organizationUsersEditable.map((item) => ({
                text: item.displayname,
                value: item.uuid,
                isdeleted: item.isdeleted,
                isAttached: item.isAttached,
                color: chipColor(item),
              }))"
              :onDeleteChip="handleDeleteOrganizationUser"
              :onAddChip="handleAddOrganizationUser"
              label="Organization Users"
            /> -->
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
import { mapActions, mapState } from 'vuex';
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
    organization: {
      type: Object,
      required: false,
    },
    subjectDirectories: {
      type: Array,
      required: false,
      default() { return []; },
    },
    users: {
      type: Array,
      required: false,
      default() { return []; },
    },
    role: {
      type: String,
      required: false,
      default() { return 'edit'; },
    },
    organizationUsers: {
      type: Array,
      required: false,
      default() { return []; },
    },
    title: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    // computedOrganizationOwner() {
    //   const { computedOrganizationUsers } = this;
    //   const owner = computedOrganizationUsers.find(user => user.isowner);
    //   const ownerToAdd = computedOrganizationUsers.find(
    //     user => user.crudsubjectid === user.subjectid);
    //   if (owner) {
    //     return owner;
    //   } else if (ownerToAdd) {
    //     return ownerToAdd;
    //   }
    //   return null;
    // },
    computedOrganizationOwner: {
      get() {
        const { computedOrganizationUsers } = this;
        const owner = computedOrganizationUsers.find(user => user.isowner);
        const ownerToAdd = computedOrganizationUsers.find(
          user => user.crudsubjectid === user.subjectid);
        if (owner) {
          // console.log(owner);
          return owner;
        } else if (ownerToAdd) {
          return ownerToAdd;
        }
        return null;
      },
      set(newval) {
        const { computedOrganizationUsers } = this;
        const ownerNew = computedOrganizationUsers.find(user => user.value === newval.value);
        const user = newval;
        if (user) {
          user.isowner = true;
        }
        // console.log(newval, ownerNew);
        return ownerNew;
      },
    },
    computedOrganizationUsers() {
      const { organizationUsersEditable, chipColor } = this;
      return organizationUsersEditable
      .filter(user => user.isAttached)
      .sort((a, b) => b.sortTime - a.sortTime)
      .map(user => ({
        ...user,
        isAttached: user.isAttached,
        isowner: user.organizationuser ? user.organizationuser.isowner : false,
        disabled: user.organizationuser ? user.organizationuser.isowner : false,
        color: chipColor(user),
      }));
    },
  },
  data() {
    const { users, organizationUsers, chipColor } = this;
    return {
      organizationUsersEditable: [...JSON.parse(JSON.stringify(users))]
      .map((user) => {
        const organizationuser = organizationUsers.find(
        o => o.subjectid === user.uuid);
        const isAttached = Boolean(organizationuser);
        const sortTime = (new Date()).getTime();
        return {
          ...user,
          text: user.displayname,
          value: user.uuid,
          color: chipColor(user),
          isAttached,
          organizationuser,
          sortTime,
        };
      }),
      usersToAdd: [],
      usersToDelete: [],
      organizationOwner: null,
    };
  },
  methods: {
    ...mapActions('subjectOrganizations', ['deleteSubjectOrganizations', 'postSubjectOrganizations']),
    chipColor(item) {
      if (item.isAttached && item.organizationuser && item.organizationuser.isowner) {
        return 'btn-success';
      } else if (!item.isAttached &&
        item.organizationuser && item.organizationuser.isowner) {
        return 'btn-danger';
      }
      return 'btn-secondary';
    },
    handleSubmit(evt) {
      const { organization, organizationUsersEditable, postSubjectOrganizations,
        deleteSubjectOrganizations, onUpdate } = this;
      evt.preventDefault();
      this.usersToDelete = organizationUsersEditable
      .filter(user => user.organizationuser && !user.isAttached)
      .map(user => (user.organizationuser));
      this.usersToAdd = organizationUsersEditable
      .filter(user => !user.organizationuser && user.isAttached)
      .map(user => ({
        // organizationid: this.currentUser.props.organizationid,
        organizationid: organization.uuid,
        crudsubjectid: this.currentUser.props.uuid,
        subjectid: user.uuid,
        organizationrefid: organization.uuid,
        isowner: false,
        isactive: true,
      }));
      if (this.usersToDelete.length) {
        // console.log('usersToDelete', this.usersToDelete);
        for (let i = 0; i < this.usersToDelete.length; i += 1) {
          deleteSubjectOrganizations(this.usersToDelete[i]).then((response) => {
            if (response && response.data) {
              onUpdate();
            }
          });
        }
      }
      if (this.usersToAdd.length) {
        // console.log('usersToAdd', this.usersToAdd);
        for (let i = 0; i < this.usersToAdd.length; i += 1) {
          postSubjectOrganizations([this.usersToAdd[i]]).then((response) => {
            if (response && response.data) {
              onUpdate();
            }
          });
        }
      }
    },
    handleDeleteOrganizationUser(index, chip) {
      const { organizationUsersEditable } = this;
      this.organizationUsersEditable = organizationUsersEditable.map((item) => {
        // console.log(item.uuid, chip.value);
        const isAttached = item.uuid === chip.value ? false : item.isAttached;
        return {
          ...item,
          isAttached,
        };
      });
    },
    handleAddOrganizationUser(chip) {
      const { organizationUsersEditable } = this;
      this.organizationUsersEditable = organizationUsersEditable.map((item) => {
        // console.log(item.uuid, chip.value);
        const isAttached = item.uuid === chip.value ? true : item.isAttached;
        const sortTime = (new Date()).getTime();
        return {
          ...item,
          isAttached,
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
