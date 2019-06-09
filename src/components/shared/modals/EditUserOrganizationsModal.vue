<template>
  <Modal
    bodyClass="p-0"
    :scrollable="false"
    :hideHeader="hideHeader"
    :hideFooter="hideFooter"
    :noCloseOnBackdrop="noCloseOnBackdrop"
    :noCloseOnEsc="noCloseOnEsc"
    :hideHeaderClose="hideHeaderClose"
    :size="size"
    :onClose="onClose"
    data-qa="modalEditUserOrganizations"
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
        <div class="p-3">
          <div class="form-group">
            <Chips
              :chips="computedUserOrganizations"
              :autocompleteOptions="organizationsEditable"
              :onDeleteChip="handleDeleteUserOrganization"
              :onAddChip="handleAddUserOrganization"
              :showAddChip="false"
              label="User Organizations"
            />
          </div>
        </div>
        <footer class="modal-footer">
          <b-button
            variant="link"
            @click="onClose"
          >
            Cancel
          </b-button>
          <b-button
            variant="primary"
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
      .filter(organization => organization.isAttached)
      .sort((a, b) => b.sortTime - a.sortTime)
      .map(organization => ({
        ...organization,
        isAttached: organization.isAttached,
        isowner: organization.userorganization ? organization.userorganization.isowner : false,
        color: chipColor(organization),
      }));
    },
  },
  data() {
    const { organizations, userOrganizations, chipColor } = this;
    return {
      organizationsEditable: [...JSON.parse(JSON.stringify(organizations))].map((organization) => {
        const userorganization = userOrganizations.find(
          o => o.organizationrefid === organization.uuid);
        const isAttached = Boolean(userorganization);
        const sortTime = (new Date()).getTime();
        return {
          ...organization,
          text: organization.name,
          value: organization.uuid,
          color: chipColor(organization),
          isAttached,
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
      if (item.isAttached && item.userorganization && item.userorganization.isowner) {
        return 'btn-success';
      } else if (!item.isAttached &&
        item.userorganization && item.userorganization.isowner) {
        return 'btn-danger';
      }
      return 'btn-secondary';
    },
    handleSubmit(evt) {
      const { organizationsEditable, postSubjectOrganizations,
        deleteSubjectOrganizations, onUpdate } = this;
      evt.preventDefault();
      this.organizationsToDelete = organizationsEditable
      .filter(organization => organization.userorganization && !organization.isAttached)
      .map(organization => (organization.userorganization));
      this.organizationsToAdd = organizationsEditable
      .filter(organization => !organization.userorganization && organization.isAttached)
      .map(organization => ({
        organizationid: organization.organizationid,
        crudsubjectid: this.currentUser.props.uuid,
        subjectid: this.user.uuid,
        organizationrefid: organization.uuid,
        isowner: false,
        isactive: true,
      }));
      if (this.organizationsToDelete.length) {
        for (let i = 0; i < this.organizationsToDelete.length; i += 1) {
          deleteSubjectOrganizations(this.organizationsToDelete[i]).then((response) => {
            if (response && i === this.organizationsToDelete.length - 1) {
              onUpdate();
            }
          });
        }
      }
      if (this.organizationsToAdd.length) {
        for (let i = 0; i < this.organizationsToAdd.length; i += 1) {
          postSubjectOrganizations([this.organizationsToAdd[i]]).then((response) => {
            if (response && i === this.organizationsToAdd.length - 1) {
              onUpdate();
            }
          })
          .catch((error) => {
            if (error && i === this.organizationsToAdd.length - 1) {
              onUpdate();
            }
          });
        }
      }
    },
    handleDeleteUserOrganization(index, chip) {
      const { organizationsEditable } = this;
      this.organizationsEditable = organizationsEditable.map((item) => {
        const isAttached = item.uuid === chip.value ? false : item.isAttached;
        return {
          ...item,
          isAttached,
        };
      });
    },
    handleAddUserOrganization(chip) {
      const { organizationsEditable } = this;
      this.organizationsEditable = organizationsEditable.map((item) => {
        const isAttached = item.uuid === chip.value ? true : item.isAttached;
        const sortTime = (new Date()).getTime();
        return {
          ...item,
          isAttached,
          sortTime,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
