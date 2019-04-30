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
        {{ role === 'edit' ? 'Edit Role' : 'Add New Role' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="roleNameGroup"
            label="Role Name:"
            label-for="roleNameInput"
            :invalid-feedback="roleNameInvalidFeedback"
            :state="roleNameState"
          >
            <b-form-input
              id="roleNameInput"
              type="text"
              v-model="roleEditable.subjectname"
              placeholder="Role Name"
              :state="roleNameState"
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
              v-model="roleEditable.displayname"
              placeholder="Display Name"
              :state="displayNameState"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group id="roleEnabledGroup">
            <b-form-checkbox
              id="roleEnabledChecks"
              v-model="roleEditable.isactivated"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
          </b-form-group>
          
          <b-form-group 
            id="roleOrganizationIdGroup"
            label="Organization:"
            label-for="roleOrganizationIdInput"
            :invalid-feedback="organizationIdInvalidFeedback"
            :state="organizationIdState"
          >
            <b-form-select
              id="roleOrganizationIdInput"
              v-model="roleEditable.organizationid" 
              :options="[
                {
                  value: null,
                  text: 'Please select',
                },
                ...organizations.map(organization => ({
                  value: organization.uuid,
                  text: organization.name,
                  disabled: organization.isdeleted,
                })),
              ]"
              :state="organizationIdState"
            />
          </b-form-group>
          <b-form-group 
            id="roleDirectoryIdGroup"
            label="Directory:"
            label-for="roleDirectoryIdInput"
            :invalid-feedback="subjectDirectoryIdInvalidFeedback"
            :state="subjectDirectoryIdState"
          >
            <b-form-select
              id="roleDirectoryIdInput"
              v-model="roleEditable.subjectdirectoryid" 
              :options="[
                {
                  value: null,
                  text: 'Please select',
                },
                ...subjectDirectories.map(subjectDirectory => ({
                  value: subjectDirectory.uuid,
                  text: subjectDirectory.directoryname,
                  disabled: subjectDirectory.isdeleted,
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
            id="roleDescriptionGroup"
            label="Description:"
            label-for="roleDescriptionTextarea"
            :invalid-feedback="descriptionInvalidFeedback"
            :state="descriptionState"
          >
            <b-form-textarea
              id="roleDescriptionTextarea"
              v-model="roleEditable.description"
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
    accessRole: {
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
        return this.roleEditable.effectivestartdate.substring(0, 10);
      },
      set(value) {
        const date = new Date(value);
        this.roleEditable.effectivestartdate = date.toISOString();
      },
    },
    effectiveEndDate: {
      get() {
        return this.roleEditable.effectiveenddate.substring(0, 10);
      },
      set(value) {
        const date = new Date(value);
        this.roleEditable.effectiveenddate = date.toISOString();
      },
    },
    displayNameState() {
      const { displayname } = this.roleEditable;
      const re = /^[0-9A-Za-z_@.-\s]{2,30}$/;
      return displayname.length > 0
        && re.test(String(displayname))
      ;
    },
    displayNameInvalidFeedback() {
      const { displayname } = this.roleEditable;
      if (displayname.length === 0) {
        return 'Please enter display name';
      }
      return '';
    },
    roleNameState() {
      const { subjectname } = this.roleEditable;
      const re = /^[0-9a-z_@.-]{2,30}$/;
      return subjectname.length > 0
        && re.test(String(subjectname))
      ;
    },
    roleNameInvalidFeedback() {
      const { subjectname } = this.roleEditable;
      if (subjectname.length === 0) {
        return 'Please enter role name';
      }
      return '';
    },
    descriptionState() {
      const { description } = this.roleEditable;
      return description.length > 0;
    },
    descriptionInvalidFeedback() {
      const { description } = this.roleEditable;
      if (description.length === 0) {
        return 'Please enter description';
      }
      return '';
    },
    effectiveStartDateState() {
      const { effectivestartdate } = this.roleEditable;
      return effectivestartdate.length > 0;
    },
    effectiveStartDateInvalidFeedback() {
      const { effectivestartdate } = this.roleEditable;
      if (effectivestartdate.length === 0) {
        return 'Please enter start date';
      }
      return '';
    },
    effectiveEndDateState() {
      const { effectiveenddate } = this.roleEditable;
      return effectiveenddate.length > 0;
    },
    effectiveEndDateInvalidFeedback() {
      const { effectiveenddate } = this.roleEditable;
      if (effectiveenddate.length === 0) {
        return 'Please enter end date';
      }
      return '';
    },
    organizationIdState() {
      const { organizationid } = this.roleEditable;
      return organizationid !== null;
    },
    organizationIdInvalidFeedback() {
      const { organizationid } = this.roleEditable;
      if (organizationid === null) {
        return 'Please select organization';
      }
      return '';
    },
    subjectDirectoryIdState() {
      const { subjectdirectoryid } = this.roleEditable;
      return subjectdirectoryid !== null;
    },
    subjectDirectoryIdInvalidFeedback() {
      const { subjectdirectoryid } = this.roleEditable;
      if (subjectdirectoryid === null) {
        return 'Please select directory';
      }
      return '';
    },
  },
  data() {
    const { accessRole, role } = this;
    return {
      roleEditable: JSON.parse(JSON.stringify(accessRole)),
      isPasswordInputVisible: (role === 'add'),
    };
  },
  methods: {
    ...mapActions('roles', ['putRoles', 'postRoles']),
    setValidSubjectName(value) {
      return value.replace(/ /g, '').toLowerCase();
    },
    handleSubmit(evt) {
      evt.preventDefault();
      const { roleEditable, putRoles, postRoles, onUpdate, role } = this;
      const { description, url, effectiveenddate, displayname,
        subjectname, picture, distinguishedname, uniqueid,
        phonebusiness, phoneextension, phonehome, phonemobile,
        jobtitle, department, company } = roleEditable;
      let roleToUpdate = {
        ...roleEditable,
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
        jobtitle: (jobtitle === null ? '' : jobtitle),
        department: (department === null ? '' : department),
        company: (company === null ? '' : company),
        effectiveenddate: (effectiveenddate === null ? '' : effectiveenddate),
      };

      if (role === 'edit') {
        putRoles(roleToUpdate).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        const { currentUser } = this;
        const { uuid } = currentUser.props;
        const crudsubjectid = uuid;
        roleToUpdate = [{
          ...roleToUpdate,
          crudsubjectid,
        }];
        postRoles(roleToUpdate).then((response) => {
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
