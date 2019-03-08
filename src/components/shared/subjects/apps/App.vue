<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand>{{ item.displayname }}</b-navbar-brand>

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
            <b-dropdown-item :to="`${routePath}/logs/${item.uuid}/subject/1`">All</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <Icon icon="cog" />
              <em>Operations</em>
            </template>
            <b-dropdown-item :to="`${routePath}/edit-app/${item.uuid}`"><Icon icon="edit" /> Edit App</b-dropdown-item>
            <b-dropdown-item :to="`${routePath}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete App</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="margin: 2rem;">
      <div class="row">
        <div class="col">
          <dt>Name:</dt>
          <dd>{{ item.subjectname }}</dd>
          <dt>Id:</dt>
          <dd><code>{{ item.uuid }}</code></dd>
          <dt>Url:</dt>
          <dd>{{ item.url }}</dd>
          <dt>Email:</dt>
          <dd>{{ item.email }}</dd>
        </div>
        <div class="col">
          <dt>Organization:</dt>
          <dd>{{ getOrganizationName(item.organizationid) }}</dd>
          <dt>Directory:</dt>
          <dd>{{ getSubjectDirectoryName(item.subjectdirectoryid) }}</dd>
          <dt>Effective Start Date:</dt>
          <dd>{{ item.effectivestartdate | moment("DD.MM.YYYY HH:mm") }}</dd>
          <dt>Effective End Date:</dt>
          <dd>{{ item.effectiveenddate | moment("DD.MM.YYYY HH:mm") }}</dd>
        </div>
        <div class="col">
          <dt>Created:</dt>
          <dd>{{ item.created | moment("DD.MM.YYYY HH:mm") }}</dd>
          <dt>Updated:</dt>
          <dd>{{ item.updated | moment("DD.MM.YYYY HH:mm") }}</dd>
          <dt v-if="item.isdeleted">Deleted:</dt>
          <dd v-if="item.isdeleted">{{ item.deleted | moment("DD.MM.YYYY HH:mm") }}</dd>
        </div>
      </div>
      <b-button
        @click="handleToggleContractsTable"
        size="sm"
      >
        <span>Contracts</span>
        <b-badge variant="light">{{ item.contracts.length }}</b-badge>
        <Icon :icon="`${isContractsTableVisible ? 'arrow-down' : 'arrow-right'}`" />
      </b-button>
      <div v-if="isContractsTableVisible" style="margin-bottom: 1rem;">
        <Contracts
          :rows="appContracts"
          :routePath="routePath"
        ></Contracts>
      </div>
    </div>
  </div>
</template>

<script>
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
    childComponent: {
      type: String,
      required: false,
      default() { return 'Contracts'; },
    },
  },
  components: {
    Icon,
    Contracts: () => import('@/components/shared/subjects/contracts/Contracts'),
  },
  computed: {
    ...mapState({
      contractStates: state => state.contractStates.items,
      organizations: state => state.organizations.items,
      subjectDirectories: state => state.subjectDirectories.items,
    }),
    appContracts() {
      const { item, contractStates } = this;
      const getContractStateName = (contractStateId) => {
        const contractState = contractStates
          .find(contractStateItem => contractStateItem.uuid === contractStateId);
        return contractState ? contractState.name : contractStateId;
      };
      return item.contracts.map(contract => ({
        ...contract,
        contractstatename: getContractStateName(contract.contractstateid),
      }));
    },
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      isContractsTableVisible: false,
    };
  },
  methods: {
    handleToggleContractsTable() {
      this.isContractsTableVisible = !this.isContractsTableVisible;
    },
    getOrganizationName(organizationId) {
      const { organizations } = this;
      const organization = organizations.find(i => i.uuid === organizationId) || {};
      return organization.name || organizationId;
    },
    getSubjectDirectoryName(subjectDirectoryId) {
      const { subjectDirectories } = this;
      const directory = subjectDirectories.find(item => item.uuid === subjectDirectoryId) || {};
      return directory.directoryname || subjectDirectoryId;
    },
  },
};
</script>
