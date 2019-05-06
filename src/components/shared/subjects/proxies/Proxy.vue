<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col-auto">
        <dt class="bg-cover mb-2 bg-secondary embed-responsive embed-responsive-1by1 img-thumbnail" style="width: 200px;" :style="{ 'background-image': 'url(' + item.image + ')' }"></dt>
      </dl>
      <dl class="col">
        <dt>Proxy Api Name:</dt>
        <dd>{{ item.openapidocument.info.title }}</dd>
        <dt>Version:</dt>
        <dd>{{ item.openapidocument.info.version }}</dd>
        <dt>Organization:</dt>
        <dd>{{ item.organizationame }}</dd>
      </dl>
      <dl class="col col-md-2">
        <dt>State:</dt>
        <dd>{{ item.apistatename }}</dd>
        <dt>Visibility:</dt>
        <dd>{{ item.apivisibilityname }}</dd>
        <dt>Environment:</dt>
        <dd>{{ environment(item) }}</dd>
      </dl>
      <dl class="col">
        <dt>Business API:</dt>
        <dd>{{ computedBusinessApiName }}</dd>
        <dt>Description:</dt>
        <dd>{{ item.openapidocument.info.description }}</dd>
      </dl>
    </div>
    <div class="row abyss-table-buttons">
      <b-button
        @click="handleToggleBusinessTable"
        size="md"
        variant="link"
        :class="{'active': isBusinessTableVisible}"
      >
        <span>Business API</span>
        <b-badge pill>{{ computedBusinessApi.length }}</b-badge>
      </b-button>
      <b-button
        @click="handleToggleLicensesTable"
        size="md"
        variant="link"
        :class="{'active': isLicensesTableVisible}"
      >
        <span>Licenses</span>
        <b-badge pill>{{ item.licenses ? item.licenses.length : 0 }}</b-badge>
      </b-button>
      <b-button
        @click="handleToggleContractsTable"
        size="md"
        variant="link"
        :class="{'active': isContractsTableVisible}"
      >
        <span>Contracts</span>
        <b-badge pill>{{ item.contractscount }}</b-badge>
      </b-button>
    </div>
    <div v-if="isLicensesTableVisible && item.licenses.length">
      <Licenses
        :rows="item.licenses"
        :routePath="routePath"
      ></Licenses>
    </div>
    <div v-if="isContractsTableVisible && item.contracts.length">
      <Contracts
        :rows="item.contracts"
        :routePath="routePath"
      ></Contracts>
    </div>
    <div v-if="isBusinessTableVisible && computedBusinessApi.length">
      <Apis
        :rows="computedBusinessApi"
        :routePath="routePath"
      ></Apis>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';

export default {
  computed: {
    ...mapState({
      businessApis: state => state.businessApis.items,
    }),
    computedBusinessApi() {
      return this.businessApis.filter(item =>
        item.uuid === this.item.businessapiid);
    },
    computedBusinessApiName() {
      if (this.computedBusinessApi.length) {
        return this.computedBusinessApi[0].openapidocument.info.title;
      }
      return '';
    },
  },
  components: {
    TbodyCollapsible,
    Icon,
    Licenses: () => import('@/components/shared/subjects/licenses/Licenses'),
    Contracts: () => import('@/components/shared/subjects/contracts/Contracts'),
    Apis: () => import('@/components/shared/subjects/apis/Apis'),
  },
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
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      collapsedRows: [],
      isLicensesTableVisible: false,
      isContractsTableVisible: false,
      isTokensTableVisible: false,
      isBusinessTableVisible: false,
    };
  },
  methods: {
    environment(item) {
      return item.islive ? 'Live' : 'Sandbox';
    },
    handleToggleContractsTable() {
      this.isContractsTableVisible = !this.isContractsTableVisible;
      if (this.isContractsTableVisible) {
        this.isLicensesTableVisible = false;
        this.isTokensTableVisible = false;
        this.isBusinessTableVisible = false;
      }
    },
    handleToggleLicensesTable() {
      this.isLicensesTableVisible = !this.isLicensesTableVisible;
      if (this.isLicensesTableVisible) {
        this.isContractsTableVisible = false;
        this.isTokensTableVisible = false;
        this.isBusinessTableVisible = false;
      }
    },
    handleToggleBusinessTable() {
      this.isBusinessTableVisible = !this.isBusinessTableVisible;
      if (this.isBusinessTableVisible) {
        this.isContractsTableVisible = false;
        this.isTokensTableVisible = false;
        this.isLicensesTableVisible = false;
      }
    },
    handleCollapseTableRows(itemId) {
      const rowIndex = this.collapsedRows.indexOf(itemId);
      if (rowIndex === -1) {
        // this.collapsedRows.push(itemId);
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>