<template>
  <div class="verapi-table-container">
    <table class="table verapi-table">
      <thead>
        <tr>
          <th>License Name</th>
          <th>Version</th>
          <th>Visibility</th>
          <th>State</th>
          <th>Created Date</th>
          <th># of Policies</th>
        </tr>
      </thead>
      <TbodyCollapsible
        v-for="(licenseItem, licenseIndex) in rows" v-bind:key="licenseIndex"
        :isCollapsed="collapsedRows.indexOf(licenseItem.uuid) > -1"
        :level="2"
      >
        <tr slot="main" :class="`${licenseIndex % 2 === 0 ? 'odd' : 'even'}`">
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.name }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.version }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.licensedocument.info.visibility }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.licensedocument.legal.documentState }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.created }}
          </td>
          <td @click="() => handleCollapseTableRows(licenseItem.uuid)">
            {{ licenseItem.licensedocument.termsOfService.policyKey.length }}
          </td>
        </tr>
        <tr slot="footer" class="footer" v-if="collapsedRows.indexOf(licenseItem.uuid) > -1">
          <td colspan="6">
            <div class="collapsible-content">
              <License
                :item="licenseItem"
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
import TbodyCollapsible from '@/components/shared/TbodyCollapsible';
import Icon from '@/components/shared/Icon';
import License from '@/components/shared/subjects/licenses/License';

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
    TbodyCollapsible,
    Icon,
    License,
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