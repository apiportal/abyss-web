<template>
  <div class="abyss-table-content">
    <div class="row">
      <dl class="col">
        <dt>Name:</dt>
        <dd>{{ item.subjectname }}</dd>
        <dt>Url:</dt>
        <dd>{{ item.url }}</dd>
        <dt>Email:</dt>
        <dd>{{ item.email }}</dd>
      </dl>
      <dl class="col">
        <dt>Organization:</dt>
        <dd>{{ getOrganizationName(item.organizationid) }}</dd>
        <dt>Directory:</dt>
        <dd>{{ getSubjectDirectoryName(item.subjectdirectoryid) }}</dd>
      </dl>
      <dl class="col">
        <dt>Effective Start Date:</dt>
        <dd>{{ item.effectivestartdate | moment("DD.MM.YYYY HH:mm") }}</dd>
        <dt>Effective End Date:</dt>
        <dd>{{ item.effectiveenddate | moment("DD.MM.YYYY HH:mm") }}</dd>
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
        @click="handleToggleContractsTable"
        size="md"
        variant="link"
        :class="{'active': isContractsTableVisible}"
      >
        <span>Contracts</span>
        <b-badge pill>{{ item.contracts.length }}</b-badge>
      </b-button>
    </div>
    <div v-if="isContractsTableVisible">
      <Contracts
        :rows="appContracts"
        :routePath="routePath"
      ></Contracts>
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
