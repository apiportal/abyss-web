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
        Edit Administer User Groups
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
        const isMembership =
          Boolean(memberships.find(membership => membership.subjectgroupid === group.uuid));
        const sortTime = (new Date()).getTime();
        return {
          ...group,
          isMembership,
          sortTime,
        };
      }),
    };
  },
  methods: {
    handleSubmit(evt) {
      evt.preventDefault();
    },
    handleDeleteMembership({ uuid }) {
      const { groupsEditable } = this;
      this.groupsEditable = groupsEditable.map((group) => {
        const isMembership = group.uuid === uuid ? false : group.isMembership;
        return {
          ...group,
          isMembership,
        };
      });
    },
    handleAddMembership({ uuid }) {
      const { groupsEditable } = this;
      this.groupsEditable = groupsEditable.map((group) => {
        const isMembership = group.uuid === uuid ? true : group.isMembership;
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
