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
    data-qa="modalEditRoleUsers"
  >
    <template slot="header">
      <h5 class="modal-title">
        Edit Role Users of {{selectedRole.displayname}}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div class="p-3">
          <div>
            <Chips
              :chips="computedMemberships"
              :autocompleteOptions="roleUsersEditable"
              :onDeleteChip="handleDeleteRoleUsers"
              :onAddChip="handleAddRoleUsers"
              label="Role Users"
            />
          </div>
        </div>
        <footer class="modal-footer">
          <b-button
            variant="link"
            @click="onClose"
          >
            Cancel
          </b-button>
          <b-button
            variant="primary"
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
      users: {
        type: Array,
        required: false,
        default() { return []; },
      },
      selectedRole: {
        type: Object,
        required: false,
      },
      memberships: {
        type: Array,
        required: false,
        default() { return []; },
      },
    },
    computed: {
      ...mapState({
        currentUser: state => state.user,
        roleMemberships: state => state.roleMemberships.items,
      }),
      computedMemberships() {
        const { roleUsersEditable } = this;
        return roleUsersEditable
        .filter(user => user.isAttached)
        .sort((a, b) => b.sortTime - a.sortTime);
      },
    },
    data() {
      const { users, memberships, selectedRole } = this;
      return {
        roleUsersEditable: [...JSON.parse(JSON.stringify(users))].map((user) => {
          const membership = memberships.find(m =>
            m.subjectid === user.uuid &&
            m.subjectgroupid === selectedRole.uuid,
          );
          const isAttached = Boolean(membership);
          const sortTime = (new Date()).getTime();
          return {
            ...user,
            value: user.uuid,
            text: user.displayname,
            isAttached,
            membership,
            sortTime,
          };
        }),
        usersToAdd: [],
        usersToDelete: [],
      };
    },
    methods: {
      ...mapActions('roleMemberships', ['deleteRoleMemberships', 'postRoleMemberships']),
      handleSubmit(evt) {
        const { selectedRole, roleUsersEditable, postRoleMemberships,
          deleteRoleMemberships, onUpdate } = this;
        evt.preventDefault();
        this.usersToDelete = roleUsersEditable
          .filter(user => user.membership && !user.isAttached)
          .map(user => (user.membership));
        this.usersToAdd = roleUsersEditable
          .filter(user => !user.membership && user.isAttached)
          .map(user => ({
            organizationid: this.currentUser.organizationid,
            crudsubjectid: this.currentUser.props.uuid,
            subjectid: user.uuid,
            subjectgroupid: selectedRole.uuid,
            subjecttypeid: user.subjecttypeid,
            subjectgrouptypeid: selectedRole.subjecttypeid,
            subjectdirectoryid: user.subjectdirectoryid,
            isactive: true,
          }));
        if (this.usersToDelete.length) {
          for (let i = 0; i < this.usersToDelete.length; i += 1) {
            deleteRoleMemberships(this.usersToDelete[i]).then((response) => {
              if (response && response.data) {
                onUpdate();
              }
            });
          }
        }
        if (this.usersToAdd.length) {
          for (let i = 0; i < this.usersToAdd.length; i += 1) {
            postRoleMemberships([this.usersToAdd[i]]).then((response) => {
              if (response && response.data) {
                onUpdate();
              }
            });
          }
        }
      },
      handleDeleteRoleUsers(index, chip) {
        const { roleUsersEditable } = this;
        this.roleUsersEditable = roleUsersEditable.map((item) => {
          const isAttached = item.uuid === chip.value ? false : item.isAttached;
          return {
            ...item,
            isAttached,
          };
        });
      },
      handleAddRoleUsers(chip) {
        const { roleUsersEditable } = this;
        this.roleUsersEditable = roleUsersEditable.map((item) => {
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

<style lang="scss" scoped>
</style>