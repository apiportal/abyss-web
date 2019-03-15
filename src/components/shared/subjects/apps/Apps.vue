<template>
  <div class="abyss-table-content">
    <table class="table abyss-table abyss-table-cards">
      <thead>
        <tr>
          <th class="status">Status</th>
          <th>App Name</th>
          <th># of Subscriptions</th>
          <th></th>
        </tr>
      </thead>
      <TBodyLoading
        v-if="isLoading && rows.length === 0"
        :cols="4"
      />
      <TbodyCollapsible
        v-for="(item, index) in rows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`">
          <td class="status" @click="() => handleCollapseTableRows(item.uuid)">
            <Icon :icon="item.isactivated ? 'check-circle' : 'times-circle'" :class="item.isactivated ? 'text-success' : 'text-danger'" />
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.displayname }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.contracts ? item.contracts.length : '' }}
          </td>
          <td class="actions">
            <b-dropdown variant="link" size="lg" no-caret right v-if="!item.isdeleted">
              <template slot="button-content">
                <Icon icon="ellipsis-h" />
              </template>

              <b-dropdown-item :to="`${routePath}/edit-app/${item.uuid}`"><Icon icon="edit" /> Edit</b-dropdown-item>
              <b-dropdown-item :to="`${routePath}/delete/${item.uuid}`"><Icon icon="trash-alt" /> Delete</b-dropdown-item>

              <b-dropdown-header>LOGS</b-dropdown-header>

              <b-dropdown-item :to="`${routePath}/logs/${item.uuid}/subject/1`">All</b-dropdown-item>

              <b-dropdown-header><code>{{ item.uuid }}</code></b-dropdown-header>

            </b-dropdown>
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
          <td colspan="4">
            <div class="collapsible-content">
              <App
                :item="item"
                :routePath="routePath"
              ></App>
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import App from '@/components/shared/subjects/apps/App';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
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
  computed: {
    ...mapState({
      isLoading: state => state.traffic.isLoading,
    }),
  },
  components: {
    App,
    TbodyCollapsible,
    TBodyLoading,
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
        this.collapsedRows = [itemId];
      } else {
        this.collapsedRows.splice(rowIndex, 1);
      }
    },
  },
};
</script>