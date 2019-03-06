<template>
  <div class="verapi-table-container">
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
      <TBodyLoading
        v-if="isLoading && rows.length === 0"
        :cols="6"
      />
      <TbodyCollapsible
        v-for="(policyItem, index) in rows" v-bind:key="index"
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
                :routePath="routePath"
              ></Policy>
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Icon from '@/components/shared/Icon';
import Policy from '@/components/shared/subjects/policies/Policy';

export default {
  props: {
    rows: {
      type: Array,
      required: false,
      default() { return []; },
    },
    routePath: {
      type: String,
      required: false,
      default() { return ''; },
    },
  },
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
    }),
  },
  components: {
    TbodyCollapsible,
    TBodyLoading,
    Icon,
    Policy,
  },
  data() {
    return {
      collapsedRows: [],
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
  },
};
</script>