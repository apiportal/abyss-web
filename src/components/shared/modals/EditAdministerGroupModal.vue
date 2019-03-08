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
              :formatter="setValidSubjectName"
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
            :invalid-feedback="urlInvalidFeedback"
            :state="urlState"
          >
            <b-form-input
              id="urlInput"
              type="text"
              v-model="groupEditable.url"
              placeholder="URL"
              :state="urlState"
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
            :invalid-feedback="effectiveStartDateInvalidFeedback"
            :state="effectiveStartDateState"
          >
            <b-form-input
              id="effectiveStartDateInput"
              type="date"
              v-model="effectiveStartDate"
              placeholder="Effective Start Date"
              :state="effectiveStartDateState"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="effectiveEndDateGroup"
            label="Effective End Date:"
            label-for="effectiveEndDateInput"
            :invalid-feedback="effectiveEndDateInvalidFeedback"
            :state="effectiveEndDateState"
          >
            <b-form-input
              id="effectiveEndDateInput"
              type="date"
              v-model="effectiveEndDate"
              placeholder="Effective End Date"
              :state="effectiveEndDateState"
              required
            >
            </b-form-input>
          </b-form-group>

          <b-form-group 
            id="groupDescriptionGroup"
            label="Description:"
            label-for="groupDescriptionTextarea"
            :invalid-feedback="descriptionInvalidFeedback"
            :state="descriptionState"
          >
            <b-form-textarea
              id="groupDescriptionTextarea"
              v-model="groupEditable.description"
              placeholder="Description"
              :rows="3"
              :state="descriptionState"
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
    effectiveStartDate: {
      get() {
        return this.groupEditable.effectivestartdate.substring(0, 10);
      },
      set(value) {
        const date = new Date(value);
        this.groupEditable.effectivestartdate = date.toISOString();
      },
    },
    effectiveEndDate: {
      get() {
        return this.groupEditable.effectiveenddate.substring(0, 10);
      },
      set(value) {
        const date = new Date(value);
        this.groupEditable.effectiveenddate = date.toISOString();
      },
    },
    displayNameState() {
      const { displayname } = this.groupEditable;
      const re = /^[0-9A-Za-z_@.-\s]{2,30}$/;
      return displayname.length > 0
        && re.test(String(displayname))
      ;
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
      const re = /^[0-9a-z_@.-]{2,30}$/;
      return subjectname.length > 0
        && re.test(String(subjectname))
      ;
    },
    groupNameInvalidFeedback() {
      const { subjectname } = this.groupEditable;
      if (subjectname.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    urlState() {
      const { url } = this.groupEditable;
      // const re = /https?:\/\/[^\s]+/;
      const re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
      return re.test(String(url));
      // return url.length > 0
      //   && document.getElementById('urlInput').validity.valid
      // ;
    },
    urlInvalidFeedback() {
      const { url } = this.groupEditable;
      // if (url.length === 0) {
      // const re = /https?:\/\/[^\s]+/;
      const re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
      if (!url || url.length === 0) {
        return 'Please enter url';
      // } else if (document.getElementById('urlInput')) {
      } else if (re.test(String(url))) {
        return 'Please enter a valid url';
      }
      return '';
    },
    descriptionState() {
      const { description } = this.groupEditable;
      return description.length > 0;
    },
    descriptionInvalidFeedback() {
      const { description } = this.groupEditable;
      if (description.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    effectiveStartDateState() {
      const { effectivestartdate } = this.groupEditable;
      return effectivestartdate.length > 0;
    },
    effectiveStartDateInvalidFeedback() {
      const { effectivestartdate } = this.groupEditable;
      if (effectivestartdate.length === 0) {
        return 'Please enter something';
      }
      return '';
    },
    effectiveEndDateState() {
      const { effectiveenddate } = this.groupEditable;
      return effectiveenddate.length > 0;
    },
    effectiveEndDateInvalidFeedback() {
      const { effectiveenddate } = this.groupEditable;
      if (effectiveenddate.length === 0) {
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
    ...mapActions('groups', ['putGroups', 'postGroups']),
    setValidSubjectName(value) {
      return value.replace(/ /g, '').toLowerCase();
    },
    handleSubmit(evt) {
      evt.preventDefault();
      const { groupEditable, putGroups, postGroups, onUpdate, role } = this;
      const { description, url, effectiveenddate, displayname,
        subjectname, picture, distinguishedname,
        uniqueid, phonebusiness, phoneextension, phonehome, phonemobile } = groupEditable;
      let groupToUpdate = {
        ...groupEditable,
        firstname: displayname,
        lastname: displayname,
        email: `${subjectname}@verapi.com`,
        secondaryemail: `${subjectname}@verapi.com`,
        description: (description === null ? '' : description),
        url: (url === null ? '' : url),
        picture: (picture === null ? '' : picture),
        distinguishedname: (distinguishedname === null ? '' : distinguishedname),
        uniqueid: (uniqueid === null ? '' : uniqueid),
        phonebusiness: (phonebusiness === null ? '' : phonebusiness),
        phoneextension: (phoneextension === null ? '' : phoneextension),
        phonehome: (phonehome === null ? '' : phonehome),
        phonemobile: (phonemobile === null ? '' : phonemobile),
        effectiveenddate: (effectiveenddate === null ? '' : effectiveenddate),
      };

      if (role === 'edit') {
        putGroups(groupToUpdate).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid, subjecttypeid } = currentUser.props;
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
