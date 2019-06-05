<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col">
        <dt>License Name:</dt>
        <dd>{{ item.name }}</dd>
        <dt>Description:</dt>
        <dd>{{ item.licensedocument.info.description }}</dd>
      </dl>
      <dl class="col">
        <dt>Organization:</dt>
        <dd>{{ getOrganizationName(item.organizationid) }}</dd>
        <dt>Visibility:</dt>
        <dd>{{ item.licensedocument.info.visibility }}</dd>
      </dl>
      <dl class="col">
        <dt>Performance:</dt>
        <dd>{{ item.licensedocument.sla.performance }}</dd>
        <dt>Availability:</dt>
        <dd>{{ item.licensedocument.sla.availability }}</dd>
      </dl>
      <dl class="col">
        <dt>Support Hours:</dt>
        <dd>{{ item.licensedocument.sla.supportHours }}</dd>
        <dt>BlackOutHours PerYear:</dt>
        <dd>{{ item.licensedocument.sla.blackOutHoursPerYear }}</dd>
      </dl>
      <dl class="col">
        <dt>Link:</dt>
        <dd><b-link :href="item.licensedocument.legal.link" target="_blank">{{ item.licensedocument.legal.link }}</b-link></dd>
        <b-link
          @click="toggleInformModal"
        >
          Show Legal Agreement
        </b-link>
      </dl>
      <dl class="col">
        <dt>Created:</dt>
        <dd>{{ item.created | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="!item.isdeleted">Updated:</dt>
        <dd v-if="!item.isdeleted">{{ item.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="item.isdeleted">Deleted:</dt>
        <dd v-if="item.isdeleted">{{ item.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
      </dl>
    </div>
    <TextAreaModal
      v-if="isInformModalVisible"
      size="lg"
      :item="item"
      :onClose="toggleInformModal"
      :onConfirm="toggleInformModal"
    >
    </TextAreaModal>
    <div class="row abyss-table-buttons">
      <b-button
        @click="handleTogglePoliciesTable"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Policies attached to License"

        :class="{'active': isPoliciesTableVisible}"
      >
        <span>Policies</span>
        <b-badge pill>{{ tableRows.length }}</b-badge>
      </b-button>
      <b-button
        v-if="routePath !== '/app/explore/'"
        @click="handleToggleApisTable"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Proxy APIs using this License"
        :class="{'active': isApisTableVisible}"
      >
        <span>Proxy APIs</span>
        <b-badge pill>{{ licenseApis.length }}</b-badge>
      </b-button>
      <b-button
        v-if="routePath !== '/app/explore/'"
        @click="handleToggleContractsTable"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Contracts with this License"
        :class="{'active': isContractsTableVisible}"
      >
        <span>Contracts</span>
        <b-badge pill>{{ computedLicenseContracts.length }}</b-badge>
      </b-button>
    </div>
    <div v-if="isPoliciesTableVisible">
      <Policies
        :rows="tableRows"
        :routePath="routePath"
      ></Policies>
    </div>
    <div v-if="isApisTableVisible && licenseApis.length">
      <Proxies
        :rows="computedLicenseApis"
        :routePath="routePath"
      ></Proxies>
    </div>
    <div v-if="isContractsTableVisible && computedLicenseContracts.length">
      <Contracts
        :rows="computedLicenseContracts"
        :routePath="routePath"
        :onNeedsRefreshData="getLicenseContracts"
      ></Contracts>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';

import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';
import TextAreaModal from '@/components/shared/modals/TextAreaModal';

export default {
  name: 'License',
  props: {
    item: {
      type: Object,
      required: true,
    },
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
    childComponent: {
      type: String,
      required: true,
    },
  },
  components: {
    TbodyCollapsible,
    Icon,
    TextAreaModal,
    Policies: () => import('@/components/shared/subjects/policies/Policies'),
    Proxies: () => import('@/components/shared/subjects/proxies/Proxies.vue'),
    Contracts: () => import('@/components/shared/subjects/contracts/Contracts'),
    Apis: () => import('@/components/shared/subjects/apis/Apis'),
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
      currentPage: state => state.currentPage,
      policyTypes: state => state.policyTypes.items,
      organizations: state => state.organizations.items,
      apis: state => state.exploreApis.items,
      proxies: state => state.proxies.items,
    }),
    policies() {
      if (this.item.subjectid !== this.currentUser.uuid) {
        return this.$store.state.policies.items;
      }
      return this.$store.state.subjectPolicies.items;
    },
    tableRows() {
      const { item, policies, policyTypes } = this;
      const licensePolicyIds = item.licensedocument.termsOfService.policyKey;
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
    computedLicenseApis() {
      const { licenseApis } = this;
      return licenseApis.map(licenseApiItem => ({
        ...licenseApiItem,
      }));
    },
    computedLicenseContracts() {
      const { licenseContracts, apis } = this;
      const { currentUser, routePath } = this;
      const getUserFromApi = (apiId) => {
        const theApi = apis.find(item => item.uuid === apiId) || {};
        return theApi.subjectid || apiId;
      };
      return licenseContracts
        .map(licenseContractItem => ({
          ...licenseContractItem,
          userid: getUserFromApi(licenseContractItem.apiid),
        }))
        .filter((item) => {
          if (routePath === '/app/explore/') {
            return item.userid === currentUser.props.uuid;
          }
          return true;
        });
    },
  },
  data() {
    return {
      collapsedRows: [],
      isPoliciesTableVisible: false,
      isApisTableVisible: false,
      isContractsTableVisible: false,
      isInformModalVisible: false,
      licenseApis: [],
      licenseContracts: [],
    };
  },
  methods: {
    toggleInformModal() {
      this.isInformModalVisible = !this.isInformModalVisible;
    },
    getOrganizationName(organizationId) {
      const { organizations } = this;
      const organization = organizations.find(i => i.uuid === organizationId) || {};
      return organization.name || organizationId;
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
    handleTogglePoliciesTable() {
      this.isPoliciesTableVisible = !this.isPoliciesTableVisible;
      if (this.isPoliciesTableVisible) {
        this.isApisTableVisible = false;
        this.isContractsTableVisible = false;
      }
    },
    handleToggleApisTable() {
      this.isApisTableVisible = !this.isApisTableVisible;
      if (this.isApisTableVisible) {
        this.isPoliciesTableVisible = false;
        this.isContractsTableVisible = false;
      }
    },
    handleToggleContractsTable() {
      this.isContractsTableVisible = !this.isContractsTableVisible;
      if (this.isContractsTableVisible) {
        this.isPoliciesTableVisible = false;
        this.isApisTableVisible = false;
      }
    },
    getLicenseContracts() {
      api.getLicenseContracts(this.item.uuid).then((response) => {
        if (response) {
          this.licenseContracts = response.data;
        }
      })
      .catch((error) => {
        if (error.status === 404) {
          this.licenseContracts = [];
        }
      });
    },
    getLicenseApis() {
      api.getLicenseApis(this.item.uuid).then((response) => {
        if (response) {
          this.licenseApis = response.data;
        }
      })
      .catch((error) => {
        if (error.status === 404) {
          this.licenseApis = [];
        }
      });
    },
  },
  mounted() {
    this.$store.dispatch('businessApis/getBusinessApis', { uuid: this.currentUser.uuid });
    if (this.item.subjectid !== this.currentUser.uuid) {
      this.$store.dispatch('policies/getPolicies', { uuid: this.currentUser.uuid });
    } else {
      this.$store.dispatch('subjectPolicies/getSubjectPolicies', { uuid: this.currentUser.uuid });
    }
    this.getLicenseContracts();
    this.getLicenseApis();
  },
};
</script>
