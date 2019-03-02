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
            <!-- <b-dropdown-item :to="`/app/my-licenses/${page}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete License</b-dropdown-item> -->
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div style="margin: 2rem;">
      {{ item.subjectname }}
      <p>
        <strong>Contracts:</strong>
        <span v-if="item.contracts.length === 0">{{ item.contracts.length }}</span>
        <b-link @click="handleToggleContractsTable" v-else>
          <span>{{ item.contracts.length }}</span>
          <Icon :icon="`${isContractsTableVisible ? 'arrow-down' : 'arrow-right'}`" />
        </b-link>
      </p>
      <div v-if="isContractsTableVisible" style="margin-bottom: 1rem;">
        <Contracts
          :rows="appContracts"
          :routePath="routePath"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Icon from '@/components/shared/Icon';
import Contracts from '@/components/shared/subjects/contracts/Contracts';

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
    Contracts,
  },
  computed: {
    ...mapState({
      contractStates: state => state.contractStates.items,
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
  },
};
</script>