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
              {{computedOrganizationOwner}}
              <hr>
              {{organizationOwner}}
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
            {{computedOrganizationUsers}}
            <Chips
              :chips="computedOrganizationUsers"
              :autocompleteOptions="this.organizationUsersEditable.map((item) => ({
                text: item.displayname,
                value: item.uuid,
                isOrganizationUser: item.isOrganizationUser,
                color: item.color,
              }))"
              :onDeleteChip="handleDeleteOrganizationUser"
              :onAddChip="handleAddOrganizationUser"
              label="Organization Users"
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
        user.isowner = true;
        // console.log(newval, ownerNew);
        return ownerNew;
      },
    },
    computedOrganizationUsers() {
      const { organizationUsersEditable, chipColor } = this;
      return organizationUsersEditable
      .filter(user => user.isOrganizationUser)
      .sort((a, b) => b.sortTime - a.sortTime)
      .map(user => ({
        value: user.uuid,
        text: user.displayname,
        isdeleted: user.isdeleted,
        isOrganizationUser: user.isOrganizationUser,
        isowner: user.organizationuser ? user.organizationuser.isowner : false,
        color: chipColor(user),
      }));
    },
  },
  data() {
    const { users, organizationUsers } = this;
    return {
      organizationUsersEditable: [...JSON.parse(JSON.stringify(users))]
      .map((user) => {
        const organizationuser = organizationUsers.find(
        o => o.subjectid === user.uuid);
        const isOrganizationUser = Boolean(organizationuser);
        const sortTime = (new Date()).getTime();
        return {
          ...user,
          isOrganizationUser,
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
      if (item.isOrganizationUser && item.organizationuser && item.organizationuser.isowner) {
        return 'btn-success';
      } else if (!item.isOrganizationUser &&
        item.organizationuser && item.organizationuser.isowner) {
        return 'btn-error';
      }
      return 'btn-secondary';
    },
    handleSubmit(evt) {
      const { organization, organizationUsersEditable, postSubjectOrganizations,
        deleteSubjectOrganizations, onUpdate } = this;
      evt.preventDefault();
      this.usersToDelete = organizationUsersEditable
      .filter(user => user.organizationuser && !user.isOrganizationUser)
      .map(user => (user.organizationuser));
      this.usersToAdd = organizationUsersEditable
      .filter(user => !user.organizationuser && user.isOrganizationUser)
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
        const isOrganizationUser = item.uuid === chip.value ? false : item.isOrganizationUser;
        return {
          ...item,
          isOrganizationUser,
        };
      });
    },
    handleAddOrganizationUser(chip) {
      const { organizationUsersEditable } = this;
      this.organizationUsersEditable = organizationUsersEditable.map((item) => {
        // console.log(item.uuid, chip.value);
        const isOrganizationUser = item.uuid === chip.value ? true : item.isOrganizationUser;
        const sortTime = (new Date()).getTime();
        return {
          ...item,
          isOrganizationUser,
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
