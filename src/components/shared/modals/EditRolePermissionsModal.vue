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
        Edit Role Permissions of {{selectedRole.displayname}}
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
import moment from 'moment-timezone';
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
    selectedRole: {
      type: Object,
      required: false,
    },
    rolePermissions: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      permissions: state => state.permissions.items,
    }),
    computedRolePermissions() {
      const { permissionsEditable } = this;
      return permissionsEditable
        .filter(permission => permission.isAttached)
        .sort((a, b) => b.sortTime - a.sortTime);
    },
  },
  data() {
    const { permissions, rolePermissions } = this;
    return {
      permissionsEditable: [...JSON.parse(JSON.stringify(permissions))].map((permission) => {
        const rolepermission = rolePermissions
          .find(o => o.permissionrefid === this.selectedRole.uuid);
        const isAttached = Boolean(rolepermission);
        const sortTime = (new Date()).getTime();
        return {
          ...permission,
          text: permission.permission,
          value: permission.uuid,
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
    ...mapActions('permissions', ['deletePermissions', 'postPermissions']),
    handleSubmit(evt) {
      evt.preventDefault();
      const now = new Date();
      const endDate = new Date(now);
      endDate.setFullYear(now.getFullYear() + 1);
      const { permissionsEditable, selectedRole, currentUser,
        postPermissions, deletePermissions, onUpdate } = this;
      this.permissionsToDelete = permissionsEditable
         .filter(permission => permission.rolepermission && !permission.isAttached)
        .map(permission => (permission.rolepermission));
      this.permissionsToAdd = permissionsEditable
        .filter(permission => !permission.rolepermission && permission.isAttached)
        .map(permission => ({
          organizationid: permission.organizationid,
          crudsubjectid: currentUser.props.uuid,
          permission: permission.permission,
          description: permission.description,
          effectivestartdate: moment(now),
          effectiveenddate: moment(endDate),
          subjectid: selectedRole.uuid,
          resourceid: permission.resourceid,
          resourceactionid: permission.resourceactionid,
          accessmanagerid: permission.accessmanagerid,
          isactive: true,
          // permissionrefid: permission.uuid,
        }));
      if (this.permissionsToDelete.length) {
        for (let i = 0; i < this.permissionsToDelete.length; i += 1) {
          deletePermissions(this.permissionsToDelete[i]).then((response) => {
            if (response && response.data) {
              onUpdate();
            }
          });
        }
      }
      if (this.permissionsToAdd.length) {
        for (let i = 0; i < this.permissionsToAdd.length; i += 1) {
          postPermissions(this.permissionsToAdd[i]).then((response) => {
            if (response && response.data) {
              onUpdate();
            }
          });
        }
      }
      // let rolePermissionsObj = {}; // eslint-disable-line
      // for (let i = 0; i < rolePermissions.length; i += 1) {
      //   const { uuid, ...rest } = rolePermissions[i];
      //   rolePermissionsObj[uuid] = rest;
      // }
      // postPermissions(rolePermissionsObj).then(() => {
      //   onUpdate();
      // });
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
