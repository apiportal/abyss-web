<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col">
        <dt>Title:</dt>
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
        <dt>Description:</dt>
        <dd>{{ item.openapidocument.info.description }}</dd>
      </dl>
    </div>
    <div class="row abyss-table-buttons">
      <b-button
        @click="handleToggleLicensesTable"
        size="md"
        variant="link"
        :class="{'active': isLicensesTableVisible}"
      >
        <span>Licenses</span>
        <b-badge pill>{{ licenses ? licenses.length : 0 }}</b-badge>
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
      <b-button
        @click="handleToggleTokensTable"
        size="md"
        variant="link"
        :class="{'active': isTokensTableVisible}"
        v-if="item.accessTokens"
      >
        <span>API Access Tokens</span>
        <b-badge pill>{{ item.accessTokens.length }}</b-badge>
      </b-button>
    </div>
    <div v-if="isLicensesTableVisible">
      <Licenses
        :rows="licenses"
        :routePath="routePath"
      ></Licenses>
    </div>
    <div v-if="isContractsTableVisible">
      <Contracts
        :rows="item.contracts"
        :routePath="routePath"
      ></Contracts>
    </div>
    <div v-if="isTokensTableVisible && item.accessTokens">
      <AccessTokens
        :rows="item.accessTokens"
        :routePath="routePath"
      ></AccessTokens>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';

export default {
  computed: {
    ...mapState({
    }),
    tableRows() {
      return this.licenses;
    },
  },
  components: {
    TbodyCollapsible,
    Icon,
    AccessTokens: () => import('@/components/shared/subjects/subscriptions/AccessTokens'),
    Licenses: () => import('@/components/shared/subjects/licenses/Licenses'),
    Contracts: () => import('@/components/shared/subjects/contracts/Contracts'),
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
      licenses: [],
      isLicensesTableVisible: false,
      isContractsTableVisible: false,
      isTokensTableVisible: false,
    };
  },
  methods: {
    environment(item) {
      return item.islive ? 'Live' : 'Sandbox';
    },
    getApiLicenses(uuid) {
      api.getApiLicenses(uuid).then((response) => {
        if (response && response.data) {
          this.licenses = response.data;
          // console.log(this.licenses);
        }
      });
    },
    handleToggleTokensTable() {
      this.isTokensTableVisible = !this.isTokensTableVisible;
      // if (this.isTokensTableVisible) {
      this.isLicensesTableVisible = false;
      this.isContractsTableVisible = false;
      // }
    },
    handleToggleContractsTable() {
      this.isContractsTableVisible = !this.isContractsTableVisible;
      if (this.isContractsTableVisible) {
        this.isLicensesTableVisible = false;
        this.isTokensTableVisible = false;
      }
    },
    handleToggleLicensesTable() {
      this.isLicensesTableVisible = !this.isLicensesTableVisible;
      if (this.isLicensesTableVisible) {
        this.isContractsTableVisible = false;
        this.isTokensTableVisible = false;
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
  created() {
    this.getApiLicenses(this.item.uuid);
  },
};
</script>