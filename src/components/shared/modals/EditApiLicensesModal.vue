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
  >
    <template slot="header">
      <h5 class="modal-title">
        Edit API Licenses of {{proxy.openapidocument.info.title}}
      </h5>
    </template>
    <template>
      <b-form
        @submit="handleSubmit"
      >
        <div style="padding: 1rem;">
          <div>
            <Chips
              :chips="computedProxyLicenses"
              :autocompleteOptions="proxyLicensesEditable"
              :onDeleteChip="handleDeleteApiLicense"
              :onAddChip="handleAddApiLicense"
              :showAddChip="false"
              label="API Licenses"
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
    proxy: {
      type: Object,
      required: false,
    },
    licenses: {
      type: Array,
      required: false,
      default() { return []; },
    },
    apiLicenses: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      proxies: state => state.proxies.items,
    }),
    computedProxyLicenses() {
      const { proxyLicensesEditable } = this;
      return proxyLicensesEditable
      .filter(license => license.isAttached)
      .sort((a, b) => b.sortTime - a.sortTime);
    },
  },
  data() {
    const { licenses, apiLicenses } = this;
    return {
      proxyLicensesEditable: [...JSON.parse(JSON.stringify(licenses))].map((license) => {
        const proxyLicense = apiLicenses.find(m =>
          m.apiid === this.proxy.uuid &&
          !m.isdeleted &&
          m.licenseid === license.uuid,
        );
        const isAttached = Boolean(proxyLicense);
        const sortTime = (new Date()).getTime();
        return {
          ...license,
          value: license.uuid,
          text: license.name,
          isAttached,
          proxyLicense,
          sortTime,
        };
      }),
      licensesToAdd: [],
      licensesToDelete: [],
    };
  },
  methods: {
    ...mapActions('apiLicenses', ['deleteApiLicensesRefs', 'postApiLicensesRefs']),
    handleSubmit(evt) {
      const { proxy, proxyLicensesEditable, postApiLicensesRefs,
        deleteApiLicensesRefs, onUpdate } = this;
      // const { proxy, proxyLicensesEditable } = this;
      evt.preventDefault();
      this.licensesToDelete = proxyLicensesEditable
      .filter(license => license.proxyLicense && !license.isAttached)
      .map(license => (license.proxyLicense));
      this.licensesToAdd = proxyLicensesEditable
      .filter(license => !license.proxyLicense && license.isAttached)
      .map(license => ({
        // organizationid: this.currentUser.props.organizationid,
        organizationid: proxy.organizationid,
        crudsubjectid: this.currentUser.props.uuid,
        licenseid: license.uuid,
        apiid: proxy.uuid,
        isactive: true,
      }));
      if (this.licensesToDelete.length) {
        console.log('licensesToDelete', this.licensesToDelete); // eslint-disable-line
        for (let i = 0; i < this.licensesToDelete.length; i += 1) {
          deleteApiLicensesRefs(this.licensesToDelete[i]).then((response) => {
            if (response && i === this.licensesToDelete.length - 1) {
              onUpdate();
            }
          });
        }
      }
      if (this.licensesToAdd.length) {
        console.log('licensesToAdd', this.licensesToAdd); // eslint-disable-line
        for (let i = 0; i < this.licensesToAdd.length; i += 1) {
          postApiLicensesRefs([this.licensesToAdd[i]]).then((response) => {
            if (response && i === this.licensesToAdd.length - 1) {
              onUpdate();
            }
          })
          .catch((error) => {
            if (error && i === this.licensesToAdd.length - 1) {
              onUpdate();
            }
          });
        }
      }
    },
    handleDeleteApiLicense(index, chip) {
      const { proxyLicensesEditable } = this;
      this.proxyLicensesEditable = proxyLicensesEditable.map((proxy) => {
        const isAttached = proxy.uuid === chip.value ? false : proxy.isAttached;
        return {
          ...proxy,
          isAttached,
        };
      });
    },
    handleAddApiLicense(chip) {
      const { proxyLicensesEditable } = this;
      this.proxyLicensesEditable = proxyLicensesEditable.map((proxy) => {
        const isAttached = proxy.uuid === chip.value ? true : proxy.isAttached;
        const sortTime = (new Date()).getTime();
        return {
          ...proxy,
          isAttached,
          sortTime,
        };
      });
    },
  },
};
</script>
