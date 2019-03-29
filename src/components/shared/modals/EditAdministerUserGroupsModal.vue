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
      <h5 id="IdModalTitle" class="modal-title">
        Edit User Groups
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
              :autocompleteOptions="this.groups.map((item) => ({
                text: item.subjectname,
                value: item.uuid,
              }))"
              :onDeleteChip="handleDeleteMembership"
              :onAddChip="handleAddMembership"
              label="User Groups"
            />
          </div>

        </div>
        <footer class="modal-footer">
          <b-button
            variant="secondary"
            @click="onClose"
            id="IdBtnCancel"
          >
            Cancel
          </b-button>
          <b-button
            variant="success"
            type="submit"
            id="IdBtnSave"
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
      .filter(group => group.isMembership)
      .sort((a, b) => b.sortTime - a.sortTime)
      .map(group => ({
        value: group.uuid,
        text: group.subjectname,
      }));
    },
  },
  data() {
    const { groups, memberships } = this;
    return {
      groupsEditable: [...JSON.parse(JSON.stringify(groups))].map((group) => {
        const membership = memberships.find(m => m.subjectgroupid === group.uuid);
        const isMembership = Boolean(membership);
        const sortTime = (new Date()).getTime();
        return {
          ...group,
          isMembership,
          membership,
          sortTime,
        };
      }),
      // userMemberships: [...JSON.parse(JSON.stringify(memberships))],
      groupsToAdd: [],
      groupsToDelete: [],
    };
  },
  methods: {
    ...mapActions('subjectMemberships', ['deleteSubjectMemberships', 'postSubjectMemberships']),
    handleSubmit(evt) {
      const { groupsEditable, postSubjectMemberships, deleteSubjectMemberships } = this;
      evt.preventDefault();
      this.groupsToDelete = groupsEditable
      .filter(group => group.membership && !group.isMembership)
      .map(group => (group.membership));
      this.groupsToAdd = groupsEditable
      .filter(group => !group.membership && group.isMembership)
      .map(group => ({
        // organizationid: this.currentUser.props.organizationid,
        organizationid: group.organizationid,
        crudsubjectid: this.currentUser.props.uuid,
        subjectid: this.user.uuid,
        subjectgroupid: group.uuid,
      }));
      if (this.groupsToDelete.length) {
        // console.log('groupsToDelete', this.groupsToDelete);
        for (let i = 0; i < this.groupsToDelete.length; i += 1) {
        // for (let item of this.groupsToDelete) {
          // deleteSubjectMemberships(item).then((response) => {
          // console.log('this.groupsToDelete[i]', this.groupsToDelete[i]);
          deleteSubjectMemberships([this.groupsToDelete[i]]).then((response) => {
            if (response && response.data) {
              // onUpdate();
            }
          });
        }
      }
      if (this.groupsToAdd.length) {
        // console.log('groupsToAdd', this.groupsToAdd);
        for (let i = 0; i < this.groupsToAdd.length; i += 1) {
        // for (let item of this.groupsToAdd) {
          // postSubjectMemberships(item).then((response) => {
          // console.log('this.groupsToAdd[i]', this.groupsToAdd[i]);
          postSubjectMemberships([this.groupsToAdd[i]]).then((response) => {
            if (response && response.data) {
              // onUpdate();
            }
          });
        }
      }
    },
    handleDeleteMembership(index, chip) {
      const { groupsEditable } = this;
      this.groupsEditable = groupsEditable.map((group) => {
        const isMembership = group.uuid === chip.value ? false : group.isMembership;
        return {
          ...group,
          isMembership,
        };
      });
    },
    handleAddMembership(chip) {
      const { groupsEditable } = this;
      this.groupsEditable = groupsEditable.map((group) => {
        const isMembership = group.uuid === chip.value ? true : group.isMembership;
        const sortTime = (new Date()).getTime();
        return {
          ...group,
          isMembership,
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
