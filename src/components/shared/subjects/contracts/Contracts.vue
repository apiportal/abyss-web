<template>
  <div class="verapi-table-container">
    <table class="table verapi-table">
      <thead>
        <tr>
          <th>Contract Name</th>
          <th>State</th>
          <th>Status</th>
          <th>Environment</th>
        </tr>
      </thead>
      <TbodyCollapsible
        v-for="(item, index) in rows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'}`">
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.name }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" style="text-transform: capitalize">
            {{ item.contractstatename }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" style="text-transform: capitalize">
            {{ item.status }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" style="text-transform: capitalize">
            {{ item.environment }}
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
          <td colspan="4">
            <div class="collapsible-content">
              <Contract
                :item="item"
                :routePath="routePath"
              />
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
  </div>
</template>

<script>
import Contract from '@/components/shared/subjects/contracts/Contract';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';

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
  components: {
    Contract,
    TbodyCollapsible,
    Icon,
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
