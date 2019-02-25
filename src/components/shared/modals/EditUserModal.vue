<template>
  <Modal
    bodyClass="edit-administer-user"
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
        {{ `Edit ${title} User` }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <div class="form-group">
            <label>Display Name:</label>
            <div class="h5">{{user.displayname}}</div>
          </div>
          <b-form-group 
            id="userOrganizationIdGroup"
            label="Organization*:"
            label-for="userOrganizationIdInput"
            :invalid-feedback="organizationIdInvalidFeedback"
            :state="organizationIdState"
          >
            <b-form-select
              id="userOrganizationIdInput"
              v-model="userEditable.organizationid" 
              :options="[
                {
                  value: null,
                  text: 'Please select',
                },
                ...organizations.map(organization => ({
                  value: organization.uuid,
                  text: organization.name,
                })),
              ]"
              :state="organizationIdState"
            />
          </b-form-group>
          <b-form-group 
            id="userDirectoryIdGroup"
            label="Directory*:"
            label-for="userDirectoryIdInput"
            :invalid-feedback="subjectDirectoryIdInvalidFeedback"
            :state="subjectDirectoryIdState"
          >
            <b-form-select
              id="userDirectoryIdInput"
              v-model="userEditable.subjectdirectoryid" 
              :options="[
                {
                  value: null,
                  text: 'Please select',
                },
                ...subjectDirectories.map(subjectDirectory => ({
                  value: subjectDirectory.uuid,
                  text: subjectDirectory.directoryname,
                })),
              ]"
              :state="subjectDirectoryIdState"
            />
          </b-form-group>
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
    organizations: {
      type: Array,
      required: false,
      default() { return []; },
    },
    role: {
      type: String,
      required: false,
      default() { return 'edit'; },
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
    organizationIdState() {
      const { organizationid } = this.userEditable;
      return organizationid !== null;
    },
    organizationIdInvalidFeedback() {
      const { organizationid } = this.userEditable;
      if (organizationid === null) {
        return 'Please select organization';
      }
      return '';
    },
    subjectDirectoryIdState() {
      const { subjectdirectoryid } = this.userEditable;
      return subjectdirectoryid !== null;
    },
    subjectDirectoryIdInvalidFeedback() {
      const { subjectdirectoryid } = this.userEditable;
      if (subjectdirectoryid === null) {
        return 'Please select directory';
      }
      return '';
    },
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
    const { user, groups, memberships } = this;
    return {
      userEditable: JSON.parse(JSON.stringify(user)),
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
    ...mapActions('users', ['putUsers', 'postUsers']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { userEditable, putUsers, postUsers, onUpdate, role } = this;
      const { description, url, effectiveenddate, secondaryemail, email, picture } = userEditable;
      let userToUpdate = {
        ...userEditable,
        description: (description === null ? '' : description),
        url: (url === null ? '' : url),
        picture: (picture === null ? '' : picture),
        effectiveenddate: (effectiveenddate === null ? '' : effectiveenddate),
        secondaryemail: (secondaryemail === null ? email : email),
      };

      if (role === 'edit') {
        putUsers(userToUpdate).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid, subjecttypeid } = currentUser.props;
        const crudsubjectid = uuid;
        userToUpdate = [{
          ...userToUpdate,
          crudsubjectid,
          subjecttypeid,
        }];
        postUsers(userToUpdate).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      }
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
  &.edit-administer-user {
    padding: 0;
  }
}
</style>
