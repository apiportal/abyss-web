<template>
  <div class="abyss-table-content">
    <!-- {{ apisOfPolicy }} -->
    <div class="row">
      <dl class="col">
        <dt>Policy Name:</dt>
        <dd>{{ item.name }}</dd>
        <dt>Description:</dt>
        <dd>{{ item.description }}</dd>
        <dt>Organization:</dt>
        <dd>{{ getOrganizationName(item.organizationid) }}</dd>
      </dl>
      <dl class="col" v-if="item.policyinstance && item.policyinstance.info">
        <dt>Type:</dt>
        <dd>{{ item.policyinstance.info.type }}</dd>
        <dt>Subtype:</dt>
        <dd>{{ item.policyinstance.info.subType }}</dd>
        <dt>Title:</dt>
        <dd>{{ item.policyinstance.info.title }}</dd>
        <dt>Description:</dt>
        <dd>{{ item.policyinstance.info.description }}</dd>
      </dl>
      <dl class="col" v-if="item.policyinstance && item.policyinstance.openApiLifeCycle">
        <dt>Business Request</dt>
        <dd class="text-black-50">
          <Icon icon="circle" :class="item.policyinstance.openApiLifeCycle.onBusinessRequest ? 'business-true' : ''" />
        </dd>
          <dt>Business Response</dt>
        <dd class="text-black-50">
          <Icon icon="circle" :class="item.policyinstance.openApiLifeCycle.onBusinessResponse ? 'business-true' : ''" />
        </dd>
          <dt>Proxy Request</dt>
        <dd class="text-black-50">
          <Icon icon="circle" :class="item.policyinstance.openApiLifeCycle.onProxyRequest ? 'proxy-true' : ''" />
        </dd>
          <dt>Proxy Response</dt>
        <dd class="text-black-50">
          <Icon icon="circle" :class="item.policyinstance.openApiLifeCycle.onProxyResponse ? 'proxy-true' : ''" />
        </dd>
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
    <div class="row abyss-table-buttons">
      <b-button
        v-if="routePath !== '/app/explore/' && item.subjectid === currentUser.uuid"
        @click="handleToggleLicensesTable"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Policy Attached Licenses"
        :class="{'active': isLicensesTableVisible}"
      >
        <span>Licenses</span>
        <b-badge pill>{{ licensesOfPolicy ? licensesOfPolicy.length : 0 }}</b-badge>
      </b-button>
      <b-button
        v-if="routePath !== '/app/explore/' && item.subjectid === currentUser.uuid"
        @click="handleToggleContractsTable"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Used by Contracts"
        :class="{'active': isContractsTableVisible}"
      >
        <span>Contracts</span>
        <b-badge pill>{{ contractsOfPolicy ? contractsOfPolicy.length : 0 }}</b-badge>
      </b-button>
      <b-button
        v-if="routePath !== '/app/explore/' && item.subjectid === currentUser.uuid"
        @click="handleToggleApisTable"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Used by APIs"
        :class="{'active': isApisTableVisible}"
      >
        <span>APIs</span>
        <b-badge pill>{{ apisOfPolicy.length }}</b-badge>
      </b-button>
    </div>
    <div v-if="isLicensesTableVisible && licensesOfPolicy.length">
      <Licenses
        :rows="licensesOfPolicy"
        :routePath="routePath"
      ></Licenses>
    </div>
    <div v-if="isContractsTableVisible && contractsOfPolicy.length">
      <Contracts
        :rows="contractsOfPolicy"
        :routePath="routePath"
      ></Contracts>
    </div>
    <div v-if="isApisTableVisible && apisOfPolicy.length">
      <Proxies
        :rows="apisOfPolicy"
        :routePath="routePath"
      ></Proxies>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';

export default {
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
    organizations: {
      type: Array,
      required: false,
    },
  },
  components: {
    Icon,
    Licenses: () => import('@/components/shared/subjects/licenses/Licenses'),
    Contracts: () => import('@/components/shared/subjects/contracts/Contracts'),
    Proxies: () => import('@/components/shared/subjects/proxies/Proxies'),
  },
  methods: {
    handleToggleContractsTable() {
      this.isContractsTableVisible = !this.isContractsTableVisible;
      if (this.isContractsTableVisible) {
        this.isApisTableVisible = false;
        this.isLicensesTableVisible = false;
      }
    },
    handleToggleApisTable() {
      this.isApisTableVisible = !this.isApisTableVisible;
      if (this.isApisTableVisible) {
        this.isContractsTableVisible = false;
        this.isLicensesTableVisible = false;
      }
    },
    handleToggleLicensesTable() {
      this.isLicensesTableVisible = !this.isLicensesTableVisible;
      if (this.isLicensesTableVisible) {
        this.isApisTableVisible = false;
        this.isContractsTableVisible = false;
      }
    },
    getOrganizationName(organizationId) {
      const { organizations } = this;
      const organization = organizations.find(i => i.uuid === organizationId) || {};
      return organization.name || organizationId;
    },
    getLicensesOfPolicy() {
      api.getLicensesOfPolicy(this.item.uuid).then((response) => {
        this.licensesOfPolicy = response.data;
      });
    },
    getContractsOfPolicy() {
      api.getContractsOfPolicy(this.item.uuid).then((response) => {
        this.contractsOfPolicy = response.data;
      });
    },
    getApisOfPolicy() {
      api.getApisOfPolicy(this.item.uuid).then((response) => {
        this.apisOfPolicy = response.data;
      });
    },
  },
  computed: {
    ...mapState({
      currentUser: state => state.user,
    }),
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      isLicensesTableVisible: false,
      isContractsTableVisible: false,
      isApisTableVisible: false,
      licensesOfPolicy: [],
      contractsOfPolicy: [],
      apisOfPolicy: [],
    };
  },
  created() {
    this.getLicensesOfPolicy();
    this.getContractsOfPolicy();
    this.getApisOfPolicy();
  },
};
</script>
<style lang="scss" scoped>
.business-true {
  color: cyan;
}
.proxy-true {
  color: purple;
}
</style>