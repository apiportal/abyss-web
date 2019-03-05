<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand>{{ item.name }}</b-navbar-brand>

      <b-navbar-toggle target="nav_collapse" />

      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <Icon icon="list-ol" />
              <em>Logs</em>
            </template>
            <b-dropdown-item :to="`${routePath}/logs/${item.uuid}/license/1`">All</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <Icon icon="cog" />
              <em>Operations</em>
            </template>
            <b-dropdown-item :to="`${routePath}/edit-license/${item.uuid}`"><Icon icon="edit" /> Edit License</b-dropdown-item>
            <b-dropdown-item @keyup.8="handleDeleteModal" @click="handleDeleteModal"><Icon icon="trash-alt" /> Delete License</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="margin: 2rem;">
      <div class="flex-container">
        <div>
          <p><strong>Name:</strong> {{ item.name }}</p>
          <p><strong>Id:</strong> {{ item.uuid }}</p>
          <p><strong>Organization:</strong> {{ getOrganizationName(item.organizationid) }}</p>
          <p><strong>Description:</strong> {{ item.licensedocument.sla.description }}</p>
          </div>
          <div>
          <p><strong>Performance:</strong> {{ item.licensedocument.sla.performance }}</p>
          <p><strong>Availability:</strong> {{ item.licensedocument.sla.availability }}</p>
          <p><strong>Support Hours:</strong> {{ item.licensedocument.sla.supportHours }}</p>
          <p><strong>BlackOutHours PerYear:</strong> {{ item.licensedocument.sla.blackOutHoursPerYear }}</p>
          <p><strong>Link:</strong> {{ item.licensedocument.legal.link }}</p>
          <b-link
            @click="toggleInformModal"  
            class="fas fa-search"
          >
            Show Legal Agreement 🔍
          </b-link>
          <TextAreaModal
            v-if="isInformModalVisible"  
            size="lg"
            :item="item"
            :onClose="toggleInformModal"
            :onConfirm="toggleInformModal"
          >
          </TextAreaModal>
          </div>
          <div>
          <p><strong>Created at:</strong> {{ item.created | moment("DD.MM.YYYY HH:mm") }}</p>
          <p><strong>Updated at:</strong> {{ item.updated | moment("DD.MM.YYYY HH:mm") }}</p>
          <p v-if="item.isdeleted"><strong>Deleted at:</strong> {{ item.deleted | moment("DD.MM.YYYY HH:mm") }}</p>
          <p><strong>Effective Start Date:</strong></p>
          <p><strong>Effective End Date:</strong></p>
        </div>
      </div>
      <!-- Policies -->
      <div v-if="childComponent === 'policies'">
        <b-button
          @click="handleTogglePoliciesTable"
          size="sm"
        >
          <span>Policies</span>
          <b-badge variant="light">{{ tableRows.length }}</b-badge>
          <Icon :icon="`${isPoliciesTableVisible ? 'arrow-down' : 'arrow-right'}`" />
        </b-button>
        <div v-if="isPoliciesTableVisible" style="margin-bottom: 1rem;">
          <Policies
            :rows="tableRows"
            :routePath="routePath"
          ></Policies>
        </div>
      </div>
      <!-- APIs -->
      <div v-else-if="childComponent === 'apis'">
        <b-button
          @click="handleToggleApisTable"
          size="sm"
        >
          <span>APIs</span>
          <b-badge variant="light">{{ licenseApis.length }}</b-badge>
          <Icon :icon="`${isApisTableVisible ? 'arrow-down' : 'arrow-right'}`" />
        </b-button>
        <div v-if="isApisTableVisible" style="margin-bottom: 1rem;">
          <Apis
            :rows="computedLicenseApis"
            :routePath="routePath"
          ></Apis>
        </div>
      </div>
      <!-- Proxies -->
      <div v-else-if="childComponent === 'proxies'">
        <b-button
          @click="handleToggleApisTable"
          size="sm"
        >
          <span>Proxies</span>
          <b-badge variant="light">{{ licenseApis.length }}</b-badge>
          <Icon :icon="`${isApisTableVisible ? 'arrow-down' : 'arrow-right'}`" />
        </b-button>
        <div v-if="isApisTableVisible" style="margin-bottom: 1rem;">
          <Proxies
            :rows="computedLicenseApis"
            :routePath="routePath"
          ></Proxies>
        </div>
      </div>
      <!-- Contracts -->
      <div v-else-if="childComponent === 'contracts'">
        <b-button
          @click="handleToggleContractsTable"
          size="sm"
        >
          <span>Contracts</span>
          <b-badge variant="light">{{ licenseContracts.length }}</b-badge>
          <Icon :icon="`${isContractsTableVisible ? 'arrow-down' : 'arrow-right'}`" />
        </b-button>
        <div v-if="isContractsTableVisible" style="margin-bottom: 1rem;">
          <Contracts
            :rows="computedLicenseContracts"
            :routePath="routePath"
          ></Contracts>
        </div>
      </div>
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
  },
  computed: {
    ...mapState({
      policies: state => state.policies.items,
      policyTypes: state => state.policyTypes.items,
      organizations: state => state.organizations.items,
      apiStates: state => state.apiStates.items,
      apiVisibilityTypes: state => state.apiVisibilityTypes.items,
      proxies: state => state.proxies.items,
      contractStates: state => state.contractStates.items,
    }),
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
      const { licenseApis, apiStates, apiVisibilityTypes, proxies } = this;
      const getApiStateName = (apistateid) => {
        const apiState = apiStates.find(item => item.uuid === apistateid);
        return apiState ? apiState.name : apistateid;
      };
      const getApiVisibilityName = (apivisibilityid) => {
        const apiVisibility = apiVisibilityTypes.find(item => item.uuid === apivisibilityid);
        return apiVisibility ? apiVisibility.name : apivisibilityid;
      };
      const getNumberOfProxies = apiUuid =>
        proxies.filter(proxy => proxy.businessapiid === apiUuid).length;
      return licenseApis.map(licenseApiItem => ({
        ...licenseApiItem,
        apistatename: getApiStateName(licenseApiItem.apistateid),
        apivisibilityname: getApiVisibilityName(licenseApiItem.apivisibilityid),
        numberofproxies: getNumberOfProxies(licenseApiItem.uuid),
      }));
    },
    computedLicenseContracts() {
      const { licenseContracts, contractStates } = this;
      const getContractStateName = (contractStateId) => {
        const contractState = contractStates
          .find(contractStateItem => contractStateItem.uuid === contractStateId);
        return contractState ? contractState.name : contractStateId;
      };
      return licenseContracts.map(licenseContractItem => ({
        ...licenseContractItem,
        contractstatename: getContractStateName(licenseContractItem.contractstateid),
      }));
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
        this.collapsedRows.push(itemId);
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
    handleTogglePoliciesTable() {
      this.isPoliciesTableVisible = !this.isPoliciesTableVisible;
    },
    handleToggleApisTable() {
      this.isApisTableVisible = !this.isApisTableVisible;
    },
    handleToggleContractsTable() {
      this.isContractsTableVisible = !this.isContractsTableVisible;
    },
    handleDeleteModal() {
      const { item, routePath } = this;
      this.$router.push(`${routePath}/delete-license/${item.uuid}`);
    },
  },
  mounted() {
    if (this.childComponent === 'contracts') {
      api
      .getLicenseContracts(this.item.uuid)
      .then((response) => {
        this.licenseContracts = response.data;
      });
    } else if (this.childComponent === 'proxies') {
      api
      .getLicenseApis(this.item.uuid)
      .then((response) => {
        this.licenseApis = response.data;
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.flex-container {
  display: flex;
  justify-content: space-between;
  border: 1px;
}
</style>