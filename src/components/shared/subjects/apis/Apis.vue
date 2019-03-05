<template>
  <div class="verapi-table-container">
    <table class="table verapi-table">
      <thead>
        <tr>
          <th>Api Name</th>
          <th>Version</th>
          <th>State</th>
          <th>Visibility</th>
          <th># of Proxies</th>
          <th>Status</th>
        </tr>
      </thead>
      <TBodyLoading
        v-if="isLoading && rows.length === 0"
        :cols="6"
      />
      <TbodyCollapsible
        v-for="(item, index) in rows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'}`">
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.openapidocument.info.title }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.version }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.apistatename }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.apivisibilityname }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.numberofproxies }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            <Icon :icon="item.islive ? 'check-circle' : 'times-circle'" :class="item.islive ? 'text-success' : 'text-danger'" />
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
          <td colspan="6">
            <div class="collapsible-content">
              <Api
                :item="item"
                :routePath="routePath"
              ></Api>
            </div>
          </td>
        </tr>
      </TbodyCollapsible>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Api from '@/components/shared/subjects/apis/Api';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import TBodyLoading from '@/components/shared/TBodyLoading';
import Icon from '@/components/shared/Icon';

export default {
  name: 'Apis',
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
    Api,
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