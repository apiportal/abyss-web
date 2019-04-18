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
        Edit Role Groups of {{role.displayname}}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <div class="form-group">
            <Chips
              :chips="computedRoleGroups"
              :autocompleteOptions="groupsEditable"
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
      user: {
        type: Object,
        required: false,
      },
      subjectDirectories: {
        type: Array,
        required: false,
        default() { return []; },
      },
      groups: {
        type: Array,
        required: false,
        default() { return []; },
      },
      role: {
        type: String,
        required: false,
        default() { return 'edit'; },
      },
      roleGroups: {
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
      computedRoleGroups() {
        const { groupsEditable, chipColor } = this;
        return groupsEditable
          .filter(group => group.isAttached)
          .sort((a, b) => b.sortTime - a.sortTime)
          .map(group => ({
            ...group,
            isAttached: group.isAttached,
            isowner: group.rolegroup ? group.rolegroup.isowner : false,
            color: chipColor(group),
          }));
      },
    },
    data() {
      const { groups, roleGroups, chipColor } = this;
      return {
        groupsEditable: [...JSON.parse(JSON.stringify(groups))].map((group) => {
          const rolegroup = roleGroups.find(
            o => o.grouprefid === group.uuid);
          const isAttached = Boolean(rolegroup);
          const sortTime = (new Date()).getTime();
          return {
            ...group,
            text: group.displayname,
            value: group.uuid,
            color: chipColor(group),
            isAttached,
            rolegroup,
            sortTime,
          };
        }),
        groupsToAdd: [],
        groupsToDelete: [],
      };
    },
    methods: {
      ...mapActions('subjectOrganizations', ['deleteSubjectOrganizations', 'postSubjectOrganizations']),
      chipColor(item) {
        if (item.isAttached && item.rolegroup && item.rolegroup.isowner) {
          return 'btn-success';
        } else if (!item.isAttached &&
          item.rolegroup && item.rolegroup.isowner) {
          return 'btn-danger';
        }
        return 'btn-secondary';
      },
      handleSubmit(evt) {
        const { groupsEditable, postSubjectOrganizations,
          deleteSubjectOrganizations, onUpdate } = this;
        evt.preventDefault();
        this.groupsToDelete = groupsEditable
          .filter(group => group.rolegroup && !group.isAttached)
          .map(group => (group.rolegroup));
        this.groupsToAdd = groupsEditable
          .filter(group => !group.rolegroup && group.isAttached)
          .map(group => ({
            // organizationid: this.currentUser.props.organizationid,
            organizationid: group.organizationid,
            crudsubjectid: this.currentUser.props.uuid,
            subjectid: this.user.uuid,
            grouprefid: group.uuid,
            isowner: false,
            isactive: true,
          }));
        if (this.groupsToDelete.length) {
          // console.log('groupsToDelete', this.groupsToDelete);
          for (let i = 0; i < this.groupsToDelete.length; i += 1) {
            deleteSubjectOrganizations(this.groupsToDelete[i]).then((response) => {
              if (response && response.data) {
                onUpdate();
              }
            });
          }
        }
        if (this.groupsToAdd.length) {
          // console.log('groupsToAdd', this.groupsToAdd);
          for (let i = 0; i < this.groupsToAdd.length; i += 1) {
            postSubjectOrganizations([this.groupsToAdd[i]]).then((response) => {
              if (response && response.data) {
                onUpdate();
              }
            });
          }
        }
      },
      handleDeleteRoleGroups(index, chip) {
        const { groupsEditable } = this;
        this.groupsEditable = groupsEditable.map((item) => {
          const isAttached = item.uuid === chip.value ? false : item.isAttached;
          return {
            ...item,
            isAttached,
          };
        });
      },
      handleAddRoleGroups(chip) {
        const { groupsEditable } = this;
        this.groupsEditable = groupsEditable.map((item) => {
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
