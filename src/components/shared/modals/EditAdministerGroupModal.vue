<template>
  <Modal
    bodyClass="edit-administer-group"
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
        {{ role === 'edit' ? 'Edit Administer Group' : 'Add New Administer Group' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="groupNameGroup"
            label="Group Name:"
            label-for="groupNameInput"
            :invalid-feedback="groupNameInvalidFeedback"
            :state="groupNameState"
          >
            <b-form-input
              id="groupNameInput"
              type="text"
              v-model="groupEditable.subjectname"
              placeholder="Group Name"
              :state="groupNameState"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="displayNameGroup"
            label="Display Name:"
            label-for="displayNameInput"
            :invalid-feedback="displayNameInvalidFeedback"
            :state="displayNameState"
          >
            <b-form-input
              id="displayNameInput"
              type="text"
              v-model="groupEditable.displayname"
              placeholder="Display Name"
              :state="displayNameState"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group id="groupEnabledGroup">
            <b-form-checkbox
              id="groupEnabledChecks"
              v-model="groupEditable.isactivated"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
          </b-form-group>
          
          <b-form-group 
            id="urlGroup"
            label="URL:"
            label-for="urlInput"
          >
            <b-form-input
              id="urlInput"
              type="text"
              v-model="groupEditable.url"
              placeholder="URL"
              required
            >
            </b-form-input>
          </b-form-group>

          <b-form-group 
            id="groupOrganizationIdGroup"
            label="Organization:"
            label-for="groupOrganizationIdInput"
            :invalid-feedback="organizationIdInvalidFeedback"
            :state="organizationIdState"
          >
            <b-form-select
              id="groupOrganizationIdInput"
              v-model="groupEditable.organizationid" 
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
            id="groupDirectoryIdGroup"
            label="Directory:"
            label-for="groupDirectoryIdInput"
            :invalid-feedback="subjectDirectoryIdInvalidFeedback"
            :state="subjectDirectoryIdState"
          >
            <b-form-select
              id="groupDirectoryIdInput"
              v-model="groupEditable.subjectdirectoryid" 
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

          <b-form-group 
            id="effectiveStartDateGroup"
            label="Effective Start Date:"
            label-for="effectiveStartDateInput"
          >
            <b-form-input
              id="effectiveStartDateInput"
              type="date"
              v-model="groupEditable.effectivestartdate"
              placeholder="Effective Start Date"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="effectiveEndDateGroup"
            label="Effective End Date:"
            label-for="effectiveEndDateInput"
          >
            <b-form-input
              id="effectiveEndDateInput"
              type="date"
              v-model="groupEditable.effectiveenddate"
              placeholder="Effective End Date"
              required
            >
            </b-form-input>
          </b-form-group>

          <b-form-group 
            id="groupDescriptionGroup"
            label="Description:"
            label-for="groupDescriptionTextarea"
          >
            <b-form-textarea
              id="groupDescriptionTextarea"
              v-model="groupEditable.description"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
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

export default {
  components: {
    Modal,
    Icon,
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
    role: {
      type: String,
      required: false,
      default() { return 'edit'; },
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    displayNameState() {
      const { displayname } = this.groupEditable;
      return displayname.length > 0;
    },
    displayNameInvalidFeedback() {
      const { displayname } = this.groupEditable;
      if (displayname.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    groupNameState() {
      const { subjectname } = this.groupEditable;
      return subjectname.length > 0;
    },
    groupNameInvalidFeedback() {
      const { subjectname } = this.groupEditable;
      if (subjectname.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    emailState() {
      const { email } = this.groupEditable;
      return email.length > 0;
    },
    emailInvalidFeedback() {
      const { email } = this.groupEditable;
      if (email.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    organizationIdState() {
      const { organizationid } = this.groupEditable;
      return organizationid !== null;
    },
    organizationIdInvalidFeedback() {
      const { organizationid } = this.groupEditable;
      if (organizationid === null) {
        return 'Please select organization';
      }
      return '';
    },
    subjectDirectoryIdState() {
      const { subjectdirectoryid } = this.groupEditable;
      return subjectdirectoryid !== null;
    },
    subjectDirectoryIdInvalidFeedback() {
      const { subjectdirectoryid } = this.groupEditable;
      if (subjectdirectoryid === null) {
        return 'Please select directory';
      }
      return '';
    },
  },
  data() {
    const { group, role } = this;
    return {
      groupEditable: JSON.parse(JSON.stringify(group)),
      isPasswordInputVisible: (role === 'add'),
    };
  },
  methods: {
    ...mapActions('groups', ['putGroups']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { groupEditable, putGroups, postGroups, onUpdate, role } = this;
      const { description, url, effectiveenddate, displayname, subjectname } = groupEditable;
      let groupToUpdate = {
        ...groupEditable,
        firstname: displayname,
        lastname: displayname,
        email: `${subjectname}@verapi.com`,
        secondaryemail: `${subjectname}@verapi.com`,
        description: (description === null ? '' : description),
        url: (url === null ? '' : url),
        effectiveenddate: (effectiveenddate === null ? '' : effectiveenddate),
      };

      if (role === 'edit') {
        putGroups(groupToUpdate).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        const { currentGroup } = this;
        const { uuid, subjecttypeid } = currentGroup.props;
        const crudsubjectid = uuid;
        groupToUpdate = [{
          ...groupToUpdate,
          crudsubjectid,
          subjecttypeid,
        }];
        postGroups(groupToUpdate).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      }
    },
  },
};
</script>

<style lang="scss">
.modal-body {
  &.edit-administer-group {
    padding: 0;
  }
}
</style>
