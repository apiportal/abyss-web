<template>
  <Modal
    bodyClass="edit-administer-user-policies"
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
        Edit User Groups of {{license.name}}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <div>
            {{computedLicensePolicies}}
            <hr>
            {{xxx}}
            <hr>
            {{license.licensedocument.termsOfService.policyKey}}
            <Chips
              :chips="computedLicensePolicies"
              :autocompleteOptions="this.policies.map((item) => ({
                text: item.name,
                value: item.uuid,
                isdeleted: item.isdeleted,
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
    license: {
      type: Object,
      required: false,
    },
    policies: {
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
    computedLicensePolicies() {
      const { policiesEditable } = this;
      return policiesEditable
      .filter(group => group.isMembership)
      .sort((a, b) => b.sortTime - a.sortTime)
      .map(group => ({
        value: group.uuid,
        text: group.name,
        isdeleted: group.isdeleted,
        isMembership: group.isMembership,
      }));
    },
    xxx() {
      this.computedLicensePolicies.map(group => (group.uuid));
    },
    zzzz() {
      const { license, policies, policyTypes } = this;
      const licensePolicyIds = license.licensedocument.termsOfService.policyKey;
      const getTypeName = (typeId) => {
        const type = policyTypes.find(policyType => policyType.uuid === typeId);
        return type ? type.name : typeId;
      };
      return policies
      .filter(policy => licensePolicyIds.indexOf(policy.uuid) > -1)
      .map(policy => ({
        ...policy,
        typename: getTypeName(policy.typeid),
      }));
    },
  },
  data() {
    const { license, policies } = this;
    const licensePolicyIds = license.licensedocument.termsOfService.policyKey;
    return {
      policiesEditable: [...JSON.parse(JSON.stringify(policies))]
      .map((group) => {
        console.log(licensePolicyIds.indexOf(group.uuid) > -1);
        // const membership = policies.find(policy => licensePolicyIds.indexOf(policy.uuid) > -1);
        const isMembership = Boolean(licensePolicyIds.indexOf(group.uuid) > -1);
        // console.log(membership.some(f =>
        //     f.subjectid === el.uuid,
        //   ),);
        // console.log(isMembership, licensePolicyIds, membership);
        const sortTime = (new Date()).getTime();
        return {
          ...group,
          isMembership,
          // membership,
          sortTime,
        };
      }),
      policiesToAdd: [],
      policiesToDelete: [],
    };
  },
  methods: {
    ...mapActions('subjectMemberships', ['deleteSubjectMemberships', 'postSubjectMemberships']),
    handleSubmit(evt) {
      const { policiesEditable, postSubjectMemberships, deleteSubjectMemberships, onUpdate } = this;
      evt.preventDefault();
      this.policiesToDelete = policiesEditable
      .filter(group => group.membership && !group.isMembership)
      .map(group => (group.membership));
      this.policiesToAdd = policiesEditable
      .filter(group => !group.membership && group.isMembership)
      .map(group => ({
        // organizationid: this.currentUser.props.organizationid,
        organizationid: group.organizationid,
        crudsubjectid: this.currentUser.props.uuid,
        subjectid: this.user.uuid,
        subjectgroupid: group.uuid,
        subjectdirectoryid: group.subjectdirectoryid,
      }));
      if (this.policiesToDelete.length) {
        // console.log('policiesToDelete', this.policiesToDelete);
        for (let i = 0; i < this.policiesToDelete.length; i += 1) {
          deleteSubjectMemberships(this.policiesToDelete[i]).then((response) => {
            if (response && response.data) {
              onUpdate();
            }
          });
        }
      }
      if (this.policiesToAdd.length) {
        // console.log('policiesToAdd', this.policiesToAdd);
        for (let i = 0; i < this.policiesToAdd.length; i += 1) {
          postSubjectMemberships([this.policiesToAdd[i]]).then((response) => {
            if (response && response.data) {
              onUpdate();
            }
          });
        }
      }
    },
    handleDeleteMembership(index, chip) {
      const { policiesEditable } = this;
      this.policiesEditable = policiesEditable.map((group) => {
        const isMembership = group.uuid === chip.value ? false : group.isMembership;
        return {
          ...group,
          isMembership,
        };
      });
    },
    handleAddMembership(chip) {
      const { policiesEditable } = this;
      this.policiesEditable = policiesEditable.map((group) => {
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
  &.edit-administer-user-policies {
    padding: 0;
  }
}
</style>
