<template>
  <div class="abyss-table-content">
    <table class="table abyss-table abyss-table-cards">
      <thead>
        <tr>
          <th>Permission</th>
          <th>Action</th>
        </tr>
      </thead>
      <TBodyLoading
        v-if="isLoading && rows.length === 0"
        :cols="2"
      />
      <TbodyCollapsible
        v-for="(subscriptionItem, index) in rows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(subscriptionItem.uuid) > -1"
        :level="3"
      >
        <tr slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${subscriptionItem.isdeleted ? 'is-deleted' : ''}`" :data-qa="`tableRow-${index}`">
          <td @click="() => handleCollapseTableRows(subscriptionItem.uuid)">
            {{ subscriptionItem.permission }}
          </td>
          <td @click="() => handleCollapseTableRows(subscriptionItem.uuid)">
            {{ subscriptionItem.resourceactionname }}
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(subscriptionItem.uuid) > -1">
          <td colspan="6">
            <div class="collapsible-content">
              <Subscription
                :item="subscriptionItem"
                :routePath="routePath"
              ></Subscription>
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
import Subscription from '@/components/shared/subjects/subscriptions/Subscription';

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
    page: {
      Type: Number,
      required: false,
      default() { return 1; },
    },
    itemsPerPage: {
      Type: Number,
      required: false,
      default() { return 2000; },
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
    Subscription,
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