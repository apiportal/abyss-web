<template>
  <Modal
    bodyClass="edit-role-users"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalEditRoleUsers"
  >
    <template slot="header">
      <h5 class="modal-title">
        Edit Role Users of {{role.displayname}}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <div class="form-group">
            <Chips
              :chips="computedRoleUsers"
              :autocompleteOptions="usersEditable"
              :onDeleteChip="handleDeleteRoleUsers"
              :onAddChip="handleAddRoleUsers"
              label="Role Users"
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
      user: {
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
      rolePermissions: {
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
      computedRoleUsers() {
        const { usersEditable, chipColor } = this;
        return usersEditable
          .filter(user => user.isAttached)
          .sort((a, b) => b.sortTime - a.sortTime)
          .map(user => ({
            ...user,
            isAttached: user.isAttached,
            isowner: user.userrole ? user.userrole.isowner : false,
            color: chipColor(user),
          }));
      },
    },
    data() {
      const { users, rolePermissions, chipColor } = this;
      return {
        usersEditable: [...JSON.parse(JSON.stringify(users))].map((user) => {
          const userrole = rolePermissions.find(
            o => o.userrefid === user.uuid);
          const isAttached = Boolean(userrole);
          const sortTime = (new Date()).getTime();
          return {
            ...user,
            text: user.displayname,
            value: user.uuid,
            color: chipColor(user),
            isAttached,
            userrole,
            sortTime,
          };
        }),
        usersToAdd: [],
        usersToDelete: [],
      };
    },
    methods: {
      ...mapActions('subjectOrganizations', ['deleteSubjectOrganizations', 'postSubjectOrganizations']),
      chipColor(item) {
        if (item.isAttached && item.userrole && item.userrole.isowner) {
          return 'btn-success';
        } else if (!item.isAttached &&
          item.userrole && item.userrole.isowner) {
          return 'btn-danger';
        }
        return 'btn-secondary';
      },
      handleSubmit(evt) {
        const { usersEditable, postSubjectOrganizations,
          deleteSubjectOrganizations, onUpdate } = this;
        evt.preventDefault();
        this.usersToDelete = usersEditable
          .filter(permission => permission.userrole && !permission.isAttached)
          .map(permission => (permission.userrole));
        this.usersToAdd = usersEditable
          .filter(permission => !permission.userrole && permission.isAttached)
          .map(permission => ({
            // organizationid: this.currentUser.props.organizationid,
            organizationid: permission.organizationid,
            crudsubjectid: this.currentUser.props.uuid,
            subjectid: this.user.uuid,
            userrefid: this.user.uuid,
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
      handleDeleteRoleUsers(index, chip) {
        const { usersEditable } = this;
        this.usersEditable = usersEditable.map((item) => {
          const isAttached = item.uuid === chip.value ? false : item.isAttached;
          return {
            ...item,
            isAttached,
          };
        });
      },
      handleAddRoleUsers(chip) {
        const { usersEditable } = this;
        this.usersEditable = usersEditable.map((item) => {
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
    &.edit-role-users {
      padding: 0;
    }
  }
</style>
