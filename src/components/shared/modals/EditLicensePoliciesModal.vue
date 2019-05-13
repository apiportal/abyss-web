<template>
  <Modal
    bodyClass="edit-license-policies"
    :scrollable="false"
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
        Edit License Policies of {{licenseEditable.name}}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <div>
            <Chips
              :chips="computedLicensePolicies"
              :autocompleteOptions="policiesEditable"
              :onDeleteChip="handleDeletePolicies"
              :onAddChip="handleAddPolicies"
              :showAddChip="false"
              label="License Policies"
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
    policyTypes: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      // policyTypes: state => state.policyTypes.items,
    }),
    computedLicensePolicies() {
      const { policiesEditable } = this;
      return policiesEditable
      .filter(item => item.isAttached)
      .sort((a, b) => b.sortTime - a.sortTime)
      // .map(item => ({
      //   ...item,
      //   value: item.uuid,
      //   text: `${item.name}: ${item.typename}`,
      // }))
      ;
    },
  },
  data() {
    const { license, policies } = this;
    const licensePolicyIds = license.licensedocument.termsOfService.policyKey;
    // const getTypeName = (typeId) => {
    //   console.log(typeId, this.policyTypes);
    //   const type = this.policyTypes.find(policyType => policyType.uuid === typeId);
    //   return type ? `${type.name} / ${type.type} / ${type.subtype}` : typeId;
    // };
    const policyText = (item) => {
      if (item.policyinstance.info) {
        const nameWithTypes = `${item.name} /
        ${item.policyinstance.info.type} / ${item.policyinstance.info.subType}`;
        return nameWithTypes;
      }
      return item.name;
    };
    return {
      licenseEditable: JSON.parse(JSON.stringify(license)),
      policiesEditable: [...JSON.parse(JSON.stringify(policies))]
      .map((item) => {
        const isAttached = Boolean(licensePolicyIds.indexOf(item.uuid) > -1);
        const sortTime = (new Date()).getTime();
        return {
          ...item,
          text: policyText(item),
          value: item.uuid,
          isAttached,
          sortTime,
        };
      }),
    };
  },
  methods: {
    ...mapActions('subjectLicenses', ['putLicenses']),
    policyIds() {
      this.licenseEditable.licensedocument.termsOfService.policyKey =
      this.computedLicensePolicies.map(item => (item.value));
    },
    handleSubmit(evt) {
      evt.preventDefault();
      const { licenseEditable, onUpdate, putLicenses } = this;
      // const { licenseEditable, onUpdate } = this;
      // console.log(licenseEditable);
      // onUpdate();
      putLicenses(licenseEditable).then(() => {
        onUpdate();
      });
    },
    handleDeletePolicies(index, chip) {
      const { policiesEditable } = this;
      this.policiesEditable = policiesEditable.map((item) => {
        const isAttached = item.uuid === chip.value ? false : item.isAttached;
        return {
          ...item,
          isAttached,
        };
      });
      this.policyIds();
    },
    handleAddPolicies(chip) {
      const { policiesEditable } = this;
      this.policiesEditable = policiesEditable.map((item) => {
        const isAttached = item.uuid === chip.value ? true : item.isAttached;
        const sortTime = (new Date()).getTime();
        return {
          ...item,
          isAttached,
          sortTime,
        };
      });
      this.policyIds();
    },
  },
};
</script>

<style lang="scss">
.modal-body {
  &.edit-license-policies {
    padding: 0;
  }
}
</style>
