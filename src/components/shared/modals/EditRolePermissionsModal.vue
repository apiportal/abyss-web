<template>
  <Modal
    bodyClass="p-0"
    :scrollable="false"
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
        <div class="p-3">
          <div class="form-group">
            <Chips
              :chips="computedRolePermissions"
              :autocompleteOptions="permissionsEditable"
              :onDeleteChip="handleDeleteRolePermissions"
              :onAddChip="handleAddRolePermissions"
              :showAddChip="false"
              label="Role Permissions"
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
    permissions: {
      type: Array,
      required: false,
      default() { return []; },
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
    }),
    computedRolePermissions() {
      const { permissionsEditable } = this;
      return permissionsEditable
      .filter(permission => permission.isAttached)
      .sort((a, b) => b.sortTime - a.sortTime);
    },
  },
  data() {
    const { permissions, rolePermissions, selectedRole } = this;
    return {
      permissionsEditable: [...JSON.parse(JSON.stringify(permissions))].map((permission, index) => {
        const rolepermission = rolePermissions.find(m =>
          m.subjectid === permission.subjectid &&
          m.subjectid === selectedRole.uuid,
        );
        const isAttached = Boolean(rolepermission);
        const sortTime = (new Date()).getTime();
        return {
          ...permission,
          value: permission.uuid,
          text: `${permission.permission} - ${index}`,
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
      const { permissionsEditable, selectedRole, currentUser,
        postPermissions, deletePermissions, onUpdate } = this;
      this.permissionsToDelete = permissionsEditable
         .filter(permission => permission.rolepermission && !permission.isAttached)
        .map(permission => (permission.rolepermission));
      this.permissionsToAdd = [permissionsEditable
        .filter(permission => !permission.rolepermission && permission.isAttached)
        .map(permission => ({
          organizationid: permission.organizationid,
          crudsubjectid: currentUser.props.uuid,
          permission: permission.permission,
          description: permission.description,
          effectivestartdate: this.$moment.utc().toISOString(),
          effectiveenddate: this.$moment.utc().add(1, 'years').toISOString(),
          subjectid: selectedRole.uuid,
          resourceid: permission.resourceid,
          resourceactionid: permission.resourceactionid,
          accessmanagerid: permission.accessmanagerid,
          isactive: true,
        }))];
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
          })
          .catch((error) => {
            if (error && i === this.permissionsToAdd.length - 1) {
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

<style lang="scss" scoped>
</style>