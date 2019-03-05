<template>
  <div class="verapi-table-container">
    <table class="table verapi-table">
      <thead>
        <tr>
          <th>Status</th>
          <th>Policy Name</th>
          <th>Policy Type</th>
          <th>Policy SubType</th>
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
            <Icon :icon="policyItem.isactive ? 'check-circle' : 'times-circle'" :class="policyItem.isactive ? 'text-success' : 'text-danger'" />
          </td>
          <td @click="() => handleCollapseTableRows(policyItem.uuid)">
            {{ policyItem.name }}
          </td>
          <td @click="() => handleCollapseTableRows(policyItem.uuid)">
            {{ policyItem.typename }}
          </td>
          <td @click="() => handleCollapseTableRows(policyItem.uuid)">
            {{ policyItem.policyinstance.info.subType }}
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(policyItem.uuid) > -1">
          <td colspan="6">
            <div class="collapsible-content">
              <Policy
                :item="policyItem"
                :organizations="organizations"
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
      organizations: state => state.organizations.items,
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