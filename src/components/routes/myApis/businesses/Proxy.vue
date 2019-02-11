<template>
  <div>
    <p><strong>Title:</strong> {{ item.openapidocument.info.title }}</p>
    <p><strong>Version:</strong> {{ item.openapidocument.info.version }}</p>
    <p><strong>Description:</strong> {{ item.openapidocument.info.description }}</p>
    <p><strong>Organization:</strong> {{ item.organizationame }}</p>
    <p><strong>Licenses:</strong> {{ item.subcriptions.length }}</p>

    <div style="border: 1px solid #e7eaf3; border-radius: .3rem; padding: 1rem;" v-if="item.subcriptions.length > 0">
      <table class="table verapi-table">
        <thead>
          <tr>
            <th>License Name</th>
          </tr>
        </thead>
        <TbodyCollapsible
          v-for="(licenseItem, licenseIndex) in item.subcriptions" v-bind:key="licenseIndex"
          :isCollapsed="collapsedRows.indexOf(licenseItem.uuid) > -1"
        >
          <tr slot="main" :class="`${licenseIndex % 2 === 0 ? 'odd' : 'even'}`">
            <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
              {{ licenseItem.name }}
            </td>
          </tr>
        </TbodyCollapsible>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';

export default {
  computed: {
    ...mapState({
    }),
    tableRows() {
      return this.licenses;
    },
  },
  components: {
    TbodyCollapsible,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
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