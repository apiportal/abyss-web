<template>
  <div>
    <p><strong>Title:</strong> {{ item.name }}</p>
    <p>
      <strong>Policies:</strong>
      <span v-if="tableRows.length === 0">{{ tableRows.length }}</span>
      <b-link @click="handleTogglePoliciesTable" v-else>
        <span>{{ tableRows.length }}</span>
        <Icon :icon="`${isPoliciesTableVisible ? 'arrow-down' : 'arrow-right'}`" />
      </b-link>
    </p>
    <div v-if="isPoliciesTableVisible" style="margin-bottom: 1rem;">
      <Policies
        :rows="tableRows"
      />
    </div>

    <div>
      <b-dropdown variant="secondary" size="sm">
        <template slot="button-content">
          <Icon icon="list-ol" />
          <span>License Logs</span>
        </template>
        <b-dropdown-item :to="`/app/my-apis/businesses/${page}/logs/${item.uuid}/all/1`">All</b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';
import Policies from '@/components/shared/subjects/policies/Policies';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      policies: state => state.policies.items,
      policyTypes: state => state.policyTypes.items,
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
  },
  components: {
    TbodyCollapsible,
    Icon,
    Policies,
  },
  data() {
    return {
      page: parseInt(this.$route.params.page, 10),
      collapsedRows: [],
      isPoliciesTableVisible: false,
    };
  },
  methods: {
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
  },
};
</script>