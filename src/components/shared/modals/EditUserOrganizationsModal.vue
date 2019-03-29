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
        Edit User Organizations of {{user.displayname}}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <div class="form-group">
            <Chips
              :chips="computedUserOrganizations"
              :autocompleteOptions="this.organizationsEditable.map((item) => ({
                text: item.name,
                value: item.uuid,
                isUserOrganization: item.isUserOrganization,
                color: item.color,
                // isowner: item.isowner,
              }))"
              :onDeleteChip="handleDeleteUserOrganization"
              :onAddChip="handleAddUserOrganization"
              label="User Organizations"
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
    computedUserOrganizations() {
      const { organizationsEditable, chipColor } = this;
      return organizationsEditable
      .filter(organization => organization.isUserOrganization)
      .sort((a, b) => b.sortTime - a.sortTime)
      .map(organization => ({
        value: organization.uuid,
        text: organization.name,
        isdeleted: organization.isdeleted,
        isUserOrganization: organization.isUserOrganization,
        isowner: organization.userorganization.isowner,
        color: chipColor(organization),
      }));
    },
  },
  data() {
    const { organizations, userOrganizations } = this;
    return {
      organizationsEditable: [...JSON.parse(JSON.stringify(organizations))].map((organization) => {
        const userorganization = userOrganizations.find(
          o => o.organizationrefid === organization.uuid);
        const isUserOrganization = Boolean(userorganization);
        const sortTime = (new Date()).getTime();
        return {
          ...organization,
          isUserOrganization,
          userorganization,
          sortTime,
        };
      }),
      organizationsToAdd: [],
      organizationsToDelete: [],
    };
  },
  methods: {
    ...mapActions('subjectOrganizations', ['deleteSubjectOrganizations', 'postSubjectOrganizations']),
    chipColor(item) {
      if (item.isUserOrganization && item.userorganization && item.userorganization.isowner) {
        return 'btn-success';
      } else if (!item.isUserOrganization &&
        item.userorganization && item.userorganization.isowner) {
        return 'btn-error';
      }
      return 'btn-secondary';
    },
    handleSubmit(evt) {
      const { organizationsEditable, postSubjectOrganizations,
        deleteSubjectOrganizations, onUpdate } = this;
      evt.preventDefault();
      this.organizationsToDelete = organizationsEditable
      .filter(organization => organization.userorganization && !organization.isUserOrganization)
      .map(organization => (organization.userorganization));
      this.organizationsToAdd = organizationsEditable
      .filter(organization => !organization.userorganization && organization.isUserOrganization)
      .map(organization => ({
        // organizationid: this.currentUser.props.organizationid,
        organizationid: organization.organizationid,
        crudsubjectid: this.currentUser.props.uuid,
        subjectid: this.user.uuid,
        organizationrefid: organization.uuid,
        isowner: false,
        isactive: true,
      }));
      if (this.organizationsToDelete.length) {
        // console.log('organizationsToDelete', this.organizationsToDelete);
        for (let i = 0; i < this.organizationsToDelete.length; i += 1) {
          deleteSubjectOrganizations(this.organizationsToDelete[i]).then((response) => {
            if (response && response.data) {
              onUpdate();
            }
          });
        }
      }
      if (this.organizationsToAdd.length) {
        // console.log('organizationsToAdd', this.organizationsToAdd);
        for (let i = 0; i < this.organizationsToAdd.length; i += 1) {
          postSubjectOrganizations([this.organizationsToAdd[i]]).then((response) => {
            if (response && response.data) {
              onUpdate();
            }
          });
        }
      }
    },
    handleDeleteUserOrganization(index, chip) {
      const { organizationsEditable } = this;
      this.organizationsEditable = organizationsEditable.map((item) => {
        const isUserOrganization = item.uuid === chip.value ? false : item.isUserOrganization;
        return {
          ...item,
          isUserOrganization,
        };
      });
    },
    handleAddUserOrganization(chip) {
      const { organizationsEditable } = this;
      this.organizationsEditable = organizationsEditable.map((item) => {
        const isUserOrganization = item.uuid === chip.value ? true : item.isUserOrganization;
        const sortTime = (new Date()).getTime();
        return {
          ...item,
          isUserOrganization,
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
