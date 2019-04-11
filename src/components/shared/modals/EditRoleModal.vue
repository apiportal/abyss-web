<template>
  <Modal
    bodyClass="edit-role"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalEditRole"

  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        <Icon :icon=iconTitle class="name" />
        {{ role === 'edit' ? 'edit role' : 'New Role' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="roleNameGroup"
          >
            <label>
              Name:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              id="roleNameInput"
              type="text"
              v-model="roleEditable.rolename"
              :state="roleNameState"
              placeholder="Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="roleDescriptionGroup"
          >
            <label>
              Description:
              <span class="text-danger">*</span>
            </label>
            <b-form-textarea
              id="roleDescriptionTextarea"
              v-model="roleEditable.description"
              :state="descriptionState"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group id="roleEnabledGroup">
            <b-form-checkbox
              id="roleEnabledChecks"
              v-model="roleEditable.isactive"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
          </b-form-group>
        </div>
        <footer class="modal-footer">
          <b-button
            variant="secondary"
            @click="onClose"
            data-qa="btnCancel"
          >
            Cancel
          </b-button>
          <b-button
            variant="success"
            type="submit"
            data-qa="btnSave"
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
import DynamicForm from '@/components/shared/dynamicForm/DynamicForm';

export default {
  components: {
    Modal,
    Icon,
    DynamicForm,
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
    role: {
      type: String,
      required: false,
      default() { return 'edit'; },
    },
    iconTitle: {
      type: String,
      required: false,
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    roleNameState() {
      const { rolename } = this.roleEditable;

      if (rolename && rolename.length > 0) {
        return true;
      }

      return false;
    },
    descriptionState() {
      const { description } = this.roleEditable;

      if (description && description.length > 0) {
        return true;
      }

      return false;
    },
  },
  data() {
    return {
      roleEditable: JSON.parse(JSON.stringify(this.role)),
    };
  },
  methods: {
    ...mapActions('roles', ['putRoles', 'postRoles']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { putRoles, postRoles, roleEditable, onUpdate, role } = this;
      if (role === 'edit') {
        putRoles({
          ...roleEditable,
        }).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid } = currentUser.props;
        const crudsubjectid = uuid;
        const roleToAdd = [{
          ...roleEditable,
          crudsubjectid,
        }];
        postRoles(roleToAdd).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      }
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
.modal-body {
  &.edit-access-manager {
    padding: 0;
  }
}

.configure-access-manager {
  border: 1px solid #e9ecef;
  border-radius: .3rem;
  padding: 1rem;
  position: relative;

  &:before {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(233, 236, 239, 0);
    border-bottom-color: #e9ecef;
    border-width: 11px;
    margin-left: -11px;
  }
}

.name {
  color: #3b68af;
}
</style>