<template>
  <Modal
    bodyClass="edit-administer-user-groups"
    :scrollable="false"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalEditUserGroups"
  >
    <template slot="header">
      <h5 class="modal-title" data-qa="modalTitle">
        Edit User Groups of {{user.displayname}}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <div>
            <Chips
              :chips="computedMemberships"
              :autocompleteOptions="groupsEditable"
              :onDeleteChip="handleDeleteMembership"
              :onAddChip="handleAddMembership"
              :showAddChip="false"
              label="User Groups"
            />
          </div>

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
    groups: {
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
      const { groupsEditable } = this;
      return groupsEditable
      .filter(group => group.isAttached)
      .sort((a, b) => b.sortTime - a.sortTime);
    },
  },
  data() {
    const { groups, memberships } = this;
    return {
      groupsEditable: [...JSON.parse(JSON.stringify(groups))].map((group) => {
        const membership = memberships.find(m => m.subjectgroupid === group.uuid);
        const isAttached = Boolean(membership);
        const sortTime = (new Date()).getTime();
        return {
          ...group,
          text: group.displayname,
          value: group.uuid,
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
    ...mapActions('subjectMemberships', ['deleteSubjectMemberships', 'postSubjectMemberships']),
    handleSubmit(evt) {
      const { groupsEditable, postSubjectMemberships, deleteSubjectMemberships, onUpdate,
      currentUser, user } = this;
      evt.preventDefault();
      this.groupsToDelete = groupsEditable
      .filter(group => group.membership && !group.isAttached)
      .map(group => (group.membership));
      this.groupsToAdd = groupsEditable
      .filter(group => !group.membership && group.isAttached)
      .map(group => ({
        organizationid: group.organizationid,
        crudsubjectid: currentUser.props.uuid,
        subjectid: user.uuid,
        subjectgroupid: group.uuid,
        subjecttypeid: user.subjecttypeid,
        subjectgrouptypeid: group.subjecttypeid,
        subjectdirectoryid: user.subjectdirectoryid,
        isactive: true,
      }));
      if (this.groupsToDelete.length) {
        for (let i = 0; i < this.groupsToDelete.length; i += 1) {
          deleteSubjectMemberships(this.groupsToDelete[i]).then((response) => {
            if (response && i === this.groupsToDelete.length - 1) {
              onUpdate();
            }
          });
        }
      }
      if (this.groupsToAdd.length) {
        for (let i = 0; i < this.groupsToAdd.length; i += 1) {
          postSubjectMemberships([this.groupsToAdd[i]]).then((response) => {
            if (response && i === this.groupsToAdd.length - 1) {
              onUpdate();
            }
          })
          .catch((error) => {
            if (error && i === this.groupsToAdd.length - 1) {
              onUpdate();
            }
          });
        }
      }
    },
    handleDeleteMembership(index, chip) {
      const { groupsEditable } = this;
      this.groupsEditable = groupsEditable.map((group) => {
        const isAttached = group.uuid === chip.value ? false : group.isAttached;
        return {
          ...group,
          isAttached,
        };
      });
    },
    handleAddMembership(chip) {
      const { groupsEditable } = this;
      this.groupsEditable = groupsEditable.map((group) => {
        const isAttached = group.uuid === chip.value ? true : group.isAttached;
        const sortTime = (new Date()).getTime();
        return {
          ...group,
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
  &.edit-administer-user-groups {
    padding: 0;
  }
}
</style>
