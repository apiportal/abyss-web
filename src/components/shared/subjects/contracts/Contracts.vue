<template>
  <div class="abyss-table-content">
    <table class="table abyss-table abyss-table-cards">
      <thead>
        <tr>
          <th class="status">Status</th>
          <th>Contract Name</th>
          <th>State</th>
          <th>Environment</th>
          <th></th>
        </tr>
      </thead>
      <TbodyCollapsible
        v-for="(item, index) in rows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
          <td class="status" @click="() => handleCollapseTableRows(item.uuid)" style="text-transform: capitalize">
            {{ item.status }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.name }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" style="text-transform: capitalize">
            {{ item.contractstatename }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)" style="text-transform: capitalize">
            {{ item.environment }}
          </td>
          <td class="actions">
            <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-header>LOGS</b-dropdown-header>

              <b-dropdown-item :to="`${routePath}/logs/${item.uuid}/contract/1`">All</b-dropdown-item>

              <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

            </b-dropdown>
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
          <td colspan="5">
            <div class="collapsible-content">
              <Contract
                :item="item"
                :routePath="routePath"
                :state="item.contractstatename"
              ></Contract>
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
        // this.collapsedRows.push(itemId);
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>
