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
      <table class="table verapi-table">
        <thead>
          <tr>
            <th>Policy Name</th>
            <th>Policy Type</th>
            <th>Business Request</th>
            <th>Business Response</th>
            <th>Proxy Request</th>
            <th>Proxy Response</th>
          </tr>
        </thead>
        <TbodyCollapsible
          v-for="(policyItem, index) in tableRows" v-bind:key="index"
          :isCollapsed="collapsedRows.indexOf(policyItem.uuid) > -1"
          :level="3"
        >
          <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'}`">
            <td @click="() => handleCollapseTableRows(policyItem.uuid)">
              {{ policyItem.name }}
            </td>
            <td @click="() => handleCollapseTableRows(policyItem.uuid)">
              {{ policyItem.typename }}
            </td>
            <td @click="() => handleCollapseTableRows(policyItem.uuid)">
              <Icon 
                :icon="policyItem.policyinstance.openApiLifeCycle.onBusinessRequest ? 'check-circle' : 'times-circle'" 
                :class="policyItem.policyinstance.openApiLifeCycle.onBusinessRequest ? 'text-success' : 'text-danger'"
              />
            </td>
            <td @click="() => handleCollapseTableRows(policyItem.uuid)">
              <Icon 
                :icon="policyItem.policyinstance.openApiLifeCycle.onBusinessResponse ? 'check-circle' : 'times-circle'" 
                :class="policyItem.policyinstance.openApiLifeCycle.onBusinessResponse ? 'text-success' : 'text-danger'"
              />
            </td>
            <td @click="() => handleCollapseTableRows(policyItem.uuid)">
              <Icon 
                :icon="policyItem.policyinstance.openApiLifeCycle.onProxyRequest ? 'check-circle' : 'times-circle'" 
                :class="policyItem.policyinstance.openApiLifeCycle.onProxyRequest ? 'text-success' : 'text-danger'"
              />
            </td>
            <td @click="() => handleCollapseTableRows(policyItem.uuid)">
              <Icon 
                :icon="policyItem.policyinstance.openApiLifeCycle.onProxyResponse ? 'check-circle' : 'times-circle'" 
                :class="policyItem.policyinstance.openApiLifeCycle.onProxyResponse ? 'text-success' : 'text-danger'"
              />
            </td>
          </tr>
          <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(policyItem.uuid) > -1">
            <td colspan="6">
              <div class="collapsible-content">
                <Policy
                  :item="policyItem"
                />
              </div>
            </td>
          </tr>
        </TbodyCollapsible>
      </table>
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
import Policy from '@/components/routes/myApis/businesses/Policy';

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
    Policy,
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