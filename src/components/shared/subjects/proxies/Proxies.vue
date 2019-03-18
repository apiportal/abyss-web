<template>
  <div class="abyss-table-content">
    <table class="table abyss-table abyss-table-cards">
      <thead>
        <tr>
          <th>Proxy Api Name</th>
          <th>Version</th>
          <th>State</th>
          <th>Visibility</th>
          <th># of Subscriptions</th>
          <th></th>
        </tr>
      </thead>
      <TBodyLoading
        v-if="isLoading && rows.length === 0"
        :cols="6"
      />
      <TbodyCollapsible
        v-for="(proxyItem, proxyIndex) in rows" v-bind:key="proxyIndex"
        :isCollapsed="collapsedRows.indexOf(proxyItem.uuid) > -1"
        :level="1"
      >
        <tr slot="main" :class="`${proxyIndex % 2 === 0 ? 'odd' : 'even'} ${proxyItem.isdeleted ? 'is-deleted' : ''}`">
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
            {{ proxyItem.subscriptions ? proxyItem.subscriptions.length : 0 }}
          </td>
          <td class="actions">
            <b-dropdown variant="link" size="lg" no-caret right v-if="!proxyItem.isdeleted">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-header>LOGS</b-dropdown-header>

              <b-dropdown-item :to="`${routePath}/logs/${proxyItem.uuid}/api/1`">All</b-dropdown-item>

              <b-dropdown-header><code>{{ proxyItem.uuid }}</code></b-dropdown-header>

            </b-dropdown>
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(proxyItem.uuid) > -1">
          <td colspan="6">
            <div class="collapsible-content">
              <Proxy
                :item="proxyItem"
                :routePath="routePath"
                childComponent="Licenses"
              ></Proxy>
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
import Proxy from '@/components/shared/subjects/proxies/Proxy';

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
        // this.collapsedRows.push(itemId);
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>