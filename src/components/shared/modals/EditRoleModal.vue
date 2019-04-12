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
        <Icon :icon=iconTitle class="name" />
        {{ role === 'edit' ? 'edit role' : 'New Role' }}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <b-form-group 
            id="roleNameGroup"
          >
            <label>
              Name:
              <span class="text-danger">*</span>
            </label>
            <b-form-input
              id="roleNameInput"
              type="text"
              v-model="roleEditable.displayname"
              :state="roleNameState"
              placeholder="Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group 
            id="roleDescriptionGroup"
          >
            <label>
              Description:
              <span class="text-danger">*</span>
            </label>
            <b-form-textarea
              id="roleDescriptionTextarea"
              v-model="roleEditable.description"
              :state="descriptionState"
              placeholder="Description"
              :rows="3"
              required
            >
            </b-form-textarea>
          </b-form-group>
          <b-form-group id="roleEnabledGroup">
            <b-form-checkbox
              id="roleEnabledChecks"
              v-model="roleEditable.isactive"
              :value="true"
              :unchecked-value="false"
            >
              Enabled
            </b-form-checkbox>
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
import DynamicForm from '@/components/shared/dynamicForm/DynamicForm';

export default {
  components: {
    Modal,
    Icon,
    DynamicForm,
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
    role: {
      type: String,
      required: false,
      default() { return 'edit'; },
    },
    iconTitle: {
      type: String,
      required: false,
    },
    accessRole: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
    roleNameState() {
      const { displayname } = this.roleEditable;

      if (displayname && displayname.length > 0) {
        return true;
      }

      return false;
    },
    descriptionState() {
      const { description } = this.roleEditable;

      if (description && description.length > 0) {
        return true;
      }

      return false;
    },
  },
  data() {
    const { accessRole } = this;
    return {
      roleEditable: JSON.parse(JSON.stringify(accessRole)),
    };
  },
  methods: {
    ...mapActions('accessRole', ['putRoles', 'postRoles']),
    handleSubmit(evt) {
      evt.preventDefault();
      const { putRoles, postRoles, roleEditable, onUpdate, role } = this;
      const { organizationid, crudsubjectid, subjecttypeid, subjectname,
      firstname, lastname, displayname, email, secondaryemail,
      effectivestartdate, effectiveenddate, password, picture,
      subjectdirectoryid, islockedfalse, issandbox, url,
      isrestrictedtoprocessing, description, distinguishedname,
      uniqueid, phonebusiness, phonehome, phonemobile, phoneextension,
      jobtitle, department, company } = roleEditable;

      const accessRoleToUpdate = {
        ...roleEditable,
        organizationid: (organizationid === null ? '' : organizationid),
        crudsubjectid: (crudsubjectid === null ? '' : crudsubjectid),
        subjecttypeid: (subjecttypeid === null ? '' : subjecttypeid),
        subjectname: (subjectname === null ? '' : subjectname),
        firstname: (firstname === null ? '' : firstname),
        lastname: (lastname === null ? '' : lastname),
        displayname: (displayname === null ? '' : displayname),
        email: (email === null ? '' : email),
        secondaryemail: (secondaryemail === null ? '' : secondaryemail),
        effectivestartdate: (effectivestartdate === null ?
          this.$moment.utc().toISOString() : effectivestartdate),
        effectiveenddate: (effectiveenddate === null ? this.$moment.utc().add(50, 'years').toISOString() : effectiveenddate),
        password: (password === null ? '' : password),
        picture: (picture === null ? '' : picture),
        subjectdirectoryid: (subjectdirectoryid === null ? '' : subjectdirectoryid),
        islockedfalse: (islockedfalse === null ? '' : islockedfalse),
        issandbox: (issandbox === null ? '' : issandbox),
        url: (url === null ? '' : url),
        isrestrictedtoprocessing: (isrestrictedtoprocessing === null ? '' : isrestrictedtoprocessing),
        description: (description === null ? '' : description),
        distinguishedname: (distinguishedname === null ? '' : distinguishedname),
        uniqueid: (uniqueid === null ? '' : uniqueid),
        phonebusiness: (phonebusiness === null ? '' : phonebusiness),
        phonehome: (phonehome === null ? '' : phonehome),
        phonemobile: (phonemobile === null ? '' : phonemobile),
        phoneextension: (phoneextension === null ? '' : phoneextension),
        jobtitle: (jobtitle === null ? '' : jobtitle),
        department: (department === null ? '' : department),
        company: (company === null ? '' : company),
      };

      if (role === 'edit') {
        putRoles({
          accessRoleToUpdate,
        }).then((response) => {
          if (response && response.data) {
            onUpdate();
          }
        });
      } else if (role === 'add') {
        // const { currentUser } = this;
        // const { uuid } = currentUser.props;
        // const crudsubjectid = uuid;
        const roleToAdd = [{
          ...accessRoleToUpdate,
          crudsubjectid,
        }];
        postRoles(roleToAdd).then((response) => {
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
  &.edit-access-manager {
    padding: 0;
  }
}

.configure-access-manager {
  border: 1px solid #e9ecef;
  border-radius: .3rem;
  padding: 1rem;
  position: relative;

  &:before {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(233, 236, 239, 0);
    border-bottom-color: #e9ecef;
    border-width: 11px;
    margin-left: -11px;
  }
}

.name {
  color: #3b68af;
}
</style>