<template>
  <Modal
    bodyClass="edit-administer-user-groups"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
  >
    <template slot="header">
      <h5 class="modal-title">
        Edit Group Users of {{group.displayname}}
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
              :autocompleteOptions="groupUsersEditable"
              :onDeleteChip="handleDeleteMembership"
              :onAddChip="handleAddMembership"
              label="Group Users"
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
    group: {
      type: Object,
      required: false,
    },
    users: {
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
      const { groupUsersEditable } = this;
      return groupUsersEditable
      .filter(user => user.isAttached)
      .sort((a, b) => b.sortTime - a.sortTime);
    },
  },
  data() {
    const { users, memberships } = this;
    return {
      groupUsersEditable: [...JSON.parse(JSON.stringify(users))].map((user) => {
        const membership = memberships.find(m => m.subjectid === user.uuid);
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
    ...mapActions('subjectMemberships', ['deleteSubjectMemberships', 'postSubjectMemberships']),
    handleSubmit(evt) {
      const { group, groupUsersEditable, postSubjectMemberships,
        deleteSubjectMemberships, onUpdate } = this;
      evt.preventDefault();
      this.usersToDelete = groupUsersEditable
      .filter(user => user.membership && !user.isAttached)
      .map(user => (user.membership));
      this.usersToAdd = groupUsersEditable
      .filter(user => !user.membership && user.isAttached)
      .map(user => ({
        // organizationid: this.currentUser.props.organizationid,
        organizationid: group.organizationid,
        crudsubjectid: this.currentUser.props.uuid,
        subjectid: user.uuid,
        subjectgroupid: group.uuid,
        subjecttypeid: user.subjecttypeid,
        subjectgrouptypeid: group.subjecttypeid,
        subjectdirectoryid: user.subjectdirectoryid,
        isactive: true,
      }));
      if (this.usersToDelete.length) {
        // console.log('usersToDelete', this.usersToDelete);
        for (let i = 0; i < this.usersToDelete.length; i += 1) {
          deleteSubjectMemberships(this.usersToDelete[i]).then((response) => {
            if (response && i === this.usersToDelete.length - 1) {
              onUpdate();
            }
          });
        }
      }
      if (this.usersToAdd.length) {
        // console.log('usersToAdd', this.usersToAdd);
        for (let i = 0; i < this.usersToAdd.length; i += 1) {
          postSubjectMemberships([this.usersToAdd[i]]).then((response) => {
            if (response && i === this.usersToAdd.length - 1) {
              onUpdate();
            }
          })
          .catch((error) => {
            if (error && i === this.usersToAdd.length - 1) {
              onUpdate();
            }
          });
        }
      }
    },
    handleDeleteMembership(index, chip) {
      const { groupUsersEditable } = this;
      this.groupUsersEditable = groupUsersEditable.map((group) => {
        const isAttached = group.uuid === chip.value ? false : group.isAttached;
        return {
          ...group,
          isAttached,
        };
      });
    },
    handleAddMembership(chip) {
      const { groupUsersEditable } = this;
      this.groupUsersEditable = groupUsersEditable.map((group) => {
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
