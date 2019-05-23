<template>
  <Modal
    bodyClass="edit-role-groups"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalEditRoleGroups"
  >
    <template slot="header">
      <h5 class="modal-title">
        Edit Role Groups of {{selectedRole.displayname}}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <div class="form-group">
            <Chips
              :chips="computedMemberships"
              :autocompleteOptions="roleGroupsEditable"
              :onDeleteChip="handleDeleteRoleGroups"
              :onAddChip="handleAddRoleGroups"
              label="Role Groups"
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
      groups: {
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
        const { roleGroupsEditable } = this;
        console.log('computedMemberships-roleGroupsEditable', roleGroupsEditable); //eslint-disable-line
        return roleGroupsEditable
        .filter(group => group.isAttached)
        .sort((a, b) => b.sortTime - a.sortTime);
      },
    },
    data() {
      const { groups, memberships, selectedRole } = this;
      return {
        roleGroupsEditable: [...JSON.parse(JSON.stringify(groups))].map((group) => {
          const membership = memberships.find(m =>
            m.subjectid === group.uuid &&
            m.subjectgroupid === selectedRole.uuid,
          );
          const isAttached = Boolean(membership);
          const sortTime = (new Date()).getTime();
          return {
            ...group,
            value: group.uuid,
            text: group.displayname,
            isAttached,
            membership,
            sortTime,
          };
        }),
        groupsToAdd: [],
        groupsToDelete: [],
      };
    },
    methods: {
      ...mapActions('groupRoleMemberships', ['deleteGroupRoleMemberships', 'postGroupRoleMemberships']),
      handleSubmit(evt) {
        const { selectedRole, roleGroupsEditable, postGroupRoleMemberships,
          deleteGroupRoleMemberships, onUpdate } = this;
        evt.preventDefault();
        this.groupsToDelete = roleGroupsEditable
          .filter(group => group.membership && !group.isAttached)
          .map(group => (group.membership));
        this.groupsToAdd = roleGroupsEditable
          .filter(group => !group.membership && group.isAttached)
          .map(group => ({
            organizationid: group.organizationid,
            crudsubjectid: this.currentUser.props.uuid,
            subjectid: group.uuid,
            subjectgroupid: selectedRole.uuid,
            subjecttypeid: group.subjecttypeid,
            subjectgrouptypeid: selectedRole.subjecttypeid,
            subjectdirectoryid: group.subjectdirectoryid,
            grouprefid: group.uuid,
            isactive: true,
          }));
        if (this.groupsToDelete.length) {
          for (let i = 0; i < this.groupsToDelete.length; i += 1) {
            deleteGroupRoleMemberships(this.groupsToDelete[i]).then((response) => {
              if (response && response.data) {
                onUpdate();
              }
            });
          }
        }
        if (this.groupsToAdd.length) {
          for (let i = 0; i < this.groupsToAdd.length; i += 1) {
            postGroupRoleMemberships([this.groupsToAdd[i]]).then((response) => {
              if (response && response.data) {
                onUpdate();
              }
            });
          }
        }
      },
      handleDeleteRoleGroups(index, chip) {
        const { roleGroupsEditable } = this;
        this.roleGroupsEditable = roleGroupsEditable.map((item) => {
          const isAttached = item.uuid === chip.value ? false : item.isAttached;
          return {
            ...item,
            isAttached,
          };
        });
      },
      handleAddRoleGroups(chip) {
        const { roleGroupsEditable } = this;
        this.roleGroupsEditable = roleGroupsEditable.map((item) => {
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
    &.edit-role-groups {
      padding: 0;
    }
  }
</style>
