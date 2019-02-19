<template>
  <div class="verapi-table-container">
    <table class="table verapi-table">
      <thead>
        <tr>
          <th>App Name</th>
          <th>Organization</th>
          <th>URL</th>
          <th># of Subscriptions</th>
          <th>Status</th>
        </tr>
      </thead>
      <TbodyCollapsible
        v-for="(item, index) in rows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'}`">
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.displayname }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.organizationname }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.url }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.contracts ? item.contracts.length : '' }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            <Icon :icon="item.isactivated ? 'check-circle' : 'times-circle'" :class="item.isactivated ? 'text-success' : 'text-danger'" />
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
          <td colspan="5">
            <div class="collapsible-content">
              <App
                :item="item"
              />
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
  </div>
</template>

<script>
import App from '@/components/shared/subjects/apps/App';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';

export default {
  props: {
    rows: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
  components: {
    App,
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