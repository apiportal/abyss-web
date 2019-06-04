<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col-auto">
        <dt style="width: 260px;" class="pb-2">
          <Pictures :uuid="item.uuid" :altText="item.apititle" :color="item.color" type="apis" shape="rectangle" width="200px"></Pictures>
        </dt>
      </dl>
      <dl class="col">
        <dt>Proxy Api Name:</dt>
        <dd>{{ item.apititle }}</dd>
        <dt>Version:</dt>
        <dd>{{ item.version }}</dd>
        <dt>State:</dt>
        <dd>{{ item.apistatename }}</dd>
      </dl>
      <dl class="col col-md-2">
        <dt>Visibility:</dt>
        <dd>{{ item.apivisibilityname }}</dd>
        <dt>Environment:</dt>
        <dd>{{ item.environment }}</dd>
        <dt>Organization:</dt>
        <dd>{{ getOrganizationName(item.organizationid) }}</dd>
      </dl>
      <dl class="col">
        <dt>Business API:</dt>
        <dd>{{ computedBusinessApiName }}</dd>
        <dt>Description:</dt>
        <dd>{{ item.apidescription }}</dd>
      </dl>
      <dl class="col">
        <dt>Created:</dt>
        <dd>{{ item.created | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt>Updated:</dt>
        <dd>{{ item.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt v-if="item.isdeleted">Deleted:</dt>
        <dd v-if="item.isdeleted">{{ item.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
      </dl>

    </div>
    <div class="row abyss-table-buttons">
      <b-button
        @click="handleToggleBusinessTable"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Business API of Proxy API"
        :class="{'active': isBusinessTableVisible}"
      >
        <span>Business API</span>
      </b-button>
      <b-button
        @click="handleToggleLicensesTable"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Attached Licenses"
        :class="{'active': isLicensesTableVisible}"
      >
        <span>Licenses</span>
        <b-badge pill>{{ item.licenses ? item.licenses.length : 0 }}</b-badge>
      </b-button>
      <b-button
        @click="handleToggleContractsTable"
        size="md"
        variant="link"
        v-b-tooltip.hover
        title="Proxy API Contracts"
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
        :isMineApi="isMineApi"
      ></Contracts>
    </div>
    <div v-if="isBusinessTableVisible && businessApi.length">
      <Apis
        :rows="businessApi"
        :routePath="routePath"
      ></Apis>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/api';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';
import Pictures from '@/components/shared/Pictures';

export default {
  computed: {
    ...mapState({
      currentUser: state => state.user,
      businessApis: state => state.businessApis.items,
      organizations: state => state.organizations.items,
    }),
    // computedBusinessApi() {
    //   return this.businessApis.filter(item =>
    //     item.uuid === this.item.businessapiid);
    // },
    computedBusinessApiName() {
      if (this.businessApi.length) {
        return this.businessApi[0].openapidocument.info.title;
      }
      return '';
    },
    isMineApi() {
      return this.currentUser.uuid === this.item.subjectid;
    },
  },
  components: {
    TbodyCollapsible,
    Icon,
    Pictures,
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
      businessApi: [],
    };
  },
  methods: {
    getBusinessApi() {
      api.getApi(this.item.businessapiid).then((response) => {
        this.businessApi = response.data;
      })
      .catch((error) => {
        if (error.status === 404) {
          this.businessApi = [];
        }
      });
    },
    getOrganizationName(organizationId) {
      const { organizations } = this;
      const organization = organizations.find(i => i.uuid === organizationId) || {};
      return organization.name || organizationId;
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
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
  created() {
    this.getBusinessApi();
  },
};
</script>