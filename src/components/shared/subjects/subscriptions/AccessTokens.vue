<template>
  <div class="abyss-table-content">
    <table class="table abyss-table abyss-table-cards">
      <thead>
        <tr>
          <th>Create Date</th>
          <th>Expire Date</th>
          <th>Active</th>
        </tr>
      </thead>
      <TbodyCollapsible
        v-for="(item, index) in rows" v-bind:key="index"
        :isCollapsed="collapsedRows.indexOf(item.uuid) > -1"
      >
        <tr id="IdTableRow" slot="main" :class="`${index % 2 === 0 ? 'odd' : 'even'} ${item.isdeleted ? 'is-deleted' : ''}`" class="opaque">
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.created | moment("DD.MM.YYYY HH:mm") }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.expiredate | moment("DD.MM.YYYY HH:mm") }}
          </td>
          <td @click="() => handleCollapseTableRows(item.uuid)">
            {{ item.isactive }}
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(item.uuid) > -1">
          <td colspan="4">
            <div class="collapsible-content">
              <b-form-textarea
                id="textarea1"
                v-model="item.token"
                placeholder="Enter something"
                rows="4"
                max-rows="6"
                :disabled="true"
              />
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

export default {
  name: 'AccessTokens',
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