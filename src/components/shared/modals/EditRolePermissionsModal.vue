<template>
  <Modal
    bodyClass="edit-role-permissions"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalEditRolePermissions"
  >
    <template slot="header">
      <h5 class="modal-title">
        Edit Role Permissions of {{role.displayname}}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <div class="form-group">
            <Chips
              :chips="computedRolePermissions"
              :autocompleteOptions="permissionsEditable"
              :onDeleteChip="handleDeleteRolePermissions"
              :onAddChip="handleAddRolePermissions"
              label="Role Permissions"
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
      permissions: {
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
      computedRolePermissions() {
        const { permissionsEditable, chipColor } = this;
        return permissionsEditable
          .filter(permission => permission.isAttached)
          .sort((a, b) => b.sortTime - a.sortTime)
          .map(permission => ({
            ...permission,
            isAttached: permission.isAttached,
            isowner: permission.rolepermission ? permission.rolepermission.isowner : false,
            color: chipColor(permission),
          }));
      },
    },
    data() {
      const { permissions, rolePermissions, chipColor } = this;
      return {
        permissionsEditable: [...JSON.parse(JSON.stringify(permissions))].map((permission) => {
          const rolepermission = rolePermissions.find(
            o => o.permissionrefid === permission.uuid);
          const isAttached = Boolean(rolepermission);
          const sortTime = (new Date()).getTime();
          return {
            ...permission,
            text: permission.permission,
            value: permission.uuid,
            color: chipColor(permission),
            isAttached,
            rolepermission,
            sortTime,
          };
        }),
        permissionsToAdd: [],
        permissionsToDelete: [],
      };
    },
    methods: {
      ...mapActions('subjectOrganizations', ['deleteSubjectOrganizations', 'postSubjectOrganizations']),
      chipColor(item) {
        if (item.isAttached && item.rolepermission && item.rolepermission.isowner) {
          return 'btn-success';
        } else if (!item.isAttached &&
          item.rolepermission && item.rolepermission.isowner) {
          return 'btn-danger';
        }
        return 'btn-secondary';
      },
      handleSubmit(evt) {
        const { permissionsEditable, postSubjectOrganizations,
          deleteSubjectOrganizations, onUpdate } = this;
        evt.preventDefault();
        this.permissionsToDelete = permissionsEditable
          .filter(permission => permission.rolepermission && !permission.isAttached)
          .map(permission => (permission.rolepermission));
        this.permissionsToAdd = permissionsEditable
          .filter(permission => !permission.rolepermission && permission.isAttached)
          .map(permission => ({
            // organizationid: this.currentUser.props.organizationid,
            organizationid: permission.organizationid,
            crudsubjectid: this.currentUser.props.uuid,
            subjectid: this.user.uuid,
            permissionrefid: permission.uuid,
            isowner: false,
            isactive: true,
          }));
        if (this.permissionsToDelete.length) {
          // console.log('permissionsToDelete', this.permissionsToDelete);
          for (let i = 0; i < this.permissionsToDelete.length; i += 1) {
            deleteSubjectOrganizations(this.permissionsToDelete[i]).then((response) => {
              if (response && response.data) {
                onUpdate();
              }
            });
          }
        }
        if (this.permissionsToAdd.length) {
          // console.log('permissionsToAdd', this.permissionsToAdd);
          for (let i = 0; i < this.permissionsToAdd.length; i += 1) {
            postSubjectOrganizations([this.permissionsToAdd[i]]).then((response) => {
              if (response && response.data) {
                onUpdate();
              }
            });
          }
        }
      },
      handleDeleteRolePermissions(index, chip) {
        const { permissionsEditable } = this;
        this.permissionsEditable = permissionsEditable.map((item) => {
          const isAttached = item.uuid === chip.value ? false : item.isAttached;
          return {
            ...item,
            isAttached,
          };
        });
      },
      handleAddRolePermissions(chip) {
        const { permissionsEditable } = this;
        this.permissionsEditable = permissionsEditable.map((item) => {
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
    &.edit-role-permissions {
      padding: 0;
    }
  }
</style>
