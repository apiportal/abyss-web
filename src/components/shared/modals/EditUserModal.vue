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
            <div class="font-weight-bold">{{user.displayname}}</div>
          </div>
          <div class="form-group">
            <label>Main Organization:</label>
            <div class="font-weight-bold">{{mainOrganization}}</div>
          </div>
          <div class="form-group">
            <label>Directory:</label>
            <div class="font-weight-bold">{{userDirectory}}</div>
          </div>
          <!-- <b-form-group 
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
          </b-form-group> -->
          <!-- <b-form-group 
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
          </b-form-group> -->
          <div class="form-group">
            <Chips
              :chips="computedUserOrganizations"
              :autocompleteOptions="this.organizations.map((item) => ({
                text: item.name,
                value: item.uuid,
              }))"
              :onDeleteChip="handleDeleteMembership"
              :onAddChip="handleAddMembership"
              label="User Organizations"
            />
          </div>
          <div class="form-group">
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
    userOrganizations: {
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
    mainOrganization() {
      const { organizationid } = this.userEditable;
      const { organizations } = this;
      const organization = organizations.find(item => item.uuid === organizationid);
      return organization ? organization.name : organizationid;
    },
    userDirectory() {
      const { subjectdirectoryid } = this.userEditable;
      const { subjectDirectories } = this;
      const subjectdirectory = subjectDirectories.find(item => item.uuid === subjectdirectoryid);
      return subjectdirectory ? subjectdirectory.directoryname : subjectdirectoryid;
    },
    // organizationIdState() {
    //   const { organizationid } = this.userEditable;
    //   return organizationid !== null;
    // },
    // organizationIdInvalidFeedback() {
    //   const { organizationid } = this.userEditable;
    //   if (organizationid === null) {
    //     return 'Please select organization';
    //   }
    //   return '';
    // },
    // subjectDirectoryIdState() {
    //   const { subjectdirectoryid } = this.userEditable;
    //   return subjectdirectoryid !== null;
    // },
    // subjectDirectoryIdInvalidFeedback() {
    //   const { subjectdirectoryid } = this.userEditable;
    //   if (subjectdirectoryid === null) {
    //     return 'Please select directory';
    //   }
    //   return '';
    // },
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
    computedUserOrganizations() {
      const { organizationsEditable } = this;
      return organizationsEditable
      .filter(organization => organization.isUserOrganization)
      .sort((a, b) => b.sortTime - a.sortTime)
      .map(organization => ({
        value: organization.uuid,
        text: organization.name,
      }));
    },
  },
  data() {
    const { user, groups, memberships, organizations, userOrganizations } = this;
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
      organizationsEditable: [...JSON.parse(JSON.stringify(organizations))].map((organization) => {
        const isUserOrganization =
          Boolean(userOrganizations.find(userOrg =>
            userOrg.organizationrefid === organization.uuid));
        const sortTime = (new Date()).getTime();
        return {
          ...organization,
          isUserOrganization,
          sortTime,
        };
      }),
    };
  },
  methods: {
    ...mapActions('users', ['putUsers', 'postUsers']),
    handleSubmit(evt) {
      evt.preventDefault();
      /*
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
      */
    },
    handleDeleteUserOrganization({ uuid }) {
      const { organizationsEditable } = this;
      this.organizationsEditable = organizationsEditable.map((item) => {
        const isUserOrganization = item.uuid === uuid ? false : item.isUserOrganization;
        return {
          ...item,
          isUserOrganization,
        };
      });
    },
    handleAddUserOrganization({ uuid }) {
      const { organizationsEditable } = this;
      this.organizationsEditable = organizationsEditable.map((item) => {
        const isUserOrganization = item.uuid === uuid ? true : item.isUserOrganization;
        const sortTime = (new Date()).getTime();
        return {
          ...item,
          isUserOrganization,
          sortTime,
        };
      });
    },
    handleDeleteMembership({ uuid }) {
      const { groupsEditable } = this;
      this.groupsEditable = groupsEditable.map((item) => {
        const isMembership = item.uuid === uuid ? false : item.isMembership;
        return {
          ...item,
          isMembership,
        };
      });
    },
    handleAddMembership({ uuid }) {
      const { groupsEditable } = this;
      this.groupsEditable = groupsEditable.map((item) => {
        const isMembership = item.uuid === uuid ? true : item.isMembership;
        const sortTime = (new Date()).getTime();
        return {
          ...item,
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
