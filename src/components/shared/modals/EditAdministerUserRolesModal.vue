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
    data-qa="modalEditUserRoles"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        Edit User Roles of {{user.displayname}}
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
              :autocompleteOptions="rolesEditable"
              :onDeleteChip="handleDeleteMembership"
              :onAddChip="handleAddMembership"
              :showAddChip="false"
              label="User Roles"
            />
          </div>

        </div>
        <footer class="modal-footer">
          <b-button
            variant="link"
            @click="onClose"
            data-qa="btnCancel"
          >
            Cancel
          </b-button>
          <b-button
            variant="primary"
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
import { mapState, mapActions } from 'vuex';
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
    roles: {
      type: Array,
      required: false,
      default() { return []; },
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
    }),
    computedMemberships() {
      const { rolesEditable } = this;
      return rolesEditable
      .filter(role => role.isAttached)
      .sort((a, b) => b.sortTime - a.sortTime);
    },
  },
  data() {
    const { roles, memberships } = this;
    return {
      rolesEditable: [...JSON.parse(JSON.stringify(roles))].map((role) => {
        const membership = memberships.find(m => m.subjectgroupid === role.uuid);
        const isAttached = Boolean(membership);
        const sortTime = (new Date()).getTime();
        return {
          ...role,
          text: role.displayname,
          value: role.uuid,
          isAttached,
          membership,
          sortTime,
        };
      }),
      rolesToAdd: [],
      rolesToDelete: [],
    };
  },
  methods: {
    ...mapActions('subjectMemberships', ['deleteSubjectMemberships', 'postSubjectMemberships']),
    handleSubmit(evt) {
      const { rolesEditable, postSubjectMemberships, deleteSubjectMemberships, onUpdate,
      currentUser, user } = this;
      evt.preventDefault();
      this.rolesToDelete = rolesEditable
      .filter(role => role.membership && !role.isAttached)
      .map(role => (role.membership));
      this.rolesToAdd = rolesEditable
      .filter(role => !role.membership && role.isAttached)
      .map(role => ({
        organizationid: role.organizationid,
        crudsubjectid: currentUser.props.uuid,
        subjectid: user.uuid,
        subjectgroupid: role.uuid,
        subjecttypeid: user.subjecttypeid,
        subjectgrouptypeid: role.subjecttypeid,
        subjectdirectoryid: role.subjectdirectoryid,
        isactive: true,
      }));
      if (this.rolesToDelete.length) {
        for (let i = 0; i < this.rolesToDelete.length; i += 1) {
          deleteSubjectMemberships(this.rolesToDelete[i]).then((response) => {
            if (response && response.data) {
              onUpdate();
            }
          });
        }
      }
      if (this.rolesToAdd.length) {
        for (let i = 0; i < this.rolesToAdd.length; i += 1) {
          postSubjectMemberships([this.rolesToAdd[i]]).then((response) => {
            if (response && response.data) {
              onUpdate();
            }
          });
        }
      }
    },
    handleDeleteMembership(index, chip) {
      const { rolesEditable } = this;
      this.rolesEditable = rolesEditable.map((role) => {
        const isAttached = role.uuid === chip.value ? false : role.isAttached;
        return {
          ...role,
          isAttached,
        };
      });
    },
    handleAddMembership(chip) {
      const { rolesEditable } = this;
      this.rolesEditable = rolesEditable.map((role) => {
        const isAttached = role.uuid === chip.value ? true : role.isAttached;
        const sortTime = (new Date()).getTime();
        return {
          ...role,
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
