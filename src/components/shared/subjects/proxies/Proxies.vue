<template>
  <div class="verapi-table-container">
    <table class="table verapi-table">
      <thead>
        <tr>
          <th>Proxy Api Name</th>
          <th>Version</th>
          <th>State</th>
          <th>Visibility</th>
          <th># of Subscriptions</th>
        </tr>
      </thead>
      <TbodyCollapsible
        v-for="(proxyItem, proxyIndex) in rows" v-bind:key="proxyIndex"
        :isCollapsed="collapsedRows.indexOf(proxyItem.uuid) > -1"
        :level="1"
      >
        <tr slot="main" :class="`${proxyIndex % 2 === 0 ? 'odd' : 'even'}`">
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.openapidocument.info.title }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.version }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.apistatename }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.apivisibilityname }}
          </td>
          <td @click="() => handleCollapseTableRows(proxyItem.uuid)">
            {{ proxyItem.subscriptions.length }}
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(proxyItem.uuid) > -1">
          <td colspan="6">
            <div class="collapsible-content">
              <Proxy
                :item="proxyItem"
              />
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
  </div>
</template>

<script>
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';
import Proxy from '@/components/shared/subjects/proxies/Proxy';

export default {
  props: {
    rows: {
      type: Array,
      required: false,
      default() { return []; },
    },
  },
  components: {
    TbodyCollapsible,
    Icon,
    Proxy,
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